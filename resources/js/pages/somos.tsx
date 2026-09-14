import { Head, usePage } from '@inertiajs/react';
import { Building2, FlaskConical, Globe2, Users } from 'lucide-react';
import FriezeBand from '@/components/icons/frieze-band';
import KuelapMark from '@/components/icons/kuelap-mark';
import { EmptyState } from '@/components/home/empty-state';
import { JoinCta } from '@/components/home/join-cta';
import { PageHeaderBanner } from '@/components/home/page-header-banner';
import PublicLayout from '@/layouts/public-layout';
import type { EmpresaValor, HomeStats } from '@/types/home';

type SomosProps = {
    stats: HomeStats;
    mision: string | null;
    vision: string | null;
    valores: EmpresaValor[];
};

export default function Somos({ stats, mision, vision, valores }: SomosProps) {
    const { empresa } = usePage().props;
    const descripcion = empresa?.descripcion ?? 'Red académica latinoamericana';

    return (
        <PublicLayout>
            <Head title="Nosotros" />

            <PageHeaderBanner
                breadcrumb="Nosotros"
                title="Sobre la Red Kuélap"
                subtitle="Conoce más sobre nuestra identidad, cómo trabajamos y la comunidad que impulsa la ciencia en América Latina."
            />

            <section className="bg-white py-16">
                <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
                    <p className="text-kuelap-green text-[13px] font-bold tracking-widest uppercase">
                        Nuestra identidad
                    </p>
                    <h2 className="font-display text-kuelap-ink mt-3 text-3xl font-extrabold sm:text-4xl">
                        ¿Quiénes somos?
                    </h2>
                    <p className="text-kuelap-ink/70 mt-5 text-[18px] leading-relaxed">
                        {descripcion}. Un espacio de integración académica que
                        promueve la investigación, la cooperación y la
                        innovación entre investigadores, docentes y
                        profesionales de América Latina.
                    </p>
                </div>
            </section>

            <section className="border-kuelap-ink/10 border-t bg-[#FAFBFC] py-16">
                <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-10">
                    <div>
                        <p className="text-kuelap-green text-[13px] font-bold tracking-widest uppercase">
                            Cómo trabajamos
                        </p>
                        <h2 className="font-display text-kuelap-ink mt-3 text-2xl font-extrabold sm:text-3xl">
                            Una red coordinada entre países
                        </h2>
                        <p className="text-kuelap-ink/65 mt-4 max-w-lg text-[16px] leading-relaxed">
                            Hoy coordinamos el trabajo de{' '}
                            <strong className="text-kuelap-ink">
                                +{stats.investigadores} investigadores
                            </strong>{' '}
                            en{' '}
                            <strong className="text-kuelap-ink">
                                +{stats.universidades} universidades
                            </strong>{' '}
                            de{' '}
                            <strong className="text-kuelap-ink">
                                +{stats.paises} países
                            </strong>
                            , organizados en{' '}
                            <strong className="text-kuelap-ink">
                                +{stats.areasInvestigacion} áreas de
                                investigación
                            </strong>
                            . Cada integrante se suma desde su universidad de
                            origen, manteniendo el trabajo conectado con la
                            realidad de cada país.
                        </p>
                        <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
                            {[
                                {
                                    icon: Users,
                                    value: stats.investigadores,
                                    label: 'Investigadores',
                                },
                                {
                                    icon: Building2,
                                    value: stats.universidades,
                                    label: 'Universidades',
                                },
                                {
                                    icon: Globe2,
                                    value: stats.paises,
                                    label: 'Países',
                                },
                                {
                                    icon: FlaskConical,
                                    value: stats.areasInvestigacion,
                                    label: 'Áreas',
                                },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <stat.icon className="text-kuelap-green size-5" />
                                    <dd className="font-display text-kuelap-navy mt-2 text-2xl font-extrabold">
                                        +{stat.value}
                                    </dd>
                                    <dt className="text-kuelap-ink/55 text-[13px]">
                                        {stat.label}
                                    </dt>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="bg-kuelap-navy relative aspect-[4/3] overflow-hidden rounded-2xl">
                        <FriezeBand className="text-kuelap-green/40 absolute top-8 h-3 w-full" />
                        <KuelapMark className="text-kuelap-green absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2" />
                        <FriezeBand className="text-kuelap-green/40 absolute bottom-8 h-3 w-full" />
                    </div>
                </div>
            </section>

            {(vision || mision) && (
                <section className="bg-white py-16">
                    <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                            {vision && (
                                <div className="border-kuelap-ink/10 rounded-2xl border p-8">
                                    <span className="bg-kuelap-green h-1 w-10 rounded-full" />
                                    <h3 className="font-display text-kuelap-ink mt-4 text-xl font-extrabold">
                                        Visión
                                    </h3>
                                    <p className="text-kuelap-ink/65 mt-3 text-[16px] leading-relaxed italic">
                                        “{vision}”
                                    </p>
                                </div>
                            )}
                            {mision && (
                                <div className="border-kuelap-ink/10 rounded-2xl border p-8">
                                    <span className="bg-kuelap-navy h-1 w-10 rounded-full" />
                                    <h3 className="font-display text-kuelap-ink mt-4 text-xl font-extrabold">
                                        Misión
                                    </h3>
                                    <p className="text-kuelap-ink/65 mt-3 text-[16px] leading-relaxed italic">
                                        “{mision}”
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            <section className="border-kuelap-ink/10 border-t bg-[#FAFBFC] py-16">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                    <p className="text-kuelap-green text-[13px] font-bold tracking-widest uppercase">
                        Lo que nos guía
                    </p>
                    <h2 className="font-display text-kuelap-ink mt-3 text-2xl font-extrabold sm:text-3xl">
                        Nuestros valores
                    </h2>

                    <div className="mt-8">
                        {valores.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {valores.map((valor) => (
                                    <div
                                        key={valor.id}
                                        className="border-kuelap-ink/10 rounded-2xl border bg-white p-6"
                                    >
                                        <h3 className="font-display text-kuelap-ink text-[17px] font-bold">
                                            {valor.nombre}
                                        </h3>
                                        <p className="text-kuelap-ink/60 mt-2 text-[14px] leading-relaxed">
                                            {valor.descripcion}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={FlaskConical}
                                title="Aún no hay valores publicados"
                                body="Los valores oficiales de la red se mostrarán aquí en cuanto se registren."
                            />
                        )}
                    </div>
                </div>
            </section>

            <JoinCta />
        </PublicLayout>
    );
}
