-- admin_dashboard_summary v2 (2026-11-22)
-- Reemplaza la función de 20260912000000 con los eventos que las apps envían de verdad.
-- Solo redefine el RPC, su comentario y sus permisos. No toca tablas, vistas, RLS ni Auth.
-- Aplicar en el SQL Editor de Supabase después de revisarlo. Es seguro reaplicarlo.
--
-- Cambios frente a la versión anterior (fuente: cliente iOS SupabaseAnalyticsService,
-- ImportService, ReadingSessionCoordinator, PaywallView):
--   * Personas activas = usuario registrado (user_id) o, si es invitado, su instalación.
--     Las apps son "invitado primero": contar solo user_id dejaba fuera a casi todos.
--   * documentsImported y formatUsage <- evento document_imported, properties.format.
--   * avgReadingMinutes <- reading_session_ended, properties.duration_seconds (texto numérico).
--   * technicalErrors <- error_occurred + document_import_failed.
--   * platformVersions.platform <- device_family / os_version (iOS envía "iPhone").
--     Convención para Android: device_family u os_version que empiece con "Android".
--   * funnel <- personas activas -> importaron -> terminaron una lectura -> vieron planes
--     -> compra reportada por la app (no validada por servidor; no se usa para ingresos).
--   * semiannualUsers y unavailableMetrics: las métricas financieras siguen sin fuente
--     validada por servidor (nadie escribe subscription_entitlements), así que se
--     devuelven en 0 y se listan en unavailableMetrics para que el panel no muestre
--     un 0 como si fuera real.
begin;

