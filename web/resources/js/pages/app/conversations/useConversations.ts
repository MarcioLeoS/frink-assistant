// resources/js/Pages/useConversations.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getConversations, Conversation, ConversationsResponse } from "@/services/conversations/conversations.api";

export function useConversations(currentPage: number) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchConversations = async (page: number) => {
    setLoading(true);
    try {
      const data: ConversationsResponse = await getConversations(page);
      setConversations(data.conversations.data);
      setTotalPages(data.conversations.last_page);
      setTotalItems(data.conversations.total);
    } catch (error: any) {
      toast(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations(currentPage);
  }, [currentPage]);

  return { conversations, loading, totalPages, totalItems };
}
