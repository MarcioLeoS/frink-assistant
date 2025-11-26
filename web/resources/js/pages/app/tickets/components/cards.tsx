// resources/js/Pages/TicketsList.tsx
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { toast } from "sonner";
import { useTickets } from "../hooks/useTickets";
import { Ticket as TicketIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import Pagination from "@/components/ui/pagination";
import Empty from "./empty";

export default function TicketsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const { tickets, loading, totalPages, totalItems } = useTickets(currentPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const colors = [
    "#2B265A",
    "#D86E76",
    "#902F85",
    "#739BBF",
    "#4C6CAA",
  ];

  function getRandomElement<T>(arr: T[]): T {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-transparent rounded-xl w-full flex flex-col">
      {/* Responsive grid layout */}
      {tickets.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-transparent border border-neutral-800 p-4 rounded-xl shadow-md flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  {ticket.customer.name}
                </h3>
                <Badge
                  className="text-gray-200"
                  style={{ backgroundColor: getRandomElement(colors) }}
                >
                  {ticket.status || "No status"}
                </Badge>
              </div>

              <p className="text-gray-400 text-sm">
                📞 {ticket.customer.phone_number}
              </p>
              <p className="text-gray-500 text-xs">
                🕒 Created on: {ticket.created_at}
              </p>
              <p className="text-gray-500 text-xs">
                📝 {ticket.problem_type || " "}
              </p>
              <p className="text-gray-500 text-sm">
                {ticket.problem_description}
              </p>

              <div className="mt-auto ml-auto">
                <Link href={route('tickets.details', { id: ticket.id })} className="cursor-pointer button dark:primary-mild dark:bg-opacity-20 hover:text-primary-mild dark:active:primary-mild dark:active:bg-opacity-40 rounded-xl px-3 text-sm py-0 h-auto button-press-feedback">
                  <span className="flex gap-1 items-center justify-center">
                    <span className="text-nowrap">View ticket</span>
                    <span className="text-lg">
                      <TicketIcon />
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Pagination */}
      {tickets.length > 0 && (
        <div className="mt-auto">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={10}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
