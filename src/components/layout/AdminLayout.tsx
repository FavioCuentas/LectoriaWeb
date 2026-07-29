import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DateRange } from '../../types/dashboard';
import { NAV_ITEMS } from '../../config/navigation';
import { Download, LogOut } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  const activeNavItem = NAV_ITEMS.find((item) =>
    item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path)
  ) || NAV_ITEMS[0];

  const handleDownloadReport = () => {
    const rows = [
      ['Métrica / Indicador', 'Valor Registrado', 'Variación vs Periodo Previo', 'Rango Seleccionado'],
      ['Usuarios registrados', '4,820', '+12.4%', dateRange],
      ['Usuarios activos diarios (DAU)', '612', '+8.2%', dateRange],
      ['Usuarios activos mensuales (MAU)', '3,510', '+15.1%', dateRange],
      ['Documentos importados', '9,840', '+22.0%', dateRange],
      ['Sesiones de lectura', '15,200', '+18.5%', dateRange],
      ['Tiempo promedio de lectura', '24 min', 'Estable', dateRange],
      ['Conversión a pago', '14.7%', 'Estable', dateRange],
    ];

    const csvContent = '\uFEFF' + rows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n');
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

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--color-neutral-100)',
        fontFamily: 'var(--font-body)',
        color: 'var(--color-text)',
      }}
    >
      {/* SIDEBAR NAVIGATION */}
      <aside
        style={{
          width: '240px',
          flex: 'none',
          background: 'var(--color-neutral-900)',
          color: 'var(--color-neutral-200)',
          display: 'flex',
          flexDirection: 'column',
          padding: '18px 12px',
          gap: '4px',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        }}
      >
        {/* Brand */}
        <div
          onClick={() => navigate('/admin')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 10px 18px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'var(--color-accent)',
              display: 'grid',
              placeContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            L
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', color: '#fff' }}>
            Lectoria Admin
          </span>
        </div>

        {/* Nav Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeNavItem.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  border: 'none',
                  textAlign: 'left',
                  width: '100%',
                  background: isActive ? 'var(--color-accent-700)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--color-neutral-300)',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.15s ease',
                }}
              >
                <IconComponent size={17} style={{ flex: 'none', opacity: isActive ? 1 : 0.8 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div
          style={{
            marginTop: 'auto',
            padding: '14px 10px 4px',
            borderTop: '1px solid color-mix(in srgb, #fff 12%, transparent)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--color-accent-500)',
              color: '#fff',
              display: 'grid',
              placeContent: 'center',
              fontSize: '12px',
              fontFamily: 'var(--font-heading)',
              flex: 'none',
            }}
          >
            {user?.avatarInitials || 'AD'}
          </div>
          <div style={{ fontSize: '12px', lineHeight: '1.4', overflow: 'hidden', flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'Administrador'}
            </div>
            <button
              type="button"
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--color-accent-300)',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '2px',
              }}
            >
              <LogOut size={12} /> Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Header Bar */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '16px clamp(18px, 3vw, 32px)',
            borderBottom: '1px solid var(--color-divider)',
            background: 'var(--color-bg)',
            flexWrap: 'wrap',
          }}
        >
          <h1 style={{ fontSize: '20px', margin: 0, color: 'var(--color-text)' }}>
            {activeNavItem.label}
          </h1>

          <span
            style={{
              background: 'var(--color-accent-2-100)',
              color: 'var(--color-accent-2-800)',
              border: '1px solid var(--color-accent-2-300)',
              padding: '2px 10px',
              borderRadius: '999px',
              fontSize: '11.5px',
              fontWeight: 600,
            }}
          >
            Datos de demostración
          </span>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* Date Range Selector */}
            <div
              style={{
                display: 'inline-flex',
                background: 'var(--color-surface)',
                padding: '3px',
                borderRadius: 'var(--radius-sm)',
                gap: '2px',
                border: '1px solid var(--color-divider)',
              }}
              role="radiogroup"
              aria-label="Rango de fechas"
            >
              {(['7d', '30d', '90d'] as DateRange[]).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setDateRange(range)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: dateRange === range ? '#fff' : 'transparent',
                    color: dateRange === range ? 'var(--color-text)' : 'var(--color-neutral-700)',
                    boxShadow: dateRange === range ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  {range === '7d' ? '7 días' : range === '30d' ? '30 días' : '90 días'}
                </button>
              ))}
            </div>

            {/* CSV Download Button */}
            <button
              type="button"
              onClick={handleDownloadReport}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                background: '#fff',
                border: '1px solid var(--color-divider)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-text)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Download size={15} />
              <span>Descargar informe</span>
            </button>
          </div>
        </header>

        {/* Outlet Main Container */}
        <main style={{ padding: 'clamp(18px, 3vw, 32px)', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <Outlet context={{ dateRange }} />
        </main>
      </div>
    </div>
  );
};
