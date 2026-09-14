import { countryCode } from '@/lib/country-codes';
import { cn } from '@/lib/utils';
import type { HomeMiembro } from '@/types/home';

function initials(nombre: string): string {
    const parts = nombre.trim().split(/\s+/);

    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

export function MemberCard({
    miembro,
    className,
}: {
    miembro: HomeMiembro;
    className?: string;
}) {
    return (
        <article
            className={cn(
                'border-kuelap-ink/10 hover:border-kuelap-green/30 group w-64 shrink-0 snap-start rounded-2xl border bg-white p-6 text-center shadow-[0_1px_2px_rgba(16,27,51,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_32px_-16px_rgba(16,27,51,0.18)]',
                className,
            )}
        >
            <div className="ring-kuelap-green-soft group-hover:ring-kuelap-green/30 mx-auto flex size-[74px] items-center justify-center rounded-full ring-4 transition-colors">
                <div className="bg-kuelap-navy flex size-full items-center justify-center rounded-full text-[17px] font-bold text-white">
                    {initials(miembro.nombre)}
                </div>
            </div>

            <h3 className="text-kuelap-ink font-display mt-4 text-[16px] leading-snug font-bold text-balance">
                {miembro.nombre}
            </h3>

            {miembro.universidad && (
                <p
                    className="text-kuelap-green mt-1 line-clamp-2 text-[13px] leading-snug font-semibold"
                    title={miembro.universidad}
                >
                    {miembro.universidad}
                </p>
            )}

            {miembro.pais && (
                <div className="border-kuelap-ink/10 mt-4 flex justify-center border-t pt-4">
                    <span className="bg-kuelap-green-soft text-kuelap-green-dark inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold">
                        <span className="text-[10px] font-black tracking-wider">
                            {countryCode(miembro.pais)}
                        </span>
                        {miembro.pais}
                    </span>
                </div>
            )}
        </article>
    );
}
