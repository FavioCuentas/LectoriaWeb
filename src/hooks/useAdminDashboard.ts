import { useCallback, useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { fetchAdminDashboard } from '../lib/adminAnalytics';
import type { AdminDashboardData, DateRange } from '../types/dashboard';

export const useAdminDashboard = (dateRange: DateRange, client?: SupabaseClient | null) => {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((value) => value + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    void fetchAdminDashboard(dateRange, client)
      .then((data) => {
        if (!active) return;
        setDashboard(data);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setDashboard(null);
        setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar las métricas.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [client, dateRange, reloadKey]);

  return { dashboard, loading, error, reload };
};
