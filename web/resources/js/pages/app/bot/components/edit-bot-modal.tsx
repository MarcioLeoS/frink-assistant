import { useEffect, useState } from 'react';
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
import { useUpdateBot } from '../hooks/useBots';
import { BotConfig } from '@/services/bots/bots.api';
import { toast } from 'sonner';
import Field from './field';

type Props = {
  bot: BotConfig;
  onUpdated?: () => void;
  /** React-Node usado como botón disparador (generalmente el icono). */
  trigger: React.ReactElement;
};

export default function EditBotModal({ bot, onUpdated, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const { updateBot, loading } = useUpdateBot();

  const [form, setForm] = useState({
    bot_name: bot.bot_name,
    bot_type: bot.bot_type,
    bot_description: bot.bot_description ?? '',
    long_prompt: bot.long_prompt ?? '',
  });

  /** resetea si abres el modal nuevamente  */
  useEffect(() => {
    if (open) {
      setForm({
        bot_name: bot.bot_name,
        bot_type: bot.bot_type,
        bot_description: bot.bot_description ?? '',
        long_prompt: bot.long_prompt ?? '',
      });
    }
  }, [open, bot]);

  const handleSave = async () => {
    await updateBot(bot.id, form);
    setOpen(false);
    onUpdated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar bot: {bot.bot_name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Field
            label="Nombre"
            value={form.bot_name}
            onChange={(v) => setForm((f) => ({ ...f, bot_name: v }))}
          />
          <Field
            label="Tipo"
            value={form.bot_type}
            onChange={(v) => setForm((f) => ({ ...f, bot_type: v }))}
          />
          <Field
            label="Descripción"
            value={form.bot_description}
            onChange={(v) => setForm((f) => ({ ...f, bot_description: v }))}
          />
          <Field
            textarea
            label="Prompt largo"
            value={form.long_prompt}
            onChange={(v) => setForm((f) => ({ ...f, long_prompt: v }))}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando…' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
