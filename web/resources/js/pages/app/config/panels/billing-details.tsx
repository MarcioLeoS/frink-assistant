import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import type { BreadcrumbItem } from "@/types";

export default function PaymentDetailsTab() {
    // Datos hardcodeados de ejemplo
    const payment = {
        id: "36223",
        product: "Business board basic",
        amount: "$59.90",
        method: "Tarjeta de crédito",
        date: "12/10/2021",
        status: "Pagado",
        invoiceUrl: "/facturas/36223.pdf",
        cardLast4: "1234",
        cardBrand: "Visa",
        customer: "David McMichael",
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Configuración", href: "/config" },
        { title: "Detalles de pago", href: "/config/billing" },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Configuración" />
            <div className="flex flex-col h-full w-full p-4">
                <h2 className="text-xl font-bold text-white mb-6">Detalles del pago</h2>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Resumen visual */}
                    <Card className="md:w-1/2 bg-gradient-to-br from-blue-900/60 to-stone-900/80 border-blue-900/40 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <span>Pago #{payment.id}</span>
                                <Badge variant="outline" className="ml-2 text-xs capitalize">{payment.status}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-4">
                                <div className="rounded-lg bg-blue-950/80 p-3 flex flex-col items-center justify-center">
                                    {/* Icono de tarjeta */}
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <rect x="2" y="7" width="28" height="18" rx="4" fill="#2563eb" />
                                        <rect x="2" y="13" width="28" height="4" fill="#1e293b" />
                                        <rect x="6" y="21" width="8" height="2" rx="1" fill="#fff" />
                                    </svg>
                                    <span className="text-xs text-blue-200 mt-1">{payment.cardBrand} **** {payment.cardLast4}</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{payment.amount}</div>
                                    <div className="text-xs text-blue-200">{payment.method}</div>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Cliente</span>
                                <span className="text-sm text-white">{payment.customer}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Producto</span>
                                <span className="text-sm text-white">{payment.product}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Fecha</span>
                                <span className="text-sm text-white">{payment.date}</span>
                            </div>
                            <Button asChild variant="outline" className="w-full mt-4">
                                <a href={payment.invoiceUrl} download>
                                    <Download className="w-4 h-4 mr-2" />
                                    Descargar factura
                                </a>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Detalle extendido */}
                    <Card className="md:w-1/2 bg-stone-900/80 border-stone-700/60 shadow">
                        <CardHeader>
                            <CardTitle className="text-white text-base">Detalle completo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">ID de pago</span>
                                <span>{payment.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Producto</span>
                                <span>{payment.product}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Cliente</span>
                                <span>{payment.customer}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Monto</span>
                                <span>{payment.amount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Método</span>
                                <span>{payment.method}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tarjeta</span>
                                <span>{payment.cardBrand} **** {payment.cardLast4}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Fecha</span>
                                <span>{payment.date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Estado</span>
                                <Badge variant="outline" className="capitalize">{payment.status}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}