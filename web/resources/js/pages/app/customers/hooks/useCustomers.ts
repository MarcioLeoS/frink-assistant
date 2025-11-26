// resources/js/hooks/useCustomers.ts
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getCustomers,
  Customer,
  CustomersResponse,
  CustomerQuery,
} from "@/services/customers/customers.api";

export function useCustomers(query: CustomerQuery) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const data: CustomersResponse = await getCustomers(query);
        setCustomers(data.customers.data);
        setTotalPages(data.customers.last_page);
        setTotalItems(data.customers.total);
      } catch (err: any) {
        toast(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [JSON.stringify(query)]);

  return { customers, loading, totalPages, totalItems };
}
