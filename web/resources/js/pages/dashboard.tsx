import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {/* Contenedor principal ahora con flex-row para disposición horizontal */}
            <div className="flex flex-1 flex-row gap-4 rounded-xl p-4">
                {/* Tarjeta de bienvenida */}
                <div className="w-1/2">
                    <div className="bg-zinc-800 text-white overflow-hidden rounded-lg shadow-lg h-full">
                        <div className="relative z-10 p-6">
                            <span className="inline-flex items-center gap-2 text-lg font-medium bg-gray-800 text-white px-3 py-1 rounded-md">
                                <span className="font-normal">
                                    This month <span className="font-semibold">+15% Profit</span>
                                </span>
                            </span>
                            <h4 className="text-white font-normal mt-10 pt-7 mb-2">
                                Hey, <span className="font-bold">David McMichael</span>
                            </h4>
                            <h6 className="text-white opacity-75 font-normal">
                                Aenean vel libero id metus sollicitudin
                            </h6>
                        </div>
                    </div>
                </div>

                {/* Sección de suscripciones y usuarios */}
                <div className="w-1/2">
                    <div className="flex flex-wrap -mx-2">
                        {/* Tarjeta de Subscriptions */}
                        <div className="w-full md:w-1/2 px-2">
                            <div className="bg-zinc-800 text-white overflow-hidden rounded-lg shadow-lg">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <span className="text-dark-light font-semibold text-xs">Subscriptions</span>
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-semibold mb-0 text-[10px]">78,298</h5>
                                                <span className="font-semibold text-dark-light text-[11px]">-12%</span>
                                            </div>
                                        </div>
                                        <span className="w-12 h-12 flex items-center justify-center bg-zinc-800 rounded-full">
                                            {/* Iconify icon aquí */}
                                        </span>
                                    </div>
                                    <div className="-mr-2">
                                        <div id="subscriptions" className="rounded-bars min-h-[98px]">
                                            {/* Contenido generado por ApexCharts */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta de Users */}
                        <div className="w-full md:w-1/2 px-2">
                            <div className="bg-zinc-800 text-white overflow-hidden rounded-lg shadow-lg">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-9">
                                        <div>
                                            <span className="text-dark-light font-semibold">Users</span>
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-semibold mb-0 text-[10px]">14,872</h5>
                                                <span className="font-semibold text-dark-light text-[11px]">+6.4%</span>
                                            </div>
                                        </div>
                                        <span className="w-12 h-12 flex items-center justify-center bg-zinc-800 rounded-full">
                                            {/* Iconify icon aquí */}
                                        </span>
                                    </div>
                                </div>
                                <div id="users" className="min-h-[91px]">
                                    {/* Contenido generado por ApexCharts */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex h-full flex-row gap-4 rounded-xl p-4">
                <div className="w-full md:w-2/3">
                    <div className="bg-zinc-800  h-full rounded-lg shadow p-4">
                        {/* Cabecera */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                            <div>
                                <h5 className="text-lg font-semibold">Pronóstico de ingresos</h5>
                                <p className="text-sm text-gray-500">Resumen del beneficio</p>
                            </div>
                            <div className="flex gap-9 mt-4 md:mt-0">
                                <div className="flex items-center gap-2">
                                    <span className="block w-2.5 h-2.5 bg-primary rounded-full"></span>
                                    <span className="text-sm text-gray-500">2024</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="block w-2.5 h-2.5 bg-danger rounded-full"></span>
                                    <span className="text-sm text-gray-500">2023</span>
                                </div>
                            </div>
                        </div>
                        {/* Área de gráfico */}
                        <div className="relative min-h-[305px] rounded overflow-hidden -mr-2">
                            <div id="revenue-forecast" className="min-h-[310px]">
                                {/* Aquí se renderiza el componente ApexCharts */}
                            </div>
                        </div>
                        {/* Resumen inferior */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="flex items-center gap-6">
                                <span className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                                </span>
                                <div>
                                    <span className="text-sm">Total</span>
                                    <h5 className="mt-1 font-medium">$96,640</h5>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                                </span>
                                <div>
                                    <span className="text-sm">Beneficio</span>
                                    <h5 className="mt-1 font-medium">$48,820</h5>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                                </span>
                                <div>
                                    <span className="text-sm">Ganancias</span>
                                    <h5 className="mt-1 font-medium">$48,820</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bloque: Beneficio anual (Annual Profit) */}
                <div className="w-full md:w-1/3">
                    <div className="bg-zinc-800 rounded-lg shadow p-4">
                        <h5 className="text-lg font-semibold mb-4">Beneficio anual</h5>
                        {/* Tarjeta de conversión */}
                        <div className="bg-primary/10 rounded overflow-hidden mb-4">
                            <div className="p-4 mb-9">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Tasa de conversión</span>
                                    <h3 className="mb-0">18.4%</h3>
                                </div>
                            </div>
                            <div id="annual-profit" className="min-h-[80px]">
                                {/* Aquí se renderiza el componente ApexCharts */}
                            </div>
                        </div>
                        {/* Resumen de estadísticas */}
                        <div className="flex items-center justify-between pb-6 border-b">
                            <div>
                                <span className="text-gray-500 font-medium">Añadido al carrito</span>
                                <span className="text-xs font-medium block mt-1">5 clics</span>
                            </div>
                            <div className="text-right">
                                <h6 className="font-bold mb-1 leading-none">$21,120.70</h6>
                                <span className="text-xs font-medium text-green-500">+13.2%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between py-6 border-b">
                            <div>
                                <span className="text-gray-500 font-medium">Llegó al pago</span>
                                <span className="text-xs font-medium block mt-1">12 clics</span>
                            </div>
                            <div className="text-right">
                                <h6 className="font-bold mb-1 leading-none">$16,100.00</h6>
                                <span className="text-xs font-medium text-red-500">-7.4%</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-6">
                            <div>
                                <span className="text-gray-500 font-medium">Añadido al carrito</span>
                                <span className="text-xs font-medium block mt-1">24 vistas</span>
                            </div>
                            <div className="text-right">
                                <h6 className="font-bold mb-1 leading-none">$6,400.50</h6>
                                <span className="text-xs font-medium text-green-500">+9.3%</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="w-full p-4">

                <div role="presentation" className="bg-zinc-800 border-gray-200 rounded-xl shadow">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xl font-semibold">Recent Orders</h4>
                            <button className="bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700 ring-primary dark:ring-white hover:border-primary dark:hover:border-white hover:ring-1 hover:text-primary dark:hover:text-white dark:hover:bg-transparent text-gray-600 dark:text-gray-100 h-10 rounded-xl px-3 py-2 text-sm">
                                View Orders
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-zinc-600">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left">Order</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                        <th className="px-4 py-2 text-left">Date</th>
                                        <th className="px-4 py-2 text-left">Customer</th>
                                        <th className="px-4 py-2 text-left">Amount spent</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-700">
                                    <tr>
                                        <td className="px-4 py-2">
                                            <span className="cursor-pointer select-none font-semibold text-zinc-500 hover:text-primary">
                                                #92627
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center">
                                                <span className="w-3 h-3 border border-white dark:border-gray-900 rounded-full text-xs font-semibold text-white bg-emerald-500"></span>
                                                <span className="ml-2 rtl:mr-2 capitalize font-semibold text-emerald-500">
                                                    Paid
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-zinc-500"><span>16/04/2022</span></td>
                                        <td className="px-4 py-2">Tara Fletcher</td>
                                        <td className="px-4 py-2">
                                            <span className="font-bold">$279.00</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2">
                                            <span className="cursor-pointer select-none font-semibold text-zinc-500 hover:text-primary">
                                                #92509
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center">
                                                <span className="w-3 h-3 border border-white dark:border-gray-900 rounded-full text-xs font-semibold text-white bg-amber-500"></span>
                                                <span className="ml-2 rtl:mr-2 capitalize font-semibold text-amber-500">
                                                    Pending
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-zinc-500"><span>16/04/2022</span></td>
                                        <td className="px-4 py-2">Joyce Freeman</td>
                                        <td className="px-4 py-2">
                                            <span className="font-bold">$831.00</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2">
                                            <span className="cursor-pointer select-none font-semibold text-zinc-500 hover:text-primary">
                                                #91631
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center">
                                                <span className="w-3 h-3 border border-white dark:border-gray-900 rounded-full text-xs font-semibold text-white bg-emerald-500"></span>
                                                <span className="ml-2 rtl:mr-2 capitalize font-semibold text-emerald-500">
                                                    Paid
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-zinc-500"><span>16/04/2022</span></td>
                                        <td className="px-4 py-2">Brittany Hale</td>
                                        <td className="px-4 py-2">
                                            <span className="font-bold">$142.00</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2">
                                            <span className="cursor-pointer select-none font-semibold text-zinc-500 hover:text-primary">
                                                #90963
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center">
                                                <span className="w-3 h-3 border border-white dark:border-gray-900 rounded-full text-xs font-semibold text-white bg-emerald-500"></span>
                                                <span className="ml-2 rtl:mr-2 capitalize font-semibold text-emerald-500">
                                                    Paid
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-zinc-500"><span>16/04/2022</span></td>
                                        <td className="px-4 py-2">Luke Cook</td>
                                        <td className="px-4 py-2">
                                            <span className="font-bold">$232.00</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2">
                                            <span className="cursor-pointer select-none font-semibold text-zinc-500 hover:text-primary">
                                                #89332
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center">
                                                <span className="w-3 h-3 border border-white dark:border-gray-900 rounded-full text-xs font-semibold text-white bg-amber-500"></span>
                                                <span className="ml-2 rtl:mr-2 capitalize font-semibold text-amber-500">
                                                    Pending
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-zinc-500"><span>16/04/2022</span></td>
                                        <td className="px-4 py-2">Eileen Horton</td>
                                        <td className="px-4 py-2">
                                            <span className="font-bold">$597.00</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2">
                                            <span className="cursor-pointer select-none font-semibold text-zinc-500 hover:text-primary">
                                                #89107
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center">
                                                <span className="w-3 h-3 border border-white dark:border-gray-900 rounded-full text-xs font-semibold text-white bg-red-500"></span>
                                                <span className="ml-2 rtl:mr-2 capitalize font-semibold text-red-500">
                                                    Failed
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-zinc-500"><span>16/04/2022</span></td>
                                        <td className="px-4 py-2">Frederick Adams</td>
                                        <td className="px-4 py-2">
                                            <span className="font-bold">$72.00</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2">
                                            <span className="cursor-pointer select-none font-semibold text-zinc-500 hover:text-primary">
                                                #89021
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center">
                                                <span className="w-3 h-3 border border-white dark:border-gray-900 rounded-full text-xs font-semibold text-white bg-emerald-500"></span>
                                                <span className="ml-2 rtl:mr-2 capitalize font-semibold text-emerald-500">
                                                    Paid
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-zinc-500"><span>16/04/2022</span></td>
                                        <td className="px-4 py-2">Lee Wheeler</td>
                                        <td className="px-4 py-2">
                                            <span className="font-bold">$110.00</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </AppLayout >
    );
}
