import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/config/env";
import { toast } from "sonner";

export default function RedirectToMpCheckout() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // Usa fetch nativo para GET
      const response = await fetch(`${BASE_URL}/mp/payment-preference`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const initPoint = data.initPoint as string;
      if (!initPoint) {
        throw new Error("No se recibió initPoint");
      }

      // Redirige al Checkout
      window.open(initPoint, "_blank");
    } catch (e: any) {
      console.error("Error obteniendo initPoint:", e);
      toast.error("No se pudo iniciar el pago. Intenta de nuevo más tarde.");
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={loading}>
      {loading ? "Redirigiendo..." : "Pagar"}
    </Button>
  );
}