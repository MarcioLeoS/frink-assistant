import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, SmilePlus, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react'

type ConversationFeedback = {
    [key: string]: number;
};

import { useCustomersFeedback } from '../hooks/useCustomersDetails'


export default function FeedbackModal({ id }: { id: number }) {
    const { conversationFeedback, chatFeedback, totals } = useCustomersFeedback(id) as {
        conversationFeedback: ConversationFeedback;
        chatFeedback: { [key: string]: number };
        totals: { [key: string]: number };
    };

    if (!conversationFeedback) {
        return null;
    }

    const sentimentLabels: { [key: string]: string } = {
        positive: 'Positivo',
        negative: 'Negativo',
        duda: 'Duda',
        support: 'Soporte',
        unknown: 'Desconocido',
        marketing: 'Marketing',
    };

    const sentimentLabels2: { [key: string]: string } = {
        messagePositive: 'Positivo',
        messageNegative: 'Negativo',
        messageDuda: 'Duda',
        messageSupport: 'Soporte',
        messageUnknown: 'Desconocido',
        messageMarketing: 'Marketing',
    };

    const sentimentLabelColors: { [key: string]: string } = {
        messagePositive: 'bg-emerald-400',
        messageNegative: 'bg-red-400',
        messageDuda: 'bg-yellow-400',
        messageSupport: 'bg-blue-400',
        messageUnknown: 'bg-gray-400',
        messageMarketing: 'bg-pink-400',
    };

    // Obtener el sentimiento con mayor porcentaje

    const maxKey = Object.entries(conversationFeedback)
        .reduce((max, entry) => entry[1] > max[1] ? entry : max);

    const maxSentimentLabel = maxKey;

    const [maxKey2, maxValue2] = Object.entries(chatFeedback)
        .reduce((max, entry) => entry[1] > max[1] ? entry : max);

    const maxSentimentLabel2 = sentimentLabels2[maxKey2] || maxKey2;
    const maxSentimentLabelColor = sentimentLabelColors[maxKey2] || 'bg-gray-400';

    return (
        // Modal siempre abierto
        <Dialog defaultOpen>
            <DialogContent className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl w-full">
                <DialogHeader>
                    <DialogTitle>Feedback del Cliente</DialogTitle>
                    <DialogDescription>
                        Resumen y detalles de los mensajes recibidos de este cliente.
                    </DialogDescription>
                </DialogHeader>

                {/* Resumen gráfico */}
                <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-white">Sentimiento en la última conversación</span>
                        <Badge className="bg-emerald-400 text-white">{maxSentimentLabel}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-white">Sus mensajes son: </span>
                        <Badge className={`text-white ${maxSentimentLabelColor}`}>Generalmente {maxSentimentLabel2} %{maxValue2}</Badge>
                    </div>
                    {/* Progress bar apilada para los mensajes */}
                    <div className="mt-6">
                        <span className="font-medium text-white">Distribución de mensajes</span>
                        <div className="w-full h-3 rounded bg-white/20 flex overflow-hidden mt-2">
                            {[
                                { key: 'messagePositive', color: 'bg-emerald-400' },
                                { key: 'messageNegative', color: 'bg-red-400' },
                                { key: 'messageDuda', color: 'bg-yellow-400' },
                                { key: 'messageSupport', color: 'bg-blue-400' },
                                { key: 'messageUnknown', color: 'bg-gray-400' },
                                { key: 'messageMarketing', color: 'bg-pink-400' },
                            ].map(type => (
                                chatFeedback[type.key] > 0 && (
                                    <div
                                        key={type.key}
                                        className={`${type.color} h-full`}
                                        style={{ width: `${chatFeedback[type.key]}%` }}
                                        title={`${type.key}: ${chatFeedback[type.key]}%`}
                                    />
                                )
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1 text-xs text-white/70">
                            {[
                                { key: 'messagePositive', label: 'Positivo', color: 'bg-emerald-400' },
                                { key: 'messageNegative', label: 'Negativo', color: 'bg-red-400' },
                                { key: 'messageDuda', label: 'Duda', color: 'bg-yellow-400' },
                                { key: 'messageSupport', label: 'Soporte', color: 'bg-blue-400' },
                                { key: 'messageUnknown', label: 'Desconocido', color: 'bg-gray-400' },
                                { key: 'messageMarketing', label: 'Marketing', color: 'bg-pink-400' },
                            ].map(type => (
                                chatFeedback[type.key] > 0 && (
                                    <span key={type.key} className="capitalize flex items-center gap-1">
                                        <span className={`inline-block w-3 h-3 rounded ${type.color}`}></span>
                                        {type.label}: {chatFeedback[type.key]}%
                                    </span>
                                )
                            ))}
                        </div>
                    </div>
                    {/* Finaliza progressbar */}
                </div>

                <Separator className="my-6" />

                {/* Tabs de detalle */}
                {/* <Tabs
                    value={tab}
                    onValueChange={(value: string) => setTab(value as TabKey)}
                    className="w-full"
                >
                    <TabsList>
                        <TabsTrigger value="conversations">
                            <MessageCircle className="mr-2 h-4 w-4" /> Conversaciones
                        </TabsTrigger>
                        <TabsTrigger value="tickets">
                            <SmilePlus className="mr-2 h-4 w-4" /> Tickets
                        </TabsTrigger>
                        <TabsTrigger value="reminders">
                            <Clock className="mr-2 h-4 w-4" /> Recordatorios
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="conversations" className="p-0 pt-4">
                        <ScrollArea className="h-48">
                            <ul className="space-y-3">
                                {feedbackData.conversations.map(fb => (
                                    <li key={fb.id} className="flex items-start gap-3">
                                        {fb.sentiment === 'positive' ? (
                                            <CheckCircle className="text-emerald-400 h-5 w-5" />
                                        ) : fb.sentiment === 'negative' ? (
                                            <XCircle className="text-red-400 h-5 w-5" />
                                        ) : (
                                            <AlertCircle className="text-yellow-400 h-5 w-5" />
                                        )}
                                        <p className="text-sm text-white/90">{fb.text}</p>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="tickets" className="p-0 pt-4">
                        <ScrollArea className="h-48">
                            <ul className="space-y-3">
                                {feedbackData.tickets.map(fb => (
                                    <li key={fb.id} className="flex items-start gap-3">
                                        {fb.sentiment === 'positive' ? (
                                            <CheckCircle className="text-emerald-400 h-5 w-5" />
                                        ) : fb.sentiment === 'negative' ? (
                                            <XCircle className="text-red-400 h-5 w-5" />
                                        ) : (
                                            <AlertCircle className="text-yellow-400 h-5 w-5" />
                                        )}
                                        <p className="flex-1 text-sm text-white/90">{fb.comment}</p>
                                        <Badge className="capitalize text-xs">{fb.type}</Badge>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="reminders" className="p-0 pt-4">
                        <ScrollArea className="h-48">
                            <ul className="space-y-3">
                                {feedbackData.reminders.map(fb => (
                                    <li key={fb.id} className="flex items-start gap-3">
                                        <Clock className="text-gray-400 h-5 w-5" />
                                        <p className="flex-1 text-sm text-white/90">{fb.note}</p>
                                        <Badge
                                            className={
                                                fb.status === 'done'
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-yellow-500 text-white'
                                            }
                                        >
                                            {fb.status === 'done' ? 'Realizado' : 'Pendiente'}
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                    </TabsContent>
                </Tabs> */}

                <DialogClose asChild>
                    <Button variant="ghost" className="mt-6 w-full">
                        Cerrar
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}