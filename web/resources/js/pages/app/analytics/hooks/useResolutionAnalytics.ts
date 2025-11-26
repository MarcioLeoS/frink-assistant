import { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { getAvgResolutionAnalytics } from '@/services/analytics/analytics.api';

export type Period = 'hour' | 'day' | 'month';

interface ChartData {
    labels: string[];
    datasets: { label: string; data: number[]; backgroundColor: string }[];
}

export function useResolutionAnalytics(period: Period) {
    const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true); setError(null);

        getAvgResolutionAnalytics(period)
            .then((rows) => {
                if (!mounted) return;

                /* ---- Ejes ---- */
                const labelMap = new Map<string, { low: number; medium: number; high: number }>();
                rows.forEach(({ period: p, urgency, avg_hours }) => {
                    if (!labelMap.has(p))
                        labelMap.set(p, { low: 0, medium: 0, high: 0 });
                    labelMap.get(p)![urgency] = avg_hours ?? 0;
                });

                const labels: string[] = [];
                const lows: number[] = [];
                const meds: number[] = [];
                const highs: number[] = [];

                Array.from(labelMap.keys()).sort().forEach((p) => {
                    const date = (() => {
                        switch (period) {
                            case 'hour': return parse(p, 'yyyy-MM-dd HH:mm:ss', new Date());
                            case 'day': return parse(p, 'yyyy-MM-dd', new Date());
                            default: return parse(p, 'yyyy-MM', new Date());
                        }
                    })();

                    labels.push(
                        period === 'hour'
                            ? format(date, 'HH:mm', { locale: es })
                            : period === 'day'
                                ? format(date, 'dd MMM', { locale: es })
                                : format(date, 'MMM yyyy', { locale: es })
                    );
                    const agg = labelMap.get(p)!;
                    lows.push(agg.low); meds.push(agg.medium); highs.push(agg.high);
                });

                setChartData({
                    labels,
                    datasets: [
                        { label: 'Baja', data: lows, backgroundColor: 'rgba(34,197,94,0.65)' }, // verde
                        { label: 'Media', data: meds, backgroundColor: 'rgba(250,204,21,0.65)' }, // ámbar
                        { label: 'Alta', data: highs, backgroundColor: 'rgba(239,68,68,0.65)' }, // roja
                    ],
                });
            })
            .catch(e => mounted && setError(e as Error))
            .finally(() => mounted && setLoading(false));

        return () => { mounted = false; };
    }, [period]);

    return { chartData, loading, error };
}
