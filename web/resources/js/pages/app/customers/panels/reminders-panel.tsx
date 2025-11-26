// panels/reminders-panel.tsx
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, ClockIcon, ChevronDownIcon } from 'lucide-react'
import { Reminder } from '../hooks/useCustomersDetails'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

interface Props {
  reminders: Reminder[]
}

export default function RemindersPanel({ reminders }: Props) {
  const upcoming = reminders
    .filter(r => !r.notified)
    .sort((a, b) =>
      new Date(a.remind_at).getTime() - new Date(b.remind_at).getTime()
    )

  return (
    <div className="flex h-full flex-col p-4">
      {/* Cabecera */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recordatorios</h2>
        <Button size="sm" variant="outline">
          + Nuevo
        </Button>
      </div>

      <ScrollArea className="flex-1 custom-scroll">
        {upcoming.length === 0 ? (
          <p className="text-center text-sm text-white/60">
            No hay recordatorios próximos
          </p>
        ) : (
          <Accordion type="single" collapsible className="space-y-3">
            {upcoming.map(r => {
              // Envolvemos follow_up en un array aunque sea un objeto
              const steps = r.follow_up
                ? Array.isArray(r.follow_up)
                  ? r.follow_up
                  : [r.follow_up]
                : []

              return (
                <AccordionItem
                  key={r.id}
                  value={r.id.toString()}
                  className="rounded-lg bg-white/[0.05] backdrop-blur-md"
                >
                  <AccordionTrigger className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-5 w-5 text-white/50" />
                      <span className="font-medium text-white">
                        {format(parseISO(r.remind_at), 'dd MMM yyyy • HH:mm', {
                          locale: es,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-xs">
                        {steps.length} pasos
                      </Badge>
                      <ChevronDownIcon className="h-4 w-4 text-white/50 transition-transform data-[state=open]:rotate-180" />
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="border-t border-white/10 px-4 pb-4 pt-2">
                    {steps.length > 0 ? (
                      <ol className="space-y-4">
                        {steps.map(fu => (
                          <li key={fu.id} className="flex items-start gap-3">
                            <ClockIcon
                              className={`mt-1 h-5 w-5 ${
                                fu.status === 'done'
                                  ? 'text-emerald-400'
                                  : 'text-sky-400'
                              }`}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-white">
                                  {format(parseISO(fu.date), 'dd MMM yyyy', {
                                    locale: es,
                                  })}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`text-[11px] ${
                                    fu.status === 'done'
                                      ? 'border-emerald-400 text-emerald-400'
                                      : 'border-sky-400 text-sky-400'
                                  }`}
                                >
                                  {fu.status === 'done'
                                    ? 'Realizado'
                                    : 'Pendiente'}
                                </Badge>
                              </div>
                              <p className="mt-1 text-sm text-white/70">
                                {fu.notes}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-sm text-white/60">Sin seguimientos</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        )}
      </ScrollArea>
    </div>
  )
}
