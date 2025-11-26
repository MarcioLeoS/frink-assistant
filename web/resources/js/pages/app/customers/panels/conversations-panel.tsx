import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Conversation } from '../hooks/useCustomersDetails'
import { fDate } from '@/pages/app/customers/utils/format'
import DrawerComponent from "@/components/ui/drawer-right";
import MessageCard from '../components/messages-card'

const FILTERS = ['Todas', 'Sin leer', 'Prioridad']

const SENTIMENT_META: Record<
  string,
  { icon: string; tint: string; iconBg: string }
> = {
  positive: { icon: '😊', tint: 'text-emerald-500', iconBg: 'bg-emerald-500/15' },
  negative: { icon: '😠', tint: 'text-rose-500', iconBg: 'bg-rose-500/15' },
  support: { icon: '🛠', tint: 'text-blue-500', iconBg: 'bg-blue-500/15' },
  marketing: { icon: '💼', tint: 'text-amber-500', iconBg: 'bg-amber-500/15' },
  unknown: { icon: '🤔', tint: 'text-zinc-500', iconBg: 'bg-zinc-500/15' },
}

interface Props {
  conversations: Conversation[]
}

export default function ConversationsPanel({ conversations }: Props) {
  const total = conversations.length
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const handleOpenDrawer = (conversationId: number) => {
    const conversation = conversations.find((conv) => conv.id === conversationId);
    if (conversation) {
      setSelectedConversation(conversation);
      setDrawerOpen(true);
    }
  };

  return (
    <div className="flex h-full flex-col p-4">
      {/* ─── Cabecera con título, botón, búsqueda y filtros ───── */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Conversaciones ({total})</h2>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Buscar conversaciones..."
            className="flex-1"
          />
          {FILTERS.map(f => (
            <Button key={f} size="sm" variant="ghost">
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* ─── Lista de conversaciones ───────────────────────────── */}
      <ScrollArea className="flex-1 custom-scroll">
        <ul className="space-y-3">
          {conversations.map(conv => {
            const meta = SENTIMENT_META[conv.sentiment] ?? SENTIMENT_META.unknown

            return (
              <li
                key={conv.id}
                className="group flex items-center rounded-lg bg-card/60 border border-border
                           p-4 transition hover:bg-card/50"
              >
                {/* icono con fondo suave */}
                <div
                  className={`mr-4 flex h-12 w-12 items-center justify-center
                              rounded-lg ${meta.iconBg}`}
                >
                  <span className={`text-2xl ${meta.tint}`}>{meta.icon}</span>
                </div>

                {/* info principal */}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-base font-medium">
                      {fDate(conv.updated_at, 'dd LLL yyyy • HH:mm')}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`px-2 py-1 text-xs font-medium ${meta.tint}`}
                    >
                      {conv.chat_contexts.length} msgs
                    </Badge>
                  </div>

                  {/* botón ver mensajes en lugar de preview */}
                  <div className="mt-2">
                    <Button className='cursor-pointer' onClick={() => handleOpenDrawer(conv.id)} size="sm" variant="outline">
                      Ver mensajes
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </ScrollArea>
      <DrawerComponent isDrawerOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        {selectedConversation && selectedConversation.chat_contexts.length > 0 ? (
          selectedConversation.chat_contexts.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))
        ) : (
          <p className="text-gray-400">No hay mensajes disponibles.</p>
        )}
      </DrawerComponent>
    </div>
  )
}
