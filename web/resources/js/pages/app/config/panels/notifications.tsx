import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import { saveEmailConfig } from "@/services/notifications/notifications.api";
import { testEmail } from "@/services/notifications/notifications.api";
import { useNotificationSettings } from "../hooks/notifications/useNotificationsSettings";
import { toast } from "sonner";

import {
  Mail,
  MessageSquare,
  Bell,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Users,
  Ticket,
  Settings,
  Save,
  RefreshCw
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

/* ------------------------------------------------------------- */
/* Helper row component                                           */
/* ------------------------------------------------------------- */
interface PrefRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

/* --------------------------------------------------------------------- */
/* Iconos para los diferentes tipos de notificaciones                    */
/* --------------------------------------------------------------------- */
const getNotificationIcon = (name: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Alerts': <AlertTriangle className="h-4 w-4" />,
    'Payment reminders': <CreditCard className="h-4 w-4" />,
    'Limit of messages': <MessageSquare className="h-4 w-4" />,
    'System updates': <Settings className="h-4 w-4" />,
    'Customer notifications': <Users className="h-4 w-4" />,
    'Ticket notifications': <Ticket className="h-4 w-4" />,
  };
  return iconMap[name] || <Bell className="h-4 w-4" />;
};

/* --------------------------------------------------------------------- */
/* Iconos para los diferentes tipos de canales                           */
/* --------------------------------------------------------------------- */
const getChannelIcon = (type: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'email': <Mail className="h-5 w-5" />,
    'sms': <MessageSquare className="h-5 w-5" />,
    'push': <Bell className="h-5 w-5" />,
    'webhook': <Settings className="h-5 w-5" />,
    'slack': <MessageSquare className="h-5 w-5" />,
    'discord': <MessageSquare className="h-5 w-5" />,
    'teams': <MessageSquare className="h-5 w-5" />,
  };
  return iconMap[type] || <Bell className="h-5 w-5" />;
};

/* --------------------------------------------------------------------- */
/* Helper row                                                            */
/* --------------------------------------------------------------------- */
const FormRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <Label className="text-xs text-neutral-400">{label}</Label>
    {children}
  </div>
);

