import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ClientsTable from './components/table';
import Cards from './components/cards';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clientes',
        href: '/customers',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Conversaciones" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 lg:py-4 2xl:max-w-6xl w-full mx-auto">
                <h2 className="text-white text-xl font-bold mb-4">Clientes</h2>
                

                {/* Tabla de conversaciones responsiva */}
                <div className="md:flex hidden relative flex-1 rounded-xl md:min-h-min overflow-x-auto">
                    <ClientsTable />
                </div>
                <div className="md:hidden flex relative flex-1 rounded-xl md:min-h-min overflow-x-auto">
                     <Cards />
                </div>
            </div>
        </AppLayout>
    );
}
