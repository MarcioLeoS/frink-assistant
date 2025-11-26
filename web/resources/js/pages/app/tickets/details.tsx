import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import SidebarTicket from './components/sidebar-ticket';
import HeaderTicket from './components/header-ticket';
import RightMenu from './components/right-menu';
import TicketTabs from './components/ticket-tabs';


export default function TicketDashboard() {
    const { props } = usePage();
    const { id } = props as unknown as { id: number | string };

    if (!id) {
        return <div className="text-red-500">No se encontró el ticket.</div>;
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tickets', href: '/tickets' },
        { title: `Detalles del ticket #${id}`, href: `/tickets/${id}` },
    ];

    if (id) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`Ticket #${id}`} />

                <div className="h-[calc(95vh_-_theme(spacing.16))] flex overflow-hidden text-gray-200">
                    <SidebarTicket />
                    <main className="flex-1 overflow-y-auto pb-6 px-2 pt-4 custom-scroll">
                        <HeaderTicket />
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <TicketTabs />
                            </div>
                            <div className="w-1/4 min-w-[250px] max-w-sm">
                                <RightMenu />
                            </div>
                        </div>
                    </main>
                </div>



            </AppLayout>
        );
    }
}