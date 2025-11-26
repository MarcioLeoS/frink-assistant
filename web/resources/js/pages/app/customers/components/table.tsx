import React, { useState } from "react";
import Table from "@/components/ui/table";
import Pagination from "@/components/ui/pagination";
import Loader from "@/components/ui/loader";
import TableButton from "@/components/ui/table-button";
import { useCustomers } from "../hooks/useCustomers";
import { formatDistanceToNow, parse } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, ArrowUp, ArrowDown } from "lucide-react";
import { Link } from "@inertiajs/react";
import { CustomerQuery } from "@/services/customers/customers.api";
import Filters from "./filters";

export default function ClientsTable() {
    /* 🔑  UN solo estado: query */
    const [query, setQuery] = useState<CustomerQuery>({
        page: 1,
        sortBy: null,
        sortOrder: "asc",
    });

    const { customers, loading, totalPages, totalItems } = useCustomers(query);

    /* ---- handlers ---- */
    const updateQuery = (partial: Partial<CustomerQuery>) =>
        setQuery((q) => ({ ...q, page: 1, ...partial }));

    const handleSort = (field: string) =>
        setQuery((q) => ({
            ...q,
            page: 1,
            sortBy: field,
            sortOrder: q.sortBy === field && q.sortOrder === "asc" ? "desc" : "asc",
        }));

    const handlePageChange = (page: number) =>
        setQuery((q) => ({ ...q, page }));

    const parseLast = (val?: string) => {
        if (!val) return null;
        const p = parse(val, "dd/MM/yyyy HH:mm", new Date());
        return isNaN(p.getTime()) ? null : p;
    };

    const handleViewDetails = (customerId: number) => {
        console.log("Redirigiendo a detalles del cliente:", customerId);
    };

    if (loading) return <Loader />;

    return (
        <div className="flex flex-col h-full w-full">
            <div className="ml-auto mb-4">
                <Filters query={query} onChange={updateQuery} />
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <thead>
                        <tr className="border-b border-neutral-800">
                            {/* ---- columnas con sort ---- */}
                            {[
                                { label: "Cliente", field: "name" },
                                { label: "Teléfono", field: "phone_number" },
                                { label: "Mensajes", field: "message_count" },
                                { label: "Última actividad", field: "last_contact_at" },
                            ].map(({ label, field }) => (
                                <th key={field} className="py-2 text-left px-4">
                                    <button
                                        onClick={() => handleSort(field)}
                                        className="flex items-center gap-1 focus:outline-none"
                                    >
                                        {label}
                                        {query.sortBy === field &&
                                            (query.sortOrder === "asc" ? (
                                                <ArrowUp className="w-4 h-4" />
                                            ) : (
                                                <ArrowDown className="w-4 h-4" />
                                            ))}
                                    </button>
                                </th>
                            ))}
                            <th className="py-2 px-4" />
                        </tr>
                    </thead>

                    <tbody>
                        {customers.map((c) => (
                            <tr key={c.id} className="border-b border-neutral-800">
                                <td className="py-4 px-4">{c.name}</td>
                                <td className="py-4 px-4">{c.phone_number}</td>
                                <td className="py-4 px-4">{c.message_count}</td>
                                <td className="py-4 px-4">
                                    {parseLast(c.last_contact_at)
                                        ? formatDistanceToNow(parseLast(c.last_contact_at)!, {
                                            addSuffix: true,
                                            locale: es,
                                        })
                                        : "-"}
                                </td>
                                <td className="py-4 px-4">
                                    <Link href={route('customer.details', { id: c.id })}>
                                        <TableButton action="Detalles" handleAction={() => handleViewDetails(c.id)}>
                                            <Eye className="w-4" />
                                        </TableButton>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <div className="mt-auto">
                <Pagination
                    currentPage={query.page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={10}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
