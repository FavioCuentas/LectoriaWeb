import React, { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Download, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import type { DateRange } from '../../types/dashboard';
import { NAV_ITEMS } from '../../config/navigation';

interface AdminLayoutProps {
  analyticsClient?: SupabaseClient | null;
}

const csvEscape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

export const AdminLayout: React.FC<AdminLayoutProps> = ({ analyticsClient }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const { dashboard, loading, error, reload } = useAdminDashboard(dateRange, analyticsClient);

  const activeNavItem =
    NAV_ITEMS.find((item) =>
      item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path)
    ) || NAV_ITEMS[0];

  const handleDownloadReport = () => {
    if (!dashboard) return;

    const labels: Array<[string, string | number]> = [
      ['Usuarios registrados', dashboard.kpis.usersRegistered],
      ['Usuarios activos diarios (DAU)', dashboard.kpis.dailyActiveUsers],
      ['Usuarios activos semanales (WAU)', dashboard.kpis.weeklyActiveUsers],
      ['Usuarios activos mensuales (MAU)', dashboard.kpis.monthlyActiveUsers],
      ['Nuevos usuarios', dashboard.kpis.newUsers],
      ['Usuarios Free', dashboard.kpis.freeUsers],
      ['Usuarios Anual (USD 5/año)', dashboard.kpis.annualUsers],
      ['Usuarios De por vida (USD 20)', dashboard.kpis.lifetimeUsers],
      ['Conversión a pago (%)', dashboard.kpis.paymentConversionPct],
      ['Ingresos brutos del periodo (centavos USD)', dashboard.kpis.grossRevenueCents],
      ['Documentos importados', dashboard.kpis.documentsImported],
      ['Sesiones de lectura', dashboard.kpis.readingSessions],
      ['Tiempo promedio de lectura (min)', dashboard.kpis.avgReadingMinutes],
      ['Uso de diccionario', dashboard.kpis.dictionaryUses],
      ['Uso de traducción', dashboard.kpis.translationUses],
      ['Uso de IA', dashboard.kpis.aiUses],
      ['Uso de texto a voz', dashboard.kpis.textToSpeechUses],
      ['Errores técnicos', dashboard.kpis.technicalErrors],
      ['Versión más utilizada', dashboard.kpis.topAppVersion ?? 'Sin datos'],
    ];

    const rows = [
      ['Métrica', 'Valor', 'Rango', 'Generado en'],
      ...labels.map(([label, value]) => [label, value, `${dashboard.rangeDays} días`, dashboard.generatedAt]),
    ];
    const csvContent = `\uFEFF${rows.map((row) => row.map(csvEscape).join(',')).join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lectoria-informe-${activeNavItem.id}-${dateRange}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statusLabel = loading
    ? 'Actualizando datos…'
    : error
      ? 'Sin conexión a métricas'
      : 'Datos reales de Supabase';

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
            <span className={`admin-data-status${error ? ' error' : ''}`}>{statusLabel}</span>
          </div>

          <div className="admin-toolbar">
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
