import { Link, router } from '@inertiajs/react';
import { BookOpen, Building2, Calendar, FolderGit2, Images, LayoutGrid, LogOut, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { dashboard, home, logout } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Eventos',
        href: '/eventos',
        icon: Calendar,
    },
    {
        title: 'Empresa',
        href: '/empresa',
        icon: Building2,
    },
    {
        title: 'Miembros',
        href: '/equipo',
        icon: Users,
    },
    {
        title: 'Imágenes',
        href: '/imagenes',
        icon: Images,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Portal web',
        href: home(),
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const cleanup = useMobileNavigation();
    const { isMobile, setOpenMobile } = useSidebar();

    const handleLogout = () => {
        cleanup();
        if (isMobile) setOpenMobile(false);
        router.flushAll();
    };

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <AppLogo />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip={{ children: 'Cerrar sesión' }}
                            className="text-red-500 hover:text-red-500 data-[state=open]:hover:text-red-500"
                        >
                            <Link
                                href={logout()}
                                as="button"
                                onClick={handleLogout}
                                data-test="logout-button"
                            >
                                <LogOut />
                                <span>Cerrar sesión</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
