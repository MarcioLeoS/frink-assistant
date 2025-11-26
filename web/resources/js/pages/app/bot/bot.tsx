// resources/js/Pages/Bot/Dashboard.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { useBots, useDeleteBot, useForceDeleteBot, useRestoreBot } from './hooks/useBots';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';
import { ClipboardPlus, Edit2, Trash2, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BASE_URL } from '@/config/env';
import Table from '@/components/ui/table';
import CreateBotModal from './components/create-bot-config';
import EditBotModal from './components/edit-bot-modal';
import ConfirmDialog from './components/confirm-dialog';
import FileUpload from './components/file-upload';

/* --------------------------------------------------------------------- */
/* Types & constants                                                     */
/* --------------------------------------------------------------------- */
type Provider = {
  id: 'openai' | 'gemini' | 'claude';
  name: string;
  description: string;
  icon: string;
  active: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Bot', href: '/bot' }];

const PROVIDERS: Provider[] = [
  { id: 'openai', name: 'OpenAI', description: '…', icon: BASE_URL + '/icons/openai_dark.svg', active: true },
  { id: 'gemini', name: 'Google AI', description: '…', icon: BASE_URL + '/icons/gemini.svg', active: true },
  { id: 'claude', name: 'Anthropic', description: '…', icon: BASE_URL + '/icons/claude-ai-icon.svg', active: false },
];

/* --------------------------------------------------------------------- */
/* Helper                                                                */
/* --------------------------------------------------------------------- */
function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]!)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/* --------------------------------------------------------------------- */
/* Component                                                             */
/* --------------------------------------------------------------------- */
export default function Dashboard() {
  const [openPromptId, setOpenPromptId] = useState<number | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<Provider['id']>('openai');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const { bots = [], loading, totalPages, refetch } = useBots(page, perPage);
  const { deleteBot, loading: deleting } = useDeleteBot();
  const { forceDeleteBot, loading: forcing } = useForceDeleteBot();
  const { restoreBot, loading: restoring } = useRestoreBot();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Bot" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 lg:py-4 2xl:max-w-6xl w-full mx-auto">
        {/* Bots */}
        <h2 className="text-white text-xl font-bold mb-2">Bots</h2>
        <div className="ml-auto">
          <CreateBotModal onCreated={refetch}>
            <Button variant="outline">Crear</Button>
          </CreateBotModal>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-left">
              <th className="py-2 px-2 w-10" />
              <th className="py-2 px-2">Nombre</th>
              <th className="py-2 px-2">Tipo</th>
              <th className="py-2 px-2">Propietario</th>
              <th className="py-2 px-2" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="border-b border-neutral-800">
                <td colSpan={5} className="px-4 py-2 text-center">
                  Cargando…
                </td>
              </tr>
            ) : bots.length > 0 ? (
              bots.map((bot) => (
                <tr key={bot.id} className="border-b border-neutral-800 hover:bg-neutral-800/40">
                  {/* Avatar */}
                  <td className="py-4 px-2">
                    <span
                      aria-hidden
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-xs font-semibold text-neutral-200"
                    >
                      {getInitials(bot.bot_name)}
                    </span>
                  </td>

                  <td className="py-4 px-2">{bot.bot_name}</td>
                  <td className="py-4 px-2">{bot.bot_type}</td>
                  <td className="py-4 px-2">{bot.user.name}</td>
                  <td className="py-4 px-2flex">
                    {/* Prompt */}
                    <Dialog open={openPromptId === bot.id} onOpenChange={(open) => setOpenPromptId(open ? bot.id : null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="px-2 text-sm py-1.5 h-auto justify-start border-stone-700/50 text-stone-300 hover:bg-stone-800/50 hover:text-white hover:border-stone-600/50 transition-all group"
                        >
                          <ClipboardPlus className="w-4" />
                          Prompt principal
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Prompt:</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <p>{bot.long_prompt}</p>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setOpenPromptId(null)}>
                            Cerrar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>
                  <td className="py-4 px-2 space-x-2 flex">
                    {/* Edit */}
                    <EditBotModal
                      bot={bot}
                      onUpdated={refetch}
                      trigger={
                        <Button size="sm" variant="outline" className="flex items-center">
                          <Edit2 className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                      }
                    />

                    {bot.deleted_at ? (
                      <>
                        {/* Restore */}
                        <ConfirmDialog
                          title="Restaurar bot"
                          description="¿Seguro que deseas restaurar este bot?"
                          onConfirm={() => restoreBot(bot.id).then(refetch)}
                        >
                          <Button size="sm" variant="outline" className="flex items-center">
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Restaurar
                          </Button>
                        </ConfirmDialog>

                        {/* Delete */}
                        <ConfirmDialog
                          title="Eliminar permanentemente"
                          description="Esta acción es irreversible. ¿Continuar?"
                          onConfirm={() => forceDeleteBot(bot.id).then(refetch)}
                        >
                          <Button size="sm" variant="destructive" className="flex items-center">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Destruir
                          </Button>
                        </ConfirmDialog>
                      </>
                    ) : (
                      /* Soft delete */
                      <ConfirmDialog
                        title="Eliminar bot"
                        description="El bot se marcará como eliminado y podrás restaurarlo luego."
                        onConfirm={() => deleteBot(bot.id).then(refetch)}
                      >
                        <Button size="sm" variant="destructive" className="flex items-center">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </ConfirmDialog>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center">
                  No se encontraron bots.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Docs */}
        {/* <FileUpload /> */}

        {/* Providers ---------------------------------------------------- */}
        {/* <h2 className="text-white text-xl font-bold mt-8 mb-2">Modelos de IA</h2> */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROVIDERS.map((provider) => {
            const isSelected = provider.id === selectedProviderId;

            if (provider.active) {
              return (
                <Dialog key={provider.id}>
                  <DialogTrigger asChild>
                    <div
                      className={`
                        w-full rounded-lg border p-6 text-left shadow-sm cursor-pointer transition
                        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200 dark:border-neutral-700'}
                        bg-white dark:bg-zinc-800
                      `}
                    >
                      <CardContent provider={provider} />

                      <Button
                        size="sm"
                        variant={isSelected ? 'default' : 'secondary'}
                        className="mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProviderId(provider.id);
                        }}
                      >
                        {isSelected ? 'Seleccionado ✓' : 'Usar este modelo'}
                      </Button>
                    </div>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Configurar credenciales de {provider.name}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="apiKey" className="text-right">
                          API Key
                        </Label>
                        <Input id="apiKey" placeholder="sk-..." className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="extra" className="text-right">
                          Organización / Proyecto
                        </Label>
                        <Input id="extra" placeholder="opcional" className="col-span-3" />
                      </div>
                      <div className="flex justify-end mt-4 gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button>Guardar</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            }

            return (
              <HoverCard key={provider.id}>
                <HoverCardTrigger asChild>
                  <div
                    className="w-full rounded-lg border p-6 text-left shadow-sm border-gray-200 dark:border-neutral-700 bg-white/50 dark:bg-zinc-800/40 cursor-not-allowed opacity-60"
                  >
                    <CardContent provider={provider} />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent side="top" align="center" className="w-60 text-center text-sm">
                  <span className="font-medium">{provider.name}</span> está deshabilitado por el momento.
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div> */}
      </div>
    </AppLayout>
  );
}

function CardContent({ provider }: { provider: Provider }) {
  return (
    <>
      <div className="flex items-center space-x-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 p-1 dark:border-neutral-700">
          <img src={provider.icon} alt={provider.name} className="h-6 w-6 object-contain" />
        </span>
        <dt className="text-sm font-medium text-gray-900 dark:text-gray-50">{provider.name}</dt>
      </div>
      <dd className="mt-4 text-sm text-gray-600 dark:text-gray-400">{provider.description}</dd>
    </>
  );
}
