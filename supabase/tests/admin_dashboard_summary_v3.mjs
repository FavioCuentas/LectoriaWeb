// Prueba local (sin Supabase remoto) de admin_dashboard_summary v3 (filtro por plataforma). Uso:
// node supabase/tests/admin_dashboard_summary_v3.mjs /ruta/a/@electric-sql/pglite/dist/index.js
// Los eventos de ejemplo reproducen lo que envía la app iOS (nombres y properties reales).
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
      session_id uuid not null default gen_random_uuid(),
      installation_id uuid not null,
      user_id uuid,
      event_name text not null,
      properties jsonb not null default '{}'::jsonb,
      app_version text not null,
      os_version text not null,
      device_family text not null,
      client_timestamp timestamptz not null default now(),
      created_at timestamptz not null default timezone('utc', now())
    );
    alter table public.analytics_events enable row level security;
  `);
  const read = (name) => readFile(new URL(`../migrations/${name}`, import.meta.url), 'utf8');
  // Simula la actualización real: primero la versión anterior, luego la v2 (dos veces).
  await db.exec(await read('20260912000000_admin_dashboard_summary_production.sql'));
  const v2 = await read('20261122000000_admin_dashboard_summary_v2.sql');
  await db.exec(v2);
  // v3 encima de la v2 (actualización real) y reaplicada.
  const v3 = await read('20261123000000_admin_dashboard_summary_v3_platform.sql');
  await db.exec(v3);
  await db.exec(v3);
  const overloads = await db.query("select count(*)::int as n from pg_proc where proname = 'admin_dashboard_summary'");
  assert.equal(overloads.rows[0].n, 1, 'solo debe quedar la firma (integer, text)');

  const claims = (value) => db.query("select set_config('request.jwt.claims', $1, false)", [JSON.stringify(value)]);
  const summary = async (days = 7) => (await db.query('select public.admin_dashboard_summary($1) as data', [days])).rows[0].data;
  const byPlatform = async (days, platform) =>
    (await db.query('select public.admin_dashboard_summary($1, $2) as data', [days, platform])).rows[0].data;

  await db.exec('set role authenticated');
  for (const jwt of [{}, { user_metadata: { role: 'admin' } }, { app_metadata: { role: 'user' } }]) {
    await claims(jwt);
    await assert.rejects(summary(), { code: '42501' });
  }
  await claims({ app_metadata: { role: 'admin' } });
  for (const days of [null, 0, 366]) await assert.rejects(summary(days), { code: '22023' });
  for (const platform of [null, 'web', 'IOS']) await assert.rejects(byPlatform(7, platform), { code: '22023' });

  const empty = await summary(30);
  for (const [key, value] of Object.entries(empty.kpis)) assert.equal(value, key === 'topAppVersion' ? null : 0, key);
  for (const key of ['activeUsers', 'formatUsage', 'featureUsage', 'funnel', 'platformVersions', 'planDistribution']) {
    assert.deepEqual(empty[key], [], key);
  }
  assert.ok(empty.unavailableMetrics.includes('grossRevenueCents'));
  assert.ok(empty.unavailableMetrics.includes('semiannualUsers'));

  await db.exec('reset role');
  const U1 = '00000000-0000-0000-0000-000000000001';
  const IOS_SIGNED = '00000000-0000-0000-0000-0000000000a1';
  const IOS_GUEST = '00000000-0000-0000-0000-0000000000a2';
  const ANDROID_GUEST = '00000000-0000-0000-0000-0000000000a3';
  await db.exec(`
    insert into auth.users values ('${U1}', now() - interval '40 days');
    insert into public.analytics_events
      (installation_id, user_id, event_name, properties, app_version, os_version, device_family, created_at)
    values
      -- iPhone con sesión iniciada
      ('${IOS_SIGNED}', '${U1}', 'document_imported', '{"format":"pdf","file_size_bucket":"1-5MB"}', '1.2.0', 'Version 18.1 (Build 22B83)', 'iPhone', now() - interval '2 hours'),
      ('${IOS_SIGNED}', '${U1}', 'reading_session_ended', '{"duration_seconds":"600","format":"pdf"}', '1.2.0', 'Version 18.1 (Build 22B83)', 'iPhone', now() - interval '1 hour'),
      ('${IOS_SIGNED}', '${U1}', 'paywall_viewed', '{"current_plan":"free"}', '1.2.0', 'Version 18.1 (Build 22B83)', 'iPhone', now() - interval '50 minutes'),
      ('${IOS_SIGNED}', '${U1}', 'purchase_completed', '{"product_id":"com.lectoria.premium.yearly","price":"$7.99"}', '1.2.0', 'Version 18.1 (Build 22B83)', 'iPhone', now() - interval '40 minutes'),
      -- iPhone invitado (sin user_id): antes no contaba como activo
      ('${IOS_GUEST}', null, 'document_imported', '{"format":"pasted_text"}', '1.2.0', 'Version 18.1', 'iPhone', now() - interval '3 days'),
      ('${IOS_GUEST}', null, 'reading_session_ended', '{"duration_seconds":"1200","format":"txt"}', '1.2.0', 'Version 18.1', 'iPhone', now() - interval '3 days'),
      ('${IOS_GUEST}', null, 'reading_session_ended', '{"duration_seconds":"no-numero"}', '1.2.0', 'Version 18.1', 'iPhone', now() - interval '3 days'),
      ('${IOS_GUEST}', null, 'document_import_failed', '{}', '1.2.0', 'Version 18.1', 'iPhone', now() - interval '3 days'),
      -- Android invitado (convención: device_family / os_version empiezan con "Android")
      ('${ANDROID_GUEST}', null, 'document_imported', '{"format":"epub"}', '1.0.0', 'Android 12', 'android_phone', now() - interval '20 hours'),
      ('${ANDROID_GUEST}', null, 'error_occurred', '{"code":"E1"}', '1.0.0', 'Android 12', 'android_phone', now() - interval '20 hours'),
      -- Fuera del rango de 7 días
      ('${IOS_SIGNED}', '${U1}', 'document_imported', '{"format":"epub"}', '1.1.0', 'Version 18.0', 'iPhone', now() - interval '20 days');
  `);
  await db.exec('set role authenticated');
  const d = await summary(7);

  // Personas activas: cuenta U1 + 2 invitados
  assert.equal(d.kpis.dailyActiveUsers, 2);
  assert.equal(d.kpis.weeklyActiveUsers, 3);
  assert.equal(d.kpis.monthlyActiveUsers, 3);
  assert.equal(d.kpis.usersRegistered, 1);
  assert.equal(d.kpis.newUsers, 0);
  assert.equal(d.kpis.documentsImported, 3);
  assert.equal(d.kpis.readingSessions, 3);
  assert.equal(d.kpis.avgReadingMinutes, 15); // (600 + 1200) / 2 s; el valor no numérico se ignora
  assert.equal(d.kpis.technicalErrors, 2);
  assert.equal(d.kpis.grossRevenueCents, 0); // compra reportada por app != ingreso validado
  assert.equal(d.kpis.payingUsers, 0);
  assert.equal(d.kpis.topAppVersion, '1.2.0');
  assert.equal(d.kpis.topAppVersionPct, 66.7);

  assert.deepEqual(d.formatUsage, [
    { name: 'EPUB', count: 1, pct: 33.3 },
    { name: 'PDF', count: 1, pct: 33.3 },
    { name: 'Texto pegado', count: 1, pct: 33.3 },
  ]);
  assert.deepEqual(d.platformVersions, [
    { platform: 'ios', version: '1.2.0', devices: 2, pct: 66.7 },
    { platform: 'android', version: '1.0.0', devices: 1, pct: 33.3 },
  ]);
  assert.deepEqual(d.funnel.map((s) => [s.stage, s.count, s.pct]), [
    ['Personas activas', 3, 100],
    ['Importaron un documento', 3, 100],
    ['Terminaron una lectura', 2, 66.7],
    ['Vieron los planes', 1, 33.3],
    ['Compra reportada por la app', 1, 33.3],
  ]);
  assert.ok(d.activeUsers.length >= 2 && d.activeUsers.every((p) => p.users >= 1 && p.users <= 3)); // los días UTC dependen de la hora de la prueba
  assert.deepEqual(d.planDistribution, []);

  assert.equal(d.platform, 'all');
  const all = await byPlatform(7, 'all');
  assert.deepEqual({ ...all, generatedAt: d.generatedAt }, d);

  // Solo iOS: U1 (iPhone con sesión) + invitado iPhone.
  const ios = await byPlatform(7, 'ios');
  assert.equal(ios.platform, 'ios');
  assert.equal(ios.kpis.weeklyActiveUsers, 2);
  assert.equal(ios.kpis.dailyActiveUsers, 1);
  assert.equal(ios.kpis.usersRegistered, 1);
  assert.equal(ios.kpis.documentsImported, 2);
  assert.equal(ios.kpis.technicalErrors, 1);
  assert.equal(ios.kpis.avgReadingMinutes, 15);
  assert.deepEqual(ios.formatUsage.map((f) => f.name), ['PDF', 'Texto pegado']);
  assert.deepEqual(ios.platformVersions, [{ platform: 'ios', version: '1.2.0', devices: 2, pct: 100 }]);
  assert.equal(ios.funnel[0].count, 2);
  assert.equal(ios.kpis.topAppVersionPct, 100);

  // Solo Android: el invitado Android; ninguna cuenta registrada lo usa.
  const android = await byPlatform(7, 'android');
  assert.equal(android.kpis.weeklyActiveUsers, 1);
  assert.equal(android.kpis.usersRegistered, 0);
  assert.equal(android.kpis.documentsImported, 1);
  assert.equal(android.kpis.readingSessions, 0);
  assert.equal(android.kpis.avgReadingMinutes, 0);
  assert.equal(android.kpis.technicalErrors, 1);
  assert.deepEqual(android.formatUsage, [{ name: 'EPUB', count: 1, pct: 100 }]);
  assert.deepEqual(android.platformVersions, [{ platform: 'android', version: '1.0.0', devices: 1, pct: 100 }]);
  assert.deepEqual(android.funnel.map((s) => s.count), [1, 1, 0, 0, 0]);
  assert.deepEqual(android.unavailableMetrics, d.unavailableMetrics);

  const json = JSON.stringify(d);
  for (const secret of ['0000000000a', U1, 'com.lectoria', '1-5MB', 'Build 22B83']) {
    assert.ok(!json.includes(secret), `no debe exponer ${secret}`);
  }
  await assert.rejects(db.query('select * from public.analytics_events'), { code: '42501' });
  await db.exec('reset role');
  for (const role of ['anon', 'service_role']) {
    await db.exec(`set role ${role}`);
    await assert.rejects(summary(), { code: '42501' });
    await db.exec('reset role');
  }
  console.log('SQL v3 checks passed: platform filter (all/ios/android), single signature, admin gate, ranges, empty contract, guests as active, imports/formats, reading minutes, errors, platforms, funnel, privacy, upgrade + reapplication.');
} finally {
  await db.close();
}
