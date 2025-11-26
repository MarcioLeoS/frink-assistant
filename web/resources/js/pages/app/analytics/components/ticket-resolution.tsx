// resources/js/components/AvgResolutionTrendChart.tsx
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { useResolutionAnalytics, Period } from "../hooks/useResolutionAnalytics";
import {
    Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";

/* registro Chart.js */
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

/* 🎨 paleta coherente con KPI */
const COLORS = {
    low: { stroke: "rgba(34,197,94,1)", fill: "rgba(34,197,94,0.15)" },
    medium: { stroke: "rgba(250,204,21,1)", fill: "rgba(250,204,21,0.15)" },
    high: { stroke: "rgba(239,68,68,1)", fill: "rgba(239,68,68,0.15)" },
};

/* 🔑 mapea “Baja/Media/Alta” → low/medium/high */
const URG_KEY: Record<string, keyof typeof COLORS> = {
    baja: "low",
    media: "medium",
    alta: "high",
    low: "low",
    medium: "medium",
    high: "high",
};

export default function AvgResolutionTrendChart() {
    const [period, setPeriod] = useState<Period>("month"); // por defecto: mes a mes
    const { chartData, loading, error } = useResolutionAnalytics(period);

    /* ▸ transformamos datasets bar → line */
    const lineData = {
        ...chartData,
        datasets: chartData.datasets.map((ds) => {
            const key = URG_KEY[ds.label.toLowerCase()] || "low";
            const { stroke, fill } = COLORS[key];

            return {
                label: ds.label,
                data: ds.data,
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: stroke,
                borderColor: stroke,
                backgroundColor: fill,
                fill: true,
            };
        }),
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" },
            tooltip: {
                backgroundColor: "rgba(0,0,0,0.7)",
                titleColor: "#fff",
                bodyColor: "#fff",
                cornerRadius: 6,
                padding: 10,
                callbacks: {
                    label: (ctx: any) => `${ctx.dataset.label}: ${ctx.formattedValue} h`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: "Horas" },
                grid: { color: "#27272a25" },
                ticks: { color: "#e5e7eb" },
            },
            x: {
                grid: { display: false },
                ticks: { color: "#e5e7eb" },
            },
        },
    } as const;

    if (loading) return <p className="text-sm text-zinc-400">Cargando…</p>;
    if (error) return <p className="text-sm text-red-500">{error.message}</p>;

    return (
        <div className="flex flex-col h-full">
            {/* selector periodo (sin opción hour) */}
            <Select value={period} onValueChange={v => setPeriod(v as Period)}>
                <SelectTrigger className="w-40 mb-3 bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Periodo" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 text-zinc-100 border-zinc-700">
                    <SelectItem value="day">Por día</SelectItem>
                    <SelectItem value="month">Por mes</SelectItem>
                </SelectContent>
            </Select>

            <div className="flex-1">
                <Line data={lineData} options={options} />
            </div>
        </div>
    );
}
