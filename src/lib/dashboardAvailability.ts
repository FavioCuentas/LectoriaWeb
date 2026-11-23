// Textos para métricas sin fuente confirmada (ver unavailableMetrics del RPC).
// Un 0 en esas métricas no significa "nadie", sino "todavía no medimos esto".
export const UNAVAILABLE_VALUE = 'Sin fuente';

const FINANCIAL_METRICS = new Set([
  'freeUsers', 'semiannualUsers', 'annualUsers', 'lifetimeUsers', 'payingUsers',
  'paymentConversionPct', 'cancellations', 'grossRevenueCents', 'planDistribution',
]);

/** Motivo corto para mostrar debajo de una métrica sin fuente. */
export const unavailableDetail = (key: string): string =>
  FINANCIAL_METRICS.has(key)
    ? 'Pendiente: validar compras en servidor'
    : 'Pendiente: aplicar la migración v2 del panel';
