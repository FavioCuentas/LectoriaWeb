import type { SupabaseClient } from '@supabase/supabase-js';
import type { AdminDashboardData, DateRange, PlatformFilter } from '../types/dashboard';
import { supabase } from './supabase';
import { PLAN_CODES } from '../config/plans';

export const DATE_RANGE_DAYS: Record<DateRange, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

/**
 * Completa los campos añadidos en la v2 del RPC (semiannualUsers, unavailableMetrics)
 * para que el panel siga funcionando si la web se publica antes de aplicar la migración.
 */
const withV2Defaults = (value: unknown): unknown => {
  if (!value || typeof value !== 'object') return value;
  const candidate = value as Record<string, unknown>;
  const kpis = candidate.kpis;
  const isV1 = !Array.isArray(candidate.unavailableMetrics);
  return {
    ...candidate,
    kpis: kpis && typeof kpis === 'object' ? { semiannualUsers: 0, ...(kpis as object) } : kpis,
    unavailableMetrics: isV1
      ? // La v1 devolvía siempre 0 en finanzas e importaciones por falta de fuente.
        ['freeUsers', 'semiannualUsers', 'annualUsers', 'lifetimeUsers', 'payingUsers', 'paymentConversionPct',
          'cancellations', 'grossRevenueCents', 'planDistribution', 'documentsImported', 'avgReadingMinutes',
          'technicalErrors', 'formatUsage', 'funnel']
      : candidate.unavailableMetrics,
  };
};

const isDashboardData = (value: unknown): value is AdminDashboardData => {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<AdminDashboardData>;
  const kpis = candidate.kpis as Partial<AdminDashboardData['kpis']> | undefined;
  const numberKpis: Array<keyof Omit<AdminDashboardData['kpis'], 'topAppVersion'>> = [
    'usersRegistered',
    'dailyActiveUsers',
    'weeklyActiveUsers',
    'monthlyActiveUsers',
    'newUsers',
    'freeUsers',
    'semiannualUsers',
    'annualUsers',
    'lifetimeUsers',
    'payingUsers',
    'paymentConversionPct',
    'cancellations',
    'grossRevenueCents',
    'documentsImported',
    'readingSessions',
    'avgReadingMinutes',
    'dictionaryUses',
    'translationUses',
    'aiUses',
    'textToSpeechUses',
    'technicalErrors',
    'topAppVersionPct',
  ];

  const isNumber = (item: unknown) => typeof item === 'number' && Number.isFinite(item);
  const isNameCountPct = (item: unknown) => {
    if (!item || typeof item !== 'object') return false;
    const row = item as { name?: unknown; count?: unknown; pct?: unknown };
    return typeof row.name === 'string' && isNumber(row.count) && isNumber(row.pct);
  };

  return (
    typeof candidate.generatedAt === 'string' &&
    [7, 30, 90].includes(candidate.rangeDays ?? 0) &&
    Boolean(kpis) &&
    numberKpis.every((key) => isNumber(kpis?.[key])) &&
    (kpis?.topAppVersion === null || typeof kpis?.topAppVersion === 'string') &&
    Array.isArray(candidate.activeUsers) &&
    candidate.activeUsers.every((item) => typeof item.date === 'string' && isNumber(item.users)) &&
    Array.isArray(candidate.formatUsage) && candidate.formatUsage.every(isNameCountPct) &&
    Array.isArray(candidate.featureUsage) && candidate.featureUsage.every(isNameCountPct) &&
    Array.isArray(candidate.funnel) &&
    candidate.funnel.every((item) => typeof item.stage === 'string' && isNumber(item.count) && isNumber(item.pct)) &&
    Array.isArray(candidate.platformVersions) &&
    candidate.platformVersions.every(
      (item) =>
        ['ios', 'android', 'other'].includes(item.platform) &&
        typeof item.version === 'string' &&
        isNumber(item.devices) &&
        isNumber(item.pct)
    ) &&
    Array.isArray(candidate.planDistribution) &&
    candidate.planDistribution.every(
      (item) => PLAN_CODES.includes(item.plan) && isNumber(item.count) && isNumber(item.pct)
    ) &&
    Array.isArray(candidate.unavailableMetrics) &&
    candidate.unavailableMetrics.every((item) => typeof item === 'string')
  );
};

export const PLATFORM_LABELS: Record<PlatformFilter, string> = {
  all: 'Todas',
  ios: 'iOS',
  android: 'Android',
};

export const fetchAdminDashboard = async (
  dateRange: DateRange,
  client: SupabaseClient | null = supabase,
  platform: PlatformFilter = 'all'
): Promise<AdminDashboardData> => {
  if (!client) {
    throw new Error('Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para consultar las métricas.');
  }

  // Sin filtro se envía solo range_days: así también funciona con el RPC v2 (sin platform_filter).
  const params: Record<string, string | number> = { range_days: DATE_RANGE_DAYS[dateRange] };
  if (platform !== 'all') params.platform_filter = platform;
  const { data, error } = await client.rpc('admin_dashboard_summary', params);

  if (error) {
    if (error.code === '42501') {
      throw new Error('Tu sesión no tiene permiso de administrador para consultar las métricas.');
    }
    // PGRST202: Supabase no encuentra la función con platform_filter (falta la migración v3).
    if (platform !== 'all' && error.code === 'PGRST202') {
      throw new Error('Para filtrar por plataforma aplica la migración v3 del panel (20261123000000_admin_dashboard_summary_v3_platform.sql) en Supabase.');
    }

    throw new Error('No se pudieron cargar las métricas de Supabase. Inténtalo nuevamente.');
  }

  const normalized = withV2Defaults(data);
  if (!isDashboardData(normalized)) {
    throw new Error('Supabase devolvió un formato de métricas incompatible con esta versión del dashboard.');
  }

  return normalized;
};
