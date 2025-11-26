// resources/js/Services/conversations.api.ts
import { BASE_URL } from "../../config/env";

export interface Customer {
    id: number;
    name: string;
    phone_number: string;
}

export interface ChatContext {
    id: number;
    message_content: string;
    timestamp: string;
    role: string;
    sentiment?: string | null;
}

export interface Conversation {
    id: number;
    customer: Customer;
    sentiment: string;
    status: string;
    updated_at: string;
    chat_contexts: ChatContext[];
}

export interface ConversationsResponse {
    conversations: {
        data: Conversation[];
        last_page: number;
        total: number;
    };
}

/** Fetches conversations data for a given page */
export async function getConversations(page: number): Promise<ConversationsResponse> {
    const res = await fetch(`${BASE_URL}/conversations/getData?page=${page}`);
    if (!res.ok) {
        throw new Error("Error fetching conversations");
    }
    return await res.json();
}
