import { useState } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import SidebarTicket from './components/sidebar-ticket';
import HeaderTicket from './components/header-ticket';
import RightMenu from './components/right-menu';
import TicketTabs from './components/ticket-tabs';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Ticket } from '@/services/tickets/tickets.api'
import { useTicketActions } from "./hooks/useTicketActions";

export interface TicketProps {
    ticket?: Ticket | null
}

export default function TicketDashboard() {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);

    const { status: changeStatus, actionLoading } = useTicketActions(() => {
        setRefreshKey(k => k + 1);
    });

    const handleTicketsFetched = (list: Ticket[]) => {
        setTickets(list);

        if (!selectedTicket) return;

        const updated = list.find(t => t.id === selectedTicket.id);
        if (updated) {
            setSelectedTicket(updated);
        }
    };

    const handleChangeStatus = async (id: number, newStatus: string) => {
        await changeStatus(id, newStatus);
        // Optimistic: actualizo título/estado sin esperar al refetch
        setSelectedTicket(t => t && t.id === id ? { ...t, status: newStatus } : t);
    };


    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tickets',
            href: '/tickets',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tickets`} />

            <div className="h-[calc(95vh_-_theme(spacing.16))] flex overflow-hidden text-gray-200">
                <SidebarTicket
                    onSelectTicket={setSelectedTicket}
                    onTicketsFetched={handleTicketsFetched}
                    refreshKey={refreshKey} />
                <main className="flex-1 overflow-y-auto pb-6 px-2 pt-4 custom-scroll">
                    <HeaderTicket ticket={selectedTicket} onChangeStatus={handleChangeStatus} />
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <TicketTabs ticket={selectedTicket} onChangeStatus={handleChangeStatus} />
                        </div>
                        <div className="w-1/4 min-w-[250px] max-w-sm">
                            <RightMenu ticket={selectedTicket} />
                        </div>
                    </div>
                </main>
            </div>
        </AppLayout>
    )
}