import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { MemberCard } from '@/components/home/member-card';
import type { HomeMiembro } from '@/types/home';

export function MemberRow({ miembros }: { miembros: HomeMiembro[] }) {
    const trackRef = useRef<HTMLDivElement>(null);

    const scrollBy = (amount: number) => {
        trackRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
    };

    return (
        <div className="relative">
            <div
                ref={trackRef}
                className="flex snap-x snap-mandatory scrollbar-none gap-5 overflow-x-auto scroll-smooth pb-2"
            >
                {miembros.map((miembro) => (
                    <MemberCard key={miembro.id} miembro={miembro} />
                ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={() => scrollBy(-280)}
                    aria-label="Ver miembros anteriores"
                    className="border-kuelap-ink/15 hover:bg-kuelap-navy hover:border-kuelap-navy flex size-10 items-center justify-center rounded-full border transition-colors hover:text-white"
                >
                    <ChevronLeft className="size-4" />
                </button>
                <button
                    type="button"
                    onClick={() => scrollBy(280)}
                    aria-label="Ver más miembros"
                    className="border-kuelap-ink/15 hover:bg-kuelap-navy hover:border-kuelap-navy flex size-10 items-center justify-center rounded-full border transition-colors hover:text-white"
                >
                    <ChevronRight className="size-4" />
                </button>
            </div>
        </div>
    );
}
