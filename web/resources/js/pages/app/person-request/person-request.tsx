import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import Table from './components/table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Petición de personas reales',
        href: '/person-request',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Petición de personas reales" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 lg:py-4 w-full mx-auto">
                <h2 className="text-white text-xl font-bold mb-4">Peticiones de respuesta de persona real</h2>
                

                {/* Tabla de conversaciones responsiva */}
                <div className="md:flex hidden relative flex-1 rounded-xl md:min-h-min overflow-x-auto">
                    <Table />
                </div>
                <div className="md:hidden flex relative flex-1 rounded-xl md:min-h-min overflow-x-auto">
                </div>
            </div>
        </AppLayout>
    );
}
