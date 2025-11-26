import { useEffect, useState } from "react";
import { getAgents, Agent } from "@/services/person-request/person-request.api";

export function usePersonRequestAgents() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAgents()
            .then(setAgents)
            .finally(() => setLoading(false));
    }, []);

    return { agents, loading };
}