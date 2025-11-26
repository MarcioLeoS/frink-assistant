import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useAlerts } from './hooks/useAlerts';
import Loader from '@/components/ui/loader';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Alertas',
        href: '/alerts',
    },
];

export default function Dashboard() {
    const { alerts, loading } = useAlerts();

    const urgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'high': return 'bg-red-600 text-white';
            case 'medium': return 'bg-yellow-500 text-black';
            case 'low': return 'bg-green-600 text-white';
            default: return 'bg-neutral-700 text-white';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Alertas" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    Alertas
                </h2>
                {loading ? (
                    <div className="my-auto">
                        <Loader />
                    </div>
                ) : alerts.length === 0 ? (
                    <p className="text-neutral-300">No hay alertas registradas.</p>
                ) : (
                    <Accordion type="multiple" className="w-full">
                        {alerts.map((alert) => (
                            <AccordionItem key={alert.id} value={String(alert.id)} className="mb-2 border border-neutral-800 rounded-lg overflow-hidden">
                                <AccordionTrigger className="px-4 py-3 bg-neutral-900 hover:bg-neutral-800 transition flex items-center gap-4">
                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${urgencyColor(alert.urgency)}`}>{alert.urgency}</span>
                                    <div className="flex flex-col text-left">
                                        <span className="font-bold text-white text-base">{alert.name || alert.type}</span>
                                        <span className="text-xs text-muted-foreground">{alert.status} - {alert.provider}</span>
                                    </div>
                                    <span className="ml-auto text-xs text-neutral-400">{alert.created_at && new Date(alert.created_at).toLocaleString()}</span>
                                </AccordionTrigger>
                                <AccordionContent className="bg-neutral-950 px-6 py-4 border-t border-neutral-800">
                                    <div className="mb-2">
                                        <span className="font-semibold text-neutral-300">Descripción:</span> <span className="text-neutral-200">{alert.description}</span>
                                    </div>
                                    {alert.error_message && (
                                        <div className="mb-2">
                                            <span className="font-semibold text-red-400">Error:</span> <span className="text-red-200">{alert.error_message}</span>
                                        </div>
                                    )}
                                    {alert.error_code && (
                                        <div className="mb-2">
                                            <span className="font-semibold text-red-400">Código de error:</span> <span className="text-red-200">{alert.error_code}</span>
                                        </div>
                                    )}
                                    <div className="mb-2">
                                        <span className="font-semibold text-neutral-300">Data:</span>
                                        <pre className="bg-neutral-900/80 text-xs p-2 rounded mt-1 overflow-x-auto text-neutral-200 border border-neutral-800">
                                            {alert.data ? JSON.stringify(alert.data, null, 2) : 'Sin datos'}
                                        </pre>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </div>
        </AppLayout>
    );
}
