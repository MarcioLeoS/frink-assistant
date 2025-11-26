import {
  MessageCircle,
  Ticket as TicketIcon,
  Bell,
  Smile,
  Activity as ActivityIcon,
  Folder as FolderIcon,
} from "lucide-react";

export type Tab =
  | "conversations"
  | "tickets"
  | "reminders"
  | "feedback"
  | "activity"
  | "files";

export const TAB_NAV: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "conversations", label: "Conversaciones", icon: MessageCircle },
  { id: "tickets", label: "Tickets", icon: TicketIcon },
  { id: "reminders", label: "Recordatorios", icon: Bell },
  { id: "feedback", label: "Feedback", icon: Smile },
  { id: "activity", label: "Actividad", icon: ActivityIcon },
  { id: "files", label: "Archivos", icon: FolderIcon },
];
