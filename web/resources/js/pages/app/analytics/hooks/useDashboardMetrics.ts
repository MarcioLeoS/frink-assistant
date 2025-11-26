import { useState, useEffect } from 'react';
import { getDashboardMetrics, DashboardMetrics } from '@/services/analytics/analytics.api';

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<Error | null>(null);

  useEffect(() => {
    getDashboardMetrics()
      .then(data => setMetrics(data))
      .catch(e => setError(e as Error))
      .finally(() => setLoading(false));
  }, []);

  return { metrics, loading, error };
}
