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
  newUsers: number;
}

export interface FormatUsageItem {
  format: string;
  pct: number;
  count: number;
  color: string;
}

export interface FeatureUsageItem {
  feature: string;
  pct: number;
  usersCount: number;
  color: string;
}

export interface FunnelStep {
  stage: string;
  pct: number;
  count: number;
}

export interface IosDistItem {
  version: string;
  pct: number;
  devices: number;
  color: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  plan: 'Gratuito' | 'Premium';
  registeredAt: string;
  lastActive: string;
  documentsCount: number;
  status: 'Activo' | 'Inactivo' | 'Suspendido';
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  details: string;
  ipAddress: string;
}