export default function NotificationSettings() {
  const {
    settings,
    loading,
    error,
    enabledChannels,
    preferences,
    toggleChannel,
    togglePreference,
    getOptionsByType,
    isChannelEnabled,
    isPreferenceEnabled,
    refetch,
  } = useNotificationSettings();

  const [saving, setSaving] = React.useState(false);
  const [showEmailConfig, setShowEmailConfig] = React.useState(false);
  const [showEmailToConfig, setShowEmailToConfig] = React.useState(false);
  const [testEmailTo, setTestEmailTo] = React.useState("");
  const [emailConfig, setEmailConfig] = React.useState({
    MAIL_MAILER: "log",
    MAIL_SCHEME: "",
    MAIL_HOST: "127.0.0.1",
    MAIL_PORT: "2525",
    MAIL_USERNAME: "",
    MAIL_PASSWORD: "",
    MAIL_FROM_ADDRESS: "hello@example.com",
    MAIL_FROM_NAME: "Frink Assistant",
  });

  const handleTestEmail = async () => {
    try {
      await testEmail(testEmailTo);
      toast.success("¡Correo de prueba enviado correctamente!");
    } catch (e: any) {
      toast.error(e.message || "No se pudo enviar el correo de prueba");
    }
  };

  const handleEmailConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailConfig({ ...emailConfig, [e.target.name]: e.target.value });
  };

  const handleSaveEmailConfig = async () => {
    try {
      await saveEmailConfig(emailConfig);
      toast.success("Configuración de email guardada correctamente");
      setShowEmailConfig(false);
      refetch();
    } catch (e) {
      toast.error("No se pudo guardar la configuración de email");
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configuraciones guardadas exitosamente');
    } catch (error) {
      toast.error('Error al guardar las configuraciones');
    } finally {
      setSaving(false);
    }
  };

  const ChannelHeader = ({
    id,
    title,
    desc,
    active,
    onToggle,
    badge,
  }: {
    id: string;
    title: string;
    desc: string;
    active: boolean;
    onToggle: (v: boolean) => void;
    badge?: string;
  }) => (
    <div className="flex w-full items-center justify-between gap-2 pr-2">
      <div className="flex items-center gap-3">
        {getChannelIcon(id)}
        <div>
          <div className="flex items-center gap-2">
            <Label htmlFor={id} className="text-lg font-medium text-white">
              {title}
            </Label>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          <p className="max-w-sm text-sm text-neutral-400">{desc}</p>
        </div>
      </div>
      <Switch id={id} checked={active} onCheckedChange={onToggle} />
    </div>
  );

  if (loading) {
    return (
      <section className="space-y-6 rounded-xl border border-neutral-700/70 bg-neutral-900/60 p-6 shadow-inner">
        <div className="flex items-center justify-center py-8">
          <Loader />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6 rounded-xl border border-neutral-700/70 bg-neutral-900/60 p-6 shadow-inner">
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <Button
            variant="outline"
            onClick={refetch}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-xl border border-neutral-700/70 bg-neutral-900/60 p-6 shadow-inner">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Ajustes de notificaciones
        </h2>
        {/* <Button
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar cambios
            </>
          )}
        </Button> */}
      </div>

      {settings.map((setting) => (
        <Accordion
          key={setting.id}
          type="single"
          collapsible
          className="rounded-lg bg-neutral-800/60"
        >
          <AccordionItem value={setting.type}>
            <AccordionTrigger className="border-b border-neutral-700 px-4 py-3 hover:no-underline">
              <ChannelHeader
                id={setting.type}
                title={setting.name}
                desc={setting.description}
                active={isChannelEnabled(setting.type)}
                onToggle={() => toggleChannel(setting.type)}
                badge={setting.enabled ? 'Configurado' : 'Pendiente'}
              />
            </AccordionTrigger>

            <AccordionContent className="space-y-6 px-6 pb-6 pt-4">
              <Button variant="outline" onClick={() => setShowEmailToConfig(true)}>
                Probar email
              </Button>
              <Dialog open={showEmailToConfig} onOpenChange={setShowEmailToConfig}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configurar email</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <FormRow label="Coloca el mail al que quieres que llegue el test">
                      <Input
                        name="testEmailTo"
                        value={testEmailTo}
                        onChange={e => setTestEmailTo(e.target.value)}
                        placeholder="test@ejemplo.com"
                      />
                    </FormRow>
                  </div>
                  <DialogFooter>
                    <Button variant="secondary" onClick={handleTestEmail}>
                      Enviar email
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="ml-2" onClick={() => setShowEmailConfig(true)}>
                Configurar email
              </Button>
              <Dialog open={showEmailConfig} onOpenChange={setShowEmailConfig}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configurar email</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <FormRow label="MAIL_MAILER">
                      <Input
                        name="MAIL_MAILER"
                        value={emailConfig.MAIL_MAILER}
                        onChange={handleEmailConfigChange}
                        placeholder="log"
                      />
                    </FormRow>
                    <FormRow label="MAIL_SCHEME">
                      <Input
                        name="MAIL_SCHEME"
                        value={emailConfig.MAIL_SCHEME}
                        onChange={handleEmailConfigChange}
                        placeholder="null"
                      />
                    </FormRow>
                    <FormRow label="MAIL_HOST">
                      <Input
                        name="MAIL_HOST"
                        value={emailConfig.MAIL_HOST}
                        onChange={handleEmailConfigChange}
                        placeholder="127.0.0.1"
                      />
                    </FormRow>
                    <FormRow label="MAIL_PORT">
                      <Input
                        name="MAIL_PORT"
                        value={emailConfig.MAIL_PORT}
                        onChange={handleEmailConfigChange}
                        placeholder="2525"
                      />
                    </FormRow>
                    <FormRow label="MAIL_USERNAME">
                      <Input
                        name="MAIL_USERNAME"
                        value={emailConfig.MAIL_USERNAME}
                        onChange={handleEmailConfigChange}
                        placeholder="null"
                      />
                    </FormRow>
                    <FormRow label="MAIL_PASSWORD">
                      <Input
                        name="MAIL_PASSWORD"
                        value={emailConfig.MAIL_PASSWORD}
                        onChange={handleEmailConfigChange}
                        placeholder="null"
                      />
                    </FormRow>
                    <FormRow label="MAIL_FROM_ADDRESS">
                      <Input
                        name="MAIL_FROM_ADDRESS"
                        value={emailConfig.MAIL_FROM_ADDRESS}
                        onChange={handleEmailConfigChange}
                        placeholder="hello@example.com"
                      />
                    </FormRow>
                    <FormRow label="MAIL_FROM_NAME">
                      <Input
                        name="MAIL_FROM_NAME"
                        value={emailConfig.MAIL_FROM_NAME}
                        onChange={handleEmailConfigChange}
                        placeholder="Frink Assistant"
                      />
                    </FormRow>
                  </div>
                  <DialogFooter>
                    <Button variant="secondary" onClick={handleSaveEmailConfig}>
                      Guardar configuración
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* Mostrar método de envío solo como información */}
              <FormRow label="Método de envío">
                <div className="w-56 px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-md text-neutral-300">
                  {setting.type === 'email' && 'SMTP'}
                  {setting.type === 'sms' && 'API'}
                  {setting.type === 'push' && 'Push API'}
                  {setting.type === 'webhook' && 'Webhook'}
                  {setting.type === 'slack' && 'Slack API'}
                  {setting.type === 'discord' && 'Discord API'}
                  {setting.type === 'teams' && 'Teams API'}
                </div>
              </FormRow>

              {/* Estado de configuración */}
              <FormRow label="Estado">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${setting.enabled ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                  <span className="text-sm text-neutral-300">
                    {setting.enabled ? 'Configurado correctamente' : 'Requiere configuración'}
                  </span>
                </div>
              </FormRow>

              {/* Preferencias de notificación */}
              <div>
                <p className="mb-2 text-sm font-medium text-white">
                  Preferencias de notificación
                </p>
                <Card className="space-y-2 rounded-lg border border-neutral-700 bg-neutral-900 p-4">
                  {getOptionsByType(setting.type).length > 0 ? (
                    getOptionsByType(setting.type).map((option) => (
                      <PrefRow
                        key={option.id}
                        icon={getNotificationIcon(option.name)}
                        title={option.name}
                        subtitle={option.description}
                        value={isPreferenceEnabled(option.id.toString())}
                        onChange={() => togglePreference(option.id.toString())}
                        disabled={!isChannelEnabled(setting.type)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-4 text-neutral-400 text-sm">
                      No hay opciones disponibles para este canal
                    </div>
                  )}
                </Card>
              </div>

              {/* Información adicional */}
              {!setting.enabled && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <p className="text-sm text-yellow-400">
                    <strong>Configuración requerida:</strong> Este canal necesita ser configurado por un administrador para funcionar correctamente.
                  </p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}

      {settings.length === 0 && (
        <div className="text-center py-8">
          <Shield className="h-12 w-12 text-neutral-500 mx-auto mb-4" />
          <p className="text-neutral-400">
            No hay configuraciones de notificaciones disponibles.
          </p>
        </div>
      )}
    </section>
  );
}

function PrefRow({ icon, title, subtitle, value, onChange, disabled = false }: PrefRowProps) {
  return (
    <div className={`flex items-center justify-between border-b border-neutral-700 py-3 last:border-0 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="rounded-md bg-neutral-800 p-2 text-neutral-300">
          {icon}
        </div>
        <div>
          <h5 className="text-sm font-medium text-white">{title}</h5>
          <p className="text-xs text-neutral-400">{subtitle}</p>
        </div>
      </div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}