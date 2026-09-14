import { Head } from '@inertiajs/react';
import { useState, useMemo, useCallback } from 'react';
import FormEvento, { type Evento } from './FormEvento';
import EventoDrawer from './EventoDrawer';

interface EstadoEvento { idestado_event: number; nom_estado_event: string }
interface Modalidad { idmodalidad: number; nom_modalidad: string }
interface TipoEvento { idtipo_evento: number; nom_tipo_evento: string }
interface Plataforma { idplataforma: number; nom_plataforma: string }

interface PlataformaEvento {
    idevent_canal: number;
    idplataforma: number;
    nom_plataforma: string;
    link_transmision: string;
}

interface Eventos {
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

interface Props {
    eventos: Evento[];
    estados: EstadoEvento[];
    modalidades: Modalidad[];
    tiposEvento: TipoEvento[];
    plataformas: Plataforma[];
}

interface PlataformaForm { idplataforma: string; link_transmision: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCSRF(): string {
    return (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';
}

async function apiFetch(url: string, method: 'GET' | 'POST' | 'DELETE', body?: FormData) {
    const headers: Record<string, string> = { 'X-CSRF-TOKEN': getCSRF(), 'Accept': 'application/json' };
    return fetch(url, { method, headers, body });
}

function fmtDate(d: string) {
    try { return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d + 'T00:00:00')); }
    catch { return d; }
}

function hoyISO() {
    return new Date().toISOString().slice(0, 10);
}

function diasEntre(desde: string, hasta: string) {
    const a = new Date(desde + 'T00:00:00').getTime();
    const b = new Date(hasta + 'T00:00:00').getTime();
    return Math.round((b - a) / 86_400_000);
}

const ESTADO_CFG: Record<string, { bg: string; dot: string; text: string }> = {
    'Programado': { bg: 'bg-blue-100 dark:bg-blue-900/30', dot: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-300' },
    'En curso':   { bg: 'bg-emerald-100 dark:bg-emerald-900/30', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
    'Finalizado': { bg: 'bg-zinc-100 dark:bg-zinc-800', dot: 'bg-zinc-400', text: 'text-zinc-600 dark:text-zinc-400' },
    'Cancelado':  { bg: 'bg-red-100 dark:bg-red-900/30', dot: 'bg-red-500', text: 'text-red-700 dark:text-red-300' },
    'Pospuesto':  { bg: 'bg-amber-100 dark:bg-amber-900/30', dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300' },
};
function estadoCfg(nombre: string) {
    return ESTADO_CFG[nombre] ?? { bg: 'bg-zinc-100', dot: 'bg-zinc-400', text: 'text-zinc-500' };
}

const MODALIDAD_CFG: Record<string, { bg: string; text: string; icon: string }> = {
    'Presencial': { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', icon: '📍' },
    'Virtual':    { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300', icon: '💻' },
};
function modCfg(nombre: string) {
    return MODALIDAD_CFG[nombre] ?? { bg: 'bg-zinc-100', text: 'text-zinc-500', icon: '•' };
}

function estadoInscripcion(ev: Evento): { label: string; cls: string } {
    const hoy = hoyISO();
    if (hoy < ev.fec_inicio_inscripcion) return { label: 'Próximamente', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' };
    if (hoy > ev.fec_fin_inscripcion) return { label: 'Cerradas', cls: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400' };
    return { label: 'Abiertas', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' };
}

// ─── Toast ────────────────────────────────────────────────────────────────────

interface Toast { id: number; msg: string; type: 'ok' | 'err' }
function useToast() {
    const [list, setList] = useState<Toast[]>([]);
    const push = useCallback((msg: string, type: 'ok' | 'err' = 'ok') => {
        const id = Date.now();
        setList(p => [...p, { id, msg, type }]);
        setTimeout(() => setList(p => p.filter(t => t.id !== id)), 4000);
    }, []);
    return { list, push };
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = {
    Plus: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    X: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Xs: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Edit: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
    Trash: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Search: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Spin: () => <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>,
    Grid: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Table: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" /></svg>,
    Calendar: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Link: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
    Copy: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    Image: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"/><circle cx="8.5" cy="8.5" r="1.5" /></svg>,
    MapPin: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
    Monitor: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
    Alert: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    Check: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>,
    Eye: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    ChevronLeft: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
    ChevronRight: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
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
        ${err ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-300/20' : 'border-zinc-200 dark:border-zinc-700 focus:border-violet-400 dark:focus:border-violet-500 focus:ring-2 focus:ring-violet-300/20'}`;
}

// ─── Form del modal (create/edit) ──────────────────────────────────────────

const EMPTY_FORM = {
    nom_evento: '',
    descripcion: '',
    idestado_event: '',
    idmodalidad: '',
    idtipo_evento: '',
    fecha_inicio: '',
    fecha_fin: '',
    fec_inicio_inscripcion: '',
    fec_fin_inscripcion: '',
    espacio_lugar: '',
    link_form_inscripcion: '',
};



// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function EventoIndex({ eventos: initEventos, estados, modalidades, tiposEvento, plataformas }: Props) {
    const [eventos, setEventos] = useState<Evento[]>(initEventos);
    const [modalOpen, setModalOpen] = useState(false);
    const [editEvento, setEditEvento] = useState<Evento | null>(null);
    const [drawerEvento, setDrawerEvento] = useState<Evento | null>(null);
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
    const { list: toasts, push } = useToast();

    // ── Filtros — 100% client-side, instantáneos ──
    const [search, setSearch] = useState('');
    const [filtEstado, setFiltEstado] = useState('');
    const [filtModalidad, setFiltModalidad] = useState('');
    const [filtTipo, setFiltTipo] = useState('');
    const [filtDesde, setFiltDesde] = useState('');
    const [filtHasta, setFiltHasta] = useState('');

    // ── Paginación ──
    const [page, setPage] = useState(1);
    const PER_PAGE = 9;

    const eventosFilt = useMemo(() => {
        let list = eventos;
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(e => `${e.nom_evento} ${e.descripcion} ${e.espacio_lugar ?? ''}`.toLowerCase().includes(q));
        }
        if (filtEstado) list = list.filter(e => String(e.idestado_event) === filtEstado);
        if (filtModalidad) list = list.filter(e => String(e.idmodalidad) === filtModalidad);
        if (filtTipo) list = list.filter(e => String(e.idtipo_evento) === filtTipo);
        if (filtDesde) list = list.filter(e => e.fecha_inicio >= filtDesde);
        if (filtHasta) list = list.filter(e => e.fecha_fin <= filtHasta);
        return list;
    }, [eventos, search, filtEstado, filtModalidad, filtTipo, filtDesde, filtHasta]);

    // Resetear a página 1 cuando cambian los filtros
    const resetPageAnd = <T,>(setter: (v: T) => void) => (v: T) => { setter(v); setPage(1); };

    const totalPages = Math.max(1, Math.ceil(eventosFilt.length / PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const eventosPag = eventosFilt.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

    const stats = useMemo(() => ({
        total: eventos.length,
        enCurso: eventos.filter(e => e.nom_estado_event === 'En curso').length,
        programados: eventos.filter(e => e.nom_estado_event === 'Programado').length,
        inscAbiertas: eventos.filter(e => estadoInscripcion(e).label === 'Abiertas').length,
    }), [eventos]);

    const limpiarFiltros = () => {
        setSearch(''); setFiltEstado(''); setFiltModalidad(''); setFiltTipo(''); setFiltDesde(''); setFiltHasta('');
        setPage(1);
    };
    const hayFiltros = !!(search || filtEstado || filtModalidad || filtTipo || filtDesde || filtHasta);

    const handleSaved = (ev: Evento, isNew: boolean) => {
        if (isNew) {
            setEventos(p => [ev, ...p]);
            push('Evento creado correctamente.');
        } else {
            setEventos(p => p.map(x => x.idevento === ev.idevento ? ev : x));
            if (drawerEvento?.idevento === ev.idevento) setDrawerEvento(ev);
            push('Evento actualizado correctamente.');
        }
    };

    const handleDelete = async () => {
        if (confirmId === null) return;
        setDeleting(true);
        try {
            const res = await apiFetch(`/eventos/${confirmId}`, 'DELETE');
            const data = await res.json();
            if (data.success) {
                setEventos(p => p.filter(e => e.idevento !== confirmId));
                if (drawerEvento?.idevento === confirmId) setDrawerEvento(null);
                push('Evento eliminado correctamente.');
            } else {
                push(data.message ?? 'Error al eliminar.', 'err');
            }
        } catch {
            push('Error de conexión.', 'err');
        } finally {
            setDeleting(false);
            setConfirmId(null);
        }
    };

    const copiarLink = useCallback((link: string) => {
        navigator.clipboard.writeText(link);
        push('Enlace copiado al portapapeles.');
    }, [push]);

    return (
        <>
            <Head title="Eventos" />

            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto rounded-xl p-4">

                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-800 p-6 text-white shadow-xl">
                    <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/5" />
                    <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="text-xs font-bold text-violet-200 uppercase tracking-widest mb-1">Incubadora de Empresas</p>
                            <h1 className="text-2xl font-black">Gestión de Eventos</h1>
                            <p className="text-sm text-violet-100/80 mt-0.5">{stats.total} evento{stats.total !== 1 ? 's' : ''} registrado{stats.total !== 1 ? 's' : ''}</p>
                        </div>
                        <button onClick={() => { setEditEvento(null); setModalOpen(true); }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-violet-700 font-bold text-sm hover:bg-violet-50 cursor-pointer shadow-lg shrink-0">
                            <Ico.Plus /> Nuevo evento
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Total', value: stats.total, color: 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100' },
                        { label: 'En curso', value: stats.enCurso, color: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' },
                        { label: 'Programados', value: stats.programados, color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200' },
                        { label: 'Insc. abiertas', value: stats.inscAbiertas, color: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200' },
                    ].map(s => (
                        <div key={s.label} className={`rounded-2xl px-4 py-3.5 border ${s.color}`}>
                            <div className="text-2xl font-black tabular-nums leading-none">{s.value}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filtros — instantáneos, sin recarga */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"><Ico.Search /></span>
                            <input value={search} onChange={e => resetPageAnd(setSearch)(e.target.value)} placeholder="Buscar evento, descripción, lugar…"
                                className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none focus:border-violet-400 transition-all" />
                            {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 cursor-pointer"><Ico.Xs /></button>}
                        </div>

                        <select value={filtEstado} onChange={e => resetPageAnd(setFiltEstado)(e.target.value)} className="px-3 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 outline-none focus:border-violet-400 cursor-pointer">
                            <option value="">Todos los estados</option>
                            {estados.map(e => <option key={e.idestado_event} value={e.idestado_event}>{e.nom_estado_event}</option>)}
                        </select>

                        <select value={filtModalidad} onChange={e => resetPageAnd(setFiltModalidad)(e.target.value)} className="px-3 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 outline-none focus:border-violet-400 cursor-pointer">
                            <option value="">Todas las modalidades</option>
                            {modalidades.map(m => <option key={m.idmodalidad} value={m.idmodalidad}>{m.nom_modalidad}</option>)}
                        </select>

                        <select value={filtTipo} onChange={e => resetPageAnd(setFiltTipo)(e.target.value)} className="px-3 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 outline-none focus:border-violet-400 cursor-pointer">
                            <option value="">Todos los tipos</option>
                            {tiposEvento.map(t => <option key={t.idtipo_evento} value={t.idtipo_evento}>{t.nom_tipo_evento}</option>)}
                        </select>

                        <div className="ml-auto hidden md:flex gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                            <button onClick={() => setViewMode('table')} title="Vista tabla" className={`p-2 rounded-lg cursor-pointer transition-all ${viewMode === 'table' ? 'bg-white dark:bg-zinc-700 shadow-sm text-violet-700 dark:text-violet-300' : 'text-zinc-400 hover:text-zinc-600'}`}>
                                <Ico.Table />
                            </button>
                            <button onClick={() => setViewMode('grid')} title="Vista tarjetas" className={`p-2 rounded-lg cursor-pointer transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-sm text-violet-700 dark:text-violet-300' : 'text-zinc-400 hover:text-zinc-600'}`}>
                                <Ico.Grid />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Rango de fechas del evento:</label>
                        <input type="date" value={filtDesde} onChange={e => resetPageAnd(setFiltDesde)(e.target.value)} className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 outline-none focus:border-violet-400" />
                        <span className="text-xs text-zinc-400">hasta</span>
                        <input type="date" value={filtHasta} onChange={e => resetPageAnd(setFiltHasta)(e.target.value)} className="px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 outline-none focus:border-violet-400" />
                        {hayFiltros && <button onClick={limpiarFiltros} className="text-xs text-red-500 hover:underline cursor-pointer">Limpiar filtros</button>}
                        <span className="ml-auto text-xs text-zinc-400">{eventosFilt.length} resultado{eventosFilt.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                {/* Listado vacío */}
                {eventosFilt.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <div className="text-4xl">🎉</div>
                        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                            {hayFiltros ? 'Sin resultados para los filtros aplicados' : 'No hay eventos registrados'}
                        </p>
                        {!hayFiltros && (
                            <button onClick={() => setModalOpen(true)} className="mt-1 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-bold cursor-pointer hover:bg-violet-700">
                                <Ico.Plus /> Crear primer evento
                            </button>
                        )}
                    </div>
                )}

                {/* ── VISTA TABLA ── */}
                {eventosFilt.length > 0 && viewMode === 'table' && (
    <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60">
                        {['', 'Evento', 'Modalidad', 'Fechas', 'Estado', 'Acciones'].map((h, i) => (
                            <th key={i} className="text-left px-3 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {eventosPag.map(ev => {
                        const ecfg = estadoCfg(ev.nom_estado_event);
                        const mcfg = modCfg(ev.nom_modalidad);
                        return (
                            <tr key={ev.idevento} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group cursor-pointer" onClick={() => setDrawerEvento(ev)}>
                                <td className="pl-4 py-3">
                                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                        {ev.image_url ? <img src={ev.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-300"><Ico.Image /></div>}
                                    </div>
                                </td>
                                <td className="px-3 py-3 max-w-[220px]">
                                    <p className="font-bold text-zinc-900 dark:text-zinc-100 text-xs truncate">{ev.nom_evento}</p>
                                    <p className="text-[10px] text-zinc-400 truncate">{ev.nom_tipo_evento}</p>
                                </td>
                                <td className="px-3 py-3">
                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${mcfg.bg} ${mcfg.text}`}>
                                        {mcfg.icon} {ev.nom_modalidad}
                                    </span>
                                </td>
                                <td className="px-3 py-3 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                                    {fmtDate(ev.fecha_inicio)} – {fmtDate(ev.fecha_fin)}
                                </td>
                                <td className="px-3 py-3">
                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full ${ecfg.bg} ${ecfg.text}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${ecfg.dot} ${ev.nom_estado_event === 'En curso' ? 'animate-pulse' : ''}`} /> {ev.nom_estado_event}
                                    </span>
                                </td>
                                <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => setDrawerEvento(ev)} title="Ver detalle"
                                            className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 cursor-pointer transition-colors">
                                            <Ico.Eye />
                                        </button>
                                        <button onClick={() => { setEditEvento(ev); setModalOpen(true); }} title="Editar"
                                            className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-emerald-600 cursor-pointer transition-colors">
                                            <Ico.Edit />
                                        </button>
                                        <button onClick={() => setConfirmId(ev.idevento)} title="Eliminar"
                                            className="p-1.5 rounded-lg text-zinc-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 cursor-pointer transition-colors">
                                            <Ico.Trash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
)}

{eventosFilt.length > PER_PAGE && (
    <div className="flex items-center justify-between px-1 py-2 flex-wrap gap-2">
        <span className="text-xs text-zinc-400">
            Mostrando {(safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, eventosFilt.length)} de {eventosFilt.length} eventos
        </span>
        <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                <Ico.ChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
                .reduce<(number | '...')[]>((acc, n, i, arr) => {
                    if (i > 0 && n - (arr[i - 1] as number) > 1) acc.push('...');
                    acc.push(n);
                    return acc;
                }, [])
                .map((item, i) =>
                    item === '...'
                        ? <span key={`d${i}`} className="px-1 text-zinc-400 text-xs self-center">…</span>
                        : <button key={item} onClick={() => setPage(item as number)}
                            className={`min-w-[32px] h-[32px] rounded-lg text-xs font-bold border cursor-pointer transition-all
                                ${safePage === item ? 'bg-violet-600 text-white border-violet-600' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                            {item}
                        </button>
                )}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors">
                <Ico.ChevronRight />
            </button>
        </div>
    </div>
)}

                {/* ── VISTA GRID (siempre en móvil) ── */}
                {eventosFilt.length > 0 && (viewMode === 'grid' ? true : true) && (
                    <div className={`${viewMode === 'grid' ? 'grid' : 'grid md:hidden'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
                        {eventosFilt.map(ev => {
                            const ecfg = estadoCfg(ev.nom_estado_event);
                            const mcfg = modCfg(ev.nom_modalidad);
                            const inscCfg = estadoInscripcion(ev);
                            const diasParaInicio = diasEntre(hoyISO(), ev.fecha_inicio);

                            return (
                                <div key={ev.idevento}
                                    className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-200 flex flex-col">

                                    {/* Imagen */}
                                    <div className="relative h-36 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-950/40 dark:to-purple-950/40">
                                        {ev.image_url
                                            ? <img src={ev.image_url} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center text-violet-300"><Ico.Image /></div>}
                                        <span className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full ${ecfg.bg} ${ecfg.text} backdrop-blur-sm shadow`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${ecfg.dot} ${ev.nom_estado_event === 'En curso' ? 'animate-pulse' : ''}`} /> {ev.nom_estado_event}
                                        </span>
                                        <span className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${mcfg.bg} ${mcfg.text} backdrop-blur-sm shadow`}>
                                            {mcfg.icon} {ev.nom_modalidad}
                                        </span>
                                        <div className="absolute bottom-2.5 right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditEvento(ev); setModalOpen(true); }} className="p-1.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 cursor-pointer shadow">
                                                <Ico.Edit />
                                            </button>
                                            <button onClick={() => setConfirmId(ev.idevento)} className="p-1.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-300 hover:text-red-500 cursor-pointer shadow">
                                                <Ico.Trash />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 flex flex-col gap-2.5 flex-1">
                                        <div>
                                            <p className="text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-wider">{ev.nom_tipo_evento}</p>
                                            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">{ev.nom_evento}</h3>
                                        </div>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{ev.descripcion}</p>

                                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                                            <Ico.Calendar /> {fmtDate(ev.fecha_inicio)} – {fmtDate(ev.fecha_fin)}
                                        </div>

                                        {ev.nom_modalidad === 'Presencial' && ev.espacio_lugar && (
                                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                                                <Ico.MapPin /> <span className="truncate">{ev.espacio_lugar}</span>
                                            </div>
                                        )}
                                        {ev.nom_modalidad === 'Virtual' && ev.plataformas.length > 0 && (
                                            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                                                <Ico.Monitor /> <span className="truncate">{ev.plataformas.map(p => p.nom_plataforma).join(', ')}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${inscCfg.cls}`}>Inscripciones: {inscCfg.label}</span>
                                            {ev.link_form_inscripcion && (
                                                <button onClick={() => copiarLink(ev.link_form_inscripcion!)} title="Copiar link de inscripción"
                                                    className="flex items-center gap-1 text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer">
                                                    <Ico.Copy /> Copiar link
                                                </button>
                                            )}
                                        </div>
                                        {ev.nom_estado_event === 'Programado' && diasParaInicio >= 0 && diasParaInicio <= 7 && (
                                            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">⏰ Empieza en {diasParaInicio} día{diasParaInicio !== 1 ? 's' : ''}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {eventosFilt.length > 0 && (
    <div className={`${viewMode === 'grid' ? 'grid' : 'grid md:hidden'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
        {eventosPag.map(ev => {
            const ecfg = estadoCfg(ev.nom_estado_event);
            const mcfg = modCfg(ev.nom_modalidad);
            const inscCfg = estadoInscripcion(ev);

            return (
                <div key={ev.idevento}
                    onClick={() => setDrawerEvento(ev)}
                    className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-200 flex flex-col cursor-pointer">

                    <div className="relative h-32 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-950/40 dark:to-purple-950/40">
                        {ev.image_url ? <img src={ev.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-violet-300"><Ico.Image /></div>}
                        <span className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full ${ecfg.bg} ${ecfg.text} backdrop-blur-sm shadow`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${ecfg.dot} ${ev.nom_estado_event === 'En curso' ? 'animate-pulse' : ''}`} /> {ev.nom_estado_event}
                        </span>
                        <span className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${mcfg.bg} ${mcfg.text} backdrop-blur-sm shadow`}>
                            {mcfg.icon} {ev.nom_modalidad}
                        </span>
                        <div className="absolute bottom-2.5 right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setDrawerEvento(ev)} className="p-1.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 cursor-pointer shadow"><Ico.Eye /></button>
                            <button onClick={() => { setEditEvento(ev); setModalOpen(true); }} className="p-1.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 cursor-pointer shadow"><Ico.Edit /></button>
                            <button onClick={() => setConfirmId(ev.idevento)} className="p-1.5 rounded-lg bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-300 hover:text-red-500 cursor-pointer shadow"><Ico.Trash /></button>
                        </div>
                    </div>

                    <div className="p-4 flex flex-col gap-2 flex-1">
                        <div>
                            <p className="text-[10px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-wider">{ev.nom_tipo_evento}</p>
                            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">{ev.nom_evento}</h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                            <Ico.Calendar /> {fmtDate(ev.fecha_inicio)} – {fmtDate(ev.fecha_fin)}
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-100 dark:border-zinc-800">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${inscCfg.cls}`}>Insc: {inscCfg.label}</span>
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
)}
            </div>

            <FormEvento
    open={modalOpen}
    evento={editEvento}
    modalidades={modalidades}
    tiposEvento={tiposEvento}
    plataformas={plataformas}
    onClose={() => { setModalOpen(false); setEditEvento(null); }}
    onSaved={handleSaved}
/>

{drawerEvento && (
    <EventoDrawer
        evento={drawerEvento}
        onClose={() => setDrawerEvento(null)}
        onEdit={() => { setEditEvento(drawerEvento); setDrawerEvento(null); setModalOpen(true); }}
        onDelete={() => { setConfirmId(drawerEvento.idevento); }}
        onCopyLink={copiarLink}
    />
)}

            {/* Confirm delete */}
            {confirmId !== null && (
                <>
                    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setConfirmId(null)} />
                    <div className="fixed z-[61] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(380px,92vw)] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl p-6">
                        <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center mx-auto mb-3">
                            <Ico.Trash />
                        </div>
                        <p className="text-sm font-bold text-center text-zinc-900 dark:text-zinc-100 mb-1">¿Eliminar este evento?</p>
                        <p className="text-xs text-center text-zinc-400 mb-5">Esta acción no se puede deshacer. Si el evento ya tiene inscripciones, no podrá eliminarse.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setConfirmId(null)} className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 cursor-pointer hover:bg-zinc-50">
                                Cancelar
                            </button>
                            <button onClick={handleDelete} disabled={deleting}
                                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold cursor-pointer disabled:opacity-60 flex items-center gap-2">
                                {deleting ? <><Ico.Spin />Eliminando…</> : 'Sí, eliminar'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Toasts */}
            <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-sm font-semibold text-white pointer-events-auto ${t.type === 'ok' ? 'bg-emerald-600' : 'bg-red-600'}`}>
                        {t.type === 'ok' ? <Ico.Check /> : <Ico.Xs />} {t.msg}
                    </div>
                ))}
            </div>
        </>
    );
}

EventoIndex.layout = {
    breadcrumbs: [
        { title: 'Inicio', href: '/dashboard' },
        { title: 'Eventos', href: '/eventos' },
    ],
};