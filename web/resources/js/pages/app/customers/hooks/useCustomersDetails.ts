// hooks/useCustomersDetails.ts
import { useState, useEffect, use } from 'react';
import { toast } from 'sonner';
import { getCustomerDetails, getCustomerTimeline, getCustomerFeedback } from '@/services/customers/customers.api';
import { EventType, EventSubtype, TicketStatus, TicketUrgency } from '@/lib/enums';

export type Sentiment = 'positive' | 'negative' | 'unknown' | 'support' | 'marketing';
export type FeedbackMap = { [key: string]: number };

export interface Customer {
    id: number,
    name: string,
    email: string,
    phone_number: string,
    created_at: string,
    updated_at: string
}

export interface ChatContext {
    id: number,
    message_content: string,
    timestamp: string,
    role: string,
    sentiment: string,
    created_at: string,
    updated_at: string,
    customer_id: number,
    conversation_id: number
}

export interface Conversation {
    id: number;
    status: string;
    sentiment: Sentiment;
    updated_at: string;
    chat_contexts: ChatContext[];
}

export interface Ticket {
    id: number;
    status: string;
    urgency: string;
    type: string;
    description: string;
    resolution: string | null;
    created_at: string;
    resolved_at: string | null;
    chat_context: ChatContext;
}

export interface Reminder {
    id: number;
    content: string;
    remind_at: string;
    notified: boolean;
    description: string;
    observation: string;
    follow_up: {
        id: number;
        date: string;
        status: string;
        notes: string;
        awaiting_re: boolean;
    } | null;
}

export interface CustomerDetails {
    customer: Customer;
    conversations: { data: Conversation[] };
    supportTickets: { data: Ticket[] };
    marketingTickets: { data: Ticket[] };
    reminders: { data: Reminder[] };
}

export interface TimelineChatPayload {
    message: string;
    sentiment: string | null;
}

export interface TimelineFollowUpPayload {
    notes: string;
    awaiting_reschedule: number;
}

export interface TimelineReminderPayload {
    content: string;
    notified: number;
    description: string;
}

export interface TimelineTicketPayload {
    status: TicketStatus;
    urgency: TicketUrgency | null;
    problem_type?: string;
    problem_description?: string;
    resolution?: string | null;
}

export type TimelinePayload =
    | TimelineChatPayload
    | TimelineFollowUpPayload
    | TimelineReminderPayload
    | TimelineTicketPayload;

export interface TimelineItem {
    id: number;
    type: EventType;
    subtype: EventSubtype | '';
    occurred_at: string;
    payload: TimelinePayload;
}

export interface TimelineLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface CustomerTimeline {
    current_page: number;
    data: TimelineItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: TimelineLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export function useCustomersDetails(id: number) {
    const [details, setDetails] = useState<CustomerDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await getCustomerDetails(id);
                setDetails(data);
            } catch (e: any) {
                toast(e.message ?? 'Error cargando cliente');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    return { details, loading };
}

export function useCustomersTimeline(id: number) {
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [loading, setLoading] = useState(true); // carga inicial
    const [isLoadingMore, setIsLoadingMore] = useState(false); // carga por scroll
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Reset cuando cambia el id
    useEffect(() => {
        setTimeline([]);
        setPage(1);
        setHasMore(true);
        setLoading(true);
    }, [id]);

    // Cargar datos según la página
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getCustomerTimeline(id, page);

                setTimeline(prev => [...prev, ...res.data]);
                setHasMore(res.next_page_url !== null);
            } catch (e: any) {
                toast(e.message ?? 'Error cargando línea de tiempo');
                setHasMore(false);
            } finally {
                if (page === 1) {
                    setLoading(false);
                } else {
                    setIsLoadingMore(false);
                }
            }
        };

        if (page === 1) {
            setLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        fetchData();
    }, [id, page]);

    const loadMore = () => {
        if (!isLoadingMore && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    return {
        details: timeline,
        loading,
        isLoadingMore,
        hasMore,
        loadMore,
    };
}

export function useCustomersFeedback(id: number) {
    const [conversationFeedback, setConversationFeedback] = useState<FeedbackMap | null>(null);
    const [chatFeedback, setChatFeedback] = useState<FeedbackMap | null>(null);
    const [totals, setTotals] = useState<{ conversation: number; chat: number; } | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCustomerFeedback(id);
                setConversationFeedback(data.conversation);
                setChatFeedback(data.chat);
                setTotals(data.totals);

            } catch (e: any) {
                toast(e.message ?? 'Error cargando línea de tiempo');
            }
        }

        fetchData();
    }, [id]);

    return {
        conversationFeedback,
        chatFeedback,
        totals
    };
}
