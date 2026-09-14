import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br from-kuelap-navy via-kuelap-navy to-kuelap-navy-deep p-6 md:p-10">
            {/* Halos de color con blur, inspirados en las piezas gráficas de
                KUÉLAP (dorado + teal sobre azul marino), para un look más
                moderno que los círculos planos de antes. */}
            <div className="pointer-events-none absolute -top-32 -right-24 size-[28rem] rounded-full bg-amber-400/35 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-28 size-[26rem] rounded-full bg-amber-500/25 blur-3xl" />
            <div className="pointer-events-none absolute top-1/3 right-1/4 size-40 rounded-full bg-teal-400/60 blur-3xl" />
            <div className="pointer-events-none absolute top-14 right-52 size-3 rounded-full bg-teal-300 shadow-[0_0_30px_6px_rgba(45,212,191,0.6)] sm:right-60" />

            {/* Textura sutil de puntos para que el fondo no se vea plano. */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:24px_24px]" />

            <div className="z-10 flex w-full max-w-md flex-col gap-6">
                <Card className="rounded-2xl border border-white/15 bg-white/95 shadow-[0_0_80px_-20px_rgba(251,191,36,0.2)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/90">
                    <CardHeader className="px-1 text-center">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-1 self-center"
                        >
                            <div className="flex w-full items-center justify-center">
                                <AppLogoIcon className="h-auto w-full max-w-[100px] object-contain" />
                            </div>
                        </Link>
                        <CardTitle className="text-xl">{title}</CardTitle>
                        <span className="block text-xs font-semibold text-blue-600 dark:text-blue-400">
                            Red de Investigadores Kuelap
                        </span>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-0 px-7">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
