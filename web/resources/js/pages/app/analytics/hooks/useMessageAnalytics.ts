// src/hooks/useMessagesAnalytics.ts
import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { getMessagesAnalytics } from '@/services/analytics/analytics.api';

export type Period = 'hour' | 'day' | 'month';

interface ChartData {
  labels: string[];
  datasets: { label: string; data: number[]; backgroundColor: string }[];
}

export function useMessagesAnalytics(period: Period) {
  const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error|null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true); setError(null);

    getMessagesAnalytics(period)
      .then(rows => {
        if (!mounted) return;
        // filas agrupadas por período
        const map = new Map<string, number>();
        rows.forEach(({ period: p, count }) => {
          map.set(p, count);
        });

        const labels: string[] = [];
        const counts: number[] = [];
        Array.from(map.keys()).sort().forEach(p => {
          const d = period === 'hour'
            ? parse(p, 'yyyy-MM-dd HH:mm:ss', new Date())
            : period === 'day'
              ? parse(p, 'yyyy-MM-dd', new Date())
              : parse(p, 'yyyy-MM', new Date());

          labels.push(
            period === 'hour'
              ? format(d, 'HH:mm', { locale: es })
              : period === 'day'
                ? format(d, 'dd MMM', { locale: es })
                : format(d, 'MMM yyyy', { locale: es })
          );
          counts.push(map.get(p)!);
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Mensajes',
              data: counts,
              backgroundColor: 'rgba(56,189,248,0.6)',
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
