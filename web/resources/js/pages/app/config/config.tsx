import { motion } from "framer-motion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Settings, Database, CreditCard, Building2 } from "lucide-react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import type { BreadcrumbItem } from "@/types";


//panels
import Notifications from "./panels/notifications";
import Billing from "./panels/billing";
import Storage from "./panels/storage";
import Enterprise from "./panels/enterprise";

const fakeConfig = {
  mail: {
    mailer: "smtp",
    host: "smtp.mailtrap.io",
    port: 2525,
    encryption: "tls",
    username: "fake_user",
    from: "no-reply@example.com",
  },
  app: {
    name: "MyApp",
    env: "local",
    url: "http://localhost",
    timezone: "UTC",
    locale: "en",
    debug: true,
  },
  cache: {
    driver: "file",
  },
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Configuración", href: "/config" },
];

export default function SettingsDashboard() {
  const { mail, app, cache } = fakeConfig;

  /* Gradient background animation */
  const Background = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.15 }}
      transition={{ duration: 1.8, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500 blur-3xl" />
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Configuración" />
      <div className="relative flex flex-1 flex-col space-y-6 px-4 pb-8 pt-4">
        {/* Tabs --------------------------------------------------------- */}
        <Tabs defaultValue="enterprise" className="flex flex-1 flex-col">
          <TabsList className="sticky top-4 left-12 z-20 mb-6 px-3 w-max ml-4 rounded-full bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
            <TabsTrigger value="enterprise" className="group relative flex items-center gap-2 px-4 py-2">
              <Building2 size={16} className="transition-transform group-data-[state=active]:-rotate-6" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="notifications" className="group relative flex items-center gap-2 px-4 py-2">
              <Mail size={16} className="transition-transform group-data-[state=active]:-rotate-6" />
              Notificaciones
            </TabsTrigger>
            {/* <TabsTrigger value="general" className="group relative flex items-center gap-2 px-4 py-2">
              <Settings size={16} className="transition-transform group-data-[state=active]:-rotate-6" />
              General
            </TabsTrigger>
            <TabsTrigger value="storage" className="group relative flex items-center gap-2 px-4 py-2">
              <Database size={16} className="transition-transform group-data-[state=active]:-rotate-6" />
              Almacenamiento
            </TabsTrigger>
            <TabsTrigger value="billing" className="group relative flex items-center gap-2 px-4 py-2">
              <CreditCard size={16} className="transition-transform group-data-[state=active]:-rotate-6" />
              Pagos
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="enterprise" className="flex-1">
            <Enterprise />
          </TabsContent>

          <TabsContent value="notifications" className="flex-1">
            <Notifications />
          </TabsContent>

          <TabsContent value="storage" className="flex-1">
           <Storage />
          </TabsContent>

          <TabsContent value="billing" className="flex-1">
            <Billing />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

/* --------------------------------------------------------------------- */
/* Reusable helpers                                                      */
/* --------------------------------------------------------------------- */
function AnimatedCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="rounded-2xl border-none bg-background/70 backdrop-blur-md shadow-xl">
        <CardHeader className="flex flex-row items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 p-6">{children}</CardContent>
      </Card>
    </motion.div>
  );
}

function GridSetting({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg bg-muted/70 px-4 py-2 text-sm shadow-inner">
      <span className="font-medium capitalize text-foreground/80">{label}</span>
      <span className="truncate text-muted-foreground">{value}</span>
    </div>
  );
}

/* --------------------------------------------------------------------- */
/* Tailwind CSS (if needed, add in globals)                              */
/* --------------------------------------------------------------------- */
/*
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0);   }
}
.motion-safe\:animate-fadeIn {
  @apply motion-safe:animate-[fadeIn_0.4s_ease_out];
}
*/
