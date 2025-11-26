// resources/js/Pages/AnalyticsDashboard.tsx
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import TicketsByPeriodChart from "./components/tickets-period";
import AvgResolutionTimeChart from "./components/ticket-resolution";
import MessagesByPeriodChart from "./components/messages-period";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useDashboardMetrics } from "./hooks/useDashboardMetrics";
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Analíticas", href: "/analytics" },
];

export default function AnalyticsDashboard() {
  const { metrics, loading, error } = useDashboardMetrics();
  console.log("Metrics:", metrics, "Loading:", loading, "Error:", error);
  const cards = [
    {
      label: "Solicitudes pendientes",
      value: metrics?.pendingRealPersonRequests ?? 0,
      suffix: "",
    },
    {
      label: "Tiempo promedio (h)",
      value: metrics?.avgRealPersonResolutionHrs ?? 0,
      suffix: "h",
    },
    {
      label: "Tickets marketing abiertos",
      value: metrics?.openMarketingTickets ?? 0,
      suffix: "",
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Analíticas" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 lg:py-4 2xl:max-w-6xl w-full mx-auto">
        <h2 className="text-white text-xl font-bold mb-4">Analíticas</h2>

        {/* Tarjetas placeholder para futuros KPIs */}
        <section className="grid auto-rows-[150px] gap-4 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {loading && !error && (
            <p className="text-center col-span-3 text-zinc-400">Cargando métricas…</p>
          )}
          {error && (
            <p className="text-center col-span-3 text-red-500">{error.message}</p>
          )}
          {!loading && metrics && cards.map((c, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <Card className="bg-zinc-900/60 border-zinc-700/70 shadow-md">
                <CardHeader>
                  <CardTitle className="text-zinc-200">{c.label}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-end justify-center">
                  <CountUp
                    end={c.value}
                    duration={1.2}
                    separator="."
                    decimals={c.suffix === 'h' ? 2 : 0}
                    className="text-3xl font-bold text-white"
                  />
                  {c.suffix && (
                    <span className="ml-1 text-xl text-zinc-400">{c.suffix}</span>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="rounded-xl bg-zinc-900/60 border border-zinc-700/70 shadow-md flex flex-col gap-4 p-4 h-[500px]">
          <h3 className="text-sm font-semibold text-zinc-100">
            Mensajes
          </h3>
          <div className="relative flex-1 overflow-hidden">
            <MessagesByPeriodChart />
          </div>
        </section>
        <section className="rounded-xl bg-zinc-900/60 border border-zinc-700/70 shadow-md flex flex-col gap-4 p-4 h-[500px]">
          <h3 className="text-sm font-semibold text-zinc-100">
            Tickets por período
          </h3>
          <div className="relative flex-1 overflow-hidden">
            <TicketsByPeriodChart />
          </div>
        </section>
        <section className="rounded-xl bg-zinc-900/60 border border-zinc-700/70 shadow-md flex flex-col gap-4 p-4 h-[500px]">
          <h3 className="text-sm font-semibold text-zinc-100">
            Tickets por período
          </h3>
          <div className="relative flex-1 overflow-hidden">
            <AvgResolutionTimeChart />
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
