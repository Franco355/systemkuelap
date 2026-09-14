import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

/**
 * Shared opening banner for every secondary public page (Nosotros,
 * Miembros, Actividades, Publicaciones, Noticias…) — the home page keeps
 * its own photo hero instead. Compact by design: a title, one supporting
 * line, and a breadcrumb, not a second hero.
 */
export function PageHeaderBanner({
    title,
    subtitle,
    breadcrumb,
}: {
    title: string;
    subtitle: string;
    breadcrumb: string;
}) {
    return (
        <>
            <section className="from-kuelap-navy to-kuelap-green-dark relative overflow-hidden bg-gradient-to-br">
                <div
                    className="absolute inset-0 [background-image:radial-gradient(circle,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:22px_22px] opacity-40"
                    aria-hidden="true"
                />
                <div className="relative mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
                    <h1 className="font-display max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
                        {title}
                    </h1>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
                        {subtitle}
                    </p>
                </div>
            </section>

            <div className="border-kuelap-ink/10 border-b bg-white">
                <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-6 py-3 text-[13px] lg:px-10">
                    <Link
                        href="/"
                        className="text-kuelap-ink/50 hover:text-kuelap-green transition-colors"
                    >
                        Inicio
                    </Link>
                    <ChevronRight className="text-kuelap-ink/30 size-3.5" />
                    <span className="text-kuelap-ink font-semibold">
                        {breadcrumb}
                    </span>
                </div>
            </div>
        </>
    );
}
