import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

/**
 * Layout for the public-facing KUÉLAP site (as opposed to the
 * authenticated dashboard). Wraps every marketing/content page in the
 * shared header and footer, both driven by the `empresa` data shared
 * from HandleInertiaRequests.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </div>
    );
}
