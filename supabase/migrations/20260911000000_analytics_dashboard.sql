-- Lectoria analytics foundation.
-- This migration is intentionally local until it is reviewed and applied through
-- the Supabase migration workflow. It stores operational metadata, never document
-- contents, selected text, notes, highlights, search terms, or AI prompts.

create schema if not exists private;
revoke all on schema private from public;

create type public.app_platform as enum ('ios', 'android', 'other');
create type public.app_plan as enum ('free', 'annual', 'lifetime');
create type public.subscription_status as enum ('active', 'cancelled', 'expired', 'refunded');
create type public.subscription_event_type as enum ('started', 'renewed', 'cancelled', 'refunded');
create type public.analytics_event_name as enum (
  'app_opened',
  'document_imported',
  'reading_started',
  'reading_completed',
  'dictionary_used',
  'translation_used',
  'ai_used',
  'text_to_speech_used',
  'highlight_created',
  'app_error'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length check (display_name is null or char_length(display_name) <= 120)
);

create table public.analytics_events (
  event_id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id uuid,
  event_name public.analytics_event_name not null,
  platform public.app_platform not null,
  app_version text not null,
  os_version text,
  document_format text,
  feature text,
  duration_seconds integer,
  error_code text,
  properties jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  constraint analytics_app_version_length check (char_length(app_version) between 1 and 40),
  constraint analytics_os_version_length check (os_version is null or char_length(os_version) <= 40),
  constraint analytics_format_length check (document_format is null or char_length(document_format) <= 40),
  constraint analytics_feature_length check (feature is null or char_length(feature) <= 80),
  constraint analytics_error_code_length check (error_code is null or char_length(error_code) <= 120),
  constraint analytics_duration_bounds check (duration_seconds is null or duration_seconds between 0 and 86400),
  constraint analytics_properties_object check (jsonb_typeof(properties) = 'object'),
  constraint analytics_properties_size check (pg_column_size(properties) <= 4096)
);

create table public.app_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan public.app_plan not null,
  status public.subscription_status not null,
  source text not null,
  external_product_id text not null,
  started_at timestamptz not null,
  expires_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint paid_plans_only check (plan <> 'free'),
  constraint subscription_source_length check (char_length(source) between 1 and 40),
  constraint subscription_product_length check (char_length(external_product_id) between 1 and 160),
  constraint annual_has_expiration check (plan <> 'annual' or expires_at is not null)
);

create table public.subscription_events (
  id uuid primary key default gen_random_uuid(),
  external_event_id text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan public.app_plan not null,
  event_type public.subscription_event_type not null,
  amount_cents integer not null default 0,
  currency text not null default 'USD',
  source text not null,
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  constraint subscription_events_paid_plans_only check (plan <> 'free'),
  constraint subscription_events_currency check (currency ~ '^[A-Z]{3}$'),
  constraint subscription_events_amount_sign check (
    (event_type = 'refunded' and amount_cents <= 0)
    or (event_type <> 'refunded' and amount_cents >= 0)
  ),
  constraint subscription_events_external_id_length check (char_length(external_event_id) between 1 and 200),
  constraint subscription_events_source_length check (char_length(source) between 1 and 40)
);

create index analytics_events_user_time_idx on public.analytics_events (user_id, occurred_at desc);
create index analytics_events_name_time_idx on public.analytics_events (event_name, occurred_at desc);
create index analytics_events_platform_version_idx on public.analytics_events (platform, app_version, occurred_at desc);
create index subscription_events_time_idx on public.subscription_events (occurred_at desc);

alter table public.profiles enable row level security;
alter table public.analytics_events enable row level security;
alter table public.app_subscriptions enable row level security;
alter table public.subscription_events enable row level security;

create or replace function private.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select au.raw_app_meta_data ->> 'role' = 'admin'
      from auth.users as au
      where au.id = (select auth.uid())
    ),
    false
  );
$$;

grant usage on schema private to authenticated;
revoke all on function private.current_user_is_admin() from public;
grant execute on function private.current_user_is_admin() to authenticated;

create policy profiles_select_own_or_admin
on public.profiles
for select
to authenticated
using (
  id = (select auth.uid())
  or (select private.current_user_is_admin())
);

create policy analytics_insert_own
on public.analytics_events
for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy analytics_select_admin
on public.analytics_events
for select
to authenticated
using ((select private.current_user_is_admin()));

