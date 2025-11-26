import { useState } from "react";
import { toast } from "sonner";
import { updateSuscription } from "@/services/plans/plans.api";

export function usePlansUpdateSuscription() {
    const [loading, setLoading] = useState<boolean>(false);

    const updateSubscription = async (planId: number, interval: "month" | "year" = "month") => {
        setLoading(true);
        try {
            const data: any = await updateSuscription(planId, interval);
            toast.success("Suscripción actualizada correctamente");
        } catch (err: any) {
            toast.error(err.message || "Failed to update subscription");
        } finally {
            setLoading(false);
        }
    };

    return { updateSubscription, loading };
}