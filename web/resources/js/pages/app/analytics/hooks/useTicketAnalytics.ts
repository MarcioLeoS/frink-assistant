// resources/js/hooks/useTicketAnalytics.ts
import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { getTicketsAnalytics } from '@/services/analytics/analytics.api';

/* ---------- TIPOS ---------- */
export type Period = 'hour' | 'day' | 'month';

export interface AnalyticsPoint {
  period: string;   // 2025-06-07 15:00:00 | 2025-06-07 | 2025-06
  count:  number;
}

interface ChartData {
  labels: string[];
  datasets: { label: string; data: number[]; backgroundColor: string }[];
}

/* ---------- HOOK ---------- */
export function useTicketAnalytics(period: Period) {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getTicketsAnalytics(period)
      .then((rows: AnalyticsPoint[]) => {
        if (!mounted) return;

        const labels: string[] = [];
        const counts: number[] = [];

        rows.forEach(({ period: p, count }) => {
          /* 👇 siempre se inicializa antes de usarse */
          const date: Date = (() => {
            switch (period) {
              case 'hour':
                return parse(p, 'yyyy-MM-dd HH:mm:ss', new Date());
              case 'day':
                return parse(p, 'yyyy-MM-dd', new Date());
              case 'month':
              default:
                return parse(p, 'yyyy-MM', new Date());
            }
          })();

          labels.push(
            period === 'hour'
              ? format(date, 'HH:mm',    { locale: es })
              : period === 'day'
              ? format(date, 'dd MMM',   { locale: es })
              : format(date, 'MMM yyyy', { locale: es })
          );
          counts.push(count);
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Tickets',
              data: counts,
              backgroundColor: 'rgba(99,102,241,0.70)',
            },
          ],
        });
      })
      .catch(e => mounted && setError(e as Error))
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [period]);

  return { chartData, loading, error };
}
