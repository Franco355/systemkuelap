import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HomeEvento } from '@/types/home';

export function EventCard({ evento }: { evento: HomeEvento }) {
    const fecha = new Date(evento.fechaInicio);
    const dia = fecha.toLocaleDateString('es-PE', { day: '2-digit' });
    const mes = fecha
        .toLocaleDateString('es-PE', { month: 'short' })
        .replace('.', '')
        .toUpperCase();
    const pasada = evento.estado === 'pasada';

    return (
        <article className="border-kuelap-ink/10 hover:border-kuelap-green/30 group overflow-hidden rounded-2xl border bg-white shadow-[0_1px_2px_rgba(16,27,51,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_32px_-16px_rgba(16,27,51,0.18)]">
            <div className="bg-kuelap-ink/5 relative aspect-[16/10] overflow-hidden">
                <img
                    src={evento.imagen}
                    alt={evento.titulo}
                    loading="lazy"
                    className={cn(
                        'h-full w-full object-cover transition-transform duration-300 group-hover:scale-105',
                        pasada && 'grayscale',
                    )}
                />
                {pasada && (
                    <div className="bg-kuelap-ink/30 absolute inset-0" />
                )}

                <div className="absolute top-3 left-3 flex flex-col items-center rounded-lg bg-white/95 px-2.5 py-1.5 leading-none shadow-sm backdrop-blur-sm">
                    <span className="text-kuelap-navy text-[15px] font-extrabold">
                        {dia}
                    </span>
                    <span className="text-kuelap-ink/55 mt-0.5 text-[9px] font-bold tracking-wide">
                        {mes}
                    </span>
                </div>

                {(pasada || evento.tipo) && (
                    <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-1.5">
                        {pasada && (
                            <span className="bg-kuelap-ink/70 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
                                Finalizado
                            </span>
                        )}
                        {evento.tipo && (
                            <span className="bg-kuelap-green rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
                                {evento.tipo}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="p-5 text-center">
                <h3 className="font-display text-kuelap-ink line-clamp-1 text-[16px] font-bold">
                    {evento.titulo}
                </h3>
                <p className="text-kuelap-ink/60 mt-1.5 line-clamp-2 text-[13px] leading-relaxed">
                    {evento.descripcion}
                </p>

                {(evento.modalidad || evento.lugar) && (
                    <div className="text-kuelap-ink/50 mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[12px]">
                        {evento.modalidad && (
                            <span className="flex items-center gap-1">
                                <Clock className="size-3.5" />
                                {evento.modalidad}
                            </span>
                        )}
                        {evento.lugar && (
                            <span className="flex items-center gap-1">
                                <MapPin className="size-3.5" />
                                {evento.lugar}
                            </span>
                        )}
                    </div>
                )}

                {evento.inscripcion && !pasada && (
                    <a
                        href={evento.inscripcion}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-kuelap-green mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold"
                    >
                        Ver actividad
                        <ArrowRight className="size-3.5" />
                    </a>
                )}
            </div>
        </article>
    );
}
