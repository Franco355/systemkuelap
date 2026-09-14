import { useEffect, useMemo, useRef, useState } from 'react';
import { apiFetch, type Catalogos, type Miembro } from './miembros';

// ─── Helpers ────────────────────────────────────────────────────────────────

const DNI_RE = /^[A-Za-z0-9.\-]+$/;
const TEL_RE = /^(pendiente|[0-9+()\-\s]{6,20})$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
    open: boolean;
    miembro: Miembro | null;
    catalogos: Catalogos;
    onClose: () => void;
    onSaved: (m: Miembro) => void;
}

// ─── UI helpers (mismo estilo que FormEvento.tsx) ──────────────────────────

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
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-admin-600 dark:text-admin-400">{title}</h3>
            {children}
        </div>
    );
}

const Ico = {
    X: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Spin: () => <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>,
    Alert: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    File: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    Search: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
};

const EMPTY_FORM = {
    nombres: '', apell_paterno: '', apell_materno: '', dni: '', telefono: '', direccion: '', idgenero: '',
    email_miembro: '', idcondicion_miembro: '', id_grado_academico: '', iduniversidad: '', idtipo_membresia: '',
};

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function FormMiembro({ open, miembro, catalogos, onClose, onSaved }: Props) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [filtroPais, setFiltroPais] = useState('');
    const [lineasSel, setLineasSel] = useState<number[]>([]);
    const [buscarLinea, setBuscarLinea] = useState('');
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [errs, setErrs] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!open || !miembro) return;
        setForm({
            nombres: miembro.nombres,
            apell_paterno: miembro.apell_paterno,
            apell_materno: miembro.apell_materno,
            dni: miembro.dni,
            telefono: miembro.telefono,
            direccion: miembro.direccion ?? '',
            idgenero: String(miembro.idgenero),
            email_miembro: miembro.email_miembro,
            idcondicion_miembro: String(miembro.idcondicion_miembro),
            id_grado_academico: String(miembro.id_grado_academico),
            iduniversidad: String(miembro.iduniversidad),
            idtipo_membresia: String(miembro.idtipo_membresia),
        });
        setFiltroPais(String(miembro.idpais));
        setLineasSel(miembro.lineas.map(l => l.idlinea_investigacion));
        setBuscarLinea('');
        setCvFile(null);
        setErrs({});
    }, [open, miembro?.idequipo_miembro]);

    const universidadesFiltradas = useMemo(() => {
        if (!filtroPais) return catalogos.universidades;
        return catalogos.universidades.filter(u => String(u.idpais) === filtroPais);
    }, [catalogos.universidades, filtroPais]);

    const lineasFiltradas = useMemo(() => {
        if (!buscarLinea.trim()) return catalogos.lineasInvestigacion;
        const q = buscarLinea.toLowerCase();
        return catalogos.lineasInvestigacion.filter(l => `${l.linea_investigacion} ${l.nom_area_investigacion}`.toLowerCase().includes(q));
    }, [catalogos.lineasInvestigacion, buscarLinea]);

    if (!open || !miembro) return null;

    const set = (k: keyof typeof form, v: string) => {
        setForm(p => ({ ...p, [k]: v }));
        setErrs(p => { const n = { ...p }; delete n[k]; return n; });
    };

    const handlePais = (idpais: string) => {
        setFiltroPais(idpais);
        const universidadActual = catalogos.universidades.find(u => String(u.iduniversidad) === form.iduniversidad);
        if (idpais && universidadActual && String(universidadActual.idpais) !== idpais) {
            set('iduniversidad', '');
        }
    };

    const toggleLinea = (id: number) => {
        setLineasSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    };

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (!form.nombres.trim()) e.nombres = 'Obligatorio.';
        else if (form.nombres.length > 100) e.nombres = 'Máximo 100 caracteres.';
        if (!form.apell_paterno.trim()) e.apell_paterno = 'Obligatorio.';
        else if (form.apell_paterno.length > 70) e.apell_paterno = 'Máximo 70 caracteres.';
        if (!form.apell_materno.trim()) e.apell_materno = 'Obligatorio. Usa "N/A" si no aplica.';
        else if (form.apell_materno.length > 70) e.apell_materno = 'Máximo 70 caracteres.';
        if (!form.dni.trim()) e.dni = 'Obligatorio.';
        else if (!DNI_RE.test(form.dni.trim())) e.dni = 'Solo letras, números, puntos y guiones.';
        else if (form.dni.length > 20) e.dni = 'Máximo 20 caracteres.';
        if (!form.telefono.trim()) e.telefono = 'Obligatorio.';
        else if (!TEL_RE.test(form.telefono.trim())) e.telefono = 'Solo números, espacios, +, - y paréntesis (6 a 20 caracteres).';
        if (!form.idgenero) e.idgenero = 'Selecciona un género.';
        if (!form.email_miembro.trim()) e.email_miembro = 'Obligatorio.';
        else if (!EMAIL_RE.test(form.email_miembro)) e.email_miembro = 'Correo electrónico inválido.';
        else if (form.email_miembro.length > 80) e.email_miembro = 'Máximo 80 caracteres.';
        if (!form.idcondicion_miembro) e.idcondicion_miembro = 'Selecciona una condición.';
        if (!form.id_grado_academico) e.id_grado_academico = 'Selecciona un grado académico.';
        if (!form.iduniversidad) e.iduniversidad = 'Selecciona una universidad.';
        if (!form.idtipo_membresia) e.idtipo_membresia = 'Selecciona un tipo de membresía.';

        setErrs(e);
        return Object.keys(e).length === 0;
    };

    const submit = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            fd.append('lineas', JSON.stringify(lineasSel));
            if (cvFile) fd.append('cv_archivo', cvFile);
            fd.append('_method', 'PUT');

            const res = await apiFetch(`/equipo/${miembro.idequipo_miembro}`, 'POST', fd);
            const data = await res.json();

            if (data.success) {
                onSaved(data.miembro);
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
                w-[min(760px,96vw)] max-h-[92vh] overflow-y-auto
                bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xl">

                <div className="h-1.5 w-full bg-gradient-to-r from-admin-500 via-admin-600 to-admin-800 sticky top-0 z-20" />

                <div className="sticky top-1.5 z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <div>
                        <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">✏️ Editar miembro</h2>
                        <p className="text-xs text-zinc-400 mt-0.5">{miembro.nombreCompleto}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"><Ico.X /></button>
                </div>

                <div className="px-6 py-5 space-y-6">
                    {errs._general && (
                        <div className="px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-semibold flex items-center gap-2">
                            <Ico.Alert /> {errs._general}
                        </div>
                    )}

                    <Section title="Datos personales">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Field label="Nombres" req error={errs.nombres}>
                                <input value={form.nombres} onChange={e => set('nombres', e.target.value)} className={inp(!!errs.nombres)} maxLength={100} />
                            </Field>
                            <Field label="Apellido paterno" req error={errs.apell_paterno}>
                                <input value={form.apell_paterno} onChange={e => set('apell_paterno', e.target.value)} className={inp(!!errs.apell_paterno)} maxLength={70} />
                            </Field>
                            <Field label="Apellido materno" req error={errs.apell_materno} hint='Escribe "N/A" si no aplica'>
                                <input value={form.apell_materno} onChange={e => set('apell_materno', e.target.value)} className={inp(!!errs.apell_materno)} maxLength={70} />
                            </Field>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Field label="DNI / documento" req error={errs.dni}>
                                <input value={form.dni} onChange={e => set('dni', e.target.value)} className={inp(!!errs.dni)} maxLength={20} />
                            </Field>
                            <Field label="Teléfono" req error={errs.telefono}>
                                <input value={form.telefono} onChange={e => set('telefono', e.target.value)} placeholder="+51 987 654 321" className={inp(!!errs.telefono)} maxLength={20} />
                            </Field>
                            <Field label="Género" req error={errs.idgenero}>
                                <select value={form.idgenero} onChange={e => set('idgenero', e.target.value)} className={inp(!!errs.idgenero)}>
                                    <option value="">— Seleccionar —</option>
                                    {catalogos.generos.map(g => <option key={g.idgenero} value={g.idgenero}>{g.nom_genero}</option>)}
                                </select>
                            </Field>
                        </div>
                        <Field label="Dirección" error={errs.direccion} hint="Opcional">
                            <textarea value={form.direccion} onChange={e => set('direccion', e.target.value)} rows={2} className={`${inp(!!errs.direccion)} resize-none`} maxLength={2000} />
                        </Field>
                    </Section>

                    <Section title="Datos institucionales">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field label="Correo de contacto" req error={errs.email_miembro}>
                                <input type="email" value={form.email_miembro} onChange={e => set('email_miembro', e.target.value)} className={inp(!!errs.email_miembro)} maxLength={80} />
                            </Field>
                            <Field label="Condición" req error={errs.idcondicion_miembro}>
                                <select value={form.idcondicion_miembro} onChange={e => set('idcondicion_miembro', e.target.value)} className={inp(!!errs.idcondicion_miembro)}>
                                    <option value="">— Seleccionar —</option>
                                    {catalogos.condiciones.map(c => <option key={c.idcondicion_miembro} value={c.idcondicion_miembro}>{c.nom_condicion}</option>)}
                                </select>
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Field label="País de la universidad">
                                <select value={filtroPais} onChange={e => handlePais(e.target.value)} className={inp()}>
                                    <option value="">Todos los países</option>
                                    {catalogos.paises.map(p => <option key={p.idpais} value={p.idpais}>{p.nom_pais}</option>)}
                                </select>
                            </Field>
                            <Field label="Universidad" req error={errs.iduniversidad}>
                                <select value={form.iduniversidad} onChange={e => set('iduniversidad', e.target.value)} className={inp(!!errs.iduniversidad)}>
                                    <option value="">— Seleccionar —</option>
                                    {universidadesFiltradas.map(u => <option key={u.iduniversidad} value={u.iduniversidad}>{u.siglas} — {u.nom_universidad}</option>)}
                                </select>
                            </Field>
                            <Field label="Grado académico" req error={errs.id_grado_academico}>
                                <select value={form.id_grado_academico} onChange={e => set('id_grado_academico', e.target.value)} className={inp(!!errs.id_grado_academico)}>
                                    <option value="">— Seleccionar —</option>
                                    {catalogos.gradosAcademicos.map(g => <option key={g.id_grado_academico} value={g.id_grado_academico}>{g.nombre_titulo ?? g.abreviatura}</option>)}
                                </select>
                            </Field>
                        </div>

                        <Field label="Tipo de membresía" req error={errs.idtipo_membresia}>
                            <select value={form.idtipo_membresia} onChange={e => set('idtipo_membresia', e.target.value)} className={inp(!!errs.idtipo_membresia)}>
                                <option value="">— Seleccionar —</option>
                                {catalogos.tiposMembresia.map(t => <option key={t.idtipo_membresia} value={t.idtipo_membresia}>{t.nom_tipo_membresia}</option>)}
                            </select>
                        </Field>
                    </Section>

                    <Section title="Currículum (CV)">
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => fileRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-admin-400 text-sm text-zinc-500 dark:text-zinc-400 cursor-pointer transition-colors">
                                <Ico.File /> {cvFile ? cvFile.name : 'Reemplazar CV (PDF)'}
                            </button>
                            {miembro.cv_url && !cvFile && (
                                <a href={miembro.cv_url} target="_blank" rel="noreferrer" className="text-xs text-admin-600 dark:text-admin-400 hover:underline">Ver CV actual</a>
                            )}
                            <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={e => setCvFile(e.target.files?.[0] ?? null)} />
                        </div>
                        <p className="text-[10px] text-zinc-400">PDF · máx. 5MB · deja vacío para conservar el actual</p>
                        {errs.cv_archivo && <p className="text-[11px] text-red-500 flex items-center gap-1">⚠ {errs.cv_archivo}</p>}
                    </Section>

                    <Section title={`Líneas de investigación (${lineasSel.length} seleccionada${lineasSel.length !== 1 ? 's' : ''})`}>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"><Ico.Search /></span>
                            <input value={buscarLinea} onChange={e => setBuscarLinea(e.target.value)} placeholder="Buscar línea o área de investigación…" className={`${inp()} pl-8`} />
                        </div>
                        <div className="max-h-52 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-700 divide-y divide-zinc-100 dark:divide-zinc-800">
                            {lineasFiltradas.length === 0 && <p className="text-xs text-zinc-400 italic p-3">Sin resultados.</p>}
                            {lineasFiltradas.map(l => (
                                <label key={l.idlinea_investigacion} className="flex items-start gap-2.5 px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer">
                                    <input type="checkbox" checked={lineasSel.includes(l.idlinea_investigacion)} onChange={() => toggleLinea(l.idlinea_investigacion)}
                                        className="mt-0.5 accent-admin-600 cursor-pointer" />
                                    <span className="text-xs">
                                        <span className="block text-zinc-700 dark:text-zinc-300">{l.linea_investigacion}</span>
                                        <span className="block text-[10px] text-zinc-400">{l.nom_area_investigacion}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </Section>
                </div>

                <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer">
                        Cancelar
                    </button>
                    <button onClick={submit} disabled={saving}
                        className="px-5 py-2 rounded-xl bg-admin-600 hover:bg-admin-700 text-white text-sm font-bold cursor-pointer disabled:opacity-60 flex items-center gap-2">
                        {saving ? <><Ico.Spin />Guardando…</> : '💾 Guardar cambios'}
                    </button>
                </div>
            </div>
        </>
    );
}
