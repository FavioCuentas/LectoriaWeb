-- Read-only production schema inspection. Returns no event rows or user data.
-- Run this entire file in Supabase SQL Editor and share both result sets.
select table_schema, table_name, ordinal_position, column_name,
       data_type, udt_schema, udt_name, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name in (
    'analytics_events',
    'v_daily_active_users',
    'v_educational_tools_usage',
    'v_monetization_metrics',
    'v_reading_session_metrics'
  )
order by table_name, ordinal_position;

select n.nspname as schema_name, c.relname as view_name,
       pg_catalog.pg_get_viewdef(c.oid, true) as definition
from pg_catalog.pg_class c
join pg_catalog.pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind in ('v', 'm')
  and c.relname in (
    'v_daily_active_users',
    'v_educational_tools_usage',
    'v_monetization_metrics',
    'v_reading_session_metrics'
  )
order by c.relname;
