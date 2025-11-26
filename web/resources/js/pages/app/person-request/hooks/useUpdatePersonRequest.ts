import { useState } from "react";
import { updateRequest } from "@/services/person-request/person-request.api";
import { toast } from "sonner";

export function useUpdatePersonRequest() {
  const [loading, setLoading] = useState(false);

  async function update(id: number, payload: any) {
    try {
      setLoading(true);
      await updateRequest(id, payload);
      toast("Cambios guardados correctamente");
      return true;
    } catch (err: any) {
      toast("Error al asignar el agente a la petición: " + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { update, loading };
}
