# Contrato de admin_dashboard_summary

Inspeccionado en `src/lib/adminAnalytics.ts`, `src/types/dashboard.ts`,
`src/components/dashboard/OverviewTab.tsx`,
`src/components/dashboard/DynamicAdminView.tsx` y
`src/components/layout/AdminLayout.tsx`.

El RPC recibe `{ range_days: number }` y devuelve un objeto JSON, no una lista
de filas. El frontend solicita y valida exclusivamente 7, 30 o 90 días.
La nueva función podrá aceptar enteros de 1 a 365 sin cambiar el selector actual.

```ts
{
  generatedAt: string;
  rangeDays: number;
  kpis: {
    usersRegistered: number;
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    newUsers: number;
    freeUsers: number;
    annualUsers: number;
    semiannualUsers: number;   // v2
    lifetimeUsers: number;
    payingUsers: number;
    paymentConversionPct: number;
    cancellations: number;
    grossRevenueCents: number;
    documentsImported: number;
    readingSessions: number;
    avgReadingMinutes: number;
    dictionaryUses: number;
    translationUses: number;
    aiUses: number;
    textToSpeechUses: number;
    technicalErrors: number;
    topAppVersion: string | null;
    topAppVersionPct: number;
  };
  activeUsers: { date: string; users: number }[];
  formatUsage: { name: string; count: number; pct: number }[];
  featureUsage: { name: string; count: number; pct: number }[];
  funnel: { stage: string; count: number; pct: number }[];
  platformVersions: {
    platform: 'ios' | 'android' | 'other';
    version: string;
    devices: number;
    pct: number;
  }[];
  planDistribution: {
    plan: 'free' | 'semiannual' | 'annual' | 'lifetime';
    count: number;
    pct: number;
  }[];
  unavailableMetrics: string[]; // v2: claves sin fuente confirmada
}
```

Todos los números deben ser finitos; todas las claves son obligatorias.
Las seis colecciones admiten `[]`. Solo `topAppVersion` admite `null`.
Los porcentajes se muestran en escala 0–100. Los ingresos se dividen por 100
y se muestran como USD; la duración se muestra en minutos.

La interfaz describe DAU como usuarios únicos de las últimas 24 horas,
WAU de los últimos 7 días y MAU de los últimos 30 días. Los registrados son
un total acumulado; los nuevos corresponden al período solicitado.
El promedio de lectura corresponde a sesiones finalizadas.
La conversión se describe como usuarios de pago / registrados y los usuarios
de pago como Anual + De por vida. No sustituir esas métricas por vistas de
paywall o eventos de compra sin validación de servidor.

Sin una fuente confirmada de suscripciones e ingresos, devolver cero para
los KPI financieros y `[]` para distribución de planes. No clasificar a todos
los usuarios como Free por ausencia de una tabla de suscripciones.

## Migración para el esquema confirmado de producción

Archivo nuevo: `migrations/20260912000000_admin_dashboard_summary_production.sql`.
Solo define el RPC, su comentario y sus permisos, dentro de una transacción.
No se ha ejecutado SQL remoto. No aplicar la migración histórica
`20260911000000_analytics_dashboard.sql` ni un push general de pendientes:
esa propuesta usa otro esquema y modifica tablas, RLS y Auth.

### Fuentes y semántica

- `usersRegistered`: COUNT de `auth.users` anterior a generatedAt;
  `newUsers`: mismo origen, con created_at dentro del rango. Solo lectura agregada.
- DAU/WAU/MAU: usuarios registrados distintos (`user_id` no nulo) con eventos
  en las últimas 24 horas/7 días/30 días, independientemente del selector.
  No sumar conteos diarios ni confundir instalaciones con usuarios.
- Métricas del período: intervalo semiabierto
  `[generatedAt - range_days días, generatedAt)` sobre `analytics_events.created_at`.
  No usar client_timestamp. Fechas de la serie diaria en UTC, solo días con eventos;
  un rango móvil puede abarcar range_days + 1 fechas parciales.
- Lecturas: COUNT de `reading_session_ended`.
- Herramientas: los siete nombres confirmados de `v_educational_tools_usage`;
  porcentajes respecto del total de esos eventos en el período.
- Versiones: último evento por installation_id en el período, desempate por id.
  Cada instalación cuenta una vez. Versiones ausentes o no válidas se agrupan
  como «Sin datos» y permanecen en el denominador. Solo se exponen etiquetas
  de versión de hasta 40 caracteres, que comienzan con un dígito y contienen
  letras ASCII, dígitos, punto, guion, guion bajo o signo más.
  La versión más utilizada se elige entre las conocidas; sin ellas devuelve null/0.
- No se consultan las vistas: las vistas agregadas sin fecha no permiten
  reconstruir el rango solicitado. No se crean ni modifican vistas.

### Métricas no disponibles con la información confirmada

El contrato actual no admite null en KPI numéricos. Los siguientes ceros
significan **fuente/mapeo pendiente**, no ausencia demostrada de actividad:

- Finanzas, planes y cancelaciones: 0; planDistribution y funnel: [].
  purchase_completed/paywall_viewed no prueban ingresos ni suscripciones vigentes.
