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
    plan: 'free' | 'annual' | 'lifetime';
    count: number;
    pct: number;
  }[];
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
