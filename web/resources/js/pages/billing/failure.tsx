import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface Props {
    mpPaymentId: string;
    mpStatus: string;
    error?: string;
}

export default function Failure() {
    const { mpPaymentId, mpStatus, error } = usePage().props as unknown as Props;

    return (
        <AppLayout>
            <Head title="Pago Rechazado" />
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertTitle>Pago rechazado</AlertTitle>
                    <AlertDescription>
                        Hubo un problema al procesar tu pago.
                        <p className="mt-2">
                            Código de estado: {mpStatus.charAt(0).toUpperCase() + mpStatus.slice(1)}
                        </p>
                        {error && <p className="mt-1">Error: {error}</p>}
                    </AlertDescription>
                </Alert>
                <Button asChild className="mt-4">
                    <Link href="/billing">Intentar de nuevo</Link>
                </Button>
            </div>
        </AppLayout>
    );
}