- documentsImported y technicalErrors: 0; faltan nombres de eventos confirmados.
- avgReadingMinutes: 0; falta la expresión exacta de la vista que extrae la
  duración desde properties. El nombre de la columna agregada no confirma la clave.
- formatUsage: []; el frontend muestra «Importaciones», por lo que no corresponde
  sustituirlas por sesiones agrupadas por properties->>'format'.
- platformVersions.platform: other; falta un mapeo confirmado de plataforma.
  No se deduce iOS/Android de device_family ni os_version.

Estos límites están documentados también en el SQL. El frontend no distingue
visualmente un cero por falta de fuente de un cero observado; no se modifica
el contrato ni el frontend en esta migración.

### Seguridad

SECURITY DEFINER, search_path vacío, zona UTC y relaciones calificadas.
La función exige auth.jwt()->'app_metadata'->>'role' = 'admin'; rechaza ausencia,
null y otros roles con 42501, antes de leer datos. user_metadata no autoriza.
range_days admite enteros 1..365; NULL y valores fuera del rango producen 22023.
Se revocan permisos de PUBLIC, anon, authenticated y service_role y se concede
EXECUTE únicamente a authenticated. El propietario conserva los privilegios
inherentes de PostgreSQL; también debe superar la comprobación JWT al invocar.
No se devuelven identificadores, correos, filas de eventos ni properties.

### Confirmación adicional del esquema

Se verificaron los tipos, NOT NULL y defaults de producción. Solo user_id
admite NULL. id usa gen_random_uuid(), properties usa '{}'::jsonb y created_at
usa timezone('utc', now()). La prueba local reproduce estas restricciones;
la migración no las modifica. Esta confirmación no aporta la clave JSON de
duración, los eventos de importación/error ni el mapeo de plataforma, que
continúan pendientes según lo documentado arriba.


## v2 (2026-11-22): `20261122000000_admin_dashboard_summary_v2.sql`

Reemplaza la función anterior (solo el RPC, permisos y comentario). Se confirmó el
mapeo leyendo el cliente iOS (`SupabaseAnalyticsService`, `ImportService`,
`ReadingSessionCoordinator`, `PaywallView`), que inserta en `analytics_events`:

| Métrica | Fuente |
| --- | --- |
| Personas activas (DAU/WAU/MAU, serie diaria, embudo) | `user_id` si existe; si no, `installation_id`. Las apps funcionan sin cuenta, así que contar solo `user_id` dejaba fuera a casi todos. |
| `documentsImported`, `formatUsage` | `document_imported`, `properties.format` (`epub`, `pdf`, `txt`, `markdown`, `pasted_text`, `pptx`). |
| `avgReadingMinutes` | `reading_session_ended`, `properties.duration_seconds` (texto numérico; los valores no numéricos se ignoran). |
| `technicalErrors` | `error_occurred` + `document_import_failed`. |
| `platformVersions.platform` | iOS: `device_family` `iPhone`/`iPad` u `os_version` iOS. Android: `device_family` u `os_version` que empiece con `Android` (convención para el cliente Android). |
| `funnel` | Personas activas → importaron → terminaron una lectura → vieron planes → compra reportada por la app. |

Siguen sin fuente validada por servidor (nadie escribe `subscription_entitlements`
ni `purchase_transactions`): planes, usuarios de pago, conversión, ingresos,
cancelaciones y `planDistribution`. Se devuelven en 0/[] y se listan en
`unavailableMetrics`; el panel los muestra como «Sin fuente». `purchase_completed`
solo aparece en el embudo como «compra reportada por la app», nunca como ingreso.

Compatibilidad: si la web se publica antes de aplicar la v2, el frontend acepta la
respuesta v1 (`semiannualUsers` = 0 y marca como «Sin fuente» lo que la v1 no medía).

Prueba local: `node supabase/tests/admin_dashboard_summary_v2.mjs <ruta a pglite>`
(aplica la v1, luego la v2 dos veces, y verifica permisos, rangos, invitados,
formatos, minutos, errores, plataformas, embudo y privacidad).

## v3 (2026-11-23): filtro por plataforma

Migración: `migrations/20261123000000_admin_dashboard_summary_v3_platform.sql` (aplicar después de la v2).

- Firma: `admin_dashboard_summary(range_days integer default 30, platform_filter text default 'all')`.
  `platform_filter` admite `all`, `ios` o `android`; cualquier otro valor devuelve `22023`.
- La firma anterior `(integer)` se elimina para que la llamada con solo `range_days` no sea ambigua.
  El panel envía `platform_filter` únicamente cuando se elige iOS o Android, así que con "Todas"
  sigue funcionando aunque la v3 aún no esté aplicada.
- Cada evento se clasifica con la misma regla de `platformVersions` (iPhone/iPad/iOS → `ios`,
  Android → `android`). Con filtro, actividad, uso, embudo, formatos y versiones se limitan a
  esa plataforma.
- `usersRegistered` / `newUsers` con filtro = cuentas de `auth.users` que enviaron al menos un
  evento desde esa plataforma (Auth no guarda la plataforma).
- La respuesta incluye `platform`.
- Prueba local: `node supabase/tests/admin_dashboard_summary_v3.mjs <ruta a pglite/dist/index.js>`.
