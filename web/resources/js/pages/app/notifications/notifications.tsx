/* resources/js/Pages/Notifications/Index.tsx ----------------------------- */
import React from 'react'
import AppLayout from '@/layouts/app-layout'
import type { BreadcrumbItem } from '@/types'
import { Head, router } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Loader from '@/components/ui/loader'
import { cn } from '@/lib/utils'
import { getNotifications, markNotificationAsRead } from '@/services/notifications/notifications.api'
import { Bell, CheckCircle, AlertCircle, Info, AlertTriangle, ExternalLink, Eye, Trash2 } from 'lucide-react'

/* ▸ Migas de pan --------------------------------------------------------- */
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Notificaciones', href: '/notifications' },
]

/* ▸ Tipos ---------------------------------------------------------------- */
type Level = 'info' | 'success' | 'warning' | 'error'

type Notification = {
  id: number
  title: string
  body: string
  level: Level
  viewed: boolean
  link?: string
  created_at: string
}

/* ▸ Helpers de estilo ---------------------------------------------------- */
const levelConfig = {
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
  success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/20' },
  error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/20' }
}

const formatTime = (date: string) => {
  const now = new Date()
  const notificationDate = new Date(date)
  const diffInHours = (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) return 'Ahora'
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h`
  return notificationDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

/* ▸ Página --------------------------------------------------------------- */
export default function Notifications() {
  const [list, setList] = React.useState<Notification[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)
    getNotifications()
      .then(res => {
        setList(
          res.notifications.map((n: any) => ({
            id: n.id,
            title: n.title,
            body: n.message,
            level: n.type,
            viewed: n.read,
            link: n.redirect_url,
            created_at: n.created_at,
          }))
        )
      })
      .finally(() => setLoading(false))
  }, [])

  const markRead = async (id: number) => {
    await markNotificationAsRead(id)
    setList(prev => prev.map(n => (n.id === id ? { ...n, viewed: true } : n)))
  }

  const deleteNotification = (id: number) =>
    setList((prev) => prev.filter((n) => n.id !== id))

  const unreadCount = list.filter(n => !n.viewed).length

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notificaciones" />

      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        {/* Header compacto */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs h-5 px-2">
                {unreadCount}
              </Badge>
            )} */}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setList(prev => prev.map(n => ({ ...n, viewed: true })))}
              className="h-8 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Marcar todas
            </Button>
          )}
        </div>

        {/* Lista compacta */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No hay notificaciones</p>
          </div>
        ) : (
          <div className="space-y-2">
            {list.map((n) => {
              const config = levelConfig[n.level]
              const IconComponent = config.icon

              return (
                <Card
                  key={n.id}
                  className={cn(
                    'transition-all duration-200 hover:shadow-sm cursor-pointer py-0',
                    !n.viewed && '',
                    n.viewed && 'opacity-70 hover:opacity-100'
                  )}
                  onClick={() => !n.viewed && markRead(n.id)}
                >
                  <CardContent className="p-2 pb-1">
                    <div className="flex items-start gap-3">
                      <div className={cn('p-1 rounded-full flex-shrink-0', config.bg)}>
                        <IconComponent className={cn('h-3 w-3', config.color)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium truncate">
                                {n.title}
                              </h3>
                              {!n.viewed && (
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-0.5">
                              {n.body}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatTime(n.created_at)}
                              </span>
                              {n.link && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.visit(n.link!)
                                  }}
                                  className="h-6 px-2 text-xs"
                                >
                                  Ver
                                </Button>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(n.id)
                            }}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}