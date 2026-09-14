import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const { isMobile, setOpenMobile } = useSidebar();

    // Solo un submenú abierto a la vez (acordeón): al abrir uno, cualquier
    // otro que estuviera abierto se cierra. Arranca abierto el que contenga
    // la ruta actual, para no aterrizar en una página con su menú colapsado.
    const [openTitle, setOpenTitle] = useState<string | null>(() => {
        const activo = items.find((item) => item.items?.some((sub) => isCurrentUrl(sub.href)));
        return activo?.title ?? null;
    });

    const closeMobileSidebar = () => {
        if (isMobile) setOpenMobile(false);
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    if (!item.items || item.items.length === 0) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch onClick={closeMobileSidebar}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    const abierto = openTitle === item.title;

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            open={abierto}
                            onOpenChange={(isOpen) => setOpenTitle(isOpen ? item.title : null)}
                        >
                            <SidebarMenuItem className="group/collapsible">
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={{ children: item.title }}
                                        isActive={item.items.some((sub) => isCurrentUrl(sub.href))}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items.map((sub) => (
                                            <SidebarMenuSubItem key={sub.title}>
                                                <SidebarMenuSubButton asChild isActive={isCurrentUrl(sub.href)}>
                                                    <Link href={sub.href} prefetch onClick={closeMobileSidebar}>
                                                        {sub.icon && <sub.icon />}
                                                        <span>{sub.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
