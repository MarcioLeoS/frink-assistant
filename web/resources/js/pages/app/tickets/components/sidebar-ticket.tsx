import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

import {
  Search, Clock, ChevronLeft, ChevronRight, Settings
} from "lucide-react"

import { Ticket } from "@/services/tickets/tickets.api"

import { useTickets } from "../hooks/useTickets"

interface SidebarTicketProps {
  onSelectTicket?: (ticket: any) => void;
  onTicketsFetched?: (tickets: Ticket[]) => void
  refreshKey: number;
}

export default function SidebarTicket({ onSelectTicket, onTicketsFetched, refreshKey }: SidebarTicketProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [query, setQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [order, setOrder] = useState<"recientes" | "urgencia">("recientes")
  const [perPage, setPerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [selected, setSelected] = useState<Ticket | null>(null);


  // Mapping Spanish labels to English, lowercase for API
  const statusMap: Record<string, string> = {
    Abierto: "open",
    Cerrado: "closed",
    Pendiente: "in_progress",
    Todos: "",
  }
  const priorityMap: Record<string, string> = {
    Urgente: "urgent",
    Alta: "high",
    Media: "medium",
    Baja: "low",
  }

  const engStatus = statusFilter ? statusMap[statusFilter] : ""
  const engPriority = priorityFilter ? priorityMap[priorityFilter] : ""

  // Pass English status and priority into hook for server-side filtering
  const { tickets, loading, totalPages } = useTickets(
    currentPage,
    perPage,
    engStatus,
    engPriority,
    refreshKey
  )

  useEffect(() => {
    onTicketsFetched?.(tickets);
  }, [tickets]);


  function getColorByPriority(priority: string) {
    switch (priority) {
      case "high": return "red"
      case "medium": return "orange"
      case "low": return "green"
      default: return "slate"
    }
  }

  const urgencyBadgeClasses: Record<string, string> = {
    high: "bg-red-500/30 text-red-100 border-red-500/30",
    medium: "bg-orange-500/30 text-orange-100 border-orange-500/30",
    low: "bg-green-500/30 text-green-100 border-green-500/30",
    urgent: "bg-pink-500/30 text-pink-100 border-pink-500/30",
    default: "bg-slate-500/30 text-slate-100 border-slate-500/30",
  };

  const urgencyOrder: Record<string, number> = {
    Urgente: 1,
    Alta: 2,
    Media: 3,
    Baja: 4,
  }

  // Local filtering and ordering before display
  const filtered = tickets.filter(t => {
    const matchesQuery = t.problem_description.toLowerCase().includes(query.toLowerCase())
    const matchesPriority = !priorityFilter || t.urgency === engPriority
    const matchesStatus = !statusFilter || engStatus === "" || t.status === engStatus
    return matchesQuery && matchesPriority && matchesStatus
  })

  const ordered = order === "urgencia"
    ? [...filtered].sort((a, b) => {
      const aValue = urgencyOrder[a.urgency] ?? 99
      const bValue = urgencyOrder[b.urgency] ?? 99
      return aValue - bValue
    })
    : filtered

  return (
    <div className="w-80 bg-transparent flex flex-col p-4">
      <div className="p-6 border border-white/10 bg-gradient-to-r rounded-3xl">
        <h2 className="text-xl font-bold text-white mb-4 tracking-tight">Tickets</h2>
        <div className="relative group mb-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <Input
            placeholder="Buscar tickets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-stone-800/50 border-stone-700/50 text-white placeholder-stone-400"
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="cursor-pointer mt-1 w-full flex items-center gap-2 text-stone-300 hover:text-white">
              <Settings className="w-4 h-4" />
              Configurar vista
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-stone-900 border border-stone-700">
            <DialogHeader>
              <DialogTitle className="text-white">Configuración de vista</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2 text-sm text-white">
              <div>
                <label className="block mb-1 text-stone-300">Tickets por página</label>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(parseInt(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="w-full bg-stone-800 border border-stone-600 text-white rounded px-2 py-1"
                >
                  {[5, 10, 15, 20].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-stone-300">Ordenar por</label>
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value as "recientes" | "urgencia")}
                  className="w-full bg-stone-800 border border-stone-600 text-white rounded px-2 py-1"
                >
                  <option value="recientes">Más reciente</option>
                  <option value="urgencia">Urgencia</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-stone-300">Filtrar por estado</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(statusMap).map(([label, eng]) => (
                    <Badge
                      key={eng}
                      onClick={() => {
                        setStatusFilter(prev => prev === label ? null : label)
                        setCurrentPage(1)
                      }}
                      className={`cursor-pointer ${engStatus === eng ? "bg-white/20 text-white" : "bg-stone-700/40 text-stone-300"}`}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1 overflow-auto border border-white/10 rounded-3xl mt-4 max-h-[calc(100vh-280px)]">
        <div className="p-3 space-y-2">
          {ordered.map((ticket) => (
            <Button key={ticket.id} onClick={() => {
              setSelectedTicket(ticket);
              if (onSelectTicket) onSelectTicket(ticket);
            }} variant="ghost" className={
              `w-full cursor-pointer p-4 h-auto justify-start` +
              (selectedTicket && ticket.id === selectedTicket.id ? ' bg-stone-800/40' : 'hover:bg-stone-800/40')
            }>
              <div className="flex flex-col items-start w-full space-y-3">
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold text-stone-300">TK-{ticket.id}</span>
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-sm font-medium text-left line-clamp-2 text-stone-200">
                  {ticket.problem_type || "(Untitled)"}
                </h3>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-stone-400">{ticket.customer.name}</span>
                  <Badge className={`text-xs ${urgencyBadgeClasses[ticket.urgency] || urgencyBadgeClasses.default}`}>
                    {ticket.urgency}
                  </Badge>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-stone-500">{new Date(ticket.created_at).toLocaleString()}</span>
                  <div className={`w-2 h-2 rounded-full bg-${getColorByPriority(ticket.urgency)}-400 animate-pulse`} />
                </div>
              </div>
            </Button>
          ))}
          {!loading && ordered.length === 0 && (
            <p className="text-sm text-stone-400 text-center py-6">No hay tickets</p>
          )}
        </div>
      </ScrollArea >

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-2 text-sm text-white px-2">
          <Button variant="ghost" className="cursor-pointer" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs">Pag {currentPage} de {totalPages}</span>
          <Button variant="ghost" className="cursor-pointer" size="sm" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )
      }
    </div >
  )
}