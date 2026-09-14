import { useEffect, useState } from 'react';
import FriezeBand from '@/components/icons/frieze-band';
import KuelapMark from '@/components/icons/kuelap-mark';
import { cn } from '@/lib/utils';
import type { HomeImagen } from '@/types/home';

const AUTOPLAY_MS = 6500;

/**
 * Full-bleed background carousel for the hero. Rotates through the photos
 * staff upload to the `imagenes` table; with none uploaded yet it shows a
 * single branded panel instead of a fabricated stock photo.
 */
export function HeroCarousel({ imagenes }: { imagenes: HomeImagen[] }) {
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (imagenes.length < 2 || paused) {
            return;
        }

        const id = window.setInterval(() => {
            setActive((current) => (current + 1) % imagenes.length);
        }, AUTOPLAY_MS);

        return () => window.clearInterval(id);
    }, [imagenes.length, paused]);

    return (
        <div
            className="absolute inset-0"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {imagenes.length > 0 ? (
                imagenes.map((imagen, index) => (
                    <img
                        key={imagen.id}
                        src={imagen.url}
                        alt={imagen.nombre}
                        className={cn(
                            'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out',
                            index === active ? 'opacity-100' : 'opacity-0',
                        )}
                    />
                ))
            ) : (
                <div className="bg-kuelap-navy absolute inset-0">
                    <KuelapMark className="text-kuelap-green/10 absolute -top-16 -right-16 h-[420px] w-[420px]" />
                    <FriezeBand className="text-kuelap-green/25 absolute bottom-0 h-4 w-full" />
                </div>
            )}

            <div className="from-kuelap-navy via-kuelap-navy/85 absolute inset-0 bg-gradient-to-r to-transparent" />

            {imagenes.length > 1 && (
                <div className="absolute bottom-8 left-6 z-10 flex gap-2 lg:left-10">
                    {imagenes.map((imagen, index) => (
                        <button
                            key={imagen.id}
                            type="button"
                            aria-label={`Ir a la imagen ${index + 1}`}
                            onClick={() => setActive(index)}
                            className={cn(
                                'h-1.5 rounded-full transition-all',
                                index === active
                                    ? 'bg-kuelap-green w-8'
                                    : 'w-4 bg-white/40 hover:bg-white/60',
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
