import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
    getActiveSuscription,
    Subscription,
} from "@/services/plans/plans.api";

export function usePlansGetSuscriptions() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const resp = await getActiveSuscription();
            setSubscription(resp.data || null);
        } catch (err: any) {
            toast(err.message || "Failed to fetch subscription");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { subscription, loading, refetch: fetch };
}
