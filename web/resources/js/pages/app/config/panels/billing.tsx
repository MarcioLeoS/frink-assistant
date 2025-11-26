import { useState } from "react";
import CreditCard from "../components/card";
import DrawerComponent from "@/components/ui/drawer-right";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { BASE_URL } from "@/config/env";
import { usePlansGetSuscriptions } from '../hooks/plans/usePlansGetSuscriptions'
import { Subscription } from "@/services/plans/plans.api";
import CardPayment from '../components/card-payment';

type RecordType = {
  id: string;
  date: string;
  product: string;
  status: string;
  amount: string;
};

const payments: RecordType[] = [
  { id: "36223", date: "12/10/2021", product: "Mock premium pack", status: "Pending", amount: "$39.90" },
  { id: "34283", date: "11/13/2021", product: "Business board basic", status: "Paid", amount: "$59.90" },
  { id: "32234", date: "10/12/2021", product: "Business board basic", status: "Paid", amount: "$59.90" },
];

const refunds: RecordType[] = [
  { id: "R1001", date: "01/05/2022", product: "Refund order #34283", status: "Completed", amount: "$59.90" },
];

export default function Billing() {
  const [isCardDrawerOpen, setCardDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RecordType | null>(null);
  const [view, setView] = useState<"payments" | "refunds">("payments");
  const { subscription: activeSubscription, loading } = usePlansGetSuscriptions();
  const [isCardPaymentOpen, setCardPaymentOpen] = useState(false);

  const currentList = view === "payments" ? payments : refunds;

  const handleRowClick = (rec: RecordType) => {
    setSelectedRecord(rec);
    setDetailDrawerOpen(true);
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("es-ES", options);
  }

  return (
    <main>
      <section className="space-y-8 rounded-xl border border-neutral-700/70 bg-neutral-900/60 p-6 shadow-inner">
        <h2 className="mb-4 text-xl font-semibold text-white">Facturación y pagos</h2>

        {/* Método de pago */}
        <div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-white mb-2">Método de pago principal</h3>
              <CardPayment />
            </div>
          </div>
          <div
            className="relative block cursor-pointer text-left w-full"
            onClick={() => setCardDrawerOpen(true)}
          >
            <input type="radio" name="radio-buttons" className="peer sr-only" defaultChecked />
            <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-500 hover:border-neutral-400 shadow-sm transition">
              <div className="grid grid-cols-12 items-center gap-x-2">
                {/* Card graphic */}
                <div className="col-span-6 sm:col-span-3 flex items-center space-x-4">
                  <svg className="shrink-0" width="32" height="24" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient x1="1.829%" y1="100%" x2="100%" y2="2.925%" id="c1-a">
                        <stop stopColor="#4B5563" offset="0%" />
                        <stop stopColor="#1F2937" offset="100%" />
                        <stop stopColor="#9FA1FF" offset="100%" />
                      </linearGradient>
                    </defs>
                    <g fill="none" fillRule="evenodd">
                      <rect fill="url(#c1-a)" width="32" height="24" rx="3" />
                      <ellipse fill="#E61C24" fillRule="nonzero" cx="12.522" cy="12" rx="5.565" ry="5.647" />
                      <ellipse fill="#F99F1B" fillRule="nonzero" cx="19.432" cy="12" rx="5.565" ry="5.647" />
                      <path
                        d="M15.977 7.578A5.667 5.667 0 0 0 13.867 12c0 1.724.777 3.353 2.11 4.422A5.667 5.667 0 0 0 18.087 12a5.667 5.667 0 0 0-2.11-4.422Z"
                        fill="#F26622"
                        fillRule="nonzero"
                      />
                    </g>
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-white">_Metal</div>
                    <div className="text-xs text-neutral-400">**7328</div>
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3 text-left sm:text-center">
                  <div className="text-sm font-medium text-white truncate">
                    Dominik Lamakani
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-4 text-right sm:text-center">
                  <div className="text-sm text-neutral-200">$780,00 / $20,000</div>
                </div>
                <div className="col-span-6 sm:col-span-2 text-right">
                  <div className="text-xs inline-flex font-medium bg-green-500/20 text-green-400 rounded-full px-2.5 py-1">
                    Activa
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none" aria-hidden="true" />
          </div>
          <DrawerComponent isDrawerOpen={isCardDrawerOpen} onClose={() => setCardDrawerOpen(false)}>
            <div className="p-6">
              <CreditCard />
            </div>
          </DrawerComponent>
        </div>

        {/* Historial y reembolsos */}
        <div>
          <h3 className="text-base font-medium text-white mb-2">Historial</h3>
          <select
            value={view}
            onChange={(e) => setView(e.target.value as any)}
            className="mb-4 px-3 py-2 border rounded-md bg-neutral-900 border-neutral-700 text-white"
          >
            <option value="payments">Pagos</option>
            <option value="refunds">Reembolsos</option>
          </select>
          <HistoryTable data={currentList} onRowClick={handleRowClick} />
        </div>
      </section>
      <section className="space-y-8 mt-4 rounded-xl border border-neutral-700/70 bg-neutral-900/60 p-6 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <h2 className="mb-4 text-xl font-semibold text-white">Suscripción</h2>
          <Link href={route('plan')} className="ml-auto">Mejorar suscripción</Link>
        </div>
        {loading ? (
          <p className="text-neutral-300">Cargando suscripción...</p>
        ) : activeSubscription ? (
          <SubscriptionSection subscription={activeSubscription} />
        ) : (
          <p className="text-neutral-300">No tienes una suscripción activa.</p>
        )}
      </section>
    </main>
  );
}

function HistoryTable({
  data,
  onRowClick,
}: {
  data: RecordType[];
  onRowClick: (r: RecordType) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-900">
      <table className="min-w-full divide-y divide-neutral-800">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-sm text-neutral-400">Referencia</th>
            <th className="px-4 py-2 text-left text-sm text-neutral-400">Producto</th>
            <th className="px-4 py-2 text-left text-sm text-neutral-400">Estado</th>
            <th className="px-4 py-2 text-left text-sm text-neutral-400">Fecha</th>
            <th className="px-4 py-2 text-right text-sm text-neutral-400">Monto</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {data.map((item) => (
            <tr
              key={item.id}
              className="cursor-pointer hover:bg-neutral-800/60"
              onClick={() => onRowClick(item)}
            >
              <td className="px-4 py-2 text-sm font-mono text-neutral-200">{item.id}</td>
              <td className="px-4 py-2 text-sm text-neutral-200">{item.product}</td>
              <td className="px-4 py-2 text-sm text-neutral-300">{item.status}</td>
              <td className="px-4 py-2 text-sm text-neutral-400">{item.date}</td>
              <td className="px-4 py-2 text-sm text-right text-neutral-100">{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubscriptionSection({ subscription }: { subscription: Subscription }) {
  const [open, setOpen] = useState(false);

  const name = subscription.plan?.name || "Sin nombre"; // Derivar el nombre del plan
  const nextPayment = subscription.next_renewal_formatted; // Usar la fecha de próxima renovación
  const amount = subscription.plan?.price || "Sin monto"; // Derivar el monto del plan

  return (
    <div className="space-y-4 flex flex-col">
      <button
        className="cursor-pointer p-4 rounded-lg bg-neutral-900 border border-neutral-700 shadow-sm flex justify-between items-center w-full text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <div className="text-sm font-medium text-white">{name}</div>
          <div className="text-xs text-neutral-400">
            Siguiente pago: {nextPayment}
          </div>
        </div>
        <div className="text-sm font-semibold text-neutral-200">${amount}</div>
      </button>
      <div className={`accordion-content-custom bg-neutral-800 rounded-lg mt-1 ${open ? "open" : ""}`}>
        <div className="p-4 space-y-4 flex flex-col">
          <div className="text-sm text-neutral-400">
            Tu suscripción te da acceso a todas las funciones premium de nuestra plataforma. Puedes
            cancelar en cualquier momento.
          </div>
          <Link
            href="/app/config/panels/billing/cancel"
            className="inline-block text-sm ml-auto font-medium text-red-500 hover:text-red-400"
          >
            Cancelar suscripción
          </Link>
        </div>
      </div>
    </div>
  );
}