import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_APP_URL || "http://localhost/frink-assistant-web/public";

interface ModalProps {
  children: React.ReactNode;
  title?: string;
  open: boolean;
  postUrl: string;
  onOpenChange: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({
  children,
  title = "Registro",
  open,
  postUrl,
  onOpenChange,
}) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Agregar token CSRF obtenido de la meta
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
      formData.append('_token', token);
    }

    try {
      const res = await fetch(BASE_URL + postUrl, {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });

      if (!res.ok) {
        throw new Error('Error al enviar los datos');
      }

      toast('Datos enviados correctamente');
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      } else {
        toast('Error desconocido');
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          {children}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button type="submit">Enviar</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;
