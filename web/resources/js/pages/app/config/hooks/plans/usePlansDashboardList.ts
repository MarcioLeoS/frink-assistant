// resources/js/hooks/useBots.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
    getPlans,
    Plan,
} from "@/services/plans/plans.api";

export function usePlansList() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data: Plan[] = await getPlans();
            setPlans(data);
        } catch (err: any) {
            toast(err.message || "Failed to fetch plans");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return { plans, loading, refetch: fetch };
}
