import type { Auth } from '@/types/auth';
import type { Empresa } from '@/types/company';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            empresa: Empresa | null;
            [key: string]: unknown;
        };
    }
}