create policy subscriptions_select_own_or_admin
on public.app_subscriptions
for select
to authenticated
using (
  user_id = (select auth.uid())
  or (select private.current_user_is_admin())
);

create policy subscription_events_select_admin
on public.subscription_events
for select
to authenticated
using ((select private.current_user_is_admin()));

revoke all on public.profiles from anon, authenticated;
revoke all on public.analytics_events from anon, authenticated;
revoke all on public.app_subscriptions from anon, authenticated;
revoke all on public.subscription_events from anon, authenticated;

grant select on public.profiles to authenticated;
grant select, insert on public.analytics_events to authenticated;
grant select on public.app_subscriptions to authenticated;
grant select on public.subscription_events to authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, created_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.created_at
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger lectoria_on_auth_user_created
after insert on auth.users
for each row execute procedure private.handle_new_user();

insert into public.profiles (id, display_name, created_at)
select
  au.id,
  coalesce(au.raw_user_meta_data ->> 'full_name', split_part(au.email, '@', 1)),
  au.created_at
from auth.users as au
on conflict (id) do nothing;

create or replace function public.ingest_analytics_event(
  p_event_id uuid,
  p_event_name public.analytics_event_name,
  p_platform public.app_platform,
  p_app_version text,
  p_occurred_at timestamptz,
  p_device_id uuid default null,
  p_os_version text default null,
  p_document_format text default null,
  p_feature text default null,
  p_duration_seconds integer default null,
  p_error_code text default null,
  p_properties jsonb default '{}'::jsonb
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise insufficient_privilege using message = 'Authentication required';
  end if;

  insert into public.analytics_events (
    event_id,
    user_id,
    device_id,
    event_name,
    platform,
    app_version,
    os_version,
    document_format,
    feature,
    duration_seconds,
    error_code,
    properties,
    occurred_at
  )
  values (
    p_event_id,
    (select auth.uid()),
    p_device_id,
    p_event_name,
    p_platform,
    p_app_version,
    p_os_version,
    p_document_format,
    p_feature,
    p_duration_seconds,
    p_error_code,
    p_properties,
    p_occurred_at
  )
  on conflict (event_id) do nothing;

  return found;
end;
$$;

revoke all on function public.ingest_analytics_event(
  uuid,
  public.analytics_event_name,
  public.app_platform,
  text,
  timestamptz,
  uuid,
  text,
  text,
  text,
  integer,
  text,
  jsonb
) from public;
grant execute on function public.ingest_analytics_event(
  uuid,
  public.analytics_event_name,
  public.app_platform,
  text,
  timestamptz,
  uuid,
  text,
  text,
  text,
  integer,
  text,
  jsonb
) to authenticated;

create or replace function public.admin_dashboard_summary(range_days integer default 30)
returns jsonb
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  since_at timestamptz;
  total_users bigint;
  dau bigint;
  wau bigint;
  mau bigint;
  new_users bigint;
  annual_users bigint;
  lifetime_users bigint;
  paying_users bigint;
  free_users bigint;
  conversion_pct numeric;
  cancellations bigint;
  gross_revenue_cents bigint;
  documents_imported bigint;
  reading_sessions bigint;
  avg_reading_minutes numeric;
  dictionary_uses bigint;
  translation_uses bigint;
  ai_uses bigint;
  text_to_speech_uses bigint;
  technical_errors bigint;
  top_app_version text;
  top_app_version_pct numeric;
  active_users_json jsonb;
  format_usage_json jsonb;
  feature_usage_json jsonb;
  funnel_json jsonb;
  platform_versions_json jsonb;
  plan_distribution_json jsonb;
  period_registrations bigint;
  period_first_readers bigint;
  period_payers bigint;
begin
  if not (select private.current_user_is_admin()) then
    raise insufficient_privilege using message = 'Administrator role required';
  end if;

  if range_days not in (7, 30, 90) then
    raise exception 'range_days must be 7, 30, or 90' using errcode = '22023';
  end if;

  since_at := now() - make_interval(days => range_days);

  select count(*) into total_users from public.profiles;
  select count(distinct user_id) into dau from public.analytics_events where occurred_at >= now() - interval '1 day';
  select count(distinct user_id) into wau from public.analytics_events where occurred_at >= now() - interval '7 days';
  select count(distinct user_id) into mau from public.analytics_events where occurred_at >= now() - interval '30 days';
  select count(*) into new_users from public.profiles where created_at >= since_at;

  select count(*) filter (where plan = 'annual' and status = 'active'),
         count(*) filter (where plan = 'lifetime' and status = 'active')
  into annual_users, lifetime_users
  from public.app_subscriptions;

  paying_users := annual_users + lifetime_users;
  free_users := greatest(total_users - paying_users, 0);
  conversion_pct := case when total_users = 0 then 0 else round((paying_users::numeric / total_users::numeric) * 100, 1) end;

  select count(*) filter (where event_type = 'cancelled'),
         coalesce(sum(amount_cents) filter (where event_type in ('started', 'renewed')), 0)
  into cancellations, gross_revenue_cents
  from public.subscription_events
  where occurred_at >= since_at;

  select count(*) filter (where event_name = 'document_imported'),
         count(*) filter (where event_name = 'reading_completed'),
         coalesce(round((avg(duration_seconds) filter (where event_name = 'reading_completed' and duration_seconds is not null))::numeric / 60, 1), 0),
         count(*) filter (where event_name = 'dictionary_used'),
         count(*) filter (where event_name = 'translation_used'),
         count(*) filter (where event_name = 'ai_used'),
         count(*) filter (where event_name = 'text_to_speech_used'),
         count(*) filter (where event_name = 'app_error')
  into documents_imported, reading_sessions, avg_reading_minutes, dictionary_uses,
       translation_uses, ai_uses, text_to_speech_uses, technical_errors
  from public.analytics_events
  where occurred_at >= since_at;

  with latest_devices as (
    select distinct on (coalesce(device_id::text, 'user:' || user_id::text))
      coalesce(device_id::text, 'user:' || user_id::text) as device_identity,
      app_version
    from public.analytics_events
    where occurred_at >= since_at
    order by coalesce(device_id::text, 'user:' || user_id::text), occurred_at desc, received_at desc
  ), version_counts as (
    select app_version, count(*) as devices
    from latest_devices
    group by app_version
  ), totals as (
    select coalesce(sum(devices), 0) as devices from version_counts
  )
  select vc.app_version,
         case when t.devices = 0 then 0 else round((vc.devices::numeric / t.devices::numeric) * 100, 1) end
  into top_app_version, top_app_version_pct
  from version_counts vc cross join totals t
  order by vc.devices desc, vc.app_version desc
  limit 1;

  with days as (
    select generate_series(current_date - (range_days - 1), current_date, interval '1 day')::date as day
  ), daily as (
    select occurred_at::date as day, count(distinct user_id) as users
    from public.analytics_events
    where occurred_at >= since_at
    group by occurred_at::date
  )
  select coalesce(jsonb_agg(jsonb_build_object('date', to_char(d.day, 'YYYY-MM-DD'), 'users', coalesce(a.users, 0)) order by d.day), '[]'::jsonb)
  into active_users_json
  from days d left join daily a using (day);

  with counts as (
    select coalesce(document_format, 'Otro') as name, count(*) as item_count
    from public.analytics_events
    where occurred_at >= since_at and event_name = 'document_imported'
    group by coalesce(document_format, 'Otro')
  ), totals as (
    select coalesce(sum(item_count), 0) as item_count from counts
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'name', c.name,
    'count', c.item_count,
    'pct', case when t.item_count = 0 then 0 else round((c.item_count::numeric / t.item_count::numeric) * 100, 1) end
  ) order by c.item_count desc), '[]'::jsonb)
  into format_usage_json
  from counts c cross join totals t;

  with counts as (
    select
      case event_name
        when 'dictionary_used' then 'Diccionario'
        when 'translation_used' then 'Traducción'
        when 'ai_used' then 'IA'
        when 'text_to_speech_used' then 'Texto a voz'
        when 'highlight_created' then 'Resaltados'
      end as name,
      count(*) as item_count
    from public.analytics_events
    where occurred_at >= since_at
      and event_name in ('dictionary_used', 'translation_used', 'ai_used', 'text_to_speech_used', 'highlight_created')
    group by event_name
  ), totals as (
    select coalesce(sum(item_count), 0) as item_count from counts
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'name', c.name,
    'count', c.item_count,
    'pct', case when t.item_count = 0 then 0 else round((c.item_count::numeric / t.item_count::numeric) * 100, 1) end
  ) order by c.item_count desc), '[]'::jsonb)
  into feature_usage_json
  from counts c cross join totals t;

  select count(*) into period_registrations from public.profiles where created_at >= since_at;
  select count(distinct p.id) into period_first_readers
  from public.profiles p
  join public.analytics_events e on e.user_id = p.id and e.event_name = 'reading_started' and e.occurred_at >= p.created_at
  where p.created_at >= since_at;
  select count(distinct p.id) into period_payers
  from public.profiles p
  join public.subscription_events se on se.user_id = p.id and se.event_type in ('started', 'renewed') and se.occurred_at >= p.created_at
  where p.created_at >= since_at;

  funnel_json := jsonb_build_array(
    jsonb_build_object('stage', 'Registro', 'count', period_registrations, 'pct', case when period_registrations = 0 then 0 else 100 end),
    jsonb_build_object('stage', 'Primera lectura', 'count', period_first_readers, 'pct', case when period_registrations = 0 then 0 else round((period_first_readers::numeric / period_registrations::numeric) * 100, 1) end),
    jsonb_build_object('stage', 'Conversión a pago', 'count', period_payers, 'pct', case when period_registrations = 0 then 0 else round((period_payers::numeric / period_registrations::numeric) * 100, 1) end)
  );

  with latest_devices as (
    select distinct on (coalesce(device_id::text, 'user:' || user_id::text))
      coalesce(device_id::text, 'user:' || user_id::text) as device_identity,
      platform,
      app_version
    from public.analytics_events
    where occurred_at >= since_at
    order by coalesce(device_id::text, 'user:' || user_id::text), occurred_at desc, received_at desc
  ), counts as (
    select platform, app_version as version, count(*) as devices
    from latest_devices
    group by platform, app_version
  ), totals as (
    select coalesce(sum(devices), 0) as devices from counts
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'platform', c.platform,
    'version', c.version,
    'devices', c.devices,
    'pct', case when t.devices = 0 then 0 else round((c.devices::numeric / t.devices::numeric) * 100, 1) end
  ) order by c.devices desc), '[]'::jsonb)
  into platform_versions_json
  from counts c cross join totals t;

  plan_distribution_json := jsonb_build_array(
    jsonb_build_object('plan', 'free', 'count', free_users, 'pct', case when total_users = 0 then 0 else round((free_users::numeric / total_users::numeric) * 100, 1) end),
    jsonb_build_object('plan', 'annual', 'count', annual_users, 'pct', case when total_users = 0 then 0 else round((annual_users::numeric / total_users::numeric) * 100, 1) end),
    jsonb_build_object('plan', 'lifetime', 'count', lifetime_users, 'pct', case when total_users = 0 then 0 else round((lifetime_users::numeric / total_users::numeric) * 100, 1) end)
  );

  return jsonb_build_object(
    'generatedAt', now(),
    'rangeDays', range_days,
    'kpis', jsonb_build_object(
      'usersRegistered', total_users,
      'dailyActiveUsers', dau,
      'weeklyActiveUsers', wau,
      'monthlyActiveUsers', mau,
      'newUsers', new_users,
      'freeUsers', free_users,
      'annualUsers', annual_users,
      'lifetimeUsers', lifetime_users,
      'payingUsers', paying_users,
      'paymentConversionPct', conversion_pct,
      'cancellations', cancellations,
      'grossRevenueCents', gross_revenue_cents,
      'documentsImported', documents_imported,
      'readingSessions', reading_sessions,
      'avgReadingMinutes', avg_reading_minutes,
      'dictionaryUses', dictionary_uses,
      'translationUses', translation_uses,
      'aiUses', ai_uses,
      'textToSpeechUses', text_to_speech_uses,
      'technicalErrors', technical_errors,
      'topAppVersion', top_app_version,
      'topAppVersionPct', coalesce(top_app_version_pct, 0)
    ),
    'activeUsers', active_users_json,
    'formatUsage', format_usage_json,
    'featureUsage', feature_usage_json,
    'funnel', funnel_json,
    'platformVersions', platform_versions_json,
    'planDistribution', plan_distribution_json
  );
end;
$$;

revoke all on function public.admin_dashboard_summary(integer) from public;
grant execute on function public.admin_dashboard_summary(integer) to authenticated;

comment on table public.analytics_events is
  'Operational analytics only. Never store document contents, selected text, notes, highlights, search terms, or AI prompts.';
comment on function public.admin_dashboard_summary(integer) is
  'Returns aggregate Lectoria KPIs to authenticated users whose app_metadata.role is admin.';
