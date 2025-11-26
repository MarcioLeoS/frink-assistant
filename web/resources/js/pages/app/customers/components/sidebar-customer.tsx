import Avatar from 'boring-avatars'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Frown, Tent, Clock } from "lucide-react";
import { Tab, TAB_NAV } from "../tabs";
import SidebarQuickLink from "./sidebar-link";
import { FileTreeSidebar } from "./file-tree";
import { Customer } from '../hooks/useCustomersDetails';

interface Props {
  tab: Tab;
  customer: Customer | null;
  onSelect: (t: Tab) => void;
}

export default function Sidebar({ tab, customer, onSelect }: Props) {
  if (!customer) {
    return
  }

  return (
    <aside className="w-80 shrink-0 overflow-y-auto backdrop-blur-sm p-4 mb-4 space-y-4 custom-scroll">
      {/* Card presentación */}
      <div className="overflow-hidden border-white/10 bg-transparent text-card-foreground flex flex-col gap-6 rounded-3xl border pb-6 shadow-sm">
        <div className="gap-2 pt-0">
          <div
            className="relative min-h-20 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://picsum.photos/300/300')`,
            }}
          >
            <div className="absolute top-14 left-4 h-16 w-16 rounded-full bg-black flex items-center justify-center ring-2 ring-white/20">
              <Avatar
                size={64}
                name={customer.name}
                variant="marble"
              />
            </div>
          </div>
          <div className="flex flex-col items-start mt-12 px-6">
            <span className="text-xl font-semibold">{customer.name}</span>
            <span className="text-sm text-gray-400">{customer.phone_number || 'Sin celular'}</span>
            <div className="flex gap-2 text-sm text-gray-400 mt-6 mx-auto">
              <div className="p-1.5 rounded-lg bg-zinc-700">
                <Clock className="h-5 w-5 text-white/70" />
              </div>
              <span className="mt-1.5">Cliente activo recientemente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <Card className="overflow-hidden border-white/10 bg-transparent text-card-foreground flex flex-col gap-6 rounded-3xl border py-6 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Secciones</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {TAB_NAV.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={tab === id ? "secondary" : "ghost"}
              className="w-full justify-start rounded-lg cursor-pointer"
              onClick={() => onSelect(id)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <FileTreeSidebar />

      {/* Estadísticas y accesos rápidos → omitido por brevedad */}
    </aside>
  );
}
