import { Head } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/home/empty-state';
import { EventCard } from '@/components/home/event-card';
import { JoinCta } from '@/components/home/join-cta';
import { PageHeaderBanner } from '@/components/home/page-header-banner';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import type { HomeEvento } from '@/types/home';

type ActividadesProps = {
    eventos: HomeEvento[];
};

type Filtro = 'todas' | 'proxima' | 'pasada';

export default function Actividades({ eventos }: ActividadesProps) {
    const [filtro, setFiltro] = useState<Filtro>('todas');

    const filtros = useMemo(
        () => [
            { value: 'todas' as const, label: 'Todas', count: eventos.length },
            {
                value: 'proxima' as const,
                label: 'Próximas',
                count: eventos.filter((e) => e.estado === 'proxima').length,
            },
            {
                value: 'pasada' as const,
                label: 'Finalizadas',
                count: eventos.filter((e) => e.estado === 'pasada').length,
            },
        ],
        [eventos],
    );

    const resultados = useMemo(
        () =>
            eventos.filter(
                (evento) => filtro === 'todas' || evento.estado === filtro,
            ),
        [eventos, filtro],
    );

    return (
        <PublicLayout>
            <Head title="Actividades" />

            <PageHeaderBanner
                breadcrumb="Actividades"
                title="Actividades y eventos"
                subtitle="Seminarios, conferencias y encuentros de la Red Kuélap para investigadores de toda América Latina."
            />

            <section className="bg-white py-10 sm:py-12">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {filtros.map((f) => (
                            <button
                                key={f.value}
                                type="button"
                                onClick={() => setFiltro(f.value)}
                                className={cn(
                                    'rounded-full border px-4 py-2 text-[14px] font-semibold transition-colors',
                                    filtro === f.value
                                        ? 'bg-kuelap-navy border-kuelap-navy text-white'
                                        : 'border-kuelap-ink/15 text-kuelap-ink/65 hover:border-kuelap-green hover:text-kuelap-green',
                                )}
                            >
                                {f.label}{' '}
                                <span
                                    className={cn(
                                        'ml-0.5',
                                        filtro === f.value
                                            ? 'text-white/70'
                                            : 'text-kuelap-ink/40',
                                    )}
                                >
                                    ({f.count})
                                </span>
                            </button>
                        ))}
                    </div>
                    <p className="text-kuelap-ink/50 mt-5 text-center text-[13px]">
                        Mostrando {resultados.length} de {eventos.length}{' '}
                        actividades
                    </p>
                </div>
            </section>

            <section className="border-kuelap-ink/10 border-t bg-[#FAFBFC] py-12 sm:py-14">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                    {resultados.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {resultados.map((evento) => (
                                <EventCard key={evento.id} evento={evento} />
                            ))}
                        </div>
                    ) : eventos.length > 0 ? (
                        <EmptyState
                            icon={Calendar}
                            title="No hay actividades en esta categoría"
                            body="Prueba con otro filtro para ver el resto de las actividades."
                        />
                    ) : (
                        <EmptyState
                            icon={Calendar}
                            title="Aún no hay actividades programadas"
                            body="Estamos preparando los próximos seminarios y encuentros de la red. Vuelve pronto."
                        />
                    )}
                </div>
            </section>

            <JoinCta />
        </PublicLayout>
    );
}
