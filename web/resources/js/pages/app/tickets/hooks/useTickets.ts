// resources/js/Pages/useTickets.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getTickets, Ticket, TicketsResponse } from "@/services/tickets/tickets.api";

export function useTickets(
  currentPage: number,
  perPage: number,
  status: string | null,
  urgency: string | null,
  refreshKey: number
) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchTickets = async (page: number, perPage: number, status: string | null, urgency: string | null) => {
    setLoading(true);
    try {
      const data: TicketsResponse = await getTickets(page, perPage, status, urgency);
      setTickets(data.tickets.data);
      setTotalPages(data.tickets.last_page);
      setTotalItems(data.tickets.total);
    } catch (error: any) {
      toast(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(currentPage, perPage, status, urgency);
  }, [currentPage, perPage, status, urgency, refreshKey]);

  return { tickets, loading, totalPages, totalItems };
}
