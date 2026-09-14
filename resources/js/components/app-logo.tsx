import { Link, usePage } from '@inertiajs/react';
import { useSidebar } from '@/components/ui/sidebar';
import { useInitials } from '@/hooks/use-initials';
import { dashboard } from '@/routes';
import { edit } from '@/routes/profile';

/**
 * Marca KUÉLAP + tarjeta de identidad de la persona logueada, mostradas
 * juntas en la cabecera del sidebar. Cuando el sidebar se colapsa a modo
 * ícono, se reemplaza todo por un monograma "K" para no romper el layout.
 */
export default function AppLogo() {
    const { auth } = usePage().props;
    const { state, isMobile, setOpenMobile } = useSidebar();
    const getInitials = useInitials();
    const collapsed = state === 'collapsed' && !isMobile;
    const closeMobileSidebar = () => {
        if (isMobile) setOpenMobile(false);
    };

    if (collapsed) {
        return (
            <Link
                href={dashboard()}
                prefetch
                title="KUÉLAP"
                onClick={closeMobileSidebar}
                className="mx-auto flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-admin-600 to-admin-800 text-sm font-black text-white shadow-sm transition-transform hover:scale-105"
            >
                K
            </Link>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <Link
                href={dashboard()}
                prefetch
                onClick={closeMobileSidebar}
                className="flex items-center justify-center px-1 py-1 text-center transition-all duration-300 hover:opacity-90"
            >
                <span className="truncate text-[17px] font-extrabold italic tracking-wider text-amber-500 drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
                    RED KUÉLAP
                </span>
            </Link>

            {auth.user && (
                <Link
                    href={edit()}
                    prefetch
                    title="Ver mi perfil"
                    onClick={closeMobileSidebar}
                    className="group flex flex-col items-center gap-2 px-3 py-1 text-center transition-colors"
                >
                    <span className="relative">
                        <span className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-admin-500 to-admin-800 text-lg font-black text-white ring-2 ring-admin-400/70 ring-offset-2 ring-offset-sidebar transition-transform group-hover:scale-105">
                            {getInitials(auth.user.name)}
                        </span>
                        <span className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
                    </span>
                    <span className="max-w-full truncate text-sm font-bold text-sidebar-foreground">
                        {auth.user.name}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Administrador
                    </span>
                </Link>
            )}
        </div>
    );
}
