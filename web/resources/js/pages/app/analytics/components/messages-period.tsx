// src/components/MessagesByPeriodChart.tsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { useMessagesAnalytics, Period } from '../hooks/useMessageAnalytics';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/* 🎨 paleta */
const BLUE = { r: 56, g: 189, b: 248 };   // #38bdf8
const PINK = { r: 244, g: 114, b: 182 };  // #f472b6
const rgba = (c: typeof BLUE, a: number) =>
  `rgba(${c.r},${c.g},${c.b},${a})`;

export default function MessagesByPeriodChart() {
  const [period, setPeriod] = useState<Period>('hour');
  const { chartData, loading, error } = useMessagesAnalytics(period);
  const scrollRef = useRef<HTMLDivElement>(null);

  const BAR_WIDTH = period === 'hour' ? 20 : 50;

  // Transform labels for “hour” and strip built-in colors
  const completedChartData = useMemo(() => {
    const data =
      period !== 'hour'
        ? chartData
        : {
            ...chartData,
            labels: chartData.labels.map((iso) => {
              const d = new Date(iso);
              return `${d.getDate().toString().padStart(2, '0')} ${d
                .getHours()
                .toString()
                .padStart(2, '0')}h`;
            }),
          };

    const cleaned = {
      ...data,
      datasets: data.datasets.map(ds => ({
        ...ds,
        backgroundColor: undefined,
        borderColor: undefined,
        hoverBackgroundColor: undefined,
      })),
    };

    return cleaned;
  }, [chartData, period]);

  const hasData = useMemo(
    () =>
      completedChartData.datasets.some(ds =>
        (ds.data as number[]).some(v => v > 0)
      ),
    [completedChartData]
  );

  // auto-scroll al final cuando cambian los datos
  useEffect(() => {
    if (scrollRef.current && hasData) {
      setTimeout(() => {
        scrollRef.current!.scrollLeft = scrollRef.current!.scrollWidth;
      }, 100);
    }
  }, [completedChartData, hasData]);

  const chartWidth = hasData
    ? completedChartData.labels.length * BAR_WIDTH
    : '100%';

  const options: ChartOptions<'bar'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 6,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          autoSkip: false,
          color: '#e5e7eb',
          maxRotation: period === 'hour' ? 60 : period === 'month' ? 45 : 0,
          minRotation: period === 'hour' ? 60 : period === 'month' ? 45 : 0,
        },
      },
      y: {
        grid: { color: '#27272a25', drawBorder: false },
        ticks: { color: '#e5e7eb', stepSize: 1 },
        beginAtZero: true,
      },
    },
    elements: {
      bar: {
        borderRadius: 6,
        borderWidth: 2,
        borderSkipped: false,
        borderColor: ctx =>
          ctx.dataIndex % 2 === 0 ? rgba(BLUE, 1) : rgba(PINK, 1),
        backgroundColor: ctx => {
          const { chart } = ctx;
          const { ctx: c, chartArea } = chart;
          const color = ctx.dataIndex % 2 === 0 ? BLUE : PINK;
          if (!chartArea) {
            return rgba(color, 0.25);
          }
          const grad = c.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          grad.addColorStop(0, rgba(color, 0.55));
          grad.addColorStop(1, rgba(color, 0.55));
          return grad;
        },
        hoverBackgroundColor: ctx => {
          const { chart } = ctx;
          const { ctx: c, chartArea } = chart;
          const color = ctx.dataIndex % 2 === 0 ? BLUE : PINK;
          if (!chartArea) {
            return rgba(color, 0.45);
          }
          const grad = c.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          grad.addColorStop(0, rgba(color, 0.45));
          grad.addColorStop(1, rgba(color, 0.25));
          return grad;
        },
      },
    },
    datasets: {
      bar: { categoryPercentage: 0.8, barPercentage: 0.9 },
    },
  }), [period]);

  if (loading) return <p className="text-sm text-zinc-400">Cargando…</p>;
  if (error)   return <p className="text-sm text-red-500">{error.message}</p>;

  return (
    <div className="flex flex-col h-full">
      {/* selector de período */}
      <Select value={period} onValueChange={v => setPeriod(v as Period)}>
        <SelectTrigger className="w-40 mb-3 bg-zinc-800 border-zinc-700">
          <SelectValue placeholder="Periodo" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 text-zinc-100 border-zinc-700">
          <SelectItem value="hour">Últimas 48 h</SelectItem>
          <SelectItem value="day">Por día</SelectItem>
          <SelectItem value="month">Por mes</SelectItem>
        </SelectContent>
      </Select>

      {/* contenedor desplazable */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto custom-scroll scrollbar-thin scroll-smooth"
      >
        <div
          style={{ width: chartWidth, height: '100%' }}
          className="pr-4 flex items-center justify-center"
        >
          {hasData ? (
            <Bar
              key={period}
              data={completedChartData}
              options={options}
            />
          ) : (
            <span className="text-zinc-400 italic">
              Sin datos para este período
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
