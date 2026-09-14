import { Head } from '@inertiajs/react';
import { Search, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/home/empty-state';
import { JoinCta } from '@/components/home/join-cta';
import { MemberCard } from '@/components/home/member-card';
import { PageHeaderBanner } from '@/components/home/page-header-banner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import PublicLayout from '@/layouts/public-layout';
import type { HomeMiembro, HomePais } from '@/types/home';

type MiembrosProps = {
    miembros: HomeMiembro[];
    paises: HomePais[];
};

export default function Miembros({ miembros, paises }: MiembrosProps) {
    const [query, setQuery] = useState('');
    const [pais, setPais] = useState('todos');

    const resultados = useMemo(() => {
        const q = query.trim().toLowerCase();

        return miembros.filter((miembro) => {
            const coincideTexto =
                q === '' ||
                miembro.nombre.toLowerCase().includes(q) ||
                (miembro.universidad ?? '').toLowerCase().includes(q);
            const coincidePais = pais === 'todos' || miembro.pais === pais;

            return coincideTexto && coincidePais;
        });
    }, [miembros, query, pais]);

    const hayFiltros = query.trim() !== '' || pais !== 'todos';

    return (
        <PublicLayout>
            <Head title="Miembros" />

            <PageHeaderBanner
                breadcrumb="Miembros"
                title="Comunidad de investigadores"
                subtitle="Investigadores, docentes y profesionales que forman parte de la Red Kuélap en toda América Latina."
            />

            <section className="bg-white py-10 sm:py-12">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="text-kuelap-ink/35 pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar por nombre o universidad…"
                                className="border-kuelap-ink/15 text-kuelap-ink placeholder:text-kuelap-ink/40 focus:border-kuelap-green focus:ring-kuelap-green/20 w-full rounded-lg border bg-white py-2.5 pr-4 pl-10 text-[15px] outline-none focus:ring-4"
                            />
                        </div>

                        <Select value={pais} onValueChange={setPais}>
                            <SelectTrigger className="border-kuelap-ink/15 w-full sm:w-56">
                                <SelectValue placeholder="Todos los países" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">
                                    Todos los países
                                </SelectItem>
                                {paises.map((p) => (
                                    <SelectItem key={p.id} value={p.nombre}>
                                        {p.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {hayFiltros && (
                            <button
                                type="button"
                                onClick={() => {
                                    setQuery('');
                                    setPais('todos');
                                }}
                                className="text-kuelap-ink/50 hover:text-kuelap-ink inline-flex shrink-0 items-center gap-1.5 text-[14px] font-semibold"
                            >
                                <X className="size-4" />
                                Limpiar
                            </button>
                        )}
                    </div>

                    <p className="text-kuelap-ink/50 mt-4 text-[13px]">
                        Mostrando {resultados.length} de {miembros.length}{' '}
                        miembros
                    </p>
                </div>
            </section>

            <section className="border-kuelap-ink/10 border-t bg-[#FAFBFC] py-12 sm:py-14">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                    {resultados.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {resultados.map((miembro) => (
                                <MemberCard
                                    key={miembro.id}
                                    miembro={miembro}
                                    className="w-full snap-align-none"
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Users}
                            title="No se encontraron miembros"
                            body="Prueba con otro nombre, otra universidad o quita el filtro de país."
                        />
                    )}
                </div>
            </section>

            <JoinCta />
        </PublicLayout>
    );
}
