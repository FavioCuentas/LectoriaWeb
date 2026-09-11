import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { OverviewTab } from '../components/dashboard/OverviewTab';
import { createDashboardData } from '../test/dashboardMock';
import { createMockSession, createSupabaseMock } from '../test/supabaseMock';

const renderDashboard = () => {
  const mock = createSupabaseMock(createMockSession());
  mock.rpc.mockImplementation(async (_name, params) => ({
    data: createDashboardData((params as { range_days: number }).range_days),
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
  it('muestra métricas reales y los tres planes canónicos', async () => {
    renderDashboard();

    expect(await screen.findByText('Administrador Lectoria')).toBeInTheDocument();
    expect(screen.getByText(/Datos reales de Supabase/i)).toBeInTheDocument();
    expect(screen.getByText('Plan Free')).toBeInTheDocument();
    expect(screen.getByText('Plan Anual')).toBeInTheDocument();
    expect(screen.getByText('Plan De por vida')).toBeInTheDocument();
    expect(screen.getByText('USD 5 por año')).toBeInTheDocument();
    expect(screen.getByText('USD 20 pago único')).toBeInTheDocument();
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
});
