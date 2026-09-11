import type { PlanCode } from '../config/plans';

export type DateRange = '7d' | '30d' | '90d';

export interface StatMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaType: 'positive' | 'negative' | 'neutral';
  category: 'users' | 'usage' | 'technical' | 'financial';
}

export interface UserActivePoint {
  date: string;
  users: number;
}

export interface FormatUsageItem {
  name: string;
  pct: number;
  count: number;
}

export interface FeatureUsageItem {
  name: string;
  pct: number;
  count: number;
}

export interface FunnelStep {
  stage: string;
  pct: number;
  count: number;
}

export interface PlatformVersionItem {
  platform: 'ios' | 'android' | 'other';
  version: string;
  pct: number;
  devices: number;
}

export interface PlanDistributionItem {
  plan: PlanCode;
  count: number;
  pct: number;
}

export interface DashboardKpis {
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
}

export interface AdminDashboardData {
  generatedAt: string;
  rangeDays: number;
  kpis: DashboardKpis;
  activeUsers: UserActivePoint[];
  formatUsage: FormatUsageItem[];
  featureUsage: FeatureUsageItem[];
  funnel: FunnelStep[];
  platformVersions: PlatformVersionItem[];
  planDistribution: PlanDistributionItem[];
}

export interface AdminOutletContext {
  dateRange: DateRange;
  dashboard: AdminDashboardData | null;
  dashboardLoading: boolean;
  dashboardError: string | null;
  reloadDashboard: () => void;
}
