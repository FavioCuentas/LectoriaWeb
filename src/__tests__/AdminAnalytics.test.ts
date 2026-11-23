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

  it('acepta la respuesta de la v1 del RPC y marca como «sin fuente» lo que esa versión no medía', async () => {
    const mock = createSupabaseMock();
    // Respuesta v1: sin semiannualUsers ni unavailableMetrics.
    const v1 = structuredClone(createDashboardData(30)) as unknown as Record<string, unknown>;
    delete v1.unavailableMetrics;
    delete (v1.kpis as Record<string, unknown>).semiannualUsers;
    mock.rpc.mockResolvedValue({ data: v1, error: null });

    const result = await fetchAdminDashboard('30d', mock.client);
    expect(result.kpis.semiannualUsers).toBe(0);
    expect(result.unavailableMetrics).toEqual(expect.arrayContaining(['grossRevenueCents', 'documentsImported', 'funnel']));
  });

  it('rechaza planes desconocidos en la distribución', async () => {
    const mock = createSupabaseMock();
    const data = createDashboardData(30);
    mock.rpc.mockResolvedValue({ data: { ...data, planDistribution: [{ plan: 'pro', count: 1, pct: 100 }] }, error: null });

    await expect(fetchAdminDashboard('30d', mock.client)).rejects.toThrow(/formato de métricas incompatible/i);
  });
});
