import type { AdminDashboardData } from '../types/dashboard';

export const createDashboardData = (rangeDays = 30): AdminDashboardData => ({
  generatedAt: '2026-09-11T12:00:00.000Z',
  rangeDays,
  kpis: {
    usersRegistered: 25,
    dailyActiveUsers: 7,
    weeklyActiveUsers: 14,
    monthlyActiveUsers: 20,
    newUsers: 5,
    freeUsers: 18,
    annualUsers: 5,
    lifetimeUsers: 2,
    payingUsers: 7,
    paymentConversionPct: 28,
    cancellations: 1,
    grossRevenueCents: 6500,
    documentsImported: 42,
    readingSessions: 60,
    avgReadingMinutes: 18.5,
    dictionaryUses: 35,
    translationUses: 21,
    aiUses: 30,
    textToSpeechUses: 8,
    technicalErrors: 2,
    topAppVersion: '2.4.1',
    topAppVersionPct: 72,
  },
  activeUsers: [
    { date: '2026-09-10', users: 6 },
    { date: '2026-09-11', users: 7 },
  ],
  formatUsage: [
    { name: 'PDF', count: 30, pct: 71.4 },
    { name: 'EPUB', count: 12, pct: 28.6 },
  ],
  featureUsage: [
    { name: 'Diccionario', count: 35, pct: 37.2 },
    { name: 'IA', count: 30, pct: 31.9 },
  ],
  funnel: [
    { stage: 'Registro', count: 5, pct: 100 },
    { stage: 'Primera lectura', count: 4, pct: 80 },
    { stage: 'Conversión a pago', count: 2, pct: 40 },
  ],
  platformVersions: [
    { platform: 'ios', version: '2.4.1', devices: 13, pct: 72.2 },
    { platform: 'android', version: '1.0.0', devices: 5, pct: 27.8 },
  ],
  planDistribution: [
    { plan: 'free', count: 18, pct: 72 },
    { plan: 'annual', count: 5, pct: 20 },
    { plan: 'lifetime', count: 2, pct: 8 },
  ],
});
