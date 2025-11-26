import { PropsWithChildren, useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCreateBot } from '../hooks/useBots';
import { BotConfig } from '@/services/bots/bots.api';
import { toast } from 'sonner';
import Field from './field';

type Props = PropsWithChildren<{
  onCreated?: () => void; // callback para refrescar la tabla
}>;

export default function CreateBotModal({ children, onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const { createBot, loading } = useCreateBot();

  const [form, setForm] = useState<
    Partial<
      Omit<BotConfig, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'user'>
    >
  >({
    bot_name: '',
    bot_type: '',
    long_prompt: '',
    bot_description: '',
  });

  const resetForm = () =>
    setForm({
      bot_name: '',
      bot_type: '',
      long_prompt: '',
      bot_description: '',
    });

  const handleSave = async () => {
    await createBot(form as any);
    setOpen(false);
    onCreated?.();
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Botón (trigger) */}
      <DialogTrigger asChild>
        {children ?? <Button variant="outline">Crear</Button>}
      </DialogTrigger>

      {/* Contenido */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nuevo bot</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Field
            label="Nombre"
            value={form.bot_name!}
            onChange={v => setForm(f => ({ ...f, bot_name: v }))}
          />
          <Field
            label="Tipo"
            value={form.bot_type!}
            onChange={v => setForm(f => ({ ...f, bot_type: v }))}
          />
          <Field
            label="Descripción"
            value={form.bot_description || ''}
            onChange={v => setForm(f => ({ ...f, bot_description: v }))}
          />
          <Field
            label="Prompt largo"
            textarea
            value={form.long_prompt!}
            onChange={v => setForm(f => ({ ...f, long_prompt: v }))}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Creando…' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
