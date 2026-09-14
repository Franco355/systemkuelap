import { Head } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import FormMiembro from './FormMiembro';
import MiembroLogros from './MiembroLogros';

// ─── Types (compartidos con FormMiembro.tsx y MiembroLogros.tsx) ───────────

export interface Genero { idgenero: number; nom_genero: string }
export interface Condicion { idcondicion_miembro: number; nom_condicion: string }
export interface GradoAcademico { id_grado_academico: number; abreviatura: string; nombre_titulo: string | null }
export interface PaisItem { idpais: number; nom_pais: string }
export interface UniversidadItem { iduniversidad: number; siglas: string; nom_universidad: string; idpais: number }
export interface TipoMembresia { idtipo_membresia: number; nom_tipo_membresia: string; descripcion: string | null; monto: string; moneda: string }
export interface TipoLogro { idtipos_logro: number; nom_tipo_logro: string }
export interface LineaInvestigacion { idlinea_investigacion: number; linea_investigacion: string; idarea_investigacion: number; nom_area_investigacion: string }
export interface LineaMiembro { idlinea_investigacion: number; linea_investigacion: string; nom_area_investigacion: string }

export interface Miembro {
    idequipo_miembro: number;
    idpersonas: number;
    email_miembro: string;
    cv_archivo: string;
    cv_url: string | null;
    idcondicion_miembro: number; nom_condicion: string;
    id_grado_academico: number; abreviatura: string; nombre_titulo: string | null;
    iduniversidad: number; siglas: string; nom_universidad: string; idpais: number; nom_pais: string;
    idtipo_membresia: number; nom_tipo_membresia: string;
    fecha_creacion: string; created_at: string; updated_at: string;
    nombres: string; apell_paterno: string; apell_materno: string;
    dni: string; telefono: string; direccion: string | null; idgenero: number; nom_genero: string;
    nombreCompleto: string;
    lineas: LineaMiembro[];
    logros_count: number;
}

export interface Catalogos {
    generos: Genero[];
    condiciones: Condicion[];
    gradosAcademicos: GradoAcademico[];
    paises: PaisItem[];
    universidades: UniversidadItem[];
    tiposMembresia: TipoMembresia[];
    tiposLogro: TipoLogro[];
    lineasInvestigacion: LineaInvestigacion[];
}

interface Props {
    miembros: Miembro[];
    catalogos: Catalogos;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getCSRF(): string {
    return (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';
}
export async function apiFetch(url: string, method: 'GET' | 'POST' | 'DELETE', body?: FormData) {
    return fetch(url, { method, headers: { 'X-CSRF-TOKEN': getCSRF(), Accept: 'application/json' }, body });
}
function fmtDate(d: string) {
    try { return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d.slice(0, 10) + 'T00:00:00')); }
    catch { return d; }
}
function fmtDateTime(d: string) {
    try { return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d.replace(' ', 'T'))); }
    catch { return d; }
}
function initials(nombres: string, apellido: string) {
    return `${nombres.trim().charAt(0)}${apellido.trim().charAt(0)}`.toUpperCase();
}
const AVATAR_PALETTE = [
    'bg-admin-100 text-admin-700 dark:bg-admin-900/40 dark:text-admin-300',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
];
function avatarColor(id: number) {
    return AVATAR_PALETTE[id % AVATAR_PALETTE.length];
}

// ─── Toast ────────────────────────────────────────────────────────────────────

