import { useState } from "react";
import { assignAgentToRequest } from "@/services/person-request/person-request.api";
import { toast } from "sonner";

export function useAssignAgentToRequest() {
    const [loading, setLoading] = useState(false);

    const assignAgent = async (requestId: number, agentId: number) => {
        setLoading(true);
        try {
            await assignAgentToRequest(requestId, agentId);
            toast("Cambios guardados correctamente");
            return true;
        } catch (err: any) {
            toast("Error al asignar el agente a la petición: " + err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { assignAgent, loading };
}