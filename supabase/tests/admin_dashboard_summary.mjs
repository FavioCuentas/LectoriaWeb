// Local-only PostgreSQL check. Usage:
// node supabase/tests/admin_dashboard_summary.mjs /path/to/@electric-sql/pglite/dist/index.js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const { PGlite } = await import(pathToFileURL(process.argv[2]).href);
const db = new PGlite();
try {
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role;
    create schema auth;
    create table auth.users (id uuid, created_at timestamptz);
    create function auth.jwt() returns jsonb language sql stable as
      'select nullif(current_setting(''request.jwt.claims'', true), '''')::jsonb';
    create table public.analytics_events (
      id uuid not null default gen_random_uuid(),
      session_id uuid not null,
      installation_id uuid not null,
      user_id uuid,
      event_name text not null,
      properties jsonb not null default '{}'::jsonb,
      app_version text not null,
      os_version text not null,
      device_family text not null,
      client_timestamp timestamptz not null,
      created_at timestamptz not null default timezone('utc', now())
    );
    alter table public.analytics_events enable row level security;
  `);
  const sql = await readFile(new URL('../migrations/20260912000000_admin_dashboard_summary_production.sql', import.meta.url), 'utf8');
  await db.exec(sql);
  await db.exec(sql); // Safe reapplication, no source objects recreated.
  const claims = async (value) => db.query("select set_config('request.jwt.claims', $1, false)", [JSON.stringify(value)]);
  const summary = async (days = 7) => (await db.query('select public.admin_dashboard_summary($1) as data', [days])).rows[0].data;
  await db.exec('set role authenticated');
  for (const jwt of [{}, { user_metadata: { role: 'admin' } }, { app_metadata: { role: 'user' } }, { app_metadata: { role: null } }]) {
    await claims(jwt);
    await assert.rejects(summary(), { code: '42501' });
  }
  await claims({ app_metadata: { role: 'admin' } });
  for (const days of [null, 0, -1, 366]) await assert.rejects(summary(days), { code: '22023' });
  for (const days of [1, 7, 30, 90, 365]) {
    const empty = await summary(days);
    assert.equal(empty.rangeDays, days);
    for (const [key, value] of Object.entries(empty.kpis)) assert.equal(value, key === 'topAppVersion' ? null : 0);
    for (const key of ['activeUsers', 'formatUsage', 'featureUsage', 'funnel', 'platformVersions', 'planDistribution']) assert.deepEqual(empty[key], []);
  }
  await db.exec('reset role');
  await db.exec(`
    insert into auth.users values
      ('00000000-0000-0000-0000-000000000001', now() - interval '50 days'),
      ('00000000-0000-0000-0000-000000000002', now() - interval '1 day');
    insert into public.analytics_events (id, installation_id, user_id, event_name, app_version, created_at, client_timestamp, properties, session_id, os_version, device_family)
    select ('00000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid,
      '00000000-0000-0000-0000-000000000011'::uuid,
      '00000000-0000-0000-0000-000000000001'::uuid,
      event, version, now() - age, now() + interval '100 days', '{"private":"NEVER_RETURN"}',
      gen_random_uuid(), '18.0', 'phone'
    from (values
      (1, 'dictionary_looked_up', '1.0', interval '2 days'),
      (2, 'dictionary_looked_up', '2.0', interval '1 hour'),
      (3, 'translation_requested', '1.0', interval '8 days'),
      (4, 'reading_session_ended', '1.0', interval '3 days'),
      (5, 'purchase_completed', '1.0', interval '4 days'),
      (6, 'ai_query_executed', '9.0', interval '-1 day')
    ) as fixture(n, event, version, age);
    insert into public.analytics_events
      (session_id, installation_id, user_id, event_name, app_version, os_version,
       device_family, client_timestamp, created_at)
    values
      (gen_random_uuid(), '00000000-0000-0000-0000-000000000012', null,
       'note_created', '2.0', '18.0', 'phone', now(), now() - interval '1 hour'),
      (gen_random_uuid(), '00000000-0000-0000-0000-000000000013',
       '00000000-0000-0000-0000-000000000002', 'app_opened', '1.0', '18.0',
       'phone', now(), now() - interval '20 days');
    set role authenticated;
  `);
  const data = await summary();
  assert.equal(data.kpis.usersRegistered, 2);
  assert.equal(data.kpis.newUsers, 1);
  assert.equal(data.kpis.dailyActiveUsers, 1);
  assert.equal(data.kpis.weeklyActiveUsers, 1);
  assert.equal(data.kpis.monthlyActiveUsers, 2);
  assert.equal(data.kpis.dictionaryUses, 2);
  assert.equal(data.kpis.translationUses, 0);
  assert.equal(data.kpis.aiUses, 0);
  assert.equal(data.kpis.readingSessions, 1);
  assert.equal(data.kpis.payingUsers, 0);
  assert.equal(data.kpis.grossRevenueCents, 0);
  assert.equal(data.kpis.topAppVersion, '2.0');
  assert.deepEqual(data.platformVersions, [{ platform: 'other', version: '2.0', devices: 2, pct: 100 }]);
  assert.deepEqual(data.featureUsage, [{ name: 'Diccionario', count: 2, pct: 66.7 }, { name: 'Notas', count: 1, pct: 33.3 }]);
  assert.ok(!JSON.stringify(data).includes('NEVER_RETURN'));
  assert.ok(!JSON.stringify(data).includes('00000000-'));
  await assert.rejects(db.query('select * from public.analytics_events'), { code: '42501' });
  await db.exec('reset role');
  for (const role of ['anon', 'service_role']) {
    await db.exec(`set role ${role}`);
    await assert.rejects(summary(), { code: '42501' });
    await db.exec('reset role');
  }
  console.log('SQL checks passed: admin gate, grants, ranges, empty contract, aggregates, time filter, RLS isolation, privacy, reapplication.');
} finally {
  await db.close();
}
