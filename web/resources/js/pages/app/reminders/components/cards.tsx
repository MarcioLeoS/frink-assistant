// resources/js/Pages/Components/Cards.tsx
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import Loader from "@/components/ui/loader";
import { useReminders } from "../useReminders";

interface CardsProps {
  idCategory: number;
  refresh: boolean;
}

export default function Cards({ idCategory, refresh }: CardsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { reminders, loading, totalPages, totalItems, itemsPerPage } = useReminders(currentPage, idCategory, refresh);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <div className="relative flex-1 md:min-h-min overflow-x-auto grid grid-cols-3 gap-4">
        {reminders.map((item) => (
          <div key={item.id} className="bg-zinc-800 p-4 rounded-xl flex flex-col relative">
            <span
              className="side-stick rounded-full min-h-[40px] min-w-[3px] absolute left-0"
              style={{ backgroundColor: item.category?.color_code || "#524b91" }}
            ></span>
            <h6 className="text-md">{item.content}</h6>
            <p className="text-sm text-zinc-600">{item.description}</p>
            <p className="text-sm text-zinc-600">Creado el: {item.created_at}</p>
            <p className="text-sm text-zinc-600">
              {item.remind_at ? "Enviado el: " + item.remind_at : "No envíado aún"}
            </p>
            <div className="note-content">
              <p className="mt-2 text-sm">{item.observation}</p>
            </div>
            <div className="flex mt-auto">
              <div className="ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <EllipsisVertical className="w-6 p-1 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mr-20">
                    <DropdownMenuItem>Verify</DropdownMenuItem>
                    <DropdownMenuItem>Send Now</DropdownMenuItem>
                    <DropdownMenuItem>Postpone</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
