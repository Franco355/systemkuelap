import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import KuelapMark from '@/components/icons/kuelap-mark';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { dashboard, login, register } from '@/routes';

const NAV_ITEMS = [
    { label: 'Inicio', href: '/' },
    { label: 'Somos', href: '/nosotros' },
    { label: 'Miembros', href: '/miembros' },
    { label: 'Actividades', href: '/actividades' },
    { label: 'Publicaciones', href: '#publicaciones' },
    { label: 'Noticias', href: '#noticias' },
    { label: 'Contacto', href: '#contacto' },
];

export function SiteHeader() {
    const { auth, empresa } = usePage().props;
    const [open, setOpen] = useState(false);

    const brand =
        empresa?.nombre ?? 'Red de Investigadores Latinoamericanos KUÉLAP';

    return (
        <header className="border-kuelap-ink/10 sticky top-0 z-40 border-b bg-white">
            <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between gap-6 px-6 lg:px-10">
                <Link
                    href="/"
                    className="text-kuelap-ink flex shrink-0 items-center gap-3"
                >
                    <KuelapMark className="text-kuelap-navy h-10 w-10 shrink-0" />
                    <span className="hidden flex-col leading-tight sm:flex">
                        <span className="text-kuelap-navy text-[13px] font-bold tracking-tight uppercase">
                            {brand}
                        </span>
                        <span className="font-display text-kuelap-ink -mt-0.5 text-xl font-bold">
                            Kuélap
                        </span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-7 xl:flex">
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-kuelap-ink/70 hover:text-kuelap-green border-b-2 border-transparent py-1 text-[13px] font-bold tracking-wide uppercase transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden shrink-0 items-center gap-3 xl:flex">
                    {auth.user ? (
                        <Button
                            asChild
                            className="bg-kuelap-green hover:bg-kuelap-green-dark rounded-lg text-white"
                        >
                            <Link href={dashboard()}>Mi panel</Link>
                        </Button>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="text-kuelap-ink/70 hover:text-kuelap-ink text-[13px] font-bold tracking-wide uppercase transition-colors"
                            >
                                Iniciar sesión
                            </Link>
                            <Button
                                asChild
                                className="bg-kuelap-green hover:bg-kuelap-green-dark rounded-lg font-semibold text-white"
                            >
                                <Link href={register()}>Únete a la red</Link>
                            </Button>
                        </>
                    )}
                </div>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button
                            type="button"
                            className="text-kuelap-ink -mr-2 flex size-10 items-center justify-center rounded-md xl:hidden"
                            aria-label="Abrir menú"
                        >
                            <Menu className="size-6" />
                        </button>
                    </SheetTrigger>
                    <SheetContent
                        side="right"
                        className="text-kuelap-ink w-full max-w-xs gap-0 bg-white p-0"
                    >
                        <SheetTitle className="sr-only">
                            Menú de navegación
                        </SheetTitle>
                        <div className="border-kuelap-ink/10 flex h-20 items-center gap-3 border-b px-6">
                            <KuelapMark className="text-kuelap-navy h-8 w-8" />
                            <span className="font-display text-lg font-bold">
                                Kuélap
                            </span>
                        </div>
                        <nav className="flex flex-col px-6 py-6">
                            {NAV_ITEMS.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={cn(
                                        'border-kuelap-ink/10 border-b py-4 text-[13px] font-bold tracking-wide uppercase',
                                    )}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                        <div className="mt-auto flex flex-col gap-3 px-6 pb-8">
                            {auth.user ? (
                                <Button
                                    asChild
                                    className="bg-kuelap-green rounded-lg text-white"
                                >
                                    <Link href={dashboard()}>Mi panel</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="border-kuelap-ink/20 rounded-lg"
                                    >
                                        <Link href={login()}>
                                            Iniciar sesión
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        className="bg-kuelap-green rounded-lg font-semibold text-white"
                                    >
                                        <Link href={register()}>
                                            Únete a la red
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
