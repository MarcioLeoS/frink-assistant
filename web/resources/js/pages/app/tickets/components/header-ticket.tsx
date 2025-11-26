import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tickets, Calendar1, Clock, AlertCircle, CheckCircle, Zap, AlertTriangle, Circle } from "lucide-react"
import { TicketProps } from '../tickets'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"

interface HeaderTicketProps extends TicketProps {
    onChangeStatus?: (ticketId: number, newStatus: string) => void;
}

export default function HeaderTicket({ ticket, onChangeStatus }: HeaderTicketProps) {
    const [show, setShow] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const handleUpdateTicket = async () => {
        if (ticket && onChangeStatus) {
            setActionLoading(true);
            await onChangeStatus(ticket.id, "resolved");
            setActionLoading(false);
            setIsConfirmOpen(false);
        }
    };

    useEffect(() => {
        if (ticket) {
            setShow(false);
            // Pequeño timeout para reiniciar la animación al cambiar de ticket
            setTimeout(() => setShow(true), 50);
        } else {
            setShow(false);
        }
    }, [ticket]);

    if (!ticket) {
        return (
            <div className="w-full bg-transparent flex flex-col p-4">
                <div className="mb-4 flex gap-3">
                    <div className="flex items-center justify-between w-full">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-400">Selecciona un ticket</h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-transparent flex flex-col p-4">
            <div className="mb-4 flex gap-3">
                <div className="flex items-center justify-between w-full">
                    <div>
                        <h2
                            className={`text-2xl font-bold transition-all duration-500 ease-out
                                ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
                        >
                            {ticket.problem_description}
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Tickets className="w-4" />
                                <p className="text-sm text-gray-400">Cliente: {ticket.customer.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar1 className="w-4" />
                                <p className="text-sm text-gray-400">Creado el: {ticket.created_at}</p>
                            </div>
                        </div>
                    </div>

                    {(ticket.status === "open" || ticket.status === 'in_progress') && (
                        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="cursor-pointer">
                                    Resolver ticket
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>¿Resolver ticket #{ticket.id}?</DialogTitle>
                                    <DialogDescription>
                                        Esta acción marcará el ticket como resuelto y no se podrá editar luego. ¿Deseas continuar?
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button onClick={handleUpdateTicket} disabled={actionLoading}>
                                        {actionLoading ? "Procesando..." : "Confirmar"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>
        </div>
    );
}
