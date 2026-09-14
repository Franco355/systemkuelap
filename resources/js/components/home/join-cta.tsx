import { Link } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { register } from '@/routes';

/**
 * Closing conversion band shared by every public page — the one recurring
 * "become a member" moment, so it always looks and behaves the same way
 * regardless of which page a visitor lands on.
 */
export function JoinCta() {
    return (
        <section className="bg-kuelap-green">
            <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 px-6 py-12 lg:flex-row lg:items-center lg:px-10">
                <div>
                    <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                        ¿Quieres formar parte de la red?
                    </h2>
                    <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-white/85">
                        Súmate a la comunidad académica latinoamericana y
                        colabora en proyectos de investigación con impacto real.
                    </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-4">
                    <Button
                        asChild
                        size="lg"
                        className="text-kuelap-green-dark rounded-lg bg-white font-semibold hover:bg-white/90"
                    >
                        <Link href={register()}>Únete ahora</Link>
                    </Button>
                    <a
                        href="#contacto"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
                    >
                        <Mail className="size-4" />
                        Contáctanos
                    </a>
                </div>
            </div>
        </section>
    );
}
