import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { RealPersonRequest } from "@/services/person-request/person-request.api";
import { useUpdatePersonRequest } from "../hooks/useUpdatePersonRequest";

const STATUS_OPTIONS = [
  { label: "Pendiente", value: "pending" },
  { label: "Visto", value: "viewed" },
  { label: "En curso", value: "in_progress" },
  { label: "Resuelto", value: "resolved" },
] as const;

type StatusCode = (typeof STATUS_OPTIONS)[number]["value"];

interface PersonRequestEditModalProps {
  request: RealPersonRequest;
  onSaved?: () => void;
  triggerLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function PersonRequestEditModal({
  request,
  onSaved,
  triggerLabel = "",
  className = "",
  children,
}: PersonRequestEditModalProps) {
  const {
    props: {
      auth: { user },
    },
  } = usePage<{ auth: { user: { id: number } } }>();

  const { update, loading } = useUpdatePersonRequest();

  const initialStatus: StatusCode = ((): StatusCode => {
    const found = STATUS_OPTIONS.find((o) => o.value === request.status);
    return (found?.value ?? "pending") as StatusCode;
  })();

  const [open, setOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<StatusCode>(initialStatus);
  const [editObs, setEditObs] = useState(request.observations || "");

  useEffect(() => {
    if (
      open &&
      request.agent_id === user.id &&
      !request.viewed_at &&
      !loading
    ) {
      console.log("Marking request as viewed:", request.id);
      (async () => {
        await update(request.id, { viewed_at: new Date().toISOString() });
      })();
    }
  }, [open]);

  const handleSave = async () => {
    const ok = await update(request.id, {
      status: editStatus,
      observations: editObs,
    });
    if (ok) {
      setOpen(false);
      onSaved?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        {children ?? (
          <Button
            variant="outline"
            className={`flex items-center gap-2 text-yellow-400 px-2 py-1 w-auto h-auto ${className}`}
          >
            <Eye className="w-2" />
            {triggerLabel}
          </Button>
        )}
      </DialogTrigger>

      {/* Contenido del modal */}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Actualizar solicitud</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Campo Estado */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <Select
              value={editStatus}
              onValueChange={(val) => setEditStatus(val as StatusCode)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {STATUS_OPTIONS.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Campo Observaciones */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Observación ({editObs.length}/800)
            </label>
            <textarea
              className="w-full min-h-[120px] rounded-md border border-stone-600 p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              maxLength={800}
              value={editObs}
              onChange={(e) => setEditObs(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="default" disabled={loading} onClick={handleSave}>
            {loading ? "Guardando…" : "Guardar cambios"}
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
