import type { BreadcrumbItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Database, Archive } from "lucide-react";

export default function Storage() {

    return (
        <section>
            <header className="flex flex-col mb-6 ml-3 gap-1">
                <h1 className="text-xl">Reporte de almacenamientos</h1>
                <p className="text-zinc-400 text-md">En esta sección podrás ver el reporte de almacenamientos de tu aplicación.</p>
            </header>
            <div className="flex items-center mb-4 gap-2">
                <Card className="bg-transparent w-auto p-6">
                    <div className="border border-zinc-600 rounded-lg py-2 px-3 inline-flex w-fit">
                        <Database className="w-5" />
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-zinc-400">
                            Base de datos
                        </h3>
                        <p>
                            <span className="text-zinc-500">Lorem ipsum dolor sit amet.</span>
                        </p>
                    </div>
                </Card>
                <Card className="bg-transparent w-auto p-6">
                    <div className="border border-zinc-600 rounded-lg py-2 px-3 inline-flex w-fit">
                        <Archive className="w-5" />
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-zinc-400">
                            Archivos
                        </h3>
                        <p>
                            <span className="text-zinc-500">Lorem ipsum dolor sit amet. aaaaaaaaaaaa</span>
                        </p>
                    </div>
                </Card>
            </div>

        </section>
    );
}