interface Toast { id: number; msg: string; type: 'ok' | 'err' }
function useToast() {
    const [list, setList] = useState<Toast[]>([]);
    const push = useCallback((msg: string, type: 'ok' | 'err' = 'ok') => {
        const id = Date.now() + Math.random();
        setList(p => [...p, { id, msg, type }]);
        setTimeout(() => setList(p => p.filter(t => t.id !== id)), 4000);
    }, []);
    return { list, push };
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const Ico = {
    X: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Xs: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Edit: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
    Trash: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Search: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Spin: () => <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>,
    Grid: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Table: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" /></svg>,
    Check: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>,
    Eye: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    Medal: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="15" r="5" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10.5L6 3h3l2 5m4 2.5L18 3h-3l-2 5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12.5v3" /></svg>,
    ChevronLeft: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
    ChevronRight: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
    Mail: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Phone: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    MapPin: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Cap: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0121 17.75c0 .414-.336.75-.75.75H3.75A.75.75 0 013 17.75a12.083 12.083 0 012.84-7.172L12 14z" /></svg>,
    IdCard: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 15v-1a2 2 0 012-2h1a2 2 0 012 2v1M8 10h.01M14 9h4m-4 3h4" /></svg>,
    File: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    Flag: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21V4m0 0c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 4 0v9c-2 1.5-4 1.5-6 0s-4-1.5-6 0-4 1.5-4 0" /></svg>,
    Alert: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    Calendar: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
};

const CONDICION_CFG: Record<string, { bg: string; dot: string; text: string }> = {
    'Habilitado': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
    'Inhabilitado': { bg: 'bg-zinc-100 dark:bg-zinc-800', dot: 'bg-zinc-400', text: 'text-zinc-500 dark:text-zinc-400' },
};
function condicionCfg(nombre: string) {
    return CONDICION_CFG[nombre] ?? { bg: 'bg-zinc-100', dot: 'bg-zinc-400', text: 'text-zinc-500' };
}

// ─── Chips de líneas de investigación ──────────────────────────────────────

function LineasChips({ lineas, max = 2 }: { lineas: LineaMiembro[]; max?: number }) {
    if (lineas.length === 0) return <span className="text-[11px] text-zinc-400 italic">Sin registrar</span>;
    const visibles = lineas.slice(0, max);
    const restantes = lineas.length - visibles.length;
    return (
        <div className="flex flex-wrap gap-1">
            {visibles.map(l => (
                <span key={l.idlinea_investigacion} title={l.linea_investigacion}
                    className="inline-block max-w-[140px] truncate px-2 py-0.5 rounded-full bg-admin-50 dark:bg-admin-950/30 text-admin-700 dark:text-admin-300 text-[10px] font-semibold">
                    {l.linea_investigacion}
                </span>
            ))}
            {restantes > 0 && <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-bold">+{restantes}</span>}
        </div>
    );
}

// ─── Drawer de detalle (embebido en este mismo archivo) ────────────────────

function MiembroDrawer({ miembro, onClose, onEdit, onDelete, onLogros }: {
    miembro: Miembro;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onLogros: () => void;
}) {
    const ccfg = condicionCfg(miembro.nom_condicion);
    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed z-[51] top-0 right-0 h-full w-[min(440px,100vw)] bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-y-auto flex flex-col">
                <div className="h-1.5 w-full bg-gradient-to-r from-admin-500 via-admin-600 to-admin-800 shrink-0" />

                <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-100">Detalle del miembro</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"><Ico.X /></button>
                </div>

                <div className="p-5 space-y-5 flex-1">
                    <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 ${avatarColor(miembro.idequipo_miembro)}`}>
                            {initials(miembro.nombres, miembro.apell_paterno)}
                        </div>
                        <div className="min-w-0">
                            <p className="text-base font-black text-zinc-900 dark:text-zinc-100 truncate">{miembro.nombreCompleto}</p>
                            <span className={`inline-flex items-center gap-1.5 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${ccfg.bg} ${ccfg.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${ccfg.dot}`} /> {miembro.nom_condicion}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 text-sm">
                        <div className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-300"><Ico.Mail /> <a href={`mailto:${miembro.email_miembro}`} className="hover:underline truncate">{miembro.email_miembro}</a></div>
                        <div className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-300"><Ico.Phone /> {miembro.telefono}</div>
                        <div className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-300"><Ico.IdCard /> DNI/CI: {miembro.dni}</div>
                        {miembro.direccion && <div className="flex items-start gap-2.5 text-zinc-600 dark:text-zinc-300"><span className="mt-0.5"><Ico.MapPin /></span> <span>{miembro.direccion}</span></div>}
                        <div className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-300"><Ico.Flag /> {miembro.nom_pais} · {miembro.nom_genero}</div>
                    </div>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Datos académicos</p>
                        <div className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-300"><Ico.Cap /> {miembro.nombre_titulo ?? miembro.abreviatura}</div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-300 pl-[22px]">{miembro.nom_universidad} <span className="text-zinc-400">({miembro.siglas})</span></div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-300 pl-[22px]">Membresía: <span className="font-semibold">{miembro.nom_tipo_membresia}</span></div>
                    </div>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Líneas de investigación</p>
                        {miembro.lineas.length === 0
                            ? <p className="text-xs text-zinc-400 italic">Sin registrar</p>
                            : <div className="flex flex-wrap gap-1.5">
                                {miembro.lineas.map(l => (
                                    <span key={l.idlinea_investigacion} className="px-2.5 py-1 rounded-full bg-admin-50 dark:bg-admin-950/30 text-admin-700 dark:text-admin-300 text-[11px] font-semibold">
                                        {l.linea_investigacion}
                                    </span>
                                ))}
                            </div>}
                    </div>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Documentos y fechas</p>
                        {miembro.cv_url
                            ? <a href={miembro.cv_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-admin-600 dark:text-admin-400 hover:underline"><Ico.File /> Ver CV</a>
                            : <p className="flex items-center gap-2 text-xs text-zinc-400 italic"><Ico.File /> CV pendiente de subir</p>}
                        <p className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"><Ico.Calendar /> Miembro desde {fmtDate(miembro.fecha_creacion)}</p>
                        <p className="text-[11px] text-zinc-400 pl-[22px]">Última actualización: {fmtDateTime(miembro.updated_at)}</p>
                    </div>

                    <button onClick={onLogros}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 cursor-pointer transition-colors">
                        <span className="flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-300"><Ico.Medal /> Logros y reconocimientos</span>
                        <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200">{miembro.logros_count}</span>
                    </button>
                </div>

                <div className="sticky bottom-0 flex items-center gap-3 px-5 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-admin-600 hover:bg-admin-700 text-white text-sm font-bold cursor-pointer">
                        <Ico.Edit /> Editar
                    </button>
                    <button onClick={onDelete} className="p-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer">
                        <Ico.Trash />
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function MiembrosIndex({ miembros: initMiembros, catalogos }: Props) {
    const [miembros, setMiembros] = useState<Miembro[]>(initMiembros);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const { list: toasts, push } = useToast();

    const [editMiembro, setEditMiembro] = useState<Miembro | null>(null);
    const [drawerMiembro, setDrawerMiembro] = useState<Miembro | null>(null);
    const [logrosMiembro, setLogrosMiembro] = useState<Miembro | null>(null);
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [search, setSearch] = useState('');
    const [filtCondicion, setFiltCondicion] = useState('');
    const [filtPais, setFiltPais] = useState('');
    const [filtGrado, setFiltGrado] = useState('');
    const [page, setPage] = useState(1);
    const PER_PAGE = 9;

    const miembrosFilt = useMemo(() => {
        let list = miembros;
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(m => `${m.nombreCompleto} ${m.email_miembro} ${m.dni} ${m.nom_universidad}`.toLowerCase().includes(q));
        }
        if (filtCondicion) list = list.filter(m => String(m.idcondicion_miembro) === filtCondicion);
        if (filtPais) list = list.filter(m => String(m.idpais) === filtPais);
        if (filtGrado) list = list.filter(m => String(m.id_grado_academico) === filtGrado);
        return list;
    }, [miembros, search, filtCondicion, filtPais, filtGrado]);

    const resetPageAnd = <T,>(setter: (v: T) => void) => (v: T) => { setter(v); setPage(1); };

    const totalPages = Math.max(1, Math.ceil(miembrosFilt.length / PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const miembrosPag = miembrosFilt.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

    const stats = useMemo(() => ({
        total: miembros.length,
        habilitados: miembros.filter(m => m.nom_condicion === 'Habilitado').length,
        paises: new Set(miembros.map(m => m.idpais)).size,
        conLogros: miembros.filter(m => m.logros_count > 0).length,
    }), [miembros]);

    const limpiarFiltros = () => { setSearch(''); setFiltCondicion(''); setFiltPais(''); setFiltGrado(''); setPage(1); };
    const hayFiltros = !!(search || filtCondicion || filtPais || filtGrado);

    const handleSaved = (m: Miembro) => {
        setMiembros(p => p.map(x => x.idequipo_miembro === m.idequipo_miembro ? m : x));
        if (drawerMiembro?.idequipo_miembro === m.idequipo_miembro) setDrawerMiembro(m);
        push('Miembro actualizado correctamente.');
    };

    const handleDelete = async () => {
        if (confirmId === null) return;
        setDeleting(true);
        try {
            const res = await apiFetch(`/equipo/${confirmId}`, 'DELETE');
            const data = await res.json();
            if (data.success) {
                setMiembros(p => p.filter(m => m.idequipo_miembro !== confirmId));
                if (drawerMiembro?.idequipo_miembro === confirmId) setDrawerMiembro(null);
                push('Miembro eliminado correctamente.');
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

    const handleLogrosCountChange = (idequipo_miembro: number, count: number) => {
        setMiembros(p => p.map(m => m.idequipo_miembro === idequipo_miembro ? { ...m, logros_count: count } : m));
        setDrawerMiembro(p => p && p.idequipo_miembro === idequipo_miembro ? { ...p, logros_count: count } : p);
    };

    return (
        <>
            <Head title="Miembros" />

            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto rounded-xl p-4">

                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-admin-600 via-admin-700 to-admin-900 p-4 text-white shadow-xl">
                    <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/5" />
                    <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="text-xs font-bold text-admin-200 uppercase tracking-widest mb-1">Red de Investigadores Latinoamericanos KUÉLAP</p>
                            <h1 className="text-2xl font-black">Gestión de Miembros</h1>
                            <p className="text-sm text-admin-100/80 mt-0.5">{stats.total} miembro{stats.total !== 1 ? 's' : ''} registrado{stats.total !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Total', value: stats.total, color: 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100' },
                        { label: 'Habilitados', value: stats.habilitados, color: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' },
                        { label: 'Países', value: stats.paises, color: 'bg-admin-50 dark:bg-admin-950/30 border-admin-200 dark:border-admin-800 text-admin-800 dark:text-admin-200' },
                        { label: 'Con logros', value: stats.conLogros, color: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200' },
                    ].map(s => (
                        <div key={s.label} className={`rounded-2xl px-4 py-3.5 border ${s.color}`}>
                            <div className="text-xl font-black tabular-nums leading-none">{s.value}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filtros */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"><Ico.Search /></span>
                            <input value={search} onChange={e => resetPageAnd(setSearch)(e.target.value)} placeholder="Buscar por nombre, correo, DNI, universidad…"
                                className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none focus:border-admin-400 transition-all" />
                            {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 cursor-pointer"><Ico.Xs /></button>}
                        </div>

                        <select value={filtCondicion} onChange={e => resetPageAnd(setFiltCondicion)(e.target.value)} className="px-3 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 outline-none focus:border-admin-400 cursor-pointer">
                            <option value="">Todas las condiciones</option>
                            {catalogos.condiciones.map(c => <option key={c.idcondicion_miembro} value={c.idcondicion_miembro}>{c.nom_condicion}</option>)}
                        </select>

                        <select value={filtPais} onChange={e => resetPageAnd(setFiltPais)(e.target.value)} className="px-3 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 outline-none focus:border-admin-400 cursor-pointer">
                            <option value="">Todos los países</option>
                            {catalogos.paises.map(p => <option key={p.idpais} value={p.idpais}>{p.nom_pais}</option>)}
                        </select>

                        <select value={filtGrado} onChange={e => resetPageAnd(setFiltGrado)(e.target.value)} className="px-3 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 outline-none focus:border-admin-400 cursor-pointer">
                            <option value="">Todos los grados</option>
                            {catalogos.gradosAcademicos.map(g => <option key={g.id_grado_academico} value={g.id_grado_academico}>{g.nombre_titulo ?? g.abreviatura}</option>)}
                        </select>

                        {hayFiltros && <button onClick={limpiarFiltros} className="text-xs text-red-500 hover:underline cursor-pointer">Limpiar filtros</button>}

                        <div className="ml-auto hidden md:flex gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                            <button onClick={() => setViewMode('table')} title="Vista tabla" className={`p-2 rounded-lg cursor-pointer transition-all ${viewMode === 'table' ? 'bg-white dark:bg-zinc-700 shadow-sm text-admin-700 dark:text-admin-300' : 'text-zinc-400 hover:text-zinc-600'}`}>
                                <Ico.Table />
                            </button>
                            <button onClick={() => setViewMode('grid')} title="Vista tarjetas" className={`p-2 rounded-lg cursor-pointer transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-sm text-admin-700 dark:text-admin-300' : 'text-zinc-400 hover:text-zinc-600'}`}>
                                <Ico.Grid />
                            </button>
                        </div>
                    </div>
                    <span className="block text-xs text-zinc-400">{miembrosFilt.length} resultado{miembrosFilt.length !== 1 ? 's' : ''}</span>
                </div>

                {/* Vacío */}
                {miembrosFilt.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <div className="text-4xl">🧑‍🔬</div>
                        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                            {hayFiltros ? 'Sin resultados para los filtros aplicados' : 'No hay miembros registrados'}
                        </p>
                    </div>
                )}

                {/* ── VISTA TABLA ── */}
                {miembrosFilt.length > 0 && viewMode === 'table' && (
                    <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60">
                                        {['Miembro', 'Universidad', 'Académico', 'Líneas', 'Condición', 'Acciones'].map((h, i) => (
                                            <th key={i} className="text-left px-3 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {miembrosPag.map(m => {
                                        const ccfg = condicionCfg(m.nom_condicion);
                                        return (
                                            <tr key={m.idequipo_miembro} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer" onClick={() => setDrawerMiembro(m)}>
                                                <td className="pl-4 py-3">
                                                    <div className="flex items-center gap-2.5 max-w-[200px]">
                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${avatarColor(m.idequipo_miembro)}`}>
                                                            {initials(m.nombres, m.apell_paterno)}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-zinc-900 dark:text-zinc-100 text-xs truncate">{m.nombreCompleto}</p>
                                                            <p className="text-[10px] text-zinc-400 truncate">{m.email_miembro}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3 max-w-[180px]">
                                                    <p className="text-xs text-zinc-700 dark:text-zinc-300 truncate">{m.siglas}</p>
                                                    <p className="text-[10px] text-zinc-400 truncate">{m.nom_pais}</p>
                                                </td>
                                                <td className="px-3 py-3 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{m.abreviatura}</td>
                                                <td className="px-3 py-3 max-w-[220px]"><LineasChips lineas={m.lineas} /></td>
                                                <td className="px-3 py-3">
                                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full ${ccfg.bg} ${ccfg.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${ccfg.dot}`} /> {m.nom_condicion}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => setDrawerMiembro(m)} title="Ver detalle"
                                                            className="p-1.5 rounded-lg bg-admin-100 dark:bg-admin-900/30 text-admin-600 dark:text-admin-400 hover:bg-admin-200 cursor-pointer transition-colors">
                                                            <Ico.Eye />
                                                        </button>
                                                        <button onClick={() => setLogrosMiembro(m)} title="Logros"
                                                            className="relative p-1.5 rounded-lg text-zinc-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-500 cursor-pointer transition-colors">
                                                            <Ico.Medal />
                                                            {m.logros_count > 0 && <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center">{m.logros_count}</span>}
                                                        </button>
                                                        <button onClick={() => setEditMiembro(m)} title="Editar"
                                                            className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-emerald-600 cursor-pointer transition-colors">
                                                            <Ico.Edit />
                                                        </button>
                                                        <button onClick={() => setConfirmId(m.idequipo_miembro)} title="Eliminar"
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

                {/* Paginación */}
                {miembrosFilt.length > PER_PAGE && (
                    <div className="flex items-center justify-between px-1 py-2 flex-wrap gap-2">
                        <span className="text-xs text-zinc-400">
                            Mostrando {(safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, miembrosFilt.length)} de {miembrosFilt.length} miembros
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
                                ${safePage === item ? 'bg-admin-600 text-white border-admin-600' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
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

                {/* ── VISTA TARJETAS (siempre en móvil) ── */}
                {miembrosFilt.length > 0 && (
                    <div className={`${viewMode === 'grid' ? 'grid' : 'grid md:hidden'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
                        {(viewMode === 'grid' ? miembrosPag : miembrosFilt).map(m => {
                            const ccfg = condicionCfg(m.nom_condicion);
                            return (
                                <div key={m.idequipo_miembro} onClick={() => setDrawerMiembro(m)}
                                    className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl hover:border-admin-300 dark:hover:border-admin-700 transition-all duration-200 flex flex-col cursor-pointer">
                                    <div className="p-4 flex items-start gap-3">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${avatarColor(m.idequipo_miembro)}`}>
                                            {initials(m.nombres, m.apell_paterno)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 leading-snug truncate">{m.nombreCompleto}</p>
                                            <p className="text-[11px] text-zinc-400 truncate">{m.email_miembro}</p>
                                            <span className={`inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${ccfg.bg} ${ccfg.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${ccfg.dot}`} /> {m.nom_condicion}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="px-4 pb-3 flex flex-col gap-2 flex-1">
                                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                                            <Ico.Cap /> <span className="truncate">{m.abreviatura} · {m.siglas} ({m.nom_pais})</span>
                                        </div>
                                        <LineasChips lineas={m.lineas} max={3} />
                                    </div>

                                    <div className="flex items-center justify-between mt-auto px-4 py-3 border-t border-zinc-100 dark:border-zinc-800" onClick={e => e.stopPropagation()}>
                                        <button onClick={() => setLogrosMiembro(m)} title="Logros"
                                            className="relative flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer">
                                            <Ico.Medal /> {m.logros_count} logro{m.logros_count !== 1 ? 's' : ''}
                                        </button>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setDrawerMiembro(m)} className="p-1.5 rounded-lg text-zinc-400 hover:bg-admin-50 dark:hover:bg-admin-950/30 hover:text-admin-600 cursor-pointer"><Ico.Eye /></button>
                                            <button onClick={() => setEditMiembro(m)} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-emerald-600 cursor-pointer"><Ico.Edit /></button>
                                            <button onClick={() => setConfirmId(m.idequipo_miembro)} className="p-1.5 rounded-lg text-zinc-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 cursor-pointer"><Ico.Trash /></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <FormMiembro
                open={!!editMiembro}
                miembro={editMiembro}
                catalogos={catalogos}
                onClose={() => setEditMiembro(null)}
                onSaved={handleSaved}
            />

            {drawerMiembro && (
                <MiembroDrawer
                    miembro={drawerMiembro}
                    onClose={() => setDrawerMiembro(null)}
                    onEdit={() => { setEditMiembro(drawerMiembro); }}
                    onDelete={() => setConfirmId(drawerMiembro.idequipo_miembro)}
                    onLogros={() => setLogrosMiembro(drawerMiembro)}
                />
            )}

            {logrosMiembro && (
                <MiembroLogros
                    miembro={logrosMiembro}
                    tiposLogro={catalogos.tiposLogro}
                    onClose={() => setLogrosMiembro(null)}
                    onCountChange={count => handleLogrosCountChange(logrosMiembro.idequipo_miembro, count)}
                    onToast={push}
                />
            )}

            {/* Confirm delete */}
            {confirmId !== null && (
                <>
                    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setConfirmId(null)} />
                    <div className="fixed z-[61] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(400px,92vw)] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl p-6">
                        <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center mx-auto mb-3">
                            <Ico.Trash />
                        </div>
                        <p className="text-sm font-bold text-center text-zinc-900 dark:text-zinc-100 mb-1">¿Eliminar este miembro?</p>
                        <p className="text-xs text-center text-zinc-400 mb-5">Esta acción no se puede deshacer. Si tiene pagos, publicaciones, certificados u otros registros asociados, no podrá eliminarse: cámbialo a "Inhabilitado" en su lugar.</p>
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

MiembrosIndex.layout = {
    breadcrumbs: [
        { title: 'Inicio', href: '/dashboard' },
        { title: 'Miembros', href: '/equipo' },
    ],
};
