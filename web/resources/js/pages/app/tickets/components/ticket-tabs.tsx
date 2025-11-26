
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Info,
    MessageSquare,
    Clock,
    Check,
    AlertCircle,
    Paperclip,
    ListTodo,
    Send,
    FileText,
    Mail,
    Phone,
    XCircle,
    RefreshCcw,
    Repeat,
    CalendarX2
} from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { TicketProps } from "../tickets";
import { Ticket } from "@/services/tickets/tickets.api";

interface TicketTabsProps extends TicketProps {
    onChangeStatus?: (ticketId: number, newStatus: string) => void;
}

export default function TicketTabs({ ticket, onChangeStatus }: TicketTabsProps) {
    const [markdown, setMarkdown] = useState<string>("")
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isReopenOpen, setIsReopenOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const handleCloseTicket = async () => {
        if (ticket && onChangeStatus) {
            setActionLoading(true);
            await onChangeStatus(ticket.id, "closed");
            setActionLoading(false);
            setIsConfirmOpen(false);
        }
    };

    const handleReopenTicket = async () => {
        if (ticket && onChangeStatus) {
            setActionLoading(true);
            await onChangeStatus(ticket.id, "open");
            setActionLoading(false);
            setIsReopenOpen(false);
        }
    };

    if (!ticket) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center text-stone-400">
                    <p className="text-lg font-semibold">Selecciona un ticket para ver los detalles</p>
                    <p className="mt-2">No hay información disponible.</p>
                </div>
            </div>
        );
    }

    /* ---------------------------------- dummy data --------------------------------- */
    const messages = [
        {
            id: 1,
            author: "María González",
            time: "17:05",
            text: "Hola, sigo sin poder iniciar sesión :(",
            fromCustomer: true,
        },
        {
            id: 2,
            author: "Agente Soporte",
            time: "17:07",
            text: "¡Hola María! Verifiquemos tu correo y restablezcamos la contraseña.",
            fromCustomer: false,
        },
        {
            id: 3,
            author: "María González",
            time: "17:10",
            text: "Hecho, pero el link me arroja error 404.",
            fromCustomer: true,
        },
    ];

    const parseDateFlexible = (dateStr: string | null | undefined) => {
        if (!dateStr) return null;
        const trimmed = dateStr.trim();

        let parsed = parse(trimmed, "d/M/yyyy H:mm", new Date());
        if (isValid(parsed)) return parsed;

        parsed = new Date(trimmed);
        if (isValid(parsed)) return parsed;
        return null;
    };

    const createTimeline = (ticket: Ticket) => {
        let timeline = [];

        let createdDate = parseDateFlexible(ticket.created_at);

        timeline.push({
            icon: AlertCircle,
            title: "Ticket creado",
            detail: ticket.problem_description || "Descripción del problema no disponible",
            time: createdDate ? format(createdDate, "dd 'de' MMMM yyyy - HH:mm", { locale: es }) : ticket.created_at,
        });

        for (const followUp of ticket.follow_ups || []) {
            let followUpDate = parseDateFlexible(followUp.created_at);
            timeline.push({
                icon: Repeat,
                type: "follow_up",
                title: "Seguimiento",
                detail: followUp.notes || "Sin notas de seguimiento",
                time: followUpDate ? format(followUpDate, "dd 'de' MMMM yyyy - HH:mm", { locale: es }) : followUp.created_at,
            });
        }

        timeline.push({
            icon: CalendarX2,
            title: "Fin del historial del ticket",
            detail: "No hay más eventos registrados",
            time: createdDate ? format(createdDate, "dd 'de' MMMM yyyy - HH:mm", { locale: es }) : ticket.created_at,
            type: "end"
        });

        return timeline;
    }

    const timeline = createTimeline(ticket);

    const checklistItems = [
        { id: 1, label: "Verificar estado del usuario en BDD", done: false },
        { id: 2, label: "Probar reset de contraseña manual", done: true },
        { id: 3, label: "Revisar logs de autenticación", done: false },
    ];

    const attachments = [
        { id: 1, name: "error_screenshot.png", size: "820 KB" },
        { id: 2, name: "auth_logs.txt", size: "5,4 KB" },
    ];

    const urgencyBadgeClasses: Record<string, string> = {
        high: "bg-red-500/30 text-red-100 border-red-500/30",
        medium: "bg-orange-500/30 text-orange-100 border-orange-500/30",
        low: "bg-green-500/30 text-green-100 border-green-500/30",
        urgent: "bg-pink-500/30 text-pink-100 border-pink-500/30",
        default: "bg-slate-500/30 text-slate-100 border-slate-500/30",
    };

    const statusBadgeClasses: Record<string, string> = {
        open: "bg-blue-500/30 text-blue-100 border-blue-500/30",
        in_progress: "bg-yellow-500/30 text-yellow-100 border-yellow-500/30",
        closed: "bg-gray-500/30 text-gray-100 border-gray-500/30",
        resolved: "bg-green-500/30 text-green-100 border-green-500/30",
        default: "bg-slate-500/30 text-slate-100 border-slate-500/30",
    };

    const statusTranslations: Record<string, string> = {
        open: "Abierto",
        in_progress: "En progreso",
        closed: "Cerrado",
        resolved: "Resuelto",
        default: "Desconocido",
    };

    /* ------------------------------------ UI -------------------------------------- */

    return (
        <Tabs defaultValue="info" className="w-full space-y-4">
            {/* ------------------------------ Navegación ------------------------------ */}
            <TabsList className="gap-1 bg-stone-900/60 border border-stone-700/50 p-1 rounded-xl shadow-inner backdrop-blur">
                <TabsTrigger value="info" className="flex items-center gap-1 px-3 py-1.5">
                    <Info className="w-4 h-4" /> Información
                </TabsTrigger>
                {/* <TabsTrigger value="chat" className="flex items-center gap-1 px-3 py-1.5">
                        <MessageSquare className="w-4 h-4" /> Conversación
                    </TabsTrigger> */}
                <TabsTrigger value="timeline" className="flex items-center gap-1 px-3 py-1.5">
                    <Clock className="w-4 h-4" /> Historial
                </TabsTrigger>
                {/* <TabsTrigger value="tasks" className="flex items-center gap-1 px-3 py-1.5">
                        <ListTodo className="w-4 h-4" /> Checklist
                    </TabsTrigger> */}
                <TabsTrigger value="documentation" className="flex items-center gap-1 px-3 py-1.5">
                    <FileText className="w-4 h-4" /> Documentación
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center gap-1 px-3 py-1.5">
                    <FileText className="w-4 h-4" /> Archivos
                </TabsTrigger>
            </TabsList>

            {/* -------------------------------- Info ---------------------------------- */}
            <TabsContent value="info" asChild>
                <Card className="bg-gradient-to-br from-stone-900/70 to-stone-800/50 border-stone-700/50 shadow-lg backdrop-blur-md">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                            <Info className="w-4 h-4 text-blue-400" /> Resumen del ticket
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Badge
                                className={'ml-auto text-sm' + statusBadgeClasses[ticket?.status?.toLowerCase() || "default"]}
                                variant="outline">
                                {statusTranslations[ticket?.status?.toLowerCase() || "default"]}
                            </Badge>
                            <Badge
                                className={'ml-auto text-sm' + urgencyBadgeClasses[ticket?.urgency?.toLowerCase() || "default"]}
                                variant="outline">
                                {ticket?.urgency?.charAt(0).toUpperCase() + ticket?.urgency?.slice(1) || "Normal"}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm text-stone-300 space-y-3">
                        <p>
                            <span className="font-medium text-white">ID:</span> TK‑{ticket?.id || ""}
                        </p>
                        <p>
                            <span className="font-medium text-white">Cliente:</span> {ticket?.customer.name || "Desconocido"}
                        </p>
                        <p>
                            {ticket?.problem_description || ''}
                        </p>
                    </CardContent>
                    {/* Acciones rápidas */}
                    <div className="flex flex-wrap gap-2 mt-4 ml-4">
                        {(ticket.status === "open" || ticket.status === "in_progress") && (
                            <>
                                <a
                                    href={`mailto:${ticket.customer.email}?subject=Ticket%20TK-${ticket.id}%20(${ticket.problem_type})&body=Hola%20${ticket.customer.name},%0A%0AGracias%20por%20contactarnos.%20Estamos%20trabajando%20en%20tu%20ticket.%0A%0ASaludos,%0AEquipo%20de%20Soporte`}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm font-medium cursor-pointer transition-colors hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:pointer-events-none"
                                    style={{ textDecoration: "none" }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Mail className="w-4 h-4" />
                                    Enviar email
                                </a>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="gap-2 cursor-pointer transition-colors hover:bg-green-600 hover:text-white"
                                    disabled={!ticket}
                                >
                                    <Phone className="w-4 h-4" />
                                    Enviar mensaje
                                </Button>
                                <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="gap-2 cursor-pointer transition-colors hover:bg-red-700 hover:text-white"
                                            disabled={!ticket}
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Cerrar ticket
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>¿Cerrar ticket #{ticket.id}?</DialogTitle>
                                            <DialogDescription>
                                                Esta acción cerrará el ticket. ¿Deseas continuar?
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                                                Cancelar
                                            </Button>
                                            <Button onClick={handleCloseTicket} disabled={actionLoading}>
                                                {actionLoading ? "Procesando..." : "Confirmar"}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </>
                        )}
                        {/* Mostrar solo si el ticket está cerrado */}
                        {ticket.status === "closed" && (
                            <Dialog open={isReopenOpen} onOpenChange={setIsReopenOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-2 cursor-pointer transition-colors hover:bg-yellow-500/80 hover:text-white"
                                        disabled={!ticket}
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                        Reabrir ticket
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>¿Reabrir ticket #{ticket.id}?</DialogTitle>
                                        <DialogDescription>
                                            Esta acción reabrirá el ticket. ¿Deseas continuar?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsReopenOpen(false)}>
                                            Cancelar
                                        </Button>
                                        <Button onClick={handleReopenTicket} disabled={actionLoading}>
                                            {actionLoading ? "Procesando..." : "Confirmar"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </Card>
            </TabsContent>

            {/* ------------------------------- Chat ----------------------------------- */}
            <TabsContent value="chat" asChild>
                <Card className="flex flex-col h-[60vh] bg-gradient-to-br from-stone-900/70 to-stone-800/50 border-stone-700/50 shadow-lg backdrop-blur-md overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                            <MessageSquare className="w-4 h-4" /> Conversación
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-4 pb-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${msg.fromCustomer ? "ml-auto bg-blue-500/20" : "bg-stone-700/40"}`}
                                    >
                                        <div className="text-xs text-stone-400 mb-1 flex justify-between gap-2">
                                            <span>{msg.author}</span>
                                            <span>{msg.time}</span>
                                        </div>
                                        <p className="text-stone-200 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="border-t border-stone-700/50 p-3 flex items-center gap-2">
                            <Input placeholder="Escribe un mensaje…" className="flex-1 bg-stone-800/50" />
                            <Button size="icon">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* ----------------------------- Timeline ------------------------------- */}

            <TabsContent value="timeline" asChild>
                <Card className="bg-gradient-to-br from-stone-900/70 to-stone-800/50 border border-stone-700/50 shadow-xl backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                            <Clock className="h-5 w-5" /> Historial del ticket
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0overflow-visible">
                        <ScrollArea className="h-[60vh] p-4 overflow-visible">
                            <ol className="relative border-l-2 border-white/20 ml-6 ">
                                {timeline.map((item, idx) => {
                                    // Define estilos según el type
                                    let iconBg = "bg-cyan-500";
                                    let contentBg = "bg-stone-800/60 border-stone-700";
                                    let textTitle = "text-white";
                                    let textDetail = "text-stone-400";
                                    let textTime = "text-stone-500";

                                    if (item.type === "follow_up") {
                                        iconBg = "bg-indigo-500";
                                        contentBg = "bg-blue-950/60 border-blue-800/40";
                                        textTitle = "text-blue-100";
                                        textDetail = "text-blue-100";
                                        textTime = "text-blue-400";
                                    }
                                    if (item.type === "end") {
                                        iconBg = "bg-pink-500";
                                    }

                                    const isLast = idx === timeline.length - 1;

                                    return (
                                        <li key={idx} className="relative mb-8 pl-8">
                                            {/* Ícono */}
                                            <span className={`absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full ${isLast ? "top-18" : ""} ${iconBg}`}>
                                                <item.icon className="h-5 w-5 text-white" />
                                            </span>

                                            {/* Contenido */}
                                            <div className={`p-4 rounded-xl border shadow-md ${contentBg}`}>
                                                <p className={`font-semibold text-sm ${textTitle}`}>{item.title}</p>
                                                <p className={`my-1 text-sm ${textDetail}`}>{item.detail}</p>
                                                <p className={`text-xs ${textTime}`}>{item.time}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ol>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </TabsContent>


            {/* ----------------------------- Checklist ------------------------------- */}
            <TabsContent value="tasks" asChild>
                <Card className="bg-gradient-to-br from-stone-900/70 to-stone-800/50 border-stone-700/50 shadow-lg backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                            <ListTodo className="w-4 h-4" /> Checklist interno
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {checklistItems.map((task) => (
                            <label
                                key={task.id}
                                className="flex items-center gap-3 text-sm text-stone-200"
                            >
                                <input
                                    type="checkbox"
                                    defaultChecked={task.done}
                                    className="appearance-none w-4 h-4 rounded-sm bg-stone-700 border border-stone-600 checked:bg-green-500 transition-all"
                                />
                                <span className={task.done ? "line-through text-stone-500" : ""}>
                                    {task.label}
                                </span>
                            </label>
                        ))}
                        <Button variant="outline" className="mt-2 border-stone-700/50 text-stone-300 hover:bg-stone-800/50 w-full justify-center">
                            Agregar tarea
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* ------------------------------- Files --------------------------------- */}
            <TabsContent value="files" asChild>
                <Card className="bg-gradient-to-br from-stone-900/70 to-stone-800/50 border-stone-700/50 shadow-lg backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                            <Paperclip className="w-4 h-4" /> Archivos adjuntos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {attachments.map((file) => (
                                <div
                                    key={file.id}
                                    className="group flex cursor-pointer items-center gap-3 rounded-lg bg-white/[0.02] p-4 transition hover:bg-white/[0.08]"
                                >
                                    <div className="text-blue-400">
                                        <Paperclip className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="truncate text-sm text-white" title={file.name}>
                                            {file.name}
                                        </p>
                                        <p className="mt-1 text-xs text-white/50">
                                            {file.size}
                                        </p>
                                    </div>
                                    <Button size="icon" variant="ghost">
                                        <Paperclip className="h-5 w-5 text-white/50" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4 border-stone-700/50 text-stone-300 hover:bg-stone-800/50">
                            Subir archivo
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* ------------------------------- Docs --------------------------------- */}
            <TabsContent value="documentation" asChild>
                <Card className="bg-gradient-to-br from-stone-900/70 to-stone-800/50 border-stone-700/50 shadow-lg backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                            <FileText className="w-4 h-4" /> Documentación del ticket
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-2">
                            <label className="text-stone-300 text-sm">Editor Markdown</label>
                            <textarea
                                value={markdown}
                                onChange={(e) => setMarkdown(e.target.value)}
                                placeholder="Escribe documentación en formato Markdown…"
                                className="w-full min-h-[300px] p-3 bg-stone-800/70 border border-stone-700 text-stone-200 rounded-lg resize-none"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-stone-300 text-sm">Vista previa</label>
                            <div className="min-h-[300px] p-4 bg-stone-900/70 border border-stone-700 rounded-lg prose prose-invert max-w-none overflow-auto text-sm">
                                <ReactMarkdown>{markdown || "_Sin contenido_"}</ReactMarkdown>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
