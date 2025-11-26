// resources/js/components/filters-drawer.tsx
import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/utils/date-range-picker";
import { CustomerQuery } from "@/services/customers/customers.api";

interface Props {
    value: CustomerQuery;
    onChange: (partial: Partial<CustomerQuery>) => void;
}

export default function FiltersDrawer({ value, onChange }: Props) {
    const [minMsgs, setMinMsgs] = useState<number>(value.minMessages ?? 10);
    const debounceRef = useRef<number | undefined>(undefined);
    /* rango actividad ---------------------------------- */
    const [range, setRange] = useState<{ from: Date; to?: Date }>();

    const handleSlider = (v: number[]) => {
        const val = v[0];
        setMinMsgs(val);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(() => {
            onChange({ minMessages: val });
        }, 400);
    };

    const handleRange = (r: { from: Date; to?: Date }) => {
        setRange(r);
        onChange({
            from: r.from?.toISOString().slice(0, 10),
            to: r.to?.toISOString().slice(0, 10),
        });
    };

    /* helper para selects “sí / no / todos” -------------- */
    const select = (
        val: string,
        setter: (v: string) => void,
        key: keyof CustomerQuery
    ) => (v: string) => {
        setter(v);
        onChange({ [key]: v } as Partial<CustomerQuery>);
    };

    return (
        <div className="flex flex-col gap-6 text-sm mr-2">
            {/* Rango de actividad */}
            <div>
                <Label className="block mb-2">Rango de actividad</Label>
                <DateRangePicker
                    date={range}
                    setDate={(r) => {
                        setRange(r);
                        if (r?.from && r?.to) {
                            onChange({
                                from: r.from.toISOString().slice(0, 10),
                                to: r.to.toISOString().slice(0, 10),
                            });
                        }

                        if (!r) {
                            onChange({ from: undefined, to: undefined });
                        }
                    }}
                />
            </div>

            {/* Volumen e Interacción */}
            <div className="space-y-4 border-t border-b py-4">
                <Label className="text-xs uppercase tracking-wider">
                    Volumen e Interacción
                </Label>

                {/* Mínimo de mensajes */}
                <div className="mt-4">
                    <Label className="mb-1 block">Mínimo de mensajes</Label>
                    <Slider
                        value={[minMsgs]}
                        onValueChange={handleSlider}
                        defaultValue={[value.minMessages ?? 10]}
                        max={100}
                        step={5}
                    />
                </div>

                {/* Conversaciones largas */}
                <div>
                    <Label className="mb-1 block">Conversaciones largas</Label>
                    <Select
                        value={value.conversacionesLargas ?? "todos"}
                        onValueChange={select(
                            value.conversacionesLargas ?? "todos",
                            () => { },          // no necesitamos estado local
                            "conversacionesLargas"
                        )}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="si">Sí</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Tickets soporte */}
                <div>
                    <Label className="mb-1 block">Tickets de soporte</Label>
                    <Select
                        value={value.ticketsSoporte ?? "todos"}
                        onValueChange={select("", () => { }, "ticketsSoporte")}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="si">Sí</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Tickets marketing */}
                <div>
                    <Label className="mb-1 block">Tickets de marketing</Label>
                    <Select
                        value={value.ticketsMarketing ?? "todos"}
                        onValueChange={select("", () => { }, "ticketsMarketing")}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="si">Sí</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Recordatorios */}
                <div>
                    <Label className="mb-1 block">Con recordatorios</Label>
                    <Select
                        value={value.recordatorios ?? "todos"}
                        onValueChange={select("", () => { }, "recordatorios")}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="si">Sí</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Seguimientos */}
                <div>
                    <Label className="mb-1 block">Seguimientos</Label>
                    <Select
                        value={value.seguimientos ?? "todos"}
                        onValueChange={select("", () => { }, "seguimientos")}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="activos">Activos</SelectItem>
                            <SelectItem value="cancelados">Cancelados</SelectItem>
                            <SelectItem value="pendientes">Pendientes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Personalización y Feedback */}
            <div className="space-y-4 border-b pb-4">
                <Label className="text-xs uppercase tracking-wider">
                    Personalización y Feedback
                </Label>

                {/* Personalización */}
                <div className="mt-4">
                    <Label className="mb-1 block">Personalización</Label>
                    <Select
                        value={value.personalizacion ?? "todos"}
                        onValueChange={select("", () => { }, "personalizacion")}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="activa">Activa</SelectItem>
                            <SelectItem value="inactiva">Inactiva</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Feedback negativo */}
                <div>
                    <Label className="mb-1 block">Feedback negativo</Label>
                    <Select
                        value={value.feedbackNegativo ?? "todos"}
                        onValueChange={select("", () => { }, "feedbackNegativo")}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="si">Sí</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Solicitó humano */}
                <div>
                    <Label className="mb-1 block">Solicitó hablar con humano</Label>
                    <Select
                        value={value.solicitoHumano ?? "todos"}
                        onValueChange={select("", () => { }, "solicitoHumano")}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="si">Sí</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Problemas recurrentes */}
                <div>
                    <Label className="mb-1 block">Problemas recurrentes</Label>
                    <Select
                        value={value.problemasRecurrentes ?? "todos"}
                        onValueChange={select("", () => { }, "problemasRecurrentes")}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="si">Sí</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
