import React, { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Download, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import type { DateRange, PlatformFilter } from '../../types/dashboard';
import { PLATFORM_LABELS } from '../../lib/adminAnalytics';
import { NAV_ITEMS } from '../../config/navigation';
import { PLAN_LABELS } from '../../config/plans';
import { UNAVAILABLE_VALUE } from '../../lib/dashboardAvailability';

interface AdminLayoutProps {
  analyticsClient?: SupabaseClient | null;
}

const csvEscape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

export const AdminLayout: React.FC<AdminLayoutProps> = ({ analyticsClient }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [platform, setPlatform] = useState<PlatformFilter>('all');
  const { dashboard, loading, error, reload } = useAdminDashboard(dateRange, analyticsClient, platform);

  const activeNavItem =
    NAV_ITEMS.find((item) =>
      item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path)
    ) || NAV_ITEMS[0];

  const handleDownloadReport = () => {
    if (!dashboard) return;

    const k = dashboard.kpis;
    // [etiqueta, valor, clave de la métrica para detectar «Sin fuente»]
    const metrics: Array<[string, string | number, string?]> = [
      [platform === 'all' ? 'Usuarios registrados' : `Cuentas que usan ${PLATFORM_LABELS[platform]}`, k.usersRegistered],
      ['Personas activas diarias (incluye invitados)', k.dailyActiveUsers],
      ['Personas activas semanales (incluye invitados)', k.weeklyActiveUsers],
      ['Personas activas mensuales (incluye invitados)', k.monthlyActiveUsers],
      ['Nuevas cuentas', k.newUsers],
      [`Plan ${PLAN_LABELS.free}`, k.freeUsers, 'freeUsers'],
      [`Plan ${PLAN_LABELS.semiannual}`, k.semiannualUsers, 'semiannualUsers'],
      [`Plan ${PLAN_LABELS.annual}`, k.annualUsers, 'annualUsers'],
      [`Plan ${PLAN_LABELS.lifetime}`, k.lifetimeUsers, 'lifetimeUsers'],
      ['Usuarios de pago', k.payingUsers, 'payingUsers'],
      ['Conversión a pago (%)', k.paymentConversionPct, 'paymentConversionPct'],
      ['Ingresos brutos del periodo (centavos USD)', k.grossRevenueCents, 'grossRevenueCents'],
      ['Cancelaciones', k.cancellations, 'cancellations'],
      ['Documentos importados', k.documentsImported, 'documentsImported'],
      ['Sesiones de lectura', k.readingSessions],
      ['Tiempo promedio de lectura (min)', k.avgReadingMinutes, 'avgReadingMinutes'],
      ['Uso de diccionario', k.dictionaryUses],
      ['Uso de traducción', k.translationUses],
      ['Uso de IA', k.aiUses],
      ['Uso de texto a voz', k.textToSpeechUses],
      ['Errores técnicos', k.technicalErrors, 'technicalErrors'],
      ['Versión más utilizada', k.topAppVersion ?? 'Sin datos'],
    ];
    const labels: Array<[string, string | number]> = metrics.map(([label, value, key]) => [
      label,
      key && dashboard.unavailableMetrics.includes(key) ? UNAVAILABLE_VALUE : value,
    ]);

    const rows = [
      ['Métrica', 'Valor', 'Plataforma', 'Rango', 'Generado en'],
      ...labels.map(([label, value]) => [
        label,
        value,
        PLATFORM_LABELS[platform],
        `${dashboard.rangeDays} días`,
        dashboard.generatedAt,
      ]),
    ];
    const csvContent = `\uFEFF${rows.map((row) => row.map(csvEscape).join(',')).join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lectoria-informe-${activeNavItem.id}-${platform === 'all' ? 'todas' : platform}-${dateRange}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statusLabel = loading
    ? 'Actualizando datos…'
    : error
      ? 'Sin conexión a métricas'
      : null;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <button type="button" className="admin-brand" onClick={() => navigate('/admin')}>
          <img src="/assets/lectoria-logo-institucional.png" alt="" />
          <span>Lectoria Admin</span>
        </button>

        <nav className="admin-nav" aria-label="Navegación administrativa">
          {NAV_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeNavItem.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                className={`admin-nav-item${isActive ? ' active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <IconComponent size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-profile">
          <div className="admin-avatar">{user?.avatarInitials || 'AD'}</div>
          <div className="admin-profile-copy">
            <div>{user?.name || 'Administrador'}</div>
            <button type="button" onClick={() => void logout()}>
              <LogOut size={12} /> Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <div className="admin-content">
        <header className="admin-header">
          <div>
            <h1>{activeNavItem.label}</h1>
            {statusLabel && (
              <span className={`admin-data-status${error ? ' error' : ''}`}>{statusLabel}</span>
            )}
          </div>

          <div className="admin-toolbar">
            <div className="admin-range" role="group" aria-label="Plataforma">
              {(['all', 'ios', 'android'] as PlatformFilter[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={platform === option}
                  className={platform === option ? 'active' : ''}
                  onClick={() => setPlatform(option)}
                >
                  {PLATFORM_LABELS[option]}
                </button>
              ))}
            </div>

            <div className="admin-range" role="radiogroup" aria-label="Rango de fechas">
              {(['7d', '30d', '90d'] as DateRange[]).map((range) => (
                <button
                  key={range}
                  type="button"
                  aria-pressed={dateRange === range}
                  className={dateRange === range ? 'active' : ''}
                  onClick={() => setDateRange(range)}
                >
                  {range === '7d' ? '7 días' : range === '30d' ? '30 días' : '90 días'}
                </button>
              ))}
            </div>

            <button type="button" className="btn btn-secondary" onClick={reload} disabled={loading}>
              <RefreshCw size={15} className={loading ? 'lect-spinner' : undefined} />
              Actualizar
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleDownloadReport} disabled={!dashboard}>
              <Download size={15} />
              Descargar informe
            </button>
          </div>
        </header>

        <main className="admin-main">
          <Outlet
            context={{
              dateRange,
              platform,
              dashboard,
              dashboardLoading: loading,
              dashboardError: error,
              reloadDashboard: reload,
            }}
          />
        </main>
      </div>
    </div>
  );
};
