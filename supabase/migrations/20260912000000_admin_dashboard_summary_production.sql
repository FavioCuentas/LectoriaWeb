-- Production schema adapter. Apply only this file after explicit approval.
-- Does not modify source tables, views, RLS, users, or Auth configuration.
-- Validated against the confirmed production column types and NOT NULL constraints.
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
    select id, installation_id, user_id, event_name, app_version, created_at
    from public.analytics_events
    where created_at >= since_at and created_at < until_at
  ), registrations as (
    -- Counts only; no identity or account metadata leaves the function.
    select count(*) as total,
           count(*) filter (where created_at >= since_at) as new_users
    from auth.users
    where created_at < until_at
  ), activity as (
    -- Fixed rolling windows required by the frontend, independent of selector.
    -- NULL user_id is excluded: devices are not registered users.
    select count(distinct user_id) filter (
             where created_at >= until_at - interval '24 hours') as dau,
           count(distinct user_id) filter (
             where created_at >= until_at - interval '7 days') as wau,
           count(distinct user_id) as mau
    from public.analytics_events
    where created_at >= until_at - interval '30 days' and created_at < until_at
  ), usage_counts as (
    select count(*) filter (where event_name = 'reading_session_ended') as reading,
           count(*) filter (where event_name = 'dictionary_looked_up') as dictionary,
           count(*) filter (where event_name = 'translation_requested') as translation,
           count(*) filter (where event_name = 'ai_query_executed') as ai,
           count(*) filter (where event_name = 'tts_session_started') as tts
    from period_events
  ), daily as (
    select (created_at at time zone 'UTC')::date as day,
           count(distinct user_id) as users
    from period_events
    group by (created_at at time zone 'UTC')::date
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
  ), latest_devices as (
    select distinct on (installation_id) installation_id, app_version
    from period_events
    order by installation_id, created_at desc, id desc
  ), versions as (
    -- Unknown versions stay in the denominator; only bounded version labels
    -- are returned. Never return installation identifiers or arbitrary payloads.
    select case when app_version ~ '^[0-9][0-9A-Za-z.+_-]{0,39}$'
                then app_version else null end as version,
           count(*) as devices
    from latest_devices
    group by 1
  ), version_percentages as (
    select version, devices,
           round(100.0 * devices / sum(devices) over (), 1) as pct
    from versions
  ), top_version as (
    select version, pct from version_percentages
    where version is not null
    order by devices desc, version collate "C" asc
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
      -- No confirmed server-validated financial source.
      'freeUsers', 0, 'annualUsers', 0, 'lifetimeUsers', 0,
      'payingUsers', 0, 'paymentConversionPct', 0,
      'cancellations', 0, 'grossRevenueCents', 0,
      -- Import/error event names and duration property are not yet confirmed.
      'documentsImported', 0,
      'readingSessions', u.reading,
      'avgReadingMinutes', 0,
      'dictionaryUses', u.dictionary,
      'translationUses', u.translation,
      'aiUses', u.ai,
      'textToSpeechUses', u.tts,
      'technicalErrors', 0,
      'topAppVersion', (select version from top_version),
      'topAppVersionPct', coalesce((select pct from top_version), 0)
    ),
    'activeUsers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'date', to_char(day, 'YYYY-MM-DD'), 'users', users
      ) order by day) from daily
    ), '[]'::jsonb),
    -- Frontend labels format counts as IMPORTS, not reading sessions.
    'formatUsage', '[]'::jsonb,
    'featureUsage', coalesce((
      select jsonb_agg(jsonb_build_object(
        'name', name, 'count', uses, 'pct', pct
      ) order by uses desc, name collate "C") from feature_percentages
    ), '[]'::jsonb),
    'funnel', '[]'::jsonb,
    -- No confirmed platform mapping: do not infer OS from device_family.
    'platformVersions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'platform', 'other', 'version', coalesce(version, 'Sin datos'),
        'devices', devices, 'pct', pct
      ) order by devices desc, version collate "C" nulls last)
      from version_percentages
    ), '[]'::jsonb),
    'planDistribution', '[]'::jsonb
  ) into result
  from registrations r cross join activity a cross join usage_counts u;

  return result;
end;
$admin_dashboard$;

-- PUBLIC defaults and Supabase's service_role default grants are removed too.
revoke all on function public.admin_dashboard_summary(integer)
  from public, anon, authenticated, service_role;
grant execute on function public.admin_dashboard_summary(integer) to authenticated;

comment on function public.admin_dashboard_summary(integer) is
  'Admin JWT only; aggregate production telemetry by created_at. Unconfirmed metrics use contract defaults; see admin-dashboard-contract.md.';

commit;
