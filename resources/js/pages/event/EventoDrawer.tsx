import type { Evento } from './FormEvento';

interface Props {
    evento: Evento;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onCopyLink: (link: string) => void;
}

function fmtDate(d: string) {
    try { return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(d + 'T00:00:00')); }
    catch { return d; }
}
function fmtDateTime(d: string) {
    try { return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d)); }
    catch { return d; }
}

const ESTADO_CFG: Record<string, { bg: string; dot: string; text: string }> = {
    'Programado': { bg: 'bg-blue-100 dark:bg-blue-900/30', dot: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-300' },
    'En curso':   { bg: 'bg-emerald-100 dark:bg-emerald-900/30', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
    'Finalizado': { bg: 'bg-zinc-100 dark:bg-zinc-800', dot: 'bg-zinc-400', text: 'text-zinc-600 dark:text-zinc-400' },
    'Cancelado':  { bg: 'bg-red-100 dark:bg-red-900/30', dot: 'bg-red-500', text: 'text-red-700 dark:text-red-300' },
    'Pospuesto':  { bg: 'bg-amber-100 dark:bg-amber-900/30', dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300' },
};
function estadoCfg(n: string) { return ESTADO_CFG[n] ?? { bg: 'bg-zinc-100', dot: 'bg-zinc-400', text: 'text-zinc-500' }; }

function hoyISO() { return new Date().toISOString().slice(0, 10); }
function estadoInscripcion(ev: Evento) {
    const hoy = hoyISO();
    if (hoy < ev.fec_inicio_inscripcion) return { label: 'Próximamente', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' };
    if (hoy > ev.fec_fin_inscripcion) return { label: 'Cerradas', cls: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400' };
    return { label: 'Abiertas', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' };
}

const Ico = {
    X: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Edit: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
    Trash: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Copy: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    MapPin: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Monitor: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Link: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
    Calendar: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Image: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" /><circle cx="8.5" cy="8.5" r="1.5" /></svg>,
};

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3.5 py-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">{label}</p>
            <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{value}</div>
        </div>
    );
}

export default function EventoDrawer({ evento, onClose, onEdit, onDelete, onCopyLink }: Props) {
    const ecfg = estadoCfg(evento.nom_estado_event);
    const inscCfg = estadoInscripcion(evento);

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
            <aside className="fixed right-0 top-0 bottom-0 z-50 flex flex-col w-full sm:w-[440px] max-w-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden">

                {/* Imagen de cabecera */}
                <div className="relative h-44 shrink-0 bg-gradient-to-br from-admin-100 to-admin-200 dark:from-admin-950/40 dark:to-admin-900/40">
                    {evento.image_url
                        ? <img src={evento.image_url} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-admin-300"><Ico.Image /></div>}
                    <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 text-white hover:bg-black/60 cursor-pointer backdrop-blur-sm">
                        <Ico.X />
                    </button>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full ${ecfg.bg} ${ecfg.text} backdrop-blur-sm shadow`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${ecfg.dot} ${evento.nom_estado_event === 'En curso' ? 'animate-pulse' : ''}`} /> {evento.nom_estado_event}
                        </span>
                    </div>
                </div>

                <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-admin-500 dark:text-admin-400 uppercase tracking-wider">{evento.nom_tipo_evento}</p>
                        <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-100 leading-snug">{evento.nom_evento}</h2>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-200 cursor-pointer">
                            <Ico.Edit /> Editar
                        </button>
                        <button onClick={onDelete} className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 cursor-pointer">
                            <Ico.Trash />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">Descripción</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">{evento.descripcion}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <InfoItem label="Modalidad" value={evento.nom_modalidad} />
                        <InfoItem label="Tipo de evento" value={evento.nom_tipo_evento} />
                        <InfoItem label="Fecha inicio" value={fmtDate(evento.fecha_inicio)} />
                        <InfoItem label="Fecha fin" value={fmtDate(evento.fecha_fin)} />
                    </div>

                    <div className="px-4 py-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-1.5">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Período de inscripción</p>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${inscCfg.cls}`}>{inscCfg.label}</span>
                        </div>
                        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                            <Ico.Calendar /> {fmtDate(evento.fec_inicio_inscripcion)} — {fmtDate(evento.fec_fin_inscripcion)}
                        </p>
                    </div>

                    {evento.nom_modalidad === 'Presencial' && (
                        <div className="px-4 py-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/50">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1.5"><Ico.MapPin /> Lugar / espacio</p>
                            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{evento.espacio_lugar ?? '—'}</p>
                        </div>
                    )}

                    {evento.nom_modalidad === 'Virtual' && (
                        <div className="px-4 py-3.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/50 space-y-2.5">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5"><Ico.Monitor /> Plataformas de transmisión</p>
                            {evento.plataformas.length === 0 && <p className="text-xs text-zinc-400 italic">Sin plataformas configuradas</p>}
                            {evento.plataformas.map(p => (
                                <div key={p.idevent_canal} className="flex items-center justify-between gap-2 bg-white dark:bg-zinc-900 rounded-lg px-3 py-2 border border-cyan-100 dark:border-cyan-900/40">
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{p.nom_plataforma}</p>
                                        <p className="text-[10px] text-zinc-400 truncate max-w-[220px]">{p.link_transmision}</p>
                                    </div>
                                    <button onClick={() => onCopyLink(p.link_transmision)} className="p-1.5 rounded-lg text-cyan-600 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 cursor-pointer shrink-0">
                                        <Ico.Copy />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {evento.link_form_inscripcion && (
                        <div className="px-4 py-3.5 rounded-xl bg-admin-50 dark:bg-admin-950/20 border border-admin-200 dark:border-admin-800/50">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-admin-600 dark:text-admin-400 flex items-center gap-1.5"><Ico.Link /> Formulario de inscripción</p>
                                <button onClick={() => onCopyLink(evento.link_form_inscripcion!)} className="text-[10px] font-bold text-admin-600 dark:text-admin-400 hover:underline cursor-pointer flex items-center gap-1">
                                    <Ico.Copy /> Copiar
                                </button>
                            </div>
                            <p className="text-xs text-zinc-600 dark:text-zinc-300 truncate">{evento.link_form_inscripcion}</p>
                        </div>
                    )}

                    <div className="text-[11px] text-zinc-400 dark:text-zinc-600 space-y-0.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <p>ID del evento: #{evento.idevento}</p>
                        <p>Creado: {fmtDateTime(evento.created_at)}</p>
                        <p>Actualizado: {fmtDateTime(evento.updated_at)}</p>
                    </div>
                </div>
            </aside>
        </>
    );
}