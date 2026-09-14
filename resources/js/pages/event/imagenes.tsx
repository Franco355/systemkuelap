import { Head, Link } from '@inertiajs/react';
import { useCallback, useRef, useState } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface ImagenItem {
    idimagenes: number;
    nombre: string;
    imagen: string;
    orden: number;
    idempresa_kuelap: number;
    url: string | null;
}

interface Props {
    imagenes: ImagenItem[];
    tieneEmpresa: boolean;
    maxImagenes: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getCSRF(): string {
    return (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';
}
async function apiFetch(url: string, method: 'GET' | 'POST' | 'DELETE', body?: FormData) {
    return fetch(url, { method, headers: { 'X-CSRF-TOKEN': getCSRF(), Accept: 'application/json' }, body });
}
async function apiJson(url: string, payload: unknown) {
    return fetch(url, {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': getCSRF(), Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}
const MIN_W = 640;
const MIN_H = 360;

// ─── Toast (mismo patrón que eventos.tsx / empresa.tsx) ────────────────────

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

// ─── Icons ──────────────────────────────────────────────────────────────────

const Ico = {
    Plus: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    X: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Xs: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Edit: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
    Trash: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Check: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>,
    Spin: () => <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>,
    Alert: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    Image: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" /><circle cx="8.5" cy="8.5" r="1.5" /></svg>,
    ImageXl: () => <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" /><circle cx="8.5" cy="8.5" r="1.5" /></svg>,
    Grip: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01" /></svg>,
    ArrowUp: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>,
    ArrowDown: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>,
    Building: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1" /></svg>,
};

// ─── UI helpers (mismo estilo que eventos.tsx / empresa.tsx) ──────────────

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

const EMPTY_FORM = { nombre: '' };

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function ImagenesIndex({ imagenes: initImagenes, tieneEmpresa, maxImagenes }: Props) {
    const [imagenes, setImagenes] = useState<ImagenItem[]>(initImagenes);
    const [reordering, setReordering] = useState(false);
    const { list: toasts, push } = useToast();

    // ── Modal crear/editar (todo en este mismo archivo) ──
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<ImagenItem | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [imgFile, setImgFile] = useState<File | null>(null);
    const [imgPreview, setImgPreview] = useState<string | null>(null);
    const [errs, setErrs] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const isEditModal = !!editing;

    // ── Confirmación de borrado ──
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    // ── Drag & drop reorder (desktop) ──
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);

    const alcanzoLimite = imagenes.length >= maxImagenes;
    const puedeSubir = tieneEmpresa && !alcanzoLimite;

    // ── Abrir modal ──
    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setImgFile(null);
        setImgPreview(null);
        setErrs({});
        setModalOpen(true);
    };
    const openEdit = (img: ImagenItem) => {
        setEditing(img);
        setForm({ nombre: img.nombre });
        setImgFile(null);
        setImgPreview(img.url);
        setErrs({});
        setModalOpen(true);
    };
    const closeModal = () => {
        if (saving) return;
        setModalOpen(false);
    };

    const handleImg = (file: File | null) => {
        setImgFile(file);
        setErrs(p => { const n = { ...p }; delete n.imagen; return n; });
        if (!file) { setImgPreview(editing?.url ?? null); return; }

        const url = URL.createObjectURL(file);
        setImgPreview(url);

        const probe = new Image();
        probe.onload = () => {
            if (probe.naturalWidth < MIN_W || probe.naturalHeight < MIN_H) {
                setErrs(p => ({ ...p, imagen: `Imagen muy pequeña (${probe.naturalWidth}×${probe.naturalHeight}px). Mínimo ${MIN_W}×${MIN_H}px.` }));
            }
        };
        probe.src = url;
    };

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (!form.nombre.trim()) e.nombre = 'Obligatorio.';
        else if (form.nombre.length > 255) e.nombre = 'Máximo 255 caracteres.';
        if (!isEditModal && !imgFile) e.imagen = 'La imagen es obligatoria.';
        if (errs.imagen && errs.imagen.startsWith('Imagen muy pequeña')) e.imagen = errs.imagen;
        setErrs(e);
        return Object.keys(e).length === 0;
    };

    const submit = async () => {
        if (!validate()) {
            push('Revisa los campos marcados en rojo.', 'err');
            return;
        }
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('nombre', form.nombre.trim());
            if (imgFile) fd.append('imagen', imgFile);
            if (isEditModal) fd.append('_method', 'PUT');

            const url = isEditModal ? `/imagenes/${editing!.idimagenes}` : '/imagenes';
            const res = await apiFetch(url, 'POST', fd);
            const data = await res.json();

            if (data.success) {
                if (isEditModal) {
                    setImagenes(p => p.map(i => i.idimagenes === data.imagen.idimagenes ? data.imagen : i));
                } else {
                    setImagenes(p => [...p, data.imagen]);
                }
                push(data.message ?? 'Guardado correctamente.');
                setModalOpen(false);
            } else {
                if (data.errors) {
                    const flat: Record<string, string> = {};
                    Object.entries(data.errors).forEach(([k, v]) => { flat[k] = Array.isArray(v) ? v[0] as string : String(v); });
                    setErrs(p => ({ ...p, ...flat }));
                }
                push(data.message ?? 'Error al guardar.', 'err');
            }
        } catch {
            push('Error de conexión con el servidor.', 'err');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (confirmId === null) return;
        setDeleting(true);
        try {
            const res = await apiFetch(`/imagenes/${confirmId}`, 'DELETE');
            const data = await res.json();
            if (data.success) {
                setImagenes(data.imagenes ?? imagenes.filter(i => i.idimagenes !== confirmId));
                push('Imagen eliminada correctamente.');
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

    // ── Reordenar (persistencia optimista) ──
    const persistOrder = async (nuevoOrden: ImagenItem[]) => {
        const previo = imagenes;
        setImagenes(nuevoOrden);
        setReordering(true);
        try {
            const res = await apiJson('/imagenes/reorder', { orden: nuevoOrden.map(i => i.idimagenes) });
            const data = await res.json();
            if (data.success) {
                setImagenes(data.imagenes);
            } else {
                setImagenes(previo);
                push(data.message ?? 'No se pudo reordenar.', 'err');
            }
        } catch {
            setImagenes(previo);
            push('Error de conexión al reordenar.', 'err');
        } finally {
            setReordering(false);
        }
    };

    const moveImage = (index: number, dir: -1 | 1) => {
        const target = index + dir;
        if (target < 0 || target >= imagenes.length) return;
        const copy = [...imagenes];
        [copy[index], copy[target]] = [copy[target], copy[index]];
        persistOrder(copy);
    };

    const onDrop = (index: number) => {
        if (dragIndex === null || dragIndex === index) { setDragIndex(null); setOverIndex(null); return; }
        const copy = [...imagenes];
        const [moved] = copy.splice(dragIndex, 1);
        copy.splice(index, 0, moved);
        setDragIndex(null);
        setOverIndex(null);
        persistOrder(copy);
    };

    return (
        <>
            <Head title="Imágenes" />

            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto rounded-xl p-4">

                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-admin-600 via-admin-700 to-admin-900 p-4 text-white shadow-xl">
                    <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/5" />
                    <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="text-xs font-bold text-admin-200 uppercase tracking-widest mb-1">Carrusel de la página pública</p>
                            <h1 className="text-2xl font-black">Galería de Imágenes</h1>
                            <p className="text-sm text-admin-100/80 mt-0.5">{imagenes.length} de {maxImagenes} imágenes usadas</p>
                        </div>
                        <button onClick={openCreate} disabled={!puedeSubir}
                            title={!tieneEmpresa ? 'Registra primero la ficha de empresa' : alcanzoLimite ? 'Alcanzaste el máximo de imágenes' : undefined}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-admin-700 font-bold text-sm hover:bg-admin-50 cursor-pointer shadow-lg shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
                            <Ico.Plus /> Subir imagen
                        </button>
                    </div>
                </div>

                {!tieneEmpresa && (
                    <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl px-4 py-3.5">
                        <span className="text-amber-500 mt-0.5"><Ico.Building /></span>
                        <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
                            Aún no registraste la ficha institucional. <Link href="/empresa" className="underline hover:text-amber-800 dark:hover:text-amber-200">Regístrala en "Empresa"</Link> antes de subir imágenes.
                        </p>
                    </div>
                )}

                {tieneEmpresa && alcanzoLimite && (
                    <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl px-4 py-3.5">
                        <span className="text-amber-500 mt-0.5"><Ico.Alert /></span>
                        <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
                            Alcanzaste el máximo de {maxImagenes} imágenes. Elimina alguna para poder subir otra.
                        </p>
                    </div>
                )}

                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-100">Orden del carrusel</h2>
                            <p className="text-xs text-zinc-400 mt-0.5">Arrastra una imagen para reordenarla, o usa las flechas. El número muestra su posición actual.</p>
                        </div>
                        {reordering && <span className="flex items-center gap-1.5 text-xs font-semibold text-admin-500"><Ico.Spin /> Guardando orden…</span>}
                    </div>

                    {imagenes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="w-16 h-16 rounded-2xl bg-admin-50 dark:bg-admin-950/30 flex items-center justify-center text-admin-400"><Ico.ImageXl /></div>
                            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Aún no subiste imágenes</p>
                            <p className="text-xs text-zinc-400 max-w-xs text-center">Las imágenes que subas aquí aparecen rotando como fondo en la portada del sitio público.</p>
                            {puedeSubir && (
                                <button onClick={openCreate} className="mt-1 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-admin-600 text-white text-sm font-bold cursor-pointer hover:bg-admin-700">
                                    <Ico.Plus /> Subir la primera imagen
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {imagenes.map((img, index) => (
                                <div
                                    key={img.idimagenes}
                                    draggable
                                    onDragStart={() => setDragIndex(index)}
                                    onDragOver={e => { e.preventDefault(); setOverIndex(index); }}
                                    onDragLeave={() => setOverIndex(o => o === index ? null : o)}
                                    onDrop={e => { e.preventDefault(); onDrop(index); }}
                                    onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
                                    className={`group relative bg-white dark:bg-zinc-900 rounded-2xl border overflow-hidden transition-all duration-150 cursor-grab active:cursor-grabbing
                                        ${dragIndex === index ? 'opacity-40' : ''}
                                        ${overIndex === index && dragIndex !== null && dragIndex !== index ? 'border-admin-400 ring-2 ring-admin-300/40 dark:border-admin-500' : 'border-zinc-200 dark:border-zinc-800 hover:border-admin-300 dark:hover:border-admin-700 hover:shadow-xl'}`}
                                >
                                    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800">
                                        {img.url
                                            ? <img src={img.url} alt={img.nombre} className="w-full h-full object-cover pointer-events-none" draggable={false} />
                                            : <div className="w-full h-full flex items-center justify-center text-zinc-300"><Ico.Image /></div>}

                                        <span className="absolute top-2.5 left-2.5 flex items-center justify-center min-w-6 h-6 px-1.5 rounded-full bg-admin-600 text-white text-[11px] font-black shadow-lg">
                                            #{img.orden}
                                        </span>

                                        <span className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-white/85 dark:bg-zinc-900/85 text-zinc-400 shadow backdrop-blur-sm">
                                            <Ico.Grip />
                                        </span>

                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                            <button onClick={() => openEdit(img)} title="Editar"
                                                className="p-2.5 rounded-xl bg-white/95 dark:bg-zinc-900/95 text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 cursor-pointer shadow-lg">
                                                <Ico.Edit />
                                            </button>
                                            <button onClick={() => setConfirmId(img.idimagenes)} title="Eliminar"
                                                className="p-2.5 rounded-xl bg-white/95 dark:bg-zinc-900/95 text-zinc-700 dark:text-zinc-200 hover:text-red-500 cursor-pointer shadow-lg">
                                                <Ico.Trash />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-3 flex items-center gap-2">
                                        <p className="flex-1 min-w-0 text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{img.nombre}</p>
                                        <div className="flex items-center gap-0.5 shrink-0">
                                            <button onClick={() => moveImage(index, -1)} disabled={index === 0} title="Mover antes"
                                                className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-admin-600 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-colors">
                                                <Ico.ArrowUp />
                                            </button>
                                            <button onClick={() => moveImage(index, 1)} disabled={index === imagenes.length - 1} title="Mover después"
                                                className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-admin-600 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-colors">
                                                <Ico.ArrowDown />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Modal crear/editar (mismo archivo, sin componente aparte) ── */}
            {modalOpen && (
                <>
                    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm" onClick={closeModal} />
                    <div className="fixed z-[51] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[min(520px,94vw)] max-h-[92vh] overflow-y-auto
                        bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl">

                        <div className="h-1.5 w-full bg-gradient-to-r from-admin-500 via-admin-600 to-admin-800 sticky top-0 z-20" />

                        <div className="sticky top-1.5 z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                            <div>
                                <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                                    {isEditModal ? '✏️ Editar imagen' : '🖼️ Subir imagen'}
                                </h2>
                                <p className="text-xs text-zinc-400 mt-0.5">{isEditModal ? editing?.nombre : 'Se agrega al final del carrusel público'}</p>
                            </div>
                            <button onClick={closeModal} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"><Ico.X /></button>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            {errs._general && (
                                <div className="px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-semibold flex items-center gap-2">
                                    <Ico.Alert /> {errs._general}
                                </div>
                            )}

                            <Field label="Fotografía" req={!isEditModal} error={errs.imagen} hint={`JPG, PNG o WEBP · máx. 6MB · mínimo ${MIN_W}×${MIN_H}px`}>
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="w-full aspect-video rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-admin-400 transition-colors bg-zinc-50 dark:bg-zinc-800/50"
                                >
                                    {imgPreview
                                        ? <img src={imgPreview} alt="preview" className="w-full h-full object-cover" />
                                        : <span className="text-zinc-400 flex flex-col items-center gap-1 text-[11px]"><Ico.Image />Subir imagen</span>}
                                </div>
                                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => handleImg(e.target.files?.[0] ?? null)} />
                            </Field>

                            <Field label="Nombre / descripción interna" req error={errs.nombre} hint="Ayuda a identificarla en esta lista (no se muestra en el sitio público).">
                                <input value={form.nombre} onChange={e => { setForm({ nombre: e.target.value }); setErrs(p => { const n = { ...p }; delete n.nombre; return n; }); }}
                                    placeholder="Ej: Congreso KUÉLAP 2025 - foto grupal" className={inp(!!errs.nombre)} maxLength={255} />
                            </Field>
                        </div>

                        <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                            <button onClick={closeModal} disabled={saving} className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer disabled:opacity-50">
                                Cancelar
                            </button>
                            <button onClick={submit} disabled={saving}
                                className="px-5 py-2 rounded-xl bg-admin-600 hover:bg-admin-700 text-white text-sm font-bold cursor-pointer disabled:opacity-60 flex items-center gap-2">
                                {saving ? <><Ico.Spin />Guardando…</> : isEditModal ? '💾 Actualizar imagen' : '🖼️ Subir imagen'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Confirm delete */}
            {confirmId !== null && (
                <>
                    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setConfirmId(null)} />
                    <div className="fixed z-[61] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(380px,92vw)] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl p-6">
                        <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center mx-auto mb-3">
                            <Ico.Trash />
                        </div>
                        <p className="text-sm font-bold text-center text-zinc-900 dark:text-zinc-100 mb-1">¿Eliminar esta imagen?</p>
                        <p className="text-xs text-center text-zinc-400 mb-5">Esta acción no se puede deshacer. El resto de imágenes se renumerará automáticamente.</p>
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

ImagenesIndex.layout = {
    breadcrumbs: [
        { title: 'Inicio', href: '/dashboard' },
        { title: 'Imágenes', href: '/imagenes' },
    ],
};
