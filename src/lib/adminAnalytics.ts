import type { SupabaseClient } from '@supabase/supabase-js';
import type { AdminDashboardData, DateRange } from '../types/dashboard';
import { supabase } from './supabase';

export const DATE_RANGE_DAYS: Record<DateRange, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
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
      (item) => ['free', 'annual', 'lifetime'].includes(item.plan) && isNumber(item.count) && isNumber(item.pct)
    )
  );
};

export const fetchAdminDashboard = async (
  dateRange: DateRange,
  client: SupabaseClient | null = supabase
): Promise<AdminDashboardData> => {
  if (!client) {
    throw new Error('Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para consultar las métricas.');
  }

  const { data, error } = await client.rpc('admin_dashboard_summary', {
    range_days: DATE_RANGE_DAYS[dateRange],
  });

  if (error) {
    if (error.code === '42501') {
      throw new Error('Tu sesión no tiene permiso de administrador para consultar las métricas.');
    }

    throw new Error('No se pudieron cargar las métricas de Supabase. Inténtalo nuevamente.');
  }

  if (!isDashboardData(data)) {
    throw new Error('Supabase devolvió un formato de métricas incompatible con esta versión del dashboard.');
  }

  return data;
};
