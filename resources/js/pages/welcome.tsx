import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    FlaskConical,
    Globe2,
    Handshake,
    Lightbulb,
    Newspaper,
    Share2,
    Sprout,
    Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { EmptyState } from '@/components/home/empty-state';
import { EventCard } from '@/components/home/event-card';
import { HeroCarousel } from '@/components/home/hero-carousel';
import { JoinCta } from '@/components/home/join-cta';
import { MemberRow } from '@/components/home/member-row';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { countryCode } from '@/lib/country-codes';
import { register } from '@/routes';
import type {
    HomeEvento,
    HomeImagen,
    HomeMiembro,
    HomePais,
    HomeStats,
} from '@/types/home';

type WelcomeProps = {
    stats: HomeStats;
    miembros: HomeMiembro[];
    paises: HomePais[];
    imagenes: HomeImagen[];
    eventos: HomeEvento[];
};

const ALCANCE_FEATURES = [
    { icon: Handshake, label: 'Colaboración internacional' },
    { icon: Share2, label: 'Intercambio de conocimientos' },
    { icon: Lightbulb, label: 'Innovación y desarrollo' },
    { icon: Sprout, label: 'Impacto social y ambiental' },
];

export default function Welcome({
    stats,
    miembros,
    paises,
    imagenes,
    eventos,
}: WelcomeProps) {
    const { empresa } = usePage().props;
    const nombreCompleto =
        empresa?.nombre ?? 'Red de Investigadores Latinoamericanos KUÉLAP';

    const heroStats = [
        { value: stats.investigadores, label: 'Investigadores' },
        { value: stats.universidades, label: 'Universidades' },
        { value: stats.paises, label: 'Países' },
    ];

    return (
        <PublicLayout>
            <Head title="Inicio" />

            <section className="relative isolate flex min-h-[540px] items-center overflow-hidden">
                <HeroCarousel imagenes={imagenes} />

                <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-20 lg:px-10">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3">
                            <span className="bg-kuelap-green h-px w-8" />
                            <p className="text-kuelap-green text-[13px] font-bold tracking-widest uppercase">
                                {nombreCompleto}
                            </p>
                        </div>
                        <h1 className="font-display mt-5 text-4xl leading-[1.1] font-extrabold text-balance text-white sm:text-5xl lg:text-[52px]">
                            Integración académica para el desarrollo científico
                            de{' '}
                            <span className="text-kuelap-green">
                                América Latina
                            </span>
                        </h1>
                        <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-white/75">
                            Promovemos la investigación, la cooperación y la
                            innovación mediante el trabajo colaborativo entre
                            investigadores, docentes y profesionales de nuestra
                            región.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Button
                                asChild
                                size="lg"
                                className="bg-kuelap-green hover:bg-kuelap-green-dark rounded-lg font-semibold text-white"
                            >
                                <Link href={register()}>
                                    <Users className="size-4" />
                                    Únete a la red
                                </Link>
                            </Button>
                            <a
                                href="/nosotros"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
                            >
                                <Globe2 className="size-4" />
                                Conócenos
                            </a>
                        </div>

                        <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
                            {heroStats.map((stat) => (
                                <div key={stat.label}>
                                    <dt className="text-[13px] text-white/55">
                                        {stat.label}
                                    </dt>
                                    <dd className="font-display text-2xl font-extrabold text-white">
                                        +{stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>

            <section id="somos" className="scroll-mt-20 bg-white py-16">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
                        <div>
                            <Eyebrow>Nuestra identidad</Eyebrow>
                            <h2 className="font-display text-kuelap-ink mt-3 text-3xl font-extrabold sm:text-4xl">
                                ¿Quiénes somos?
                            </h2>
                            <p className="text-kuelap-ink/65 mt-4 max-w-2xl text-[16px] leading-relaxed">
                                {empresa?.descripcion ??
                                    'Red académica latinoamericana'}
                                . Un espacio de integración académica que
                                promueve la investigación, la cooperación y la
                                innovación entre investigadores, docentes y
                                profesionales de América Latina.
                            </p>
                        </div>
                        <Button
                            asChild
                            variant="outline"
                            className="border-kuelap-ink/20 shrink-0 rounded-lg"
                        >
                            <a href="/nosotros">
                                Conocer más sobre nosotros
                                <ArrowRight className="size-4" />
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            <section
                id="actividades"
                className="border-kuelap-ink/10 scroll-mt-20 border-t bg-[#FAFBFC] py-16"
            >
                <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                    <div className="mx-auto max-w-xl text-center">
                        <p className="text-kuelap-green text-[13px] font-bold tracking-widest uppercase">
                            Agenda
                        </p>
                        <h2 className="font-display text-kuelap-ink mt-2 text-3xl font-extrabold sm:text-4xl">
                            Próximas actividades
                        </h2>
                        <span className="bg-kuelap-green mx-auto mt-4 block h-1 w-14 rounded-full" />
                        <p className="text-kuelap-ink/60 mt-5 text-[15px] leading-relaxed">
                            Seminarios, conferencias y webinars de la Red Kuélap
                            en los que puedes participar próximamente.
                        </p>
                    </div>

                    <div className="mt-10">
                        {eventos.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {eventos.map((evento) => (
                                        <EventCard
                                            key={evento.id}
                                            evento={evento}
                                        />
                                    ))}
                                </div>
                                <div className="mt-8 flex justify-center">
                                    <a
                                        href="/actividades"
                                        className="border-kuelap-ink/20 text-kuelap-ink hover:border-kuelap-green hover:text-kuelap-green inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-[15px] font-semibold transition-colors"
                                    >
                                        Ver más actividades
                                        <ArrowRight className="size-4" />
                                    </a>
                                </div>
                            </>
                        ) : (
                            <EmptyState
                                icon={Calendar}
                                title="Aún no hay actividades programadas"
                                body="Estamos preparando los próximos seminarios y encuentros de la red. Vuelve pronto para inscribirte."
                            />
                        )}
                    </div>
                </div>
            </section>

            <section id="miembros" className="scroll-mt-20 bg-white py-16">
                <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
                    <div className="mx-auto max-w-xl text-center">
                        <p className="text-kuelap-green text-[13px] font-bold tracking-widest uppercase">
                            Comunidad
                        </p>
                        <h2 className="font-display text-kuelap-ink mt-2 text-3xl font-extrabold sm:text-4xl">
                            Nuestros miembros
                        </h2>
                        <span className="bg-kuelap-green mx-auto mt-4 block h-1 w-14 rounded-full" />
                        <p className="text-kuelap-ink/60 mt-5 text-[15px] leading-relaxed">
                            Investigadores, docentes y profesionales que forman
                            parte de nuestra red.
                        </p>
                    </div>

                    <div className="mt-10">
                        {miembros.length > 0 ? (
                            <>
                                <MemberRow miembros={miembros} />
                                <div className="mt-8 flex justify-center">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="border-kuelap-ink/20 rounded-lg"
                                    >
                                        <a href="/miembros">
                                            Ver todos los miembros
                                            <ArrowRight className="size-4" />
                                        </a>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <EmptyState
                                icon={Users}
                                title="Aún no hay miembros publicados"
                                body="Cuando se habiliten integrantes de la red, aparecerán aquí automáticamente."
                            />
                        )}
                    </div>
                </div>
            </section>

            <section className="border-kuelap-ink/10 border-t bg-[#FAFBFC] py-16">
                <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-10">
                    <div>
                        <Eyebrow>Alcance</Eyebrow>
                        <h2 className="font-display text-kuelap-ink mt-3 text-3xl font-extrabold sm:text-4xl">
                            Nuestra red conecta Latinoamérica
                        </h2>
                        <p className="text-kuelap-ink/60 mt-4 max-w-md text-[15px] leading-relaxed">
                            Investigadores, universidades e instituciones de
                            diversos países, trabajando juntos por un futuro más
                            sostenible e inclusivo.
                        </p>

                        {paises.length > 0 ? (
                            <ul className="mt-7 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                                {paises.map((pais) => (
                                    <li
                                        key={pais.id}
                                        className="flex items-center gap-2.5"
                                    >
                                        <span className="bg-kuelap-green-soft text-kuelap-green-dark flex h-6 min-w-8 items-center justify-center rounded px-1.5 text-[11px] font-black tracking-wider">
                                            {countryCode(pais.nombre)}
                                        </span>
                                        <span className="text-kuelap-ink/75 text-[14px] font-medium">
                                            {pais.nombre}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-kuelap-ink/50 mt-7 text-[14px]">
                                Aún no hay países registrados.
                            </p>
                        )}
                    </div>

                    <div className="bg-kuelap-navy relative overflow-hidden rounded-2xl p-7 sm:p-9">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {ALCANCE_FEATURES.map((feature) => (
                                <div
                                    key={feature.label}
                                    className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-4"
                                >
                                    <span className="bg-kuelap-green/15 text-kuelap-green flex size-9 shrink-0 items-center justify-center rounded-full">
                                        <feature.icon className="size-[18px]" />
                                    </span>
                                    <span className="text-[14px] font-semibold text-white/90">
                                        {feature.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-kuelap-ink/10 border-t bg-white py-16">
                <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-6 lg:grid-cols-2 lg:px-10">
                    <div id="publicaciones" className="scroll-mt-20">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <Eyebrow>Producción académica</Eyebrow>
                                <h2 className="font-display text-kuelap-ink mt-3 text-2xl font-extrabold">
                                    Publicaciones
                                </h2>
                            </div>
                            <a
                                href="/publicaciones"
                                className="text-kuelap-green inline-flex shrink-0 items-center gap-1.5 text-[14px] font-bold"
                            >
                                Ver todas
                                <ArrowRight className="size-4" />
                            </a>
                        </div>
                        <p className="text-kuelap-ink/60 mt-3 max-w-md text-[15px] leading-relaxed">
                            Artículos, informes y materiales producidos por la
                            comunidad de investigadores.
                        </p>
                        <div className="mt-6">
                            <EmptyState
                                icon={FlaskConical}
                                title="Aún no hay publicaciones registradas"
                                body="Los trabajos de la comunidad se publicarán aquí en cuanto estén disponibles."
                            />
                        </div>
                    </div>

                    <div id="noticias" className="scroll-mt-20">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <Eyebrow>Al día</Eyebrow>
                                <h2 className="font-display text-kuelap-ink mt-3 text-2xl font-extrabold">
                                    Noticias
                                </h2>
                            </div>
                            <a
                                href="/noticias"
                                className="text-kuelap-green inline-flex shrink-0 items-center gap-1.5 text-[14px] font-bold"
                            >
                                Ver todas
                                <ArrowRight className="size-4" />
                            </a>
                        </div>
                        <p className="text-kuelap-ink/60 mt-3 max-w-md text-[15px] leading-relaxed">
                            Novedades de la red, sus miembros y sus proyectos en
                            curso.
                        </p>
                        <div className="mt-6">
                            <EmptyState
                                icon={Newspaper}
                                title="Aún no hay noticias publicadas"
                                body="Las novedades de la red aparecerán aquí en cuanto se publiquen."
                            />
                        </div>
                    </div>
                </div>
            </section>

            <JoinCta />
        </PublicLayout>
    );
}

function Eyebrow({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center gap-2">
            <span className="bg-kuelap-green h-3 w-1 rounded-full" />
            <p className="text-kuelap-green text-[13px] font-bold tracking-widest uppercase">
                {children}
            </p>
        </div>
    );
}
