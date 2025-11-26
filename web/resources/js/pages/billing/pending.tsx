import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface Props {
  mpPaymentId: string;
  mpStatus: string;
}

export default function Pending() {
  const { mpPaymentId, mpStatus } = usePage().props as unknown as Props;

  return (
    <AppLayout>
      <Head title="Pago Pendiente" />
      <div className="container mx-auto p-6">
        <Alert variant="default">
          <AlertTitle>Pago pendiente</AlertTitle>
          <AlertDescription>
            Tu pago está pendiente de confirmación.
            <p className="mt-2">
              Estado: {mpStatus.charAt(0).toUpperCase() + mpStatus.slice(1)}
            </p>
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
          <Link href="/billing">Volver</Link>
        </Button>
      </div>
    </AppLayout>
  );
}