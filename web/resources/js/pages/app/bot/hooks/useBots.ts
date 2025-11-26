// resources/js/hooks/useBots.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getBots,
  createBot,
  getBot,
  updateBot,
  deleteBot,
  forceDeleteBot,
  BotConfig,
  BotsResponse,
  restoreBot
} from "@/services/bots/bots.api";

export function useBots(
  page: number,
  perPage: number,
  search?: string,
  sortBy?: string,
  orderBy?: "asc" | "desc",
  botType?: string,
  userId?: number,
  refreshKey?: number
) {
  const [bots, setBots] = useState<BotConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data: BotsResponse = await getBots(
        page,
        perPage,
        search,
        sortBy,
        orderBy,
        botType,
        userId
      );
      setBots(data.data);
      setTotalPages(data.last_page);
      setTotalItems(data.total);
    } catch (err: any) {
      toast(err.message || "Failed to fetch bots");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, search, sortBy, orderBy, botType, userId]);

  useEffect(() => {
    fetch();
  }, [fetch, refreshKey]);

  return { bots, loading, totalPages, totalItems, refetch: fetch };
}

export function useCreateBot() {
  const [loading, setLoading] = useState(false);

  const mutate = async (data: Omit<BotConfig, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'user'>) => {
    setLoading(true);
    try {
      const bot = await createBot(data);
      toast.success("Bot creado correctamente");
      return bot;
    } catch (err: any) {
      toast.error(err.message || "Failed to create bot");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createBot: mutate, loading };
}

export function useBot(id: number, refreshKey?: number) {
  const [bot, setBot] = useState<BotConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBot(id);
      setBot(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch bot");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch, refreshKey]);

  return { bot, loading, refetch: fetch };
}

export function useUpdateBot() {
  const [loading, setLoading] = useState(false);

  const mutate = async (
    id: number,
    data: Partial<Omit<BotConfig, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'user'>>
  ) => {
    setLoading(true);
    try {
      const updated = await updateBot(id, data);
      toast.success("Bot actualizado correctamente");
      return updated;
    } catch (err: any) {
      toast.error(err.message || "Failed to update bot");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateBot: mutate, loading };
}

export function useDeleteBot() {
  const [loading, setLoading] = useState(false);

  const mutate = async (id: number) => {
    setLoading(true);
    try {
      await deleteBot(id);
      toast.success("Bot eliminado correctamente");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete bot");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteBot: mutate, loading };
}

export function useForceDeleteBot() {
  const [loading, setLoading] = useState(false);

  const mutate = async (id: number) => {
    setLoading(true);
    try {
      await forceDeleteBot(id);
      toast.success("Bot permanently deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to permanently delete bot");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { forceDeleteBot: mutate, loading };
}

export function useRestoreBot() {
  const [loading, setLoading] = useState(false);

  const mutate = async (id: number) => {
    setLoading(true);
    try {
      await restoreBot(id);
      toast.success('Bot restored');
    } catch (err: any) {
      toast.error(err.message || 'Failed to restore bot');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { restoreBot: mutate, loading };
}