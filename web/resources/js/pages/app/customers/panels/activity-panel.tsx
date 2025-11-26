import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton';
import DrawerComponent from '@/components/ui/drawer-right';
import TicketComponent from '@/components/ui/ticket';

import {
    MessageSquare,
    ClipboardList,
    Bell,
    Repeat,
    Bot,
    User,
    Headphones,
    Megaphone,
    AlertCircle,
    Clock,
    CheckCircle,
    XCircle,
    Pin,
    Paperclip,
    FileText,
    ImageIcon,
    GitMerge,
    Type,
    CalendarX2,
    ChevronRightIcon
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { fDate } from '@/pages/app/customers/utils/format'

import type {
    EventType,
    EventSubtype,
    TicketStatus,
    TicketUrgency,
    ReminderNotified
} from '@/lib/enums';

import {
    useCustomersTimeline,
    TimelineItem as TimelineItemType,
} from '../hooks/useCustomersDetails';

type ViewTab = 'support' | 'marketing'
type Status = 'all' | 'open' | 'pending' | 'resolved' | 'closed'

interface Ticket {
    id: number;
    created_at: string;
    status: string;
    urgency: string;
    problem_type: string;
    problem_description: string;
    subtype: string;
}

/* --------------------------------------------------------------------------
 *  ICONOS + COLORES  (sin archivo aparte)
 * ------------------------------------------------------------------------*/

const eventTypeIcon: Record<EventType, LucideIcon> = {
    conversation: MessageSquare,
    ticket: ClipboardList,
    reminder: Bell,
    follow_up: Repeat,
};

const eventTypeColor: Record<EventType, string> = {
    conversation: 'bg-blue-500',
    ticket: 'bg-yellow-500',
    reminder: 'bg-teal-500',
    follow_up: 'bg-indigo-500',
};

const eventSubtypeIcon: Record<EventSubtype, LucideIcon> = {
    assistant: Bot,
    user: User,
    support: Headphones,
    marketing: Megaphone,
    pending: Clock,
};

const ticketStatusIcon: Record<TicketStatus, LucideIcon> = {
    open: AlertCircle,
    in_progress: Clock,
    resolved: CheckCircle,
    closed: XCircle,
};

const ticketUrgencyColor: Record<TicketUrgency, string> = {
    low: 'text-green-500 border-green-500',
    medium: 'text-yellow-500 border-yellow-500',
    high: 'text-red-500 border-red-500',
};

const reminderNotifiedColor: Record<ReminderNotified, string> = {
    1: 'text-green-500 border-green-500',
    0: 'text-blue-500 border-blue-500',
}

function TimelineItem({ event }: { event: TimelineItemType }) {
    const [statusFilter, setStatusFilter] = useState<Status>('all')
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket>();
    const [activeTab, setActiveTab] = useState<ViewTab>('support')

    const TypeIcon = eventTypeIcon[event.type as EventType];
    const SubtypeIcon = eventSubtypeIcon[event.subtype as EventSubtype];
    const dotBg = eventTypeColor[event.type as EventType];

    const status: TicketStatus | undefined = event.type === 'ticket' ? (event.payload as any).status : undefined;
    const urgency: TicketUrgency | undefined = event.type === 'ticket' ? (event.payload as any).urgency : undefined;

    const StatusIcon = status ? ticketStatusIcon[status] : undefined;
    const urgencyColor = urgency ? ticketUrgencyColor[urgency] : undefined;

    const handleOpenDrawer = (ticket: Ticket, id: number, occurred_at: string) => {
        ticket = event.payload as Ticket;
        ticket.id = id;
        ticket.created_at = occurred_at;
        if (ticket) {
            setSelectedTicket(ticket);
            setDrawerOpen(true);
        }
    };


    if (event.type === 'ticket') {
        const ticket = {
            ...(event.payload as Ticket),
            id: event.id,
            created_at: event.occurred_at,
        };

        return (
            <li className="mb-10 ml-4">
                <span className={`absolute -left-4 mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 ${dotBg}`}>
                    <TypeIcon className="h-6 w-6 text-white" />
                </span>
                <p className="text-sm text-white">
                    <span className='capitalize'>{event.type} </span>
                    {'status' in event.payload && (
                        <span className="text-blue-400">#{event.payload.status}</span>
                    )}
                </p>
                <p className="mt-1 text-xs text-white/50">
                    {event.occurred_at}
                </p>
                <div className="mt-4 space-y-2">
                    {/* Task 1 */}
                    <Card className="bg-transparent backdrop-blur-md">
                        <CardContent className="flex items-center justify-between p-3">
                            {'problem_description' in event.payload && (
                                <span className="text-sm text-white">{event.payload.problem_description}</span>
                            )}
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={`text-xs ${urgencyColor}`}>
                                    {urgency}
                                </Badge>
                                <Button onClick={() => handleOpenDrawer(ticket, event.id, event.occurred_at)} className='rounded-full cursor-pointer' size="icon" variant="ghost">
                                    <ChevronRightIcon className="h-4 w-4 text-white/60 group-hover:text-white" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <DrawerComponent isDrawerOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
                    {selectedTicket && (
                        <>
                            {/* TicketComponent con información principal */}
                            <TicketComponent title={selectedTicket.problem_type} status={selectedTicket.status}>
                                <div className="space-y-2">
                                    <div className="flex justify-between space-x-1">
                                        <span className="italic">ID:</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-100 text-right">{selectedTicket.id}</span>
                                    </div>
                                    <div className="flex justify-between space-x-1">
                                        <span className="italic">Estado:</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-100 text-right capitalize">{selectedTicket.status}</span>
                                    </div>
                                    <div className="flex justify-between space-x-1">
                                        <span className="italic">Urgencia:</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-100 text-right capitalize">{selectedTicket.urgency}</span>
                                    </div>
                                    <div className="flex justify-between space-x-1">
                                        <span className="italic">Resolución:</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-100 text-right">{selectedTicket.status || 'Pendiente'}</span>
                                    </div>
                                    <div className="flex justify-between space-x-1">
                                        <span className="italic">Creado el:</span>
                                        <span className="font-medium text-gray-700 dark:text-gray-100 text-right">{selectedTicket.created_at}</span>
                                    </div>
                                </div>
                            </TicketComponent>

                            {/* Descripción fuera del TicketComponent */}
                            <div className="mt-4 p-4 border rounded-lg max-w-96 mx-auto">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Descripción</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedTicket.problem_description}</p>
                            </div>

                            {/* Botón para ir a la pestaña del ticket */}
                            <div className="mt-4 flex justify-center">
                                <Button
                                    onClick={() => {
                                        setActiveTab(selectedTicket.subtype === 'support' ? 'support' : 'marketing');
                                        setDrawerOpen(false);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                                >
                                    Ir a la pestaña del ticket
                                </Button>
                            </div>
                        </>
                    )}
                </DrawerComponent>
            </li>
        )
    }
    else if (event.type === 'conversation') {
        return (
            <li className="mb-10 ml-4">
                <span className={`absolute -left-4 mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 ${dotBg}`}>
                    <TypeIcon className="h-6 w-6 text-white" />
                </span>
                <h3 className="text-lg font-semibold text-white">
                    Cliente inició la conversación
                </h3>
                <p className="mt-1 text-xs text-white/50">
                    {event.occurred_at}
                </p>
                <div className="mt-4 flex space-x-3 overflow-x-auto">
                    <div className="flex items-center gap-2 rounded-lg bg-white/[0.05] p-2">
                        <FileText className="h-5 w-5 text-white/50" />
                        <div className="text-xs text-white">
                            Finance KPI App <span className="text-white/60">90 mb</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/[0.05] p-2">
                        <FileText className="h-5 w-5 text-white/50" />
                        <div className="text-xs text-white">
                            CSS File Yoga App <span className="text-white/60">90 mb</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/[0.05] p-2">
                        <ImageIcon className="h-5 w-5 text-white/50" />
                        <div className="text-xs text-white">
                            All JPGs From Yoga App <span className="text-white/60">90 mb</span>
                        </div>
                    </div>
                </div>
            </li>
        )
    }
    else if (event.type === 'reminder') {
        const notifiedValue =
            'notified' in event.payload ? event.payload.notified : undefined;
        const notifiedColor =
            typeof notifiedValue === 'number'
                ? reminderNotifiedColor[notifiedValue as ReminderNotified]
                : '';

        return (
            <li className="mb-10 ml-4">
                <span className={`absolute -left-4 mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 ${dotBg}`}>
                    <TypeIcon className="h-6 w-6 text-white" />
                </span>
                <p className="text-sm text-white">
                    <span className='capitalize'>{event.type} </span>
                    {'status' in event.payload && (
                        <span className="text-blue-400">#{event.payload.status}</span>
                    )}
                </p>
                <p className="mt-1 text-xs text-white/50">
                    {event.occurred_at}
                </p>
                <div className="mt-4 space-y-2">
                    {/* Task 1 */}
                    <Card className="bg-transparent backdrop-blur-md">
                        <CardContent className="flex items-center justify-between p-3">
                            {'content' in event.payload && (
                                <span className="text-sm text-white">{event.payload.content}</span>
                            )}
                            <div className="flex items-center gap-2">
                                {'notified' in event.payload && (
                                    <Badge variant="outline" className={`text-xs ${notifiedColor}`}>
                                        <span>{event.payload.notified ? 'notificado' : 'pendiente'}</span>
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </li>
        )
    }
}


export default function ActivityPanel({ id }: { id: number }) {
    const { details: timelineData, loading, hasMore, isLoadingMore, loadMore } = useCustomersTimeline(id);
    const sentinelRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                loadMore()
            }
        });

        const sentinel = sentinelRef.current;
        if (sentinel) observer.observe(sentinel)

        return () => {
            if (sentinel) observer.unobserve(sentinel);
        }
    }, [hasMore, loading, loadMore])

    return (
        <div className="h-full p-4 custom-scroll">
            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-lg" />
                    ))}
                </div>
            ) : (
                <ol className="relative border-l-1 border-white/20 pl-6 ml-3">
                    {timelineData.length === 0 && (
                        <p className="text-center text-muted-foreground">Sin actividad.</p>
                    )}
                    {timelineData.map((event, key) => (
                        <TimelineItem key={`${event.type}-${event.id}`} event={event} />
                    ))}

                    {/* Sentinel para scroll infinito */}
                    <div ref={sentinelRef} className="h-6" />

                    {/* Cargando más... */}
                    {isLoadingMore && (
                        <div className="space-y-3 mt-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full rounded-lg" />
                            ))}
                        </div>
                    )}

                    <li key="last-event" className="mb-10 ml-4">
                        <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 mt-16">
                            <CalendarX2 className="h-6 w-6 text-white" />
                        </span>
                        <h3 className="text-lg font-semibold text-white">
                            Fin de la actividad del cliente
                        </h3>
                        <div className="mt-4 flex space-x-3 overflow-x-auto">
                            <div className="flex items-center gap-2 rounded-lg bg-white/[0.05] p-2">
                                <FileText className="h-5 w-5 text-white/50" />
                                <div className="text-xs text-white">
                                    Finance KPI App <span className="text-white/60">90 mb</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg bg-white/[0.05] p-2">
                                <FileText className="h-5 w-5 text-white/50" />
                                <div className="text-xs text-white">
                                    CSS File Yoga App <span className="text-white/60">90 mb</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg bg-white/[0.05] p-2">
                                <ImageIcon className="h-5 w-5 text-white/50" />
                                <div className="text-xs text-white">
                                    All JPGs From Yoga App <span className="text-white/60">90 mb</span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ol>
            )}
        </div>
    )
}
