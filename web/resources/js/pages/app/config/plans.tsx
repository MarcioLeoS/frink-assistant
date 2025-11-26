// resources/js/Pages/PlansDashboard.tsx
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { usePlansList } from "./hooks/plans/usePlansDashboardList";
import type { BreadcrumbItem } from "@/types";
import { usePlansUpdateSuscription } from "./hooks/plans/usePlansUpdateSuscription";
import Loader from "@/components/ui/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ---------- tipos UI ------------------------------------------------------ */
type Currency = "ARS" | "USD";

type UiPlan = {
  id: number;
  name: string;
  priceLabel: string;
  monthly_label?: string; // Precio mensual
  annual_label?: string; // Precio anual
  tag?: string;
  img: string;
  features: { text: string; ok: boolean }[];
};

/* ---------- utils --------------------------------------------------------- */
export function formatMoney(value: number, currency: Currency) {
  if (value === 0) return "Free";

  const amount = currency === "ARS" ? value : value / 100;
  const locale = currency === "ARS" ? "es-AR" : "en-US";

  let out = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

  return out.replace(/\s+/u, "");
}

const breadcrumbs: BreadcrumbItem[] = [{ title: "Planes", href: "/plans" }];

/* ========================================================================== */
/* Componente                                                                 */
/* ========================================================================== */
export default function PlansDashboard() {
  const { plans: apiPlans, loading } = usePlansList();
  const { updateSubscription, loading: updatingSubscription } = usePlansUpdateSuscription();

  // Define el estado para controlar el intervalo (mensual o anual)
  const [interval, setInterval] = useState<"month" | "year">("month");

  const handleSubmit = () => {
    if (selected === null) return;
    updateSubscription(selected, interval);
  };

  const activePlanId = useMemo(() => {
    const active = apiPlans.find((p) =>
      p.subscriptions?.some((s) => s.status === "active")
    );
    return active?.id ?? null;
  }, [apiPlans]);

  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (activePlanId !== null) {
      setSelected(activePlanId);
    }
  }, [activePlanId]);

  const plans: UiPlan[] = useMemo(() => {
    return apiPlans.map((p) => ({
      id: p.id,
      name: p.name,
      priceLabel: interval === "month"
        ? p.monthly_label ?? "Sin precio"
        : p.annual_label ?? "Sin precio",
      tag: p.order === 1 ? "Popular" : undefined,
      img: `/assets/images/backgrounds/${p.slug}.png`,
      features: p.features.length
        ? p.features.map((f) => ({
          text: String(f.description ?? f.code ?? "Feature"),
          ok: true,
        }))
        : [{ text: "Sin información", ok: false }],
    }));
  }, [apiPlans, interval]);

  const changed = selected !== activePlanId;

  const Background = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.15 }}
      transition={{ duration: 1.8, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500 blur-3xl"
    />
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Planes" />
      {Background}

      <main className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col gap-4 p-4 lg:py-4">
        <h2 className="mb-4 text-xl font-bold text-white">Planes</h2>

        {loading && <p className="text-neutral-300">Cargando planes…</p>}
        {!loading && plans.length === 0 && (
          <p className="text-neutral-300">No hay planes disponibles.</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selected === plan.id}
              onSelect={() => setSelected(plan.id)}
              interval={interval}
              setInterval={setInterval}
            />
          ))}
        </div>

        {changed && (
          <div className="mt-6 flex justify-end">
            <Button onClick={() => handleSubmit()} disabled={updatingSubscription}>
              {updatingSubscription ? "Actualizando..." : "Actualizar plan"}
            </Button>
          </div>
        )}
      </main>
    </AppLayout>
  );
}

/* ========================================================================== */
/* Tarjeta de plan                                                            */
/* ========================================================================== */
function PlanCard({
  plan,
  selected,
  onSelect,
  interval,
  setInterval, // Recibir setInterval como prop
}: {
  plan: UiPlan;
  selected: boolean;
  onSelect: () => void;
  interval: "month" | "year";
  setInterval: (value: "month" | "year") => void; // Tipo de setInterval
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-xl border shadow-inner transition hover:shadow-lg ${
        selected ? "border-blue-500 bg-neutral-900/40" : "border-neutral-700 bg-neutral-900/60"
      }`}
    >
      {selected && (
        <Check className="absolute left-3 top-3 h-6 w-6 text-blue-500" />
      )}

      <div className="p-6 text-center">
        {plan.tag && (
          <span className="absolute right-3 top-3 rounded-md bg-yellow-200/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-yellow-400">
            {plan.tag}
          </span>
        )}

        <span className="mb-7 block text-2xl font-bold uppercase tracking-wide text-white">
          {plan.name}
        </span>

        <div className="my-4 flex justify-center">
          <img src={plan.img} alt={plan.name} className="h-20 w-20" />
        </div>

        <div className="mb-3 flex items-baseline justify-center text-white">
          {plan.priceLabel === "Free" ? (
            <span className="text-3xl font-bold">Free</span>
          ) : (
            <>
              <span className="text-3xl font-bold">{plan.priceLabel}</span>
              <span className="ml-1 text-sm">
                {interval === "month" ? "/mes" : "/año"} {/* Mostrar el intervalo */}
              </span>
            </>
          )}
        </div>

        <ul
          className={`mx-auto mb-7 space-y-2 text-sm transition-all duration-300 ${
            selected ? "max-h-96 opacity-100" : "max-h-0 overflow-hidden opacity-0"
          }`}
        >
          {plan.features.map((f) => (
            <Feature key={f.text} ok={f.ok} text={f.text} />
          ))}
          <div className="flex justify-center mb-4">
            <Select value={interval} onValueChange={(value) => setInterval(value as "month" | "year")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Seleccionar intervalo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Mensual</SelectItem>
                <SelectItem value="year">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ul>

        <Button variant={selected ? "outline" : "default"} className="w-full">
          {selected ? "Plan seleccionado" : `Elegir ${plan.name}`}
        </Button>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Línea de característica                                                    */
/* ========================================================================== */
function Feature({ ok, text }: { ok: boolean; text: string }) {
  const Icon = ok ? Check : X;
  const color = ok ? "text-blue-500" : "text-neutral-500";

  return (
    <li className="flex items-center justify-center gap-2">
      <Icon className={`h-5 w-5 ${color}`} />
      <span className={ok ? "text-white" : "text-neutral-400"}>{text}</span>
    </li>
  );
}
