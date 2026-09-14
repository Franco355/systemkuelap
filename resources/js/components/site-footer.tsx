import { Link, usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import FriezeBand from '@/components/icons/frieze-band';
import KuelapMark from '@/components/icons/kuelap-mark';
import { socialIconFor } from '@/lib/social-icons';

const EXPLORAR_LINKS = [
    { label: 'Inicio', href: '/' },
    { label: '¿Quiénes somos?', href: '/nosotros' },
    { label: 'Nuestros miembros', href: '#miembros' },
    { label: 'Actividades', href: '/actividades' },
    { label: 'Publicaciones', href: '#publicaciones' },
];

const COMUNIDAD_LINKS = [
    { label: 'Noticias', href: '#noticias' },
    { label: 'Únete a la red', href: '#contacto' },
    { label: 'Membresía', href: '#contacto' },
    { label: 'Contacto', href: '#contacto' },
];

export function SiteFooter() {
    const { empresa } = usePage().props;

    const nombre =
        empresa?.nombre ?? 'Red de Investigadores Latinoamericanos KUÉLAP';
    const marca = empresa?.nombreCorto ?? 'Kuélap';
    const descripcion = empresa?.descripcion ?? 'Red académica latinoamericana';
    const redes = empresa?.redes ?? [];
    const year = new Date().getFullYear();

    return (
        <footer
            id="contacto"
            className="bg-kuelap-navy scroll-mt-20 text-white/70"
        >
            <FriezeBand className="text-kuelap-green/60 h-3 w-full" />

            <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
                    <div>
                        <div className="flex items-center gap-3 text-white">
                            <KuelapMark className="h-9 w-9" />
                            <span className="font-display text-xl font-bold">
                                {marca}
                            </span>
                        </div>
                        <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/60">
                            {descripcion}. Conectamos investigadores,
                            universidades y proyectos académicos a lo largo de
                            América Latina.
                        </p>

                        {redes.length > 0 && (
                            <ul className="mt-6 flex flex-wrap gap-2">
                                {redes.map((red) => {
                                    const Icon = socialIconFor(red.tipo);
                                    return (
                                        <li key={red.id}>
                                            <a
                                                href={red.enlace}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                aria-label={red.tipo}
                                                className="border-kuelap-navy-line hover:border-kuelap-green hover:text-kuelap-green flex size-10 items-center justify-center rounded-full border text-white/70 transition-colors"
                                            >
                                                <Icon className="size-[18px]" />
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    <nav aria-label="Explorar">
                        <h3 className="text-[13px] font-bold tracking-wide text-white uppercase">
                            Explorar
                        </h3>
                        <ul className="mt-5 flex flex-col gap-3">
                            {EXPLORAR_LINKS.map((item) => (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        className="hover:text-kuelap-green text-[15px] text-white/60 transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-label="Comunidad">
                        <h3 className="text-[13px] font-bold tracking-wide text-white uppercase">
                            Comunidad
                        </h3>
                        <ul className="mt-5 flex flex-col gap-3">
                            {COMUNIDAD_LINKS.map((item) => (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        className="hover:text-kuelap-green text-[15px] text-white/60 transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h3 className="text-[13px] font-bold tracking-wide text-white uppercase">
                            Contacto
                        </h3>
                        <ul className="mt-5 flex flex-col gap-3 text-[15px] text-white/60">
                            {empresa?.correo && (
                                <li className="flex items-start gap-3">
                                    <Mail className="text-kuelap-green mt-0.5 size-[18px] shrink-0" />
                                    <a
                                        href={`mailto:${empresa.correo}`}
                                        className="hover:text-kuelap-green transition-colors"
                                    >
                                        {empresa.correo}
                                    </a>
                                </li>
                            )}
                            {empresa?.telefono && (
                                <li className="flex items-start gap-3">
                                    <Phone className="text-kuelap-green mt-0.5 size-[18px] shrink-0" />
                                    <a
                                        href={`tel:${empresa.telefono}`}
                                        className="hover:text-kuelap-green transition-colors"
                                    >
                                        {empresa.telefono}
                                    </a>
                                </li>
                            )}
                            {empresa?.direccion && (
                                <li className="flex items-start gap-3">
                                    <MapPin className="text-kuelap-green mt-0.5 size-[18px] shrink-0" />
                                    <span>{empresa.direccion}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="border-kuelap-navy-line mt-14 flex flex-col gap-4 border-t pt-8 text-[13px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {year} {nombre}
                    </p>
                    <p>
                        <Link
                            href="/"
                            className="hover:text-kuelap-green transition-colors"
                        >
                            Ir al inicio
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
