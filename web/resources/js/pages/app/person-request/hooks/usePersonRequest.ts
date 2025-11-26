import { useEffect, useState, useCallback } from "react";
import { getRequests, RealPersonRequest, RealPersonRequestQuery } from "@/services/person-request/person-request.api";
import { toast } from "sonner";

interface RequestsResponse {
    data: RealPersonRequest[];
    last_page: number;
    total: number;
}

export function usePersonRequest(query: RealPersonRequestQuery) {
    const [requests, setRequests] = useState<RealPersonRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data: RequestsResponse = await getRequests(query);
            setRequests(data.data);
            setTotalPages(data.last_page);
            setTotalItems(data.total);
        } catch (e) {
            toast("Error al obtener datos" + (e as Error).message);
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(query)]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { requests, loading, totalPages, totalItems, refetch: fetchData };
}