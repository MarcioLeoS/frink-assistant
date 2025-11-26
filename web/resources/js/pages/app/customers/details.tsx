// pages/ClientDashboard.tsx
import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { Tab, TAB_NAV } from './tabs';
import SidebarCustomer from './components/sidebar-customer';
import { useCustomersDetails } from './hooks/useCustomersDetails';
import Loader from "@/components/ui/loader";

/* Paneles */
import ConversationsPanel from './panels/conversations-panel';
import TicketsPanel from './panels/tickets-panel';
import RemindersPanel from './panels/reminders-panel';
import ActivityPanel from './panels/activity-panel';
import FilesPanel from './panels/files-panel';
import FeedbackPanel from './panels/feedback-panel';

export default function ClientDashboard() {
  const [tab, setTab] = useState<Tab>('conversations');
  const { props } = usePage();
  const { id } = props;

  const { details, loading } = useCustomersDetails(Number(id));

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Clientes', href: '/customers' },
    { title: `${details ? details.customer.name : ''}`, href: `/customers/${id}` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Panel del cliente" />

      <div className="h-[calc(95vh_-_theme(spacing.16))] flex overflow-hidden text-gray-200">
        <SidebarCustomer tab={tab} customer={details?.customer || null} onSelect={setTab} />

        <main className="flex-1 overflow-y-auto pb-6 px-2 pt-4 custom-scroll">
          {loading && <div className="flex h-full items-center justify-center">
            <Loader />
          </div>}

          {!loading && details && (
            <>
              {tab === 'conversations' && (
                <ConversationsPanel conversations={details.conversations.data} />
              )}

              {tab === 'tickets' && (
                <TicketsPanel
                  support={details.supportTickets.data}
                  marketing={details.marketingTickets.data}
                />
              )}

              {tab === 'reminders' && (
                <RemindersPanel reminders={details.reminders.data} />
              )}

              {tab === 'activity' && id && (
                <ActivityPanel id={Number(id)} />
              )}


              {tab === 'files' && (
                <FilesPanel />
              )}

              {tab === 'feedback' && (
                <FeedbackPanel id={Number(id)} />
              )}
            </>
          )}
        </main>
      </div>
    </AppLayout>
  );
}