create or replace function public.admin_dashboard_summary(range_days integer default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
set timezone = 'UTC'
as $admin_dashboard$
declare
  until_at timestamptz := now();
  since_at timestamptz;
  result jsonb;
begin
  if (auth.jwt() -> 'app_metadata' ->> 'role') is distinct from 'admin' then
    raise exception 'Administrator role required' using errcode = '42501';
  end if;
  if range_days is null or range_days < 1 or range_days > 365 then
    raise exception 'range_days must be between 1 and 365' using errcode = '22023';
  end if;
  since_at := until_at - make_interval(days => range_days);

  with period_events as materialized (
    select id, installation_id, event_name, properties, app_version,
           os_version, device_family, created_at,
           -- Una persona: su cuenta si inició sesión; si no, su instalación.
           coalesce('u:' || user_id::text, 'i:' || installation_id::text) as actor
    from public.analytics_events
    where created_at >= since_at and created_at < until_at
  ), registrations as (
    select count(*) as total,
           count(*) filter (where created_at >= since_at) as new_users
    from auth.users
    where created_at < until_at
  ), activity as (
    -- Ventanas fijas (24 h / 7 d / 30 d), independientes del selector.
    select count(distinct coalesce('u:' || user_id::text, 'i:' || installation_id::text))
             filter (where created_at >= until_at - interval '24 hours') as dau,
           count(distinct coalesce('u:' || user_id::text, 'i:' || installation_id::text))
             filter (where created_at >= until_at - interval '7 days') as wau,
           count(distinct coalesce('u:' || user_id::text, 'i:' || installation_id::text)) as mau
    from public.analytics_events
    where created_at >= until_at - interval '30 days' and created_at < until_at
  ), reading as (
    select (properties ->> 'duration_seconds')::numeric as seconds
    from period_events
    where event_name = 'reading_session_ended'
      and properties ->> 'duration_seconds' ~ '^[0-9]{1,6}(\.[0-9]+)?$'
  ), usage_counts as (
    select count(*) filter (where event_name = 'reading_session_ended') as reading,
           count(*) filter (where event_name = 'document_imported') as imported,
           count(*) filter (where event_name in ('error_occurred', 'document_import_failed')) as errors,
           count(*) filter (where event_name = 'dictionary_looked_up') as dictionary,
           count(*) filter (where event_name = 'translation_requested') as translation,
           count(*) filter (where event_name = 'ai_query_executed') as ai,
           count(*) filter (where event_name = 'tts_session_started') as tts
    from period_events
  ), daily as (
    select (created_at at time zone 'UTC')::date as day,
           count(distinct actor) as users
    from period_events
    group by 1
  ), formats as (
    select case lower(coalesce(properties ->> 'format', ''))
             when 'epub' then 'EPUB'
             when 'pdf' then 'PDF'
             when 'txt' then 'TXT'
             when 'markdown' then 'Markdown'
             when 'md' then 'Markdown'
             when 'pasted_text' then 'Texto pegado'
             when 'pastedtext' then 'Texto pegado'
             when 'pptx' then 'PowerPoint'
             else 'Otro'
           end as name,
           count(*) as uses
    from period_events
    where event_name = 'document_imported'
    group by 1
  ), format_percentages as (
    select name, uses, round(100.0 * uses / sum(uses) over (), 1) as pct
    from formats
  ), features as (
    select case event_name
             when 'dictionary_looked_up' then 'Diccionario'
             when 'translation_requested' then 'Traducción'
             when 'ai_query_executed' then 'IA'
             when 'highlight_created' then 'Resaltados'
             when 'note_created' then 'Notas'
             when 'bookmark_added' then 'Marcadores'
             when 'tts_session_started' then 'Texto a voz'
           end as name, count(*) as uses
    from period_events
    where event_name in (
      'dictionary_looked_up', 'translation_requested', 'ai_query_executed',
      'highlight_created', 'note_created', 'bookmark_added', 'tts_session_started'
    )
    group by event_name
  ), feature_percentages as (
    select name, uses, round(100.0 * uses / sum(uses) over (), 1) as pct
    from features
  ), funnel_counts as (
    select count(distinct actor) as active,
           count(distinct actor) filter (where event_name = 'document_imported') as imported,
           count(distinct actor) filter (where event_name = 'reading_session_ended') as read,
           count(distinct actor) filter (where event_name = 'paywall_viewed') as paywall,
           count(distinct actor) filter (where event_name = 'purchase_completed') as purchased
    from period_events
  ), funnel_steps as (
    select stage, ord, cnt,
           case when f.active = 0 then 0 else round(100.0 * cnt / f.active, 1) end as pct
    from funnel_counts f
    cross join lateral (values
      (1, 'Personas activas', f.active),
      (2, 'Importaron un documento', f.imported),
      (3, 'Terminaron una lectura', f.read),
      (4, 'Vieron los planes', f.paywall),
      (5, 'Compra reportada por la app', f.purchased)
    ) as s(ord, stage, cnt)
  ), latest_devices as (
    select distinct on (installation_id) installation_id, app_version, os_version, device_family
    from period_events
    order by installation_id, created_at desc, id desc
  ), versions as (
    select case
             when device_family ilike any (array['iphone%', 'ipad%', 'ios%'])
               or os_version ilike 'ios%' or os_version ilike 'ipados%' then 'ios'
             when device_family ilike 'android%' or os_version ilike 'android%' then 'android'
             else 'other'
           end as platform,
           case when app_version ~ '^[0-9][0-9A-Za-z.+_-]{0,39}$'
                then app_version else null end as version,
           count(*) as devices
    from latest_devices
    group by 1, 2
  ), version_percentages as (
    select platform, version, devices,
           round(100.0 * devices / sum(devices) over (), 1) as pct
    from versions
  ), top_version as (
    select version, sum(pct) as pct
    from version_percentages
    where version is not null
    group by version
    order by sum(devices) desc, version collate "C" asc
    limit 1
  )
  select jsonb_build_object(
    'generatedAt', until_at,
    'rangeDays', range_days,
    'kpis', jsonb_build_object(
      'usersRegistered', r.total,
      'dailyActiveUsers', a.dau,
      'weeklyActiveUsers', a.wau,
      'monthlyActiveUsers', a.mau,
      'newUsers', r.new_users,
      -- Sin fuente validada por servidor: ver unavailableMetrics.
      'freeUsers', 0, 'semiannualUsers', 0, 'annualUsers', 0, 'lifetimeUsers', 0,
      'payingUsers', 0, 'paymentConversionPct', 0,
      'cancellations', 0, 'grossRevenueCents', 0,
      'documentsImported', u.imported,
      'readingSessions', u.reading,
      'avgReadingMinutes', coalesce((select round(avg(seconds) / 60.0, 1) from reading), 0),
      'dictionaryUses', u.dictionary,
      'translationUses', u.translation,
      'aiUses', u.ai,
      'textToSpeechUses', u.tts,
      'technicalErrors', u.errors,
      'topAppVersion', (select version from top_version),
      'topAppVersionPct', coalesce((select pct from top_version), 0)
    ),
    'unavailableMetrics', jsonb_build_array(
      'freeUsers', 'semiannualUsers', 'annualUsers', 'lifetimeUsers', 'payingUsers',
      'paymentConversionPct', 'cancellations', 'grossRevenueCents', 'planDistribution'
    ),
    'activeUsers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'date', to_char(day, 'YYYY-MM-DD'), 'users', users
      ) order by day) from daily
    ), '[]'::jsonb),
    'formatUsage', coalesce((
      select jsonb_agg(jsonb_build_object(
        'name', name, 'count', uses, 'pct', pct
      ) order by uses desc, name collate "C") from format_percentages
    ), '[]'::jsonb),
    'featureUsage', coalesce((
      select jsonb_agg(jsonb_build_object(
        'name', name, 'count', uses, 'pct', pct
      ) order by uses desc, name collate "C") from feature_percentages
    ), '[]'::jsonb),
    'funnel', case when (select active from funnel_counts) = 0 then '[]'::jsonb else (
      select jsonb_agg(jsonb_build_object(
        'stage', stage, 'count', cnt, 'pct', pct
      ) order by ord) from funnel_steps
    ) end,
    'platformVersions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'platform', platform, 'version', coalesce(version, 'Sin datos'),
        'devices', devices, 'pct', pct
      ) order by devices desc, platform, version collate "C" nulls last)
      from version_percentages
    ), '[]'::jsonb),
    'planDistribution', '[]'::jsonb
  ) into result
  from registrations r cross join activity a cross join usage_counts u;

  return result;
end;
$admin_dashboard$;

revoke all on function public.admin_dashboard_summary(integer)
  from public, anon, authenticated, service_role;
grant execute on function public.admin_dashboard_summary(integer) to authenticated;

comment on function public.admin_dashboard_summary(integer) is
  'v2 2026-11-22. Admin JWT only; aggregate telemetry by created_at. Active people = user_id or guest installation. Financial metrics listed in unavailableMetrics until server-validated purchases exist.';

commit;
