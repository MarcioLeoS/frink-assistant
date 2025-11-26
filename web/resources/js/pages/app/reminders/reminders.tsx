import { useEffect, useState } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlignLeft, EllipsisVertical, Plus } from 'lucide-react';
import Cards from './components/cards';
import Modal from '@/components/ui/modal';
import FormContent from './components/form';
import FormCategory from './components/form-category';
import { toast } from "sonner";
import { useCategories } from "./useCategories";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Reminders", href: "/reminders" },
];

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCategory, setIsModalOpenCategory] = useState(false);
  const [idCategory, setIdCategory] = useState<number>(0);
  const [refreshCards, setRefreshCards] = useState(false);

  const { categories, refetch } = useCategories();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Reminders" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 lg:py-4 2xl:max-w-6xl w-full mx-auto">
        <h2 className="text-white text-xl font-bold mb-4">Reminders</h2>
        {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
          </div>
          <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
          </div>
          <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
          </div>
        </div> */}

        <div className="bg-zinc-800 flex flex-row border-zinc-600 w-full p-4 rounded-xl gap-2">
          <button
            onClick={() => setIdCategory(0)}
            className="cursor-pointer rounded-md px-2 py-0.5 flex items-center dark:bg-zinc-700 hover:border-zinc-500 border transition-all duration-250"
          >
            <div className="w-1 h-3.5 shrink-0 bg-pink-500 rounded-full"></div>
            <span className="ml-1.5">Todos</span>
          </button>
          {categories?.length > 0 && categories.map((item) => (
            <button
              key={item.id}
              onClick={() => setIdCategory(item.id)}
              className="cursor-pointer rounded-md px-2 py-0.5 flex items-center dark:bg-zinc-700 hover:border-zinc-500 border transition-all duration-250"
            >
              <div
                className="w-1 h-3.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color_code }}
              ></div>
              <span className="ml-1.5">{item.title}</span>
            </button>
          ))}
          <button
            onClick={() => setIsModalOpenCategory(true)}
            className="cursor-pointer bg-zinc-700 rounded-full px-2 flex items-center gap-4"
          >
            <Plus className="w-4" />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="ml-auto gap-2 cursor-pointer rounded-md px-2 py-0.5 flex items-center dark:bg-zinc-700 hover:border-zinc-500 border transition-all duration-250"
          >
            <AlignLeft className="w-4" /> Agregar
          </button>
        </div>
        <div className="md:flex hidden relative flex-1 rounded-xl md:min-h-min overflow-x-auto">
          <Cards idCategory={idCategory} refresh={refreshCards} />
        </div>
      </div>
      <Modal
        open={isModalOpenCategory}
        onOpenChange={(open) => {
          setIsModalOpenCategory(open);
          if (!open) {
            refetch();
          }
        }}
        title="Create Category"
        postUrl="/reminders/categories/storeData"
      >
        <FormCategory />
      </Modal>
      <Modal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setRefreshCards((prev) => !prev);
          }
        }}
        title="Crear recordatorio"
        postUrl="/reminders/storeData"
      >
        <FormContent />
      </Modal>
    </AppLayout>
  );
}
