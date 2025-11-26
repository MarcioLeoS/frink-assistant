import { useState } from "react";
import Table from "@/components/ui/table";
import Pagination from "@/components/ui/pagination";
import Loader from "@/components/ui/loader";
import TableButton from "@/components/ui/table-button";
import { formatDistanceToNow, parse, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, ClipboardPlus, UserPlus } from "lucide-react";
import { Link } from "@inertiajs/react";
import { usePersonRequest } from "../hooks/usePersonRequest";
import { usePersonRequestAgents } from "../hooks/usePersonRequestAgents";
import { useAssignAgentToRequest } from "../hooks/useAssignAgentToRequest";
import { RealPersonRequestQuery, Agent } from "@/services/person-request/person-request.api";
import PersonRequestEditModal from "./real-request-modal";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function RealPersonRequestTable() {
    const [openQuestionId, setOpenQuestionId] = useState<number | null>(null);
    const [openObservationId, setOpenObservationId] = useState<number | null>(null);
    const [openAssignAgentId, setOpenAssignAgentId] = useState<number | null>(null);
    const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
    const { assignAgent, loading: assigning } = useAssignAgentToRequest();

    const [query, setQuery] = useState<RealPersonRequestQuery>({
        page: 1,
    });

    const { requests, loading, totalPages, totalItems, refetch } = usePersonRequest(query);
    const { agents, loading: loadingAgents } = usePersonRequestAgents();

    // Handlers para filtros, orden y paginación
    const updateQuery = (partial: Partial<RealPersonRequestQuery>) =>
        setQuery((q) => ({ ...q, page: 1, ...partial }));

    const handlePageChange = (page: number) =>
        setQuery((q) => ({ ...q, page }));

    const parseDate = (val?: string | null) => {
        if (!val) return null;
        const p = parse(val, "dd/MM/yyyy HH:mm:ss", new Date());
        if (!isNaN(p.getTime())) return p;
        const iso = new Date(val);
        return isNaN(iso.getTime()) ? null : iso;
    };

    const getDateObject = (value?: string | null) => {
        if (!value) return null;
        const formattedDate = parse(value, "dd/MM/yyyy HH:mm:ss", new Date());
        if (!isNaN(formattedDate.getTime())) return formattedDate;
        const isoDate = parseISO(value);
        return isNaN(isoDate.getTime()) ? null : isoDate;
    };
    if (loading) return <Loader />;

    return (
        <div className="flex flex-col h-full w-full">
            <div className="overflow-x-auto">
                <Table>
                    <thead>
                        <tr className="border-b border-neutral-800">
                            <th className="py-2 text-left px-2">Cliente</th>
                            <th className="py-2 text-left px-2">Teléfono</th>
                            <th className="py-2 text-left px-2">Pregunta</th>
                            <th className="py-2 text-left px-2">Observación</th>
                            <th className="py-2 text-left px-2">Estado</th>
                            <th className="py-2 text-left px-2">Agente</th>
                            <th className="py-2 text-left px-2">Creado</th>
                            <th className="py-2 text-left px-2">Visto</th>
                            <th className="py-2 px-2" />
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((r) => (
                            <tr key={r.id} className="border-b border-neutral-800">
                                <td className="py-4 px-2 text-sm">{r.customer?.name}</td>
                                <td className="py-4 px-2 text-sm">{r.customer?.phone_number}</td>
                                <td className="py-4 px-2 text-sm">
                                    <Dialog open={openQuestionId === r.id} onOpenChange={open => setOpenQuestionId(open ? r.id : null)}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline"
                                                className="w-full px-2 text-sm py-1 h-auto justify-start border-stone-700/50 text-stone-300 hover:bg-stone-800/50 hover:text-white hover:border-stone-600/50 transition-all group">
                                                <ClipboardPlus className="w-4" />
                                                solicitud
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Solicitud del cliente:</DialogTitle>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <p>{r.question}</p>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setOpenQuestionId(null)}>
                                                    Cerrar
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </td>
                                <td className="py-4 px-2 text-sm">
                                    {r.observations ? (
                                        <Dialog open={openObservationId === r.id} onOpenChange={open => setOpenObservationId(open ? r.id : null)}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline"
                                                    className="w-full px-2 py-1 h-auto justify-start border-stone-700/50 text-stone-300 hover:bg-stone-800/50 hover:text-white hover:border-stone-600/50 transition-all group">
                                                    <ClipboardPlus className="w-4" />
                                                    observación
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Observación de la petición:</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <p>{r.observations}</p>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setOpenObservationId(null)}>
                                                        Cerrar
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td className="py-4 px-2 text-sm">{r.status}</td>
                                <td className="py-4 px-2 text-sm">
                                    {r.agent?.name ?? (
                                        <Dialog
                                            open={openAssignAgentId === r.id}
                                            onOpenChange={open => {
                                                setOpenAssignAgentId(open ? r.id : null);
                                                if (open) setSelectedAgent(null); // Limpia el agente seleccionado al abrir
                                            }}
                                        >
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full flex items-center gap-2 text-blue-400 px-2 py-1 h-auto">
                                                    <UserPlus className="w-4" />
                                                    Asignar agente
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Asignar agente</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    {loadingAgents ? (
                                                        <Loader />
                                                    ) : (
                                                        <Select
                                                            value={selectedAgent ? String(selectedAgent) : ""}
                                                            onValueChange={val => setSelectedAgent(val ? Number(val) : null)}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Selecciona un agente" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Agentes</SelectLabel>
                                                                    {agents.map((agent: Agent) => (
                                                                        <SelectItem key={agent.id} value={String(agent.id)}>
                                                                            {agent.name}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        variant="default"
                                                        disabled={!selectedAgent || assigning}
                                                        onClick={async () => {
                                                            if (selectedAgent) {
                                                                const ok = await assignAgent(r.id, selectedAgent);
                                                                if (ok) {
                                                                    setOpenAssignAgentId(null);
                                                                    setSelectedAgent(null);
                                                                    refetch();
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        {assigning ? "Asignando..." : "Asignar"}
                                                    </Button>
                                                    <Button variant="outline" onClick={() => setOpenAssignAgentId(null)}>
                                                        Cancelar
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </td>
                                <td className="py-4 px-2 text-sm">
                                    {/* {parseDate(r.created_at)
                                        ? formatDistanceToNow(parseDate(r.created_at)!, {
                                            addSuffix: true,
                                            locale: es,
                                        })
                                        : "-"} */}
                                    {getDateObject(r.created_at)
                                        ? format(getDateObject(r.created_at)!, "dd/MM/yyyy HH:mm")
                                        : "-"}
                                </td>
                                <td className="py-4 px-2 text-sm">
                                    {parseDate(r.viewed_at)
                                        ? formatDistanceToNow(parseDate(r.viewed_at)!, {
                                            addSuffix: true,
                                            locale: es,
                                        })
                                        : "-"}
                                </td>
                                <td className="py-4 px-2 text-sm">
                                    <PersonRequestEditModal request={r} onSaved={refetch} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <div className="mt-auto">
                <Pagination
                    currentPage={query.page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={10}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}