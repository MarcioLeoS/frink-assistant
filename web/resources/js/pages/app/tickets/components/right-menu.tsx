import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Calendar, Clock, Zap } from "lucide-react";
import { TicketProps } from "../tickets";
import { useTicketActions } from "../hooks/useTicketActions";

export default function RightMenu({ ticket }: TicketProps) {
    const { escalate, followUp, actionLoading, followUpLoading } = useTicketActions();
    const [isEscalateOpen, setIsEscalateOpen] = useState(false);
    const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);

    const [followUpDate, setFollowUpDate] = useState("");
    const [followUpNotes, setFollowUpNotes] = useState("");

    if (!ticket) return null;

    function handleEscalateConfirm() {
        escalate(ticket!.id);
        setIsEscalateOpen(false);
    }

    function handleFollowUpConfirm() {
        followUp(ticket!.id, {
            follow_up_at: followUpDate,
            notes: followUpNotes,
        });
        setIsFollowUpOpen(false);
        setFollowUpDate("");
        setFollowUpNotes("");
    }

    return (
        <Card className="bg-gradient-to-br from-stone-900/70 to-stone-800/50 border-stone-700/50 shadow-xl backdrop-blur-sm mt-15">
            <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-600 to-green-700 rounded-md flex items-center justify-center">
                        <Zap className="w-3 h-3 text-white" />
                    </div>
                    Acciones Rápidas
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Escalar ticket */}
                {ticket.escalated === false && (
                    <Dialog open={isEscalateOpen} onOpenChange={setIsEscalateOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start border-stone-700/50 text-stone-300 hover:bg-stone-800/50 hover:text-white hover:border-stone-600/50 transition-all group"
                            >
                                <AlertTriangle className="w-4 h-4 mr-3 group-hover:text-orange-400 transition-colors" />
                                Escalar ticket
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>¿Escalar ticket #{ticket.id}?</DialogTitle>
                                <DialogDescription>
                                    Esta acción notificará al equipo de segundo nivel. ¿Deseas continuar?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEscalateOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleEscalateConfirm} disabled={actionLoading}>
                                    {actionLoading ? "Procesando..." : "Confirmar"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
                {/* Programar seguimiento */}
                <Dialog open={isFollowUpOpen} onOpenChange={setIsFollowUpOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start border-stone-700/50 text-stone-300 hover:bg-stone-800/50 hover:text-white hover:border-stone-600/50 transition-all group"
                        >
                            <Calendar className="w-4 h-4 mr-3 group-hover:text-blue-400 transition-colors" />
                            Programar seguimiento
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Programar seguimiento</DialogTitle>
                            <DialogDescription>
                                Selecciona fecha/hora y agrega una nota opcional.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="follow-up-date" className="text-sm font-medium text-zinc-400">
                                    Fecha y hora
                                </label>
                                <Input
                                    id="follow-up-date"
                                    type="datetime-local"
                                    value={followUpDate}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFollowUpDate(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="follow-up-notes" className="text-sm font-medium text-zinc-400">
                                    Notas
                                </label>
                                <Textarea
                                    id="follow-up-notes"
                                    value={followUpNotes}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFollowUpNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsFollowUpOpen(false)} disabled={followUpLoading}>
                                Cancelar
                            </Button>
                            <Button onClick={handleFollowUpConfirm} disabled={followUpLoading || !followUpDate}>
                                {followUpLoading ? "Programando..." : "Programar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button
                    variant="outline"
                    className="w-full justify-start border-stone-700/50 text-stone-300 hover:bg-stone-800/50 hover:text-white hover:border-stone-600/50 transition-all group"
                >
                    <Clock className="w-4 h-4 mr-3 group-hover:text-green-400 transition-colors" />
                    Ver historial completo
                </Button>
            </CardContent>
        </Card>
    );
}