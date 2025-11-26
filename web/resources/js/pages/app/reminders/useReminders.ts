import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getReminders, GetRemindersParams, Reminder } from "@/services/reminders/reminders.api";

export function useReminders(currentPage: number, idCategory: number, refresh: boolean) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchReminders = async () => {
    setLoading(true);
    const params: GetRemindersParams = { page: currentPage, categoryId: idCategory };
    try {
      const data = await getReminders(params);
      if (data.reminders && Array.isArray(data.reminders.data)) {
        setReminders(data.reminders.data);
        setTotalPages(data.reminders.last_page);
        setTotalItems(data.reminders.total);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error: any) {
      toast(error.message || "Error fetching reminders");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  useEffect(() => {
    fetchReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCategory, currentPage, refresh]);

  return { reminders, loading, totalPages, totalItems, itemsPerPage, setCurrentPage: (page: number) => {} };
}
