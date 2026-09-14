import { useEffect, useRef, useState } from 'react';
import { apiFetch, type Miembro, type TipoLogro } from './miembros';

interface Logro {
    idlogros_miembros: number;
    idequipo_miembro: number;
    idtipos_logro: number;
    nom_tipo_logro: string;
    titulo: string;
    descripcion: string;
    fecha_logro: string;
    archivo_evidencia: string | null;
    url: string | null;
    created_at: string;
}

interface Props {
    miembro: Miembro;
    tiposLogro: TipoLogro[];
    onClose: () => void;
    onCountChange: (count: number) => void;
    onToast: (msg: string, type?: 'ok' | 'err') => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtDate(d: string) {
    try { return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d.slice(0, 10) + 'T00:00:00')); }
    catch { return d; }
}
function hoyISO() { return new Date().toISOString().slice(0, 10); }

const TIPO_CFG: Record<string, string> = {
    'Premio': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    'Publicacion': 'bg-admin-100 text-admin-700 dark:bg-admin-900/30 dark:text-admin-300',
    'Certificacion': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    'Reconocimiento': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
};
function tipoCfg(nombre: string) {
    return TIPO_CFG[nombre] ?? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

function Field({ label, error, req, children }: { label: string; error?: string; req?: boolean; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5">
                {label}{req && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {children}
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
    Edit: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
    Trash: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Spin: () => <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>,
    Alert: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    Medal: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="15" r="5" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10.5L6 3h3l2 5m4 2.5L18 3h-3l-2 5" /></svg>,
    File: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
};

const EMPTY_FORM = { idtipos_logro: '', titulo: '', descripcion: '', fecha_logro: '' };

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function MiembroLogros({ miembro, tiposLogro, onClose, onCountChange, onToast }: Props) {
    const [logros, setLogros] = useState<Logro[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [archivo, setArchivo] = useState<File | null>(null);
    const [errs, setErrs] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                const res = await apiFetch(`/equipo/${miembro.idequipo_miembro}/logros`, 'GET');
                const data = await res.json();
                if (!cancelled && data.success) setLogros(data.logros);
            } catch {
                if (!cancelled) onToast('No se pudieron cargar los logros.', 'err');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [miembro.idequipo_miembro]);

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setArchivo(null);
        setEditingId(null);
        setErrs({});
    };

    const openCreate = () => { resetForm(); setShowForm(true); };
    const openEdit = (l: Logro) => {
        setForm({ idtipos_logro: String(l.idtipos_logro), titulo: l.titulo, descripcion: l.descripcion, fecha_logro: l.fecha_logro.slice(0, 10) });
        setArchivo(null);
        setEditingId(l.idlogros_miembros);
        setErrs({});
        setShowForm(true);
    };
    const cancelForm = () => { setShowForm(false); resetForm(); };

    const set = (k: keyof typeof form, v: string) => {
        setForm(p => ({ ...p, [k]: v }));
        setErrs(p => { const n = { ...p }; delete n[k]; return n; });
    };

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (!form.idtipos_logro) e.idtipos_logro = 'Selecciona un tipo.';
        if (!form.titulo.trim()) e.titulo = 'Obligatorio.';
        else if (form.titulo.length > 150) e.titulo = 'Máximo 150 caracteres.';
        if (!form.descripcion.trim()) e.descripcion = 'Obligatorio.';
        else if (form.descripcion.length > 3000) e.descripcion = 'Máximo 3000 caracteres.';
        if (!form.fecha_logro) e.fecha_logro = 'Obligatorio.';
        else if (form.fecha_logro > hoyISO()) e.fecha_logro = 'No puede ser una fecha futura.';
        setErrs(e);
        return Object.keys(e).length === 0;
    };

    const submit = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('idtipos_logro', form.idtipos_logro);
            fd.append('titulo', form.titulo.trim());
            fd.append('descripcion', form.descripcion.trim());
            fd.append('fecha_logro', form.fecha_logro);
            if (archivo) fd.append('archivo_evidencia', archivo);

            let res;
            if (editingId) {
                fd.append('_method', 'PUT');
                res = await apiFetch(`/equipo/${miembro.idequipo_miembro}/logros/${editingId}`, 'POST', fd);
            } else {
                res = await apiFetch(`/equipo/${miembro.idequipo_miembro}/logros`, 'POST', fd);
            }
            const data = await res.json();

            if (data.success) {
                const nuevaLista = editingId
                    ? logros.map(l => l.idlogros_miembros === data.logro.idlogros_miembros ? data.logro : l)
                    : [data.logro, ...logros];
                setLogros(nuevaLista);
                onCountChange(nuevaLista.length);
                onToast(data.message ?? 'Guardado correctamente.');
                cancelForm();
            } else {
                if (data.errors) {
                    const flat: Record<string, string> = {};
                    Object.entries(data.errors).forEach(([k, v]) => { flat[k] = Array.isArray(v) ? v[0] as string : String(v); });
                    setErrs(flat);
                }
                onToast(data.message ?? 'Error al guardar.', 'err');
            }
        } catch {
            onToast('Error de conexión con el servidor.', 'err');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            const res = await apiFetch(`/equipo/${miembro.idequipo_miembro}/logros/${id}`, 'DELETE');
            const data = await res.json();
            if (data.success) {
                setLogros(data.logros);
                onCountChange(data.logros.length);
                onToast('Logro eliminado correctamente.');
                if (editingId === id) cancelForm();
            } else {
                onToast(data.message ?? 'Error al eliminar.', 'err');
            }
        } catch {
            onToast('Error de conexión.', 'err');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm" onClick={onClose} />
            <div className="fixed z-[51] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[min(680px,96vw)] max-h-[92vh] overflow-y-auto
                bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl">

                <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 sticky top-0 z-20" />

                <div className="sticky top-1.5 z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0"><Ico.Medal /></span>
                        <div>
                            <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">Logros y reconocimientos</h2>
                            <p className="text-xs text-zinc-400 mt-0.5">{miembro.nombreCompleto}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"><Ico.X /></button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {!showForm && (
                        <button onClick={openCreate} disabled={logros.length >= 30}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                            <Ico.Plus /> Agregar logro
                        </button>
                    )}

                    {showForm && (
                        <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/10 p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">{editingId ? 'Editar logro' : 'Nuevo logro'}</h3>
                                <button onClick={cancelForm} className="text-zinc-400 hover:text-zinc-600 cursor-pointer"><Ico.Xs /></button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field label="Tipo de logro" req error={errs.idtipos_logro}>
                                    <select value={form.idtipos_logro} onChange={e => set('idtipos_logro', e.target.value)} className={inp(!!errs.idtipos_logro)}>
                                        <option value="">— Seleccionar —</option>
                                        {tiposLogro.map(t => <option key={t.idtipos_logro} value={t.idtipos_logro}>{t.nom_tipo_logro}</option>)}
                                    </select>
                                </Field>
                                <Field label="Fecha del logro" req error={errs.fecha_logro}>
                                    <input type="date" value={form.fecha_logro} max={hoyISO()} onChange={e => set('fecha_logro', e.target.value)} className={inp(!!errs.fecha_logro)} />
                                </Field>
                            </div>

                            <Field label="Título" req error={errs.titulo}>
                                <input value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Ej: Mejor ponencia — Congreso Internacional 2025" className={inp(!!errs.titulo)} maxLength={150} />
                            </Field>

                            <Field label="Descripción" req error={errs.descripcion}>
                                <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)} rows={3} className={`${inp(!!errs.descripcion)} resize-none`} maxLength={3000} />
                            </Field>

                            <div className="flex items-center gap-3">
                                <button type="button" onClick={() => fileRef.current?.click()}
                                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-amber-400 text-xs text-zinc-500 dark:text-zinc-400 cursor-pointer transition-colors">
                                    <Ico.File /> {archivo ? archivo.name : 'Evidencia (PDF o imagen, opcional)'}
                                </button>
                                <input ref={fileRef} type="file" accept="application/pdf,image/png,image/jpeg,image/webp" className="hidden" onChange={e => setArchivo(e.target.files?.[0] ?? null)} />
                            </div>
                            {errs.archivo_evidencia && <p className="text-[11px] text-red-500 flex items-center gap-1">⚠ {errs.archivo_evidencia}</p>}

                            <div className="flex justify-end gap-2 pt-1">
                                <button onClick={cancelForm} className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 cursor-pointer">
                                    Cancelar
                                </button>
                                <button onClick={submit} disabled={saving}
                                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer disabled:opacity-60 flex items-center gap-2">
                                    {saving ? <><Ico.Spin />Guardando…</> : editingId ? 'Actualizar logro' : 'Agregar logro'}
                                </button>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-10 text-zinc-400 gap-2 text-sm"><Ico.Spin /> Cargando logros…</div>
                    ) : logros.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                            <span className="text-3xl">🏅</span>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold">Aún no hay logros registrados</p>
                            <p className="text-xs text-zinc-400 max-w-xs">Registra premios, publicaciones, certificaciones y otros reconocimientos de este miembro.</p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {logros.map(l => (
                                <div key={l.idlogros_miembros} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3.5 flex gap-3">
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tipoCfg(l.nom_tipo_logro)}`}>{l.nom_tipo_logro}</span>
                                            <span className="text-[11px] text-zinc-400">{fmtDate(l.fecha_logro)}</span>
                                        </div>
                                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{l.titulo}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{l.descripcion}</p>
                                        {l.url && <a href={l.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-admin-600 dark:text-admin-400 hover:underline"><Ico.File /> Ver evidencia</a>}
                                    </div>
                                    <div className="flex flex-col gap-1 shrink-0">
                                        <button onClick={() => openEdit(l)} title="Editar" className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-emerald-600 cursor-pointer">
                                            <Ico.Edit />
                                        </button>
                                        <button onClick={() => handleDelete(l.idlogros_miembros)} disabled={deletingId === l.idlogros_miembros} title="Eliminar"
                                            className="p-1.5 rounded-lg text-zinc-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 cursor-pointer disabled:opacity-50">
                                            {deletingId === l.idlogros_miembros ? <Ico.Spin /> : <Ico.Trash />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
