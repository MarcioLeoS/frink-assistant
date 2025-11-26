import { useState, useEffect, useCallback } from "react";
import { getAlerts, AlertsResponse, Alert } from "@/services/alerts/alerts.api";

export function useAlerts(page = 1, perPage = 20) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data: AlertsResponse = await getAlerts(page, perPage);
      setAlerts(data.data);
      setTotalPages(data.last_page);
      setTotalItems(data.total);
    } catch (err) {
      // Puedes agregar un toast aquí si usas sonner o similar
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { alerts, loading, totalPages, totalItems, refetch: fetch };
}
