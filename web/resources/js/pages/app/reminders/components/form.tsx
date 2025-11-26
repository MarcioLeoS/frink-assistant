import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE_URL = import.meta.env.VITE_APP_URL || "http://localhost/frink-assistant-web/public";

interface Customer {
  id: number;
  name: string;
}

interface Category {
  id: number;
  title: string;
  description: string;
  color_code: string;
}

const FormContent: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetch(BASE_URL + "/customer/getList")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  useEffect(() => {
    fetch(BASE_URL + "/reminders/categories/getData")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Input name="content" type="text" placeholder="Contenido" />
      <Input name="description" type="text" placeholder="Descripción" />
      <Textarea name="observation" placeholder="Observaciones" />

      {/* Input oculto para enviar el customer_id */}
      <input
        type="hidden"
        name="customer_id"
        value={selectedCustomer ? selectedCustomer.id : ""}
      />

      {/* Input oculto para enviar el customer_id */}
      <input
        type="hidden"
        name="category_id"
        value={selectedCategory ? selectedCategory.id : ""}
      />

      <div className="flex mb-4 justify-between">
        {/* Select de Clientes */}
        <div className="flex flex-col">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Cliente
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-[200px] justify-between",
                  !selectedCustomer && "text-muted-foreground"
                )}
              >
                {selectedCustomer ? selectedCustomer.name : "Select customer"}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Buscar cliente..." />
                <CommandList>
                  <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                  <CommandGroup>
                    {customers.map((customer) => (
                      <CommandItem
                        key={customer.id}
                        onSelect={() => setSelectedCustomer(customer)}
                      >
                        <Check
                          className={cn(
                            "mr-2",
                            selectedCustomer && selectedCustomer.id === customer.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {customer.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>


        {/* Select de Categorías */}
        <div className="flex flex-col">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Categoría
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-[200px] justify-between",
                  !selectedCategory && "text-muted-foreground"
                )}
              >
                {selectedCategory ? selectedCategory.title : "Select category"}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Buscar categoría..." />
                <CommandList>
                  <CommandEmpty>No se encontraron categorías.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.id}
                        onSelect={() => setSelectedCategory(category)}
                      >
                        <Check
                          className={cn(
                            "mr-2",
                            selectedCategory && selectedCategory.id === category.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {category.title}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default FormContent;
