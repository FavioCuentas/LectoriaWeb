import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { OverviewTab } from '../components/dashboard/OverviewTab';
import { createDashboardData } from '../test/dashboardMock';
import type { AdminDashboardData } from '../types/dashboard';
import { createMockSession, createSupabaseMock } from '../test/supabaseMock';

const renderDashboard = (overrides: Partial<AdminDashboardData> = {}) => {
  const mock = createSupabaseMock(createMockSession());
  mock.rpc.mockImplementation(async (_name, params) => ({
    data: { ...createDashboardData((params as { range_days: number }).range_days), ...overrides },
    error: null,
  }));

  render(
    <MemoryRouter initialEntries={['/admin']}>
      <AuthProvider client={mock.client}>
        <Routes>
          <Route path="/admin" element={<AdminLayout analyticsClient={mock.client} />}>
            <Route index element={<OverviewTab />} />
          </Route>
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

  return mock;
};

describe('Dashboard administrativo', () => {
  it('muestra métricas reales y los cuatro planes canónicos', async () => {
    renderDashboard();

    expect(await screen.findByText('Administrador Lectoria')).toBeInTheDocument();
    expect(screen.getByText(/Datos reales de Supabase/i)).toBeInTheDocument();
    expect(screen.getByText('Plan Gratis')).toBeInTheDocument();
    expect(screen.getByText('Plan Semestral')).toBeInTheDocument();
    expect(screen.getByText('Plan Anual')).toBeInTheDocument();
    expect(screen.getByText('Plan De por vida')).toBeInTheDocument();
    expect(screen.getByText('USD 4,99 cada 6 meses')).toBeInTheDocument();
    expect(screen.getByText('USD 7,99 por año')).toBeInTheDocument();
    expect(screen.getByText('USD 19,99 pago único')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Descargar informe/i })).toBeEnabled();
  });

  it('consulta nuevamente el RPC al cambiar a siete días', async () => {
    const mock = renderDashboard();
    await screen.findByText(/Datos reales de Supabase/i);

    fireEvent.click(screen.getByRole('button', { name: '7 días' }));

    await waitFor(() => {
      expect(mock.rpc).toHaveBeenLastCalledWith('admin_dashboard_summary', { range_days: 7 });
    });
    expect(await screen.findByRole('heading', { name: /Métricas clave \(últimos 7 días\)/i })).toBeInTheDocument();
  });

  it('muestra «Sin fuente» en lugar de un 0 cuando la métrica no tiene datos reales', async () => {
    renderDashboard({ unavailableMetrics: ['grossRevenueCents', 'semiannualUsers'] });
    await screen.findByText(/Datos reales de Supabase/i);

    expect(screen.getAllByText('Sin fuente')).toHaveLength(2);
    expect(screen.getAllByText('Pendiente: validar compras en servidor')).toHaveLength(2);
    expect(screen.queryByText('USD 4,99 cada 6 meses')).not.toBeInTheDocument();
  });
});
