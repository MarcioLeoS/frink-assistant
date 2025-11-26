import { useState } from "react";
import { Link } from "@inertiajs/react"; // opcional si usás Inertia o redirección
import DefaultButton from "@/components/ui/default-button";
import Loader from "@/components/ui/loader";
import Pagination from "@/components/ui/pagination";
import { useCustomers } from "../hooks/useCustomers";
import { Customer } from "@/services/customers/customers.api";
import { formatDistanceToNow, parse } from "date-fns";
import { es } from "date-fns/locale";
import { Eye } from "lucide-react";
import Filters from "./filters";

export default function ClientsCards() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { customers, loading, totalPages, totalItems } = useCustomers(currentPage, {
    sortBy,
    sortOrder,
  });

  const parseLastContact = (value: string) => {
    const parsed = parse(value, "dd/MM/yyyy HH:mm", new Date());
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const handleViewDetails = (customerId: number) => {
    console.log("Redirigiendo a detalles del cliente:", customerId);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Filtros se pueden colocar en una fila superior */}
      <div className="ml-auto mb-4">
        {/* Si ya tenés el componente Filters, simplemente insértalo aquí */}
        <Filters />
      </div>

      {/* Grid de tarjetas */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {customers.map((customer: Customer) => (
          <div
            key={customer.id}
            className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-md flex flex-col gap-2"
          >
            <h3 className="text-lg font-semibold text-white">
              {customer.name}
            </h3>
            <p className="text-gray-400 text-sm">
              <span role="img" aria-label="Teléfono">
                📞
              </span>{" "}
              {customer.phone_number}
            </p>
            <p className="text-gray-400 text-sm">
              <span role="img" aria-label="Mensajes">
                💬
              </span>{" "}
              Mensajes: {customer.message_count || 0}
            </p>
            <p className="text-gray-500 text-xs">
              <span role="img" aria-label="Última actividad">
                🕒
              </span>{" "}
              Última actividad:{" "}
              {customer.last_contact_at && parseLastContact(customer.last_contact_at)
                ? formatDistanceToNow(parseLastContact(customer.last_contact_at)!, { addSuffix: true, locale: es })
                : "-"}
            </p>
            <div className="mt-auto">
              <DefaultButton handleAction={() => handleViewDetails(customer.id)}>
                <Eye className="w-4 h-4 mr-1" />
                Detalles
              </DefaultButton>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={10}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
