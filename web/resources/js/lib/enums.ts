/* ----------------------------------------------------------------------------
 *  ENUMS / TYPES
 * ------------------------------------------------------------------------- */

export const EVENT_TYPES = ['conversation', 'ticket', 'reminder', 'follow_up'] as const;
export const EVENT_SUBTYPES = ['assistant', 'user', 'support', 'marketing', 'pending'] as const;
export const TICKET_STATUS = ['open', 'in_progress', 'resolved', 'closed'] as const;
export const TICKET_URGENCY = ['low', 'medium', 'high'] as const;
export const REMINDER_NOTIFIED = [0, 1] as const;
export const CONVERSATION_STAT = ['active', 'closed', 'escalated'] as const;
export const SENTIMENTS = ['positive', 'negative', 'duda', 'support', 'unknown'] as const;

// → Uniones literales derivadas automáticamente
export type EventType = (typeof EVENT_TYPES)[number];        // 'chat' | 'ticket' | …
export type EventSubtype = (typeof EVENT_SUBTYPES)[number];
export type TicketStatus = (typeof TICKET_STATUS)[number];
export type TicketUrgency = (typeof TICKET_URGENCY)[number];
export type ReminderNotified = (typeof REMINDER_NOTIFIED)[number];
export type ConversationStatus = (typeof CONVERSATION_STAT)[number];
export type Sentiment = (typeof SENTIMENTS)[number];
