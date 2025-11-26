import { useState } from "react";
import { toast } from "sonner";
import { escalateTicket, createFollowUp, updateStatus } from "@/services/tickets/tickets.api";

/**
 * Hook for ticket actions such as escalate.
 * Uses useTickets internally to refresh list after actions.
 */
export function useTicketActions(onRefresh?: () => void) {
    const [actionLoading, setActionLoading] = useState(false);
    const [followUpLoading, setFollowUpLoading] = useState(false);

    async function escalate(id: number) {
        setActionLoading(true);
        try {
            await escalateTicket(id);
            toast.success("Ticket escalado correctamente");
        } catch (error: any) {
            toast.error(error.message || "Error al escalar el ticket");
        } finally {
            setActionLoading(false);
        }
    }

    async function followUp(id: number, payload: { notes: string; follow_up_at: string }) {
        setFollowUpLoading(true);
        try {
            await createFollowUp(id, payload);
            toast.success("Seguimiento programado correctamente");
        } catch (error: any) {
            toast.error(error.message || "Error al programar seguimiento");
        } finally {
            setFollowUpLoading(false);
        }
    }

    async function status(id: number, status: string) {
        setActionLoading(true);
        try {
            await updateStatus(id, status);
            toast.success(`Estado del ticket actualizado a ${status}`);
            onRefresh?.();
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar el estado del ticket");
        } finally {
            setActionLoading(false);
        }
    }

    return {
        escalate,
        followUp,
        status,
        actionLoading,
        followUpLoading
    };
}
