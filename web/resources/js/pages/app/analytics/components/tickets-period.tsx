// resources/js/components/TicketsByPeriodChart.tsx
import { useMemo, useState, useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTicketAnalytics, Period } from "../hooks/useTicketAnalytics";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/* 🎨 paleta */
const BLUE = { r: 56, g: 189, b: 248 };   // #38bdf8
const PINK = { r: 244, g: 114, b: 182 };  // #f472b6

const rgba = (c: typeof BLUE, a: number) =>
  `rgba(${c.r},${c.g},${c.b},${a})`;

export default function TicketsByPeriodChart() {
  const [period, setPeriod] = useState<Period>("hour");
  const { chartData, loading, error } = useTicketAnalytics(period);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const BAR_WIDTH = period === "hour" ? 20 : 50;

  /* etiquetas legibles para las 48 h */
  const completedChartData = useMemo(() => {
    const data =
      period !== "hour"
        ? chartData
        : {
          ...chartData,
          labels: (chartData.labels || []).map((iso) => {
            const d = new Date(iso as string);
            return `${d.getDate().toString().padStart(2, "0")} ${d
              .getHours()
              .toString()
              .padStart(2, "0")}h`;
          }),
        };

    // borro colores predefinidos
    const cleanedDatasets = (data.datasets || []).map((ds) => ({
      ...ds,
      backgroundColor: undefined,
      borderColor: undefined,
      hoverBackgroundColor: undefined,
    }));

    return { ...data, datasets: cleanedDatasets };
  }, [chartData, period]);

  const hasData = useMemo(
    () =>
      completedChartData.datasets?.some((ds) =>
        (ds.data as number[]).some((v) => v > 0)
      ) ?? false,
    [completedChartData]
  );

  /* opciones Chart.js */
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.7)",
          titleColor: "#fff",
          bodyColor: "#fff",
          cornerRadius: 6,
          padding: 10,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            autoSkip: false,
            color: "#e5e7eb",
            maxRotation:
              period === "hour" ? 60 : period === "month" ? 45 : 0,
            minRotation:
              period === "hour" ? 60 : period === "month" ? 45 : 0,
          },
        },
        y: {
          grid: { color: "#27272a25", drawBorder: false },
          ticks: { color: "#e5e7eb", stepSize: 1 },
          beginAtZero: true,
        },
      },
      elements: {
        bar: {
          borderRadius: 6,
          borderWidth: 2,
          borderSkipped: false,
          borderColor: (ctx: any) =>
            ctx.dataIndex % 2 === 0 ? rgba(BLUE, 1) : rgba(PINK, 1),
          backgroundColor: (ctx: any) => {
            const { chart } = ctx;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) {
              return ctx.dataIndex % 2 === 0
                ? rgba(BLUE, 0.25)
                : rgba(PINK, 0.25);
            }
            const color = ctx.dataIndex % 2 === 0 ? BLUE : PINK;
            const g = c.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );
            g.addColorStop(0, rgba(color, 0.55));
            g.addColorStop(1, rgba(color, 0.55));
            return g;
          },
          hoverBackgroundColor: (ctx: any) => {
            const { chart } = ctx;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) {
              return ctx.dataIndex % 2 === 0
                ? rgba(BLUE, 0.45)
                : rgba(PINK, 0.45);
            }
            const color = ctx.dataIndex % 2 === 0 ? BLUE : PINK;
            const g = c.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );
            g.addColorStop(0, rgba(color, 0.45));
            g.addColorStop(1, rgba(color, 0.25));
            return g;
          },
        },
      },
      datasets: { bar: { categoryPercentage: 0.8, barPercentage: 0.9 } },
    }),
    [period]
  );

  useEffect(() => {
    if (scrollContainerRef.current && hasData) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
      }, 100);
    }
  }, [completedChartData, hasData]);

  if (loading) return <p className="text-sm text-zinc-400">Cargando…</p>;
  if (error) return <p className="text-sm text-red-500">{error.message}</p>;

  const chartWidth = hasData
    ? (completedChartData.labels?.length || 0) * BAR_WIDTH
    : "100%";

  return (
    <div className="flex flex-col h-full">
      {/* selector período */}
      <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
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
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto custom-scroll scrollbar-thin scroll-smooth"
      >
        <div
          style={{ width: chartWidth, height: "100%" }}
          className="pr-4 flex items-center justify-center"
        >
          {hasData ? (
            <Bar key={period} data={completedChartData} options={options} />
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
