import { useState, useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Modalidad { idmodalidad: number; nom_modalidad: string }
interface TipoEvento { idtipo_evento: number; nom_tipo_evento: string }
interface Plataforma { idplataforma: number; nom_plataforma: string }

interface PlataformaEvento {
    idevent_canal: number;
    idplataforma: number;
    nom_plataforma: string;
    link_transmision: string;
}

export interface Evento {
    idevento: number;
    nom_evento: string;
    descripcion: string;
    idestado_event: number; nom_estado_event: string;
    idmodalidad: number; nom_modalidad: string;
    idtipo_evento: number; nom_tipo_evento: string;
    fecha_inicio: string; fecha_fin: string;
    fec_inicio_inscripcion: string; fec_fin_inscripcion: string;
    espacio_lugar: string | null;
    link_form_inscripcion: string | null;
    image_evento: string | null;
    image_url: string | null;
    plataformas: PlataformaEvento[];
    created_at: string; updated_at: string;
}

interface PlataformaForm { idplataforma: string; link_transmision: string }
type EstadoModo = 'automatico' | 'cancelado' | 'pospuesto';

interface Props {
    open: boolean;
    evento: Evento | null; // null = crear
    modalidades: Modalidad[];
    tiposEvento: TipoEvento[];
    plataformas: Plataforma[];
    onClose: () => void;
    onSaved: (ev: Evento, isNew: boolean) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCSRF(): string {
    return (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';
}
async function apiFetch(url: string, method: 'GET' | 'POST', body?: FormData) {
    return fetch(url, { method, headers: { 'X-CSRF-TOKEN': getCSRF(), Accept: 'application/json' }, body });
}
function hoyISO() { return new Date().toISOString().slice(0, 10); }

/** Réplica en cliente de la regla del servidor, solo para previsualizar. */
function estadoAutomaticoPreview(desde: string, hasta: string): string {
    if (!desde || !hasta) return '—';
    const hoy = hoyISO();
    if (hoy < desde) return 'Programado';
    if (hoy > hasta) return 'Finalizado';
    return 'En curso';
}

const ESTADO_PREVIEW_CFG: Record<string, string> = {
    'Programado': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'En curso':   'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    'Finalizado': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

// ─── UI helpers ───────────────────────────────────────────────────────────────

function Field({ label, error, req, hint, children }: { label: string; error?: string; req?: boolean; hint?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5">
                {label}{req && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {children}
            {hint && !error && <p className="text-[10px] text-zinc-400 mt-1">{hint}</p>}
            {error && <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">⚠ {error}</p>}
        </div>
    );
}
function inp(err?: boolean) {
    return `w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all
        bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400
        ${err ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-300/20' : 'border-zinc-200 dark:border-zinc-700 focus:border-admin-400 dark:focus:border-admin-500 focus:ring-2 focus:ring-admin-300/20'}`;
}

const Ico = {
    X: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Xs: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Plus: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Image: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" /><circle cx="8.5" cy="8.5" r="1.5" /></svg>,
    MapPin: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Monitor: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Link: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
    Alert: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    Spin: () => <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>,
};

const EMPTY_FORM = {
    nom_evento: '', descripcion: '',
    idmodalidad: '', idtipo_evento: '',
    fecha_inicio: '', fecha_fin: '',
    fec_inicio_inscripcion: '', fec_fin_inscripcion: '',
    espacio_lugar: '', link_form_inscripcion: '',
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function FormEvento({ open, evento, modalidades, tiposEvento, plataformas, onClose, onSaved }: Props) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [estadoModo, setEstadoModo] = useState<EstadoModo>('automatico');
    const [platsForm, setPlatsForm] = useState<PlataformaForm[]>([{ idplataforma: '', link_transmision: '' }]);
    const [imgFile, setImgFile] = useState<File | null>(null);
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [errs, setErrs] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const isEdit = !!evento;

    useEffect(() => {
        if (!open) return;
        if (evento) {
            setForm({
                nom_evento: evento.nom_evento,
                descripcion: evento.descripcion,
                idmodalidad: String(evento.idmodalidad),
                idtipo_evento: String(evento.idtipo_evento),
                fecha_inicio: evento.fecha_inicio.slice(0, 10),
                fecha_fin: evento.fecha_fin.slice(0, 10),
                fec_inicio_inscripcion: evento.fec_inicio_inscripcion.slice(0, 10),
                fec_fin_inscripcion: evento.fec_fin_inscripcion.slice(0, 10),
                espacio_lugar: evento.espacio_lugar ?? '',
                link_form_inscripcion: evento.link_form_inscripcion ?? '',
            });
            setEstadoModo(
                evento.nom_estado_event === 'Cancelado' ? 'cancelado'
                    : evento.nom_estado_event === 'Pospuesto' ? 'pospuesto'
                        : 'automatico'
            );
            setPlatsForm(
                evento.plataformas.length > 0
                    ? evento.plataformas.map(p => ({ idplataforma: String(p.idplataforma), link_transmision: p.link_transmision }))
                    : [{ idplataforma: '', link_transmision: '' }]
            );
            setImgPreview(evento.image_url);
        } else {
            setForm(EMPTY_FORM);
            setEstadoModo('automatico');
            setPlatsForm([{ idplataforma: '', link_transmision: '' }]);
            setImgPreview(null);
        }
        setImgFile(null);
        setErrs({});
    }, [open, evento?.idevento]);

    if (!open) return null;

    const set = (k: keyof typeof form, v: string) => {
        setForm(p => ({ ...p, [k]: v }));
        setErrs(p => { const n = { ...p }; delete n[k]; return n; });
    };

    const modalidadSel = modalidades.find(m => String(m.idmodalidad) === form.idmodalidad);
    const esVirtual = modalidadSel?.nom_modalidad.toLowerCase() === 'virtual';
    const esPresencial = modalidadSel?.nom_modalidad.toLowerCase() === 'presencial';
    const previewAutomatico = estadoAutomaticoPreview(form.fecha_inicio, form.fecha_fin);

    const handleImg = (file: File | null) => {
        setImgFile(file);
        setErrs(p => { const n = { ...p }; delete n.image_evento; return n; });
        if (file) setImgPreview(URL.createObjectURL(file));
    };

    const addPlataforma = () => setPlatsForm(p => [...p, { idplataforma: '', link_transmision: '' }]);
    const removePlataforma = (idx: number) => setPlatsForm(p => p.filter((_, i) => i !== idx));
    const updatePlataforma = (idx: number, k: keyof PlataformaForm, v: string) => {
        setPlatsForm(p => p.map((x, i) => i === idx ? { ...x, [k]: v } : x));
    };

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (!form.nom_evento.trim()) e.nom_evento = 'Obligatorio.';
        if (!form.descripcion.trim()) e.descripcion = 'Obligatorio.';
        if (!form.idmodalidad) e.idmodalidad = 'Selecciona una modalidad.';
        if (!form.idtipo_evento) e.idtipo_evento = 'Selecciona un tipo.';
        if (!isEdit && !imgFile) e.image_evento = 'La imagen del evento es obligatoria.';

        if (!form.fecha_inicio) e.fecha_inicio = 'Obligatorio.';
        if (!form.fecha_fin) e.fecha_fin = 'Obligatorio.';
        if (form.fecha_inicio && form.fecha_fin && form.fecha_fin < form.fecha_inicio) {
            e.fecha_fin = 'Debe ser igual o posterior a la fecha de inicio.';
        }
        if (!form.fec_inicio_inscripcion) e.fec_inicio_inscripcion = 'Obligatorio.';
        if (!form.fec_fin_inscripcion) e.fec_fin_inscripcion = 'Obligatorio.';
        if (form.fec_inicio_inscripcion && form.fec_fin_inscripcion && form.fec_fin_inscripcion < form.fec_inicio_inscripcion) {
            e.fec_fin_inscripcion = 'Debe ser igual o posterior al inicio de inscripción.';
        }
        if (form.fec_fin_inscripcion && form.fecha_fin && form.fec_fin_inscripcion > form.fecha_fin) {
            e.fec_fin_inscripcion = 'No puede cerrar después de que termine el evento.';
        }
        if (form.link_form_inscripcion && !/^https?:\/\/.+/.test(form.link_form_inscripcion)) {
            e.link_form_inscripcion = 'Debe ser una URL válida (http:// o https://).';
        }

        if (esPresencial && !form.espacio_lugar.trim()) {
            e.espacio_lugar = 'El lugar/espacio es obligatorio para eventos presenciales.';
        }
        if (esVirtual) {
            const validas = platsForm.filter(p => p.idplataforma && p.link_transmision.trim());
            if (validas.length === 0) {
                e.plataformas = 'Agrega al menos una plataforma con su enlace.';
            } else {
                for (const p of validas) {
                    if (!/^https?:\/\/.+/.test(p.link_transmision.trim())) {
                        e.plataformas = 'Todos los enlaces de plataforma deben ser URLs válidas.';
                        break;
                    }
                }
                const ids = validas.map(p => p.idplataforma);
                if (new Set(ids).size !== ids.length) e.plataformas = 'No repitas la misma plataforma.';
            }
        }

        setErrs(e);
        return Object.keys(e).length === 0;
    };

    const submit = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('nom_evento', form.nom_evento);
            fd.append('descripcion', form.descripcion);
            fd.append('estado_modo', estadoModo);
            fd.append('idmodalidad', form.idmodalidad);
            fd.append('idtipo_evento', form.idtipo_evento);
            fd.append('fecha_inicio', form.fecha_inicio);
            fd.append('fecha_fin', form.fecha_fin);
            fd.append('fec_inicio_inscripcion', form.fec_inicio_inscripcion);
            fd.append('fec_fin_inscripcion', form.fec_fin_inscripcion);
            fd.append('espacio_lugar', esPresencial ? form.espacio_lugar : '');
            fd.append('link_form_inscripcion', form.link_form_inscripcion);
            if (imgFile) fd.append('image_evento', imgFile);

            if (esVirtual) {
                const validas = platsForm
                    .filter(p => p.idplataforma && p.link_transmision.trim())
                    .map(p => ({ idplataforma: Number(p.idplataforma), link_transmision: p.link_transmision.trim() }));
                fd.append('plataformas', JSON.stringify(validas));
            } else {
                fd.append('plataformas', JSON.stringify([]));
            }

            if (isEdit) fd.append('_method', 'PUT');

            const url = isEdit ? `/eventos/${evento!.idevento}` : '/eventos';
            const res = await apiFetch(url, 'POST', fd);
            const data = await res.json();

            if (data.success) {
                onSaved(data.evento, !isEdit);
                onClose();
            } else {
                if (data.errors) {
                    const flat: Record<string, string> = {};
                    Object.entries(data.errors).forEach(([k, v]) => { flat[k] = Array.isArray(v) ? v[0] as string : String(v); });
                    setErrs(flat);
                }
                setErrs(p => ({ ...p, _general: data.message ?? 'Error al guardar.' }));
            }
        } catch {
            setErrs(p => ({ ...p, _general: 'No se pudo conectar con el servidor.' }));
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed z-[51] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[min(820px,96vw)] max-h-[92vh] overflow-y-auto
                bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl">

                <div className="h-1.5 w-full bg-gradient-to-r from-admin-500 via-admin-600 to-admin-800 sticky top-0 z-20" />

                <div className="sticky top-1.5 z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <div>
                        <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                            {isEdit ? '✏️ Editar evento' : '🎉 Nuevo evento'}
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">{isEdit ? evento?.nom_evento : 'Completa la información del evento'}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"><Ico.X /></button>
                </div>

                <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">

                    {/* ── Columna izquierda: imagen + estado ── */}
                    <div className="space-y-4">
                        <Field label="Imagen del evento" req={!isEdit} error={errs.image_evento}>
                            <div
                                onClick={() => fileRef.current?.click()}
                                className="w-full aspect-video rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-admin-400 transition-colors bg-zinc-50 dark:bg-zinc-800/50"
                            >
                                {imgPreview
                                    ? <img src={imgPreview} alt="preview" className="w-full h-full object-cover" />
                                    : <span className="text-zinc-400 flex flex-col items-center gap-1 text-[11px]"><Ico.Image />Subir imagen</span>}
                            </div>
                            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => handleImg(e.target.files?.[0] ?? null)} />
                            <p className="text-[10px] text-zinc-400 mt-1.5">JPG, PNG o WEBP · máx. 4MB</p>
                        </Field>

                        <Field label="Estado del evento">
                            <div className="space-y-1.5">
                                <button type="button" onClick={() => setEstadoModo('automatico')}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 text-xs font-bold cursor-pointer transition-all
                                        ${estadoModo === 'automatico' ? 'border-admin-400 bg-admin-50 dark:bg-admin-950/30 dark:border-admin-600 text-admin-700 dark:text-admin-300' : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-300'}`}>
                                    Automático (según fechas)
                                    {estadoModo === 'automatico' && previewAutomatico !== '—' && (
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${ESTADO_PREVIEW_CFG[previewAutomatico] ?? 'bg-zinc-100 text-zinc-500'}`}>{previewAutomatico}</span>
                                    )}
                                </button>
                                <button type="button" onClick={() => setEstadoModo('pospuesto')}
                                    className={`w-full px-3 py-2.5 rounded-xl border-2 text-xs font-bold cursor-pointer transition-all text-left
                                        ${estadoModo === 'pospuesto' ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-600 text-amber-700 dark:text-amber-300' : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-300'}`}>
                                    Marcar como Pospuesto
                                </button>
                                <button type="button" onClick={() => setEstadoModo('cancelado')}
                                    className={`w-full px-3 py-2.5 rounded-xl border-2 text-xs font-bold cursor-pointer transition-all text-left
                                        ${estadoModo === 'cancelado' ? 'border-red-400 bg-red-50 dark:bg-red-950/30 dark:border-red-600 text-red-700 dark:text-red-300' : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-300'}`}>
                                    Marcar como Cancelado
                                </button>
                            </div>
                            <p className="text-[10px] text-zinc-400 mt-1.5">Programado / En curso / Finalizado se calculan solos según las fechas. Solo Cancelado y Pospuesto se fijan manualmente.</p>
                        </Field>
                    </div>

                    {/* ── Columna derecha: resto del formulario ── */}
                    <div className="space-y-4 min-w-0">
                        {errs._general && (
                            <div className="px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-semibold flex items-center gap-2">
                                <Ico.Alert /> {errs._general}
                            </div>
                        )}

                        <Field label="Nombre del evento" req error={errs.nom_evento}>
                            <input value={form.nom_evento} onChange={e => set('nom_evento', e.target.value)} placeholder="Ej: Hackathon de Innovación 2026" className={inp(!!errs.nom_evento)} />
                        </Field>

                        <Field label="Descripción" req error={errs.descripcion}>
                            <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)} rows={3} placeholder="Describe el evento…" className={`${inp(!!errs.descripcion)} resize-none`} />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Modalidad" req error={errs.idmodalidad}>
                                <select value={form.idmodalidad} onChange={e => set('idmodalidad', e.target.value)} className={inp(!!errs.idmodalidad)}>
                                    <option value="">— Seleccionar —</option>
                                    {modalidades.map(m => <option key={m.idmodalidad} value={m.idmodalidad}>{m.nom_modalidad}</option>)}
                                </select>
                            </Field>
                            <Field label="Tipo de evento" req error={errs.idtipo_evento}>
                                <select value={form.idtipo_evento} onChange={e => set('idtipo_evento', e.target.value)} className={inp(!!errs.idtipo_evento)}>
                                    <option value="">— Seleccionar —</option>
                                    {tiposEvento.map(t => <option key={t.idtipo_evento} value={t.idtipo_evento}>{t.nom_tipo_evento}</option>)}
                                </select>
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Fecha de inicio" req error={errs.fecha_inicio}>
                                <input type="date" value={form.fecha_inicio} onChange={e => set('fecha_inicio', e.target.value)} className={inp(!!errs.fecha_inicio)} />
                            </Field>
                            <Field label="Fecha de fin" req error={errs.fecha_fin}>
                                <input type="date" value={form.fecha_fin} min={form.fecha_inicio || undefined} onChange={e => set('fecha_fin', e.target.value)} className={inp(!!errs.fecha_fin)} />
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Inicio de inscripción" req error={errs.fec_inicio_inscripcion}>
                                <input type="date" value={form.fec_inicio_inscripcion} onChange={e => set('fec_inicio_inscripcion', e.target.value)} className={inp(!!errs.fec_inicio_inscripcion)} />
                            </Field>
                            <Field label="Fin de inscripción" req error={errs.fec_fin_inscripcion} hint="No puede cerrar después de que termine el evento">
                                <input type="date" value={form.fec_fin_inscripcion} min={form.fec_inicio_inscripcion || undefined} max={form.fecha_fin || undefined} onChange={e => set('fec_fin_inscripcion', e.target.value)} className={inp(!!errs.fec_fin_inscripcion)} />
                            </Field>
                        </div>

                        {esPresencial && (
                            <Field label="Lugar / espacio físico" req error={errs.espacio_lugar}>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"><Ico.MapPin /></span>
                                    <input value={form.espacio_lugar} onChange={e => set('espacio_lugar', e.target.value)} placeholder="Ej: Auditorio Central UNASAM" className={`${inp(!!errs.espacio_lugar)} pl-9`} />
                                </div>
                            </Field>
                        )}

                        {esVirtual && (
                            <div className="space-y-2 rounded-xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50/50 dark:bg-cyan-950/10 p-3.5">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                                        <Ico.Monitor /> Plataformas de transmisión <span className="text-red-500">*</span>
                                    </label>
                                    <button type="button" onClick={addPlataforma}
                                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold hover:bg-cyan-200 cursor-pointer">
                                        <Ico.Plus /> Agregar plataforma
                                    </button>
                                </div>
                                {platsForm.map((p, idx) => (
                                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-[160px_1fr_auto] gap-2 items-start bg-white dark:bg-zinc-900 rounded-lg p-2.5 border border-zinc-100 dark:border-zinc-800">
                                        <div>
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase mb-1">Plataforma</p>
                                            <select value={p.idplataforma} onChange={e => updatePlataforma(idx, 'idplataforma', e.target.value)} className={inp()}>
                                                <option value="">Seleccionar…</option>
                                                {plataformas.map(pl => <option key={pl.idplataforma} value={pl.idplataforma}>{pl.nom_plataforma}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase mb-1">Enlace / link de transmisión</p>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"><Ico.Link /></span>
                                                <input
                                                    value={p.link_transmision}
                                                    onChange={e => updatePlataforma(idx, 'link_transmision', e.target.value)}
                                                    placeholder="https://meet.google.com/xxx-yyyy-zzz"
                                                    className={`${inp()} pl-8`}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-end h-full pb-0.5">
                                            {platsForm.length > 1 && (
                                                <button type="button" onClick={() => removePlataforma(idx)} title="Quitar"
                                                    className="p-2.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer">
                                                    <Ico.Xs />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {errs.plataformas && <p className="text-[11px] text-red-500">⚠ {errs.plataformas}</p>}
                            </div>
                        )}

                        <Field label="Link del formulario de inscripción" error={errs.link_form_inscripcion} hint="Aplica a todo el evento, sin importar si es Individual, Grupal o Ambos">
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"><Ico.Link /></span>
                                <input value={form.link_form_inscripcion} onChange={e => set('link_form_inscripcion', e.target.value)} placeholder="https://forms.gle/…" className={`${inp(!!errs.link_form_inscripcion)} pl-9`} />
                            </div>
                        </Field>
                    </div>
                </div>

                <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer">
                        Cancelar
                    </button>
                    <button onClick={submit} disabled={saving}
                        className="px-5 py-2 rounded-xl bg-admin-600 hover:bg-admin-700 text-white text-sm font-bold cursor-pointer disabled:opacity-60 flex items-center gap-2">
                        {saving ? <><Ico.Spin />Guardando…</> : isEdit ? '💾 Actualizar evento' : '🎉 Crear evento'}
                    </button>
                </div>
            </div>
        </>
    );
}