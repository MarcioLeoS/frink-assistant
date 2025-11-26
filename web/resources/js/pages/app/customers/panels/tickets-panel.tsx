import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SearchIcon, ChevronRightIcon, HelpCircle, Briefcase } from 'lucide-react'
import { Ticket } from '../hooks/useCustomersDetails'
import { fDate } from '@/pages/app/customers/utils/format'
import DrawerComponent from "@/components/ui/drawer-right";
import TicketComponent from '@/components/ui/ticket'

interface Props {
  support: Ticket[]
  marketing: Ticket[]
}

type ViewTab = 'support' | 'marketing'
type Status = 'all' | 'open' | 'pending' | 'resolved' | 'closed'

// Estado ↔ color semántico
const STATUS_COLORS: Record<Status, string> = {
  all: 'border-gray-500 text-gray-500',
  open: 'border-blue-500 text-blue-500',
  pending: 'border-yellow-500 text-yellow-500',
  resolved: 'border-green-500 text-green-500',
  closed: 'border-red-500 text-red-500',
}

// Tipo ↔ icono + color de borde
const TYPE_META: Record<ViewTab, { icon: React.ReactNode; color: string }> = {
  support: { icon: <HelpCircle className="h-5 w-5" />, color: 'border-blue-500' },
  marketing: { icon: <Briefcase className="h-5 w-5" />, color: 'border-emerald-500' },
}

export default function TicketsPanel({ support, marketing }: Props) {
  const [activeTab, setActiveTab] = useState<ViewTab>('support')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status>('all')
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket>();


  const handleOpenDrawer = (ticket: Ticket) => {
    if (ticket) {
      setSelectedTicket(ticket);
      setDrawerOpen(true);
    }
  };

  const data = activeTab === 'support' ? support : marketing
  const filtered = data.filter(t => {
    const matchText = t.description.toLowerCase().includes(query.toLowerCase())
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    return matchText && matchStatus
  })

  return (
    <div className="flex h-full flex-col p-4">
      {/* Header & filtros */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          <Input
            placeholder="Buscar tickets..."
            className="pl-10"
            value={query}
            onChange={e => setQuery(e.currentTarget.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={value => setStatusFilter(value as Status)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="open">Abierto</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="resolved">Resuelto</SelectItem>
            <SelectItem value="closed">Cerrado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ViewTab)}
        className="mb-4"
      >
        <TabsList>
          <TabsTrigger value="support">Soporte ({support.length})</TabsTrigger>
          <TabsTrigger value="marketing">Marketing ({marketing.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Listado */}
      <ScrollArea className="flex-1 custom-scroll">
        <ul className="space-y-2">
          {filtered.length ? filtered.map(t => {
            const meta = TYPE_META[activeTab]
            const statusClass = STATUS_COLORS[t.status as Status]
            return (
              <li key={t.id}>
                <Card className="group grid grid-cols-[4px_1fr_auto] overflow-hidden rounded-2xl shadow-sm transition hover:shadow-lg p-4">
                  {/* Acento lateral */}
                  <div className={`col-start-1 group-hover:${meta.color} bg-transparent`} />

                  {/* Contenido */}
                  <CardContent className="col-start-2 flex items-center gap-3">
                    <div className={`${meta.color} text-current mb-8`}>{meta.icon}</div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <p className="text-sm font-semibold text-white truncate">
                        <span className='mr-1'>  #{t.id} </span> {t.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-white/50">
                        <span>{fDate(t.created_at, 'dd MMM yyyy')}</span>
                        <Badge variant="outline" className={`${statusClass} capitalize`}>
                          {t.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>

                  {/* Acción */}
                  <div className="col-start-3 flex flex-col items-center justify-center p-4">
                    <Button onClick={() => handleOpenDrawer(t)} className='rounded-full cursor-pointer' size="icon" variant="ghost">
                      <ChevronRightIcon className="h-4 w-4 text-white/60 group-hover:text-white" />
                    </Button>
                  </div>
                </Card>
              </li>
            )
          }) : (
            <p className="p-4 text-center text-sm text-white/60">No hay tickets para mostrar</p>
          )}
        </ul>
      </ScrollArea>
      <DrawerComponent isDrawerOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        {selectedTicket && (
          <>
            {/* TicketComponent con información principal */}
            <TicketComponent title={selectedTicket.type} status={selectedTicket.status}>
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
                  <span className="font-medium text-gray-700 dark:text-gray-100 text-right">{selectedTicket.resolution || 'Pendiente'}</span>
                </div>
                <div className="flex justify-between space-x-1">
                  <span className="italic">Creado el:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-100 text-right">{fDate(selectedTicket.created_at, 'dd MMM yyyy')}</span>
                </div>
                <div className="flex justify-between space-x-1">
                  <span className="italic">Resuelto el:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-100 text-right">{selectedTicket.resolved_at ? fDate(selectedTicket.resolved_at, 'dd MMM yyyy') : 'No resuelto'}</span>
                </div>
              </div>
            </TicketComponent>

            {/* Descripción fuera del TicketComponent */}
            <div className="mt-4 p-4 border rounded-lg max-w-96 mx-auto">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Descripción</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{selectedTicket.description}</p>
            </div>

            {/* Botón para ir a la pestaña del ticket */}
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() => {
                  setActiveTab(selectedTicket.type === 'support' ? 'support' : 'marketing');
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

    </div>
  )
}
