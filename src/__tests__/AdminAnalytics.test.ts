import { describe, expect, it } from 'vitest';
import { fetchAdminDashboard } from '../lib/adminAnalytics';
import { createDashboardData } from '../test/dashboardMock';
import { createSupabaseMock } from '../test/supabaseMock';

describe('Contrato de analítica administrativa', () => {
  it('convierte el rango visual y devuelve el resumen válido', async () => {
    const mock = createSupabaseMock();
    mock.rpc.mockResolvedValue({ data: createDashboardData(90), error: null });

    await expect(fetchAdminDashboard('90d', mock.client)).resolves.toEqual(createDashboardData(90));
    expect(mock.rpc).toHaveBeenCalledWith('admin_dashboard_summary', { range_days: 90 });
  });

  it('traduce el rechazo RLS a un mensaje administrativo', async () => {
    const mock = createSupabaseMock();
    mock.rpc.mockResolvedValue({ data: null, error: { code: '42501' } });

    await expect(fetchAdminDashboard('30d', mock.client)).rejects.toThrow(/no tiene permiso de administrador/i);
  });

  it('rechaza respuestas incompatibles en lugar de mostrar cifras parciales', async () => {
    const mock = createSupabaseMock();
    mock.rpc.mockResolvedValue({ data: { generatedAt: '2026-09-11' }, error: null });

    await expect(fetchAdminDashboard('7d', mock.client)).rejects.toThrow(/formato de métricas incompatible/i);
  });
});
