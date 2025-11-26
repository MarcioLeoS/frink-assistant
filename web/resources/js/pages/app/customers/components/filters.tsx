import { useState } from 'react';
import DefaultButton from "@/components/ui/default-button"
import DrawerComponent from "@/components/ui/drawer-right";
import FiltersDrawer from "./filters-drawer";
import { Fuel } from 'lucide-react';
import { CustomerQuery } from "@/services/customers/customers.api";

interface Props {
    query: CustomerQuery;
    onChange: (partial: Partial<CustomerQuery>) => void;
}

export default function Filters({ query, onChange }: Props) {
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className='ml-2'>
            <DefaultButton handleAction={() => setDrawerOpen(true)}>
                <svg
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-funnel-icon lucide-funnel"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
                </svg>
                Filtros
            </DefaultButton>
            <DrawerComponent isDrawerOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
                <FiltersDrawer value={query} onChange={onChange} />
            </DrawerComponent>
        </div>
    )
}