import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { socialIconFor } from '@/lib/social-icons';

// ─── Types ──────────────────────────────────────────────────────────────────

interface TipoRed {
    idtipos_redes: number;
    tipos_redes: string;
}

interface RedEmpresa {
    idtipos_redes: number;
    nom_tipo_red: string;
    enlace: string;
}

interface ValorEmpresa {
    idempresa_valores: number;
    nom_valores: string;
    descripcion: string;
}

interface Empresa {
    idempresa_kuelap: number;
    nom_empresa: string;
    emp_descripcion: string;
    emp_logo: string | null;
    emp_logo_url: string | null;
    emp_mision: string;
    emp_vision: string;
    emp_correo: string;
    emp_telefono: string;
    emp_direccion: string;
    created_at: string | null;
    updated_at: string | null;
}

interface Props {
    empresa: Empresa | null;
    redes: RedEmpresa[];
    valores: ValorEmpresa[];
    tiposRedes: TipoRed[];
}

interface ValorForm {
    key: string;
    idempresa_valores: number | null;
    nom_valores: string;
    descripcion: string;
}

interface RedForm {
    key: string;
    idtipos_redes: string; // '' = aún sin seleccionar
    enlace: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getCSRF(): string {
    return (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';
}
async function apiFetch(url: string, method: 'GET' | 'POST', body?: FormData) {
    return fetch(url, { method, headers: { 'X-CSRF-TOKEN': getCSRF(), Accept: 'application/json' }, body });
}
function fmtDateTime(d: string | null) {
    if (!d) return '—';
    try {
        return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d.replace(' ', 'T')));
    } catch {
        return d;
    }
}
const URL_RE = /^https?:\/\/.+/i;
const TEL_RE = /^(pendiente|[0-9+()\-\s]{6,15})$/i;
let uid = 0;
function nextKey() { return `v${Date.now()}_${uid++}`; }
function normalizeRedes(list: { idtipos_redes: string | number; enlace: string }[]) {
    return list
        .map(r => ({ idtipos_redes: Number(r.idtipos_redes), enlace: r.enlace.trim() }))
        .filter(r => r.idtipos_redes && r.enlace)
        .sort((a, b) => a.idtipos_redes - b.idtipos_redes);
}

// ─── Toast (mismo patrón que eventos.tsx) ──────────────────────────────────

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
    Save: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-6 0V3h6v4m-6 0h6" /></svg>,
    Plus: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Xs: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Check: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>,
    Spin: () => <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>,
    Alert: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    Building: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1" /></svg>,
    Mail: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Phone: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    MapPin: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Image: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 6h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" /><circle cx="8.5" cy="8.5" r="1.5" /></svg>,
    Sparkle: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
    Compass: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l-2.5 5.5L8 16l2.5-5.5L16 8z" /></svg>,
    Heart: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    Trash: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Link: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>,
};

// ─── UI helpers (mismo estilo que eventos.tsx / FormEvento.tsx) ───────────

function Field({ label, error, req, hint, counter, children }: { label: string; error?: string; req?: boolean; hint?: string; counter?: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {label}{req && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                {counter && <span className="text-[10px] font-semibold text-zinc-400 tabular-nums">{counter}</span>}
            </div>
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
function Section({ title, icon, hint, children }: { title: string; icon: React.ReactNode; hint?: string; children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
            <div>
                <h2 className="flex items-center gap-2 text-sm font-black text-zinc-900 dark:text-zinc-100">
                    <span className="text-admin-500">{icon}</span> {title}
                </h2>
                {hint && <p className="text-xs text-zinc-400 mt-0.5">{hint}</p>}
            </div>
            {children}
        </div>
    );
}

// ─── Form state ─────────────────────────────────────────────────────────────

const EMPTY_FORM = {
    nom_empresa: '',
    emp_descripcion: '',
    emp_mision: '',
    emp_vision: '',
    emp_correo: '',
    emp_telefono: '',
    emp_direccion: '',
};
type FormState = typeof EMPTY_FORM;

function empresaToForm(e: Empresa | null): FormState {
    if (!e) return EMPTY_FORM;
    return {
        nom_empresa: e.nom_empresa,
        emp_descripcion: e.emp_descripcion,
        emp_mision: e.emp_mision,
        emp_vision: e.emp_vision,
        emp_correo: e.emp_correo,
        emp_telefono: e.emp_telefono,
        emp_direccion: e.emp_direccion,
    };
}

// ─── MAIN ───────────────────────────────────────────────────────────────────

export default function EmpresaPage({ empresa: initEmpresa, redes: initRedes, valores: initValores, tiposRedes }: Props) {
    const [empresa, setEmpresa] = useState<Empresa | null>(initEmpresa);
    const isEdit = !!empresa;

    const [form, setForm] = useState<FormState>(() => empresaToForm(initEmpresa));
    const [redesForm, setRedesForm] = useState<RedForm[]>(() =>
        initRedes.map(r => ({ key: nextKey(), idtipos_redes: String(r.idtipos_redes), enlace: r.enlace }))
    );
    const [valoresForm, setValoresForm] = useState<ValorForm[]>(() =>
        initValores.map(v => ({ key: nextKey(), idempresa_valores: v.idempresa_valores, nom_valores: v.nom_valores, descripcion: v.descripcion }))
    );

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(initEmpresa?.emp_logo_url ?? null);
    const fileRef = useRef<HTMLInputElement>(null);

    const [errs, setErrs] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const { list: toasts, push } = useToast();

    // ── Snapshot inicial, para saber si hay cambios sin guardar ──
    const savedSnapshotRef = useRef({ form: empresaToForm(initEmpresa), redes: normalizeRedes(redesForm), valoresForm: initValores.map(v => ({ nom_valores: v.nom_valores, descripcion: v.descripcion })), logo: false });

    const isDirty = useMemo(() => {
        const snap = savedSnapshotRef.current;
        if (JSON.stringify(form) !== JSON.stringify(snap.form)) return true;
        if (JSON.stringify(normalizeRedes(redesForm)) !== JSON.stringify(snap.redes)) return true;
        const curValores = valoresForm.map(v => ({ nom_valores: v.nom_valores, descripcion: v.descripcion }));
        if (JSON.stringify(curValores) !== JSON.stringify(snap.valoresForm)) return true;
        if (logoFile) return true;
        return false;
    }, [form, redesForm, valoresForm, logoFile]);

    useEffect(() => {
        const warn = (e: BeforeUnloadEvent) => { if (isDirty) { e.preventDefault(); } };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [isDirty]);

    const set = (k: keyof FormState, v: string) => {
        setForm(p => ({ ...p, [k]: v }));
        setErrs(p => { const n = { ...p }; delete n[k]; return n; });
    };

    const handleLogo = (file: File | null) => {
        setLogoFile(file);
        setErrs(p => { const n = { ...p }; delete n.emp_logo; return n; });
        if (file) setLogoPreview(URL.createObjectURL(file));
    };

    const tiposDisponibles = (paraKey: string) =>
        tiposRedes.filter(t => t.idtipos_redes === Number(redesForm.find(r => r.key === paraKey)?.idtipos_redes) || !redesForm.some(r => r.idtipos_redes === String(t.idtipos_redes)));

    const puedeAgregarRed = redesForm.length < tiposRedes.length;

    const addRed = () => setRedesForm(p => [...p, { key: nextKey(), idtipos_redes: '', enlace: '' }]);
    const removeRed = (key: string) => {
        setRedesForm(p => p.filter(r => r.key !== key));
        setErrs(p => { const n = { ...p }; delete n[`red_${key}`]; return n; });
    };
    const updateRed = (key: string, field: 'idtipos_redes' | 'enlace', v: string) => {
        setRedesForm(p => p.map(r => r.key === key ? { ...r, [field]: v } : r));
        setErrs(p => { const n = { ...p }; delete n[`red_${key}`]; return n; });
    };

    const addValor = () => setValoresForm(p => [...p, { key: nextKey(), idempresa_valores: null, nom_valores: '', descripcion: '' }]);
    const removeValor = (key: string) => setValoresForm(p => p.filter(v => v.key !== key));
    const updateValor = (key: string, field: 'nom_valores' | 'descripcion', v: string) => {
        setValoresForm(p => p.map(x => x.key === key ? { ...x, [field]: v } : x));
        setErrs(p => { const n = { ...p }; delete n[`valor_${key}`]; return n; });
    };

    const validate = (): boolean => {
        const e: Record<string, string> = {};

        if (!form.nom_empresa.trim()) e.nom_empresa = 'Obligatorio.';
        else if (form.nom_empresa.length > 150) e.nom_empresa = 'Máximo 150 caracteres.';

        if (!form.emp_descripcion.trim()) e.emp_descripcion = 'Obligatorio.';
        else if (form.emp_descripcion.length > 45) e.emp_descripcion = 'Máximo 45 caracteres.';

        if (!form.emp_mision.trim()) e.emp_mision = 'Obligatorio.';
        else if (form.emp_mision.length > 5000) e.emp_mision = 'Máximo 5000 caracteres.';

        if (!form.emp_vision.trim()) e.emp_vision = 'Obligatorio.';
        else if (form.emp_vision.length > 5000) e.emp_vision = 'Máximo 5000 caracteres.';

        if (!form.emp_correo.trim()) e.emp_correo = 'Obligatorio.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emp_correo)) e.emp_correo = 'Correo electrónico inválido.';
        else if (form.emp_correo.length > 80) e.emp_correo = 'Máximo 80 caracteres.';

        if (!form.emp_telefono.trim()) e.emp_telefono = 'Obligatorio.';
        else if (!TEL_RE.test(form.emp_telefono.trim())) e.emp_telefono = 'Solo números, espacios, +, - y paréntesis (6 a 15 caracteres).';

        if (!form.emp_direccion.trim()) e.emp_direccion = 'Obligatorio.';
        else if (form.emp_direccion.length > 200) e.emp_direccion = 'Máximo 200 caracteres.';

        if (!isEdit && !logoFile) e.emp_logo = 'El logo institucional es obligatorio.';

        const tiposVistos = new Set<string>();
        for (const r of redesForm) {
            if (!r.idtipos_redes) { e[`red_${r.key}`] = 'Selecciona una red social.'; continue; }
            if (tiposVistos.has(r.idtipos_redes)) { e[`red_${r.key}`] = 'Ya agregaste esta red social.'; continue; }
            tiposVistos.add(r.idtipos_redes);
            const enlace = r.enlace.trim();
            if (!enlace) { e[`red_${r.key}`] = 'Agrega el enlace o elimina esta red.'; continue; }
            if (!URL_RE.test(enlace)) { e[`red_${r.key}`] = 'URL inválida (debe iniciar con http:// o https://).'; continue; }
        }

        const nombresVistos = new Set<string>();
        for (const v of valoresForm) {
            const nombre = v.nom_valores.trim();
            const descripcion = v.descripcion.trim();
            if (!nombre && !descripcion) continue;
            if (!nombre || !descripcion) { e[`valor_${v.key}`] = 'Completa nombre y descripción, o elimina la fila.'; continue; }
            if (nombre.length > 100) { e[`valor_${v.key}`] = 'El nombre no puede superar 100 caracteres.'; continue; }
            if (descripcion.length > 2000) { e[`valor_${v.key}`] = 'La descripción no puede superar 2000 caracteres.'; continue; }
            const key = nombre.toLowerCase();
            if (nombresVistos.has(key)) { e[`valor_${v.key}`] = 'Ya agregaste un valor con este nombre.'; continue; }
            nombresVistos.add(key);
        }
        if (valoresForm.length > 12) e._valores = 'No puedes registrar más de 12 valores institucionales.';

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
            fd.append('nom_empresa', form.nom_empresa.trim());
            fd.append('emp_descripcion', form.emp_descripcion.trim());
            fd.append('emp_mision', form.emp_mision.trim());
            fd.append('emp_vision', form.emp_vision.trim());
            fd.append('emp_correo', form.emp_correo.trim());
            fd.append('emp_telefono', form.emp_telefono.trim());
            fd.append('emp_direccion', form.emp_direccion.trim());
            if (logoFile) fd.append('emp_logo', logoFile);

            fd.append('redes', JSON.stringify(normalizeRedes(redesForm)));

            const valoresPayload = valoresForm
                .filter(v => v.nom_valores.trim() && v.descripcion.trim())
                .map(v => ({ nom_valores: v.nom_valores.trim(), descripcion: v.descripcion.trim() }));
            fd.append('valores', JSON.stringify(valoresPayload));

            if (isEdit) fd.append('_method', 'PUT');

            const url = isEdit ? `/empresa/${empresa!.idempresa_kuelap}` : '/empresa';
            const res = await apiFetch(url, 'POST', fd);
            const data = await res.json();

            if (data.success) {
                setEmpresa(data.empresa);
                setLogoFile(null);
                setLogoPreview(data.empresa.emp_logo_url);
                const newRedesForm = (data.redes as RedEmpresa[]).map(r => ({ key: nextKey(), idtipos_redes: String(r.idtipos_redes), enlace: r.enlace }));
                setRedesForm(newRedesForm);
                const newValoresForm = (data.valores as ValorEmpresa[]).map(v => ({ key: nextKey(), idempresa_valores: v.idempresa_valores, nom_valores: v.nom_valores, descripcion: v.descripcion }));
                setValoresForm(newValoresForm);

                savedSnapshotRef.current = {
                    form: empresaToForm(data.empresa),
                    redes: normalizeRedes(newRedesForm),
                    valoresForm: newValoresForm.map(v => ({ nom_valores: v.nom_valores, descripcion: v.descripcion })),
                    logo: false,
                };

                push(data.message ?? 'Guardado correctamente.');
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

    const descripcionLen = form.emp_descripcion.length;

    return (
        <>
            <Head title="Empresa" />

            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-auto rounded-xl p-4">

                {/* Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-admin-600 via-admin-700 to-admin-900 p-4 text-white shadow-xl">
                    <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/5" />
                    <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="text-xs font-bold text-admin-200 uppercase tracking-widest mb-1">Configuración institucional</p>
                            <h1 className="text-2xl font-black">Ficha de la Empresa</h1>
                            <p className="text-sm text-admin-100/80 mt-0.5">
                                {isEdit ? `Última actualización: ${fmtDateTime(empresa!.updated_at)}` : 'Aún no registras los datos de KUÉLAP'}
                            </p>
                        </div>
                        <button onClick={submit} disabled={saving || !isDirty}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-admin-700 font-bold text-sm hover:bg-admin-50 cursor-pointer shadow-lg shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
                            {saving ? <><Ico.Spin />Guardando…</> : <><Ico.Save />{isEdit ? 'Guardar cambios' : 'Registrar empresa'}</>}
                        </button>
                    </div>
                </div>

                {!isEdit && (
                    <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl px-4 py-3.5">
                        <span className="text-amber-500 mt-0.5"><Ico.Alert /></span>
                        <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
                            Este es un registro único: se completa una sola vez y luego solo se edita desde esta misma pantalla. Completa todos los campos obligatorios para crear la ficha institucional.
                        </p>
                    </div>
                )}

                {errs._general && (
                    <div className="px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-semibold flex items-center gap-2">
                        <Ico.Alert /> {errs._general}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5 items-start">

                    {/* ── Columna izquierda: logo + meta ── */}
                    <div className="space-y-5 lg:sticky lg:top-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
                            <Field label="Logo institucional" req={!isEdit} error={errs.emp_logo}>
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="w-full aspect-square rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-admin-400 transition-colors bg-zinc-50 dark:bg-zinc-800/50"
                                >
                                    {logoPreview
                                        ? <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-4" />
                                        : <span className="text-zinc-400 flex flex-col items-center gap-1.5 text-[11px] px-4 text-center"><Ico.Image />Subir logo</span>}
                                </div>
                                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden" onChange={e => handleLogo(e.target.files?.[0] ?? null)} />
                                <p className="text-[10px] text-zinc-400 mt-1.5">JPG, PNG, WEBP o SVG · máx. 2MB</p>
                            </Field>
                        </div>

                        {isEdit && (
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-3">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Información del registro</h3>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-zinc-400">Registrado</span>
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{fmtDateTime(empresa!.created_at)}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-zinc-400">Actualizado</span>
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{fmtDateTime(empresa!.updated_at)}</span>
                                </div>
                            </div>
                        )}

                        {isDirty && (
                            <div className="flex items-center gap-2 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" /> Tienes cambios sin guardar
                            </div>
                        )}
                    </div>

                    {/* ── Columna derecha: formulario ── */}
                    <div className="space-y-5 min-w-0">

                        <Section title="Datos generales" icon={<Ico.Building />}>
                            <Field label="Nombre de la organización" req error={errs.nom_empresa}>
                                <input value={form.nom_empresa} onChange={e => set('nom_empresa', e.target.value)} placeholder="Ej: Red de Investigadores Latinoamericanos KUÉLAP" className={inp(!!errs.nom_empresa)} maxLength={150} />
                            </Field>

                            <Field label="Descripción corta" req error={errs.emp_descripcion} counter={`${descripcionLen}/45`} hint="Aparece junto al logo en el sitio público, sé breve.">
                                <input value={form.emp_descripcion} onChange={e => set('emp_descripcion', e.target.value)} placeholder="Ej: Red académica latinoamericana" className={inp(!!errs.emp_descripcion)} maxLength={45} />
                            </Field>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field label="Correo de contacto" req error={errs.emp_correo}>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"><Ico.Mail /></span>
                                        <input type="email" value={form.emp_correo} onChange={e => set('emp_correo', e.target.value)} placeholder="contacto@kuelap.org" className={`${inp(!!errs.emp_correo)} pl-9`} maxLength={80} />
                                    </div>
                                </Field>
                                <Field label="Teléfono" req error={errs.emp_telefono}>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"><Ico.Phone /></span>
                                        <input value={form.emp_telefono} onChange={e => set('emp_telefono', e.target.value)} placeholder="+51 987 654 321" className={`${inp(!!errs.emp_telefono)} pl-9`} maxLength={15} />
                                    </div>
                                </Field>
                            </div>

                            <Field label="Dirección" req error={errs.emp_direccion}>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"><Ico.MapPin /></span>
                                    <input value={form.emp_direccion} onChange={e => set('emp_direccion', e.target.value)} placeholder="Av. Ejemplo 123, Chachapoyas, Perú" className={`${inp(!!errs.emp_direccion)} pl-9`} maxLength={200} />
                                </div>
                            </Field>
                        </Section>

                        <Section title="Misión y visión" icon={<Ico.Compass />}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field label="Misión" req error={errs.emp_mision} counter={`${form.emp_mision.length}/5000`}>
                                    <textarea value={form.emp_mision} onChange={e => set('emp_mision', e.target.value)} rows={5} placeholder="¿Cuál es el propósito de la organización?" className={`${inp(!!errs.emp_mision)} resize-none`} maxLength={5000} />
                                </Field>
                                <Field label="Visión" req error={errs.emp_vision} counter={`${form.emp_vision.length}/5000`}>
                                    <textarea value={form.emp_vision} onChange={e => set('emp_vision', e.target.value)} rows={5} placeholder="¿Hacia dónde se proyecta la organización?" className={`${inp(!!errs.emp_vision)} resize-none`} maxLength={5000} />
                                </Field>
                            </div>
                        </Section>

                        <Section title="Redes sociales" icon={<Ico.Link />} hint="Agrega solo las redes que la organización realmente tiene.">
                            <div className="space-y-2.5">
                                {redesForm.length === 0 && (
                                    <p className="text-xs text-zinc-400 italic py-2">Aún no agregaste redes sociales.</p>
                                )}
                                {redesForm.map(r => {
                                    const opciones = tiposDisponibles(r.key);
                                    const seleccionado = tiposRedes.find(t => String(t.idtipos_redes) === r.idtipos_redes);
                                    const Icon = seleccionado ? socialIconFor(seleccionado.tipos_redes) : Ico.Link;
                                    const errKey = `red_${r.key}`;
                                    return (
                                        <div key={r.key} className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-2 items-start bg-zinc-50 dark:bg-zinc-800/40 rounded-xl p-2.5 border border-zinc-100 dark:border-zinc-800">
                                            <div>
                                                <p className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase mb-1">
                                                    <Icon className="size-3" /> Red social
                                                </p>
                                                <select value={r.idtipos_redes} onChange={e => updateRed(r.key, 'idtipos_redes', e.target.value)} className={inp(!!errs[errKey])}>
                                                    <option value="">Seleccionar…</option>
                                                    {opciones.map(t => <option key={t.idtipos_redes} value={t.idtipos_redes}>{t.tipos_redes}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-zinc-400 uppercase mb-1">Enlace</p>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"><Ico.Link /></span>
                                                    <input value={r.enlace} onChange={e => updateRed(r.key, 'enlace', e.target.value)} placeholder="https://…" className={`${inp(!!errs[errKey])} pl-8`} />
                                                </div>
                                            </div>
                                            <div className="flex items-end h-full pb-0.5">
                                                <button type="button" onClick={() => removeRed(r.key)} title="Quitar"
                                                    className="p-2.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer">
                                                    <Ico.Trash />
                                                </button>
                                            </div>
                                            {errs[errKey] && <p className="text-[11px] text-red-500 sm:col-span-3 flex items-center gap-1">⚠ {errs[errKey]}</p>}
                                        </div>
                                    );
                                })}
                                <button type="button" onClick={addRed} disabled={!puedeAgregarRed}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-admin-100 dark:bg-admin-900/30 text-admin-700 dark:text-admin-300 text-xs font-bold hover:bg-admin-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Ico.Plus /> Agregar red social
                                </button>
                            </div>
                        </Section>

                        <Section title="Valores institucionales" icon={<Ico.Heart />} hint="Se muestran como tarjetas en la página pública “¿Quiénes somos?”.">
                            <div className="space-y-2.5">
                                {valoresForm.length === 0 && (
                                    <p className="text-xs text-zinc-400 italic py-2">Aún no agregaste valores institucionales.</p>
                                )}
                                {valoresForm.map((v, idx) => (
                                    <div key={v.key} className="grid grid-cols-1 sm:grid-cols-[180px_1fr_auto] gap-2 items-start bg-zinc-50 dark:bg-zinc-800/40 rounded-xl p-2.5 border border-zinc-100 dark:border-zinc-800">
                                        <div>
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase mb-1">Valor #{idx + 1}</p>
                                            <input value={v.nom_valores} onChange={e => updateValor(v.key, 'nom_valores', e.target.value)} placeholder="Ej: Excelencia" className={inp(!!errs[`valor_${v.key}`])} maxLength={100} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase mb-1">Descripción</p>
                                            <textarea value={v.descripcion} onChange={e => updateValor(v.key, 'descripcion', e.target.value)} rows={1} placeholder="Explica brevemente este valor…" className={`${inp(!!errs[`valor_${v.key}`])} resize-none`} maxLength={2000} />
                                        </div>
                                        <div className="flex items-end h-full pb-0.5">
                                            <button type="button" onClick={() => removeValor(v.key)} title="Quitar"
                                                className="p-2.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer">
                                                <Ico.Trash />
                                            </button>
                                        </div>
                                        {errs[`valor_${v.key}`] && <p className="text-[11px] text-red-500 sm:col-span-3 flex items-center gap-1">⚠ {errs[`valor_${v.key}`]}</p>}
                                    </div>
                                ))}
                                {errs._valores && <p className="text-[11px] text-red-500">⚠ {errs._valores}</p>}
                                <button type="button" onClick={addValor} disabled={valoresForm.length >= 12}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-admin-100 dark:bg-admin-900/30 text-admin-700 dark:text-admin-300 text-xs font-bold hover:bg-admin-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Ico.Plus /> Agregar valor
                                </button>
                            </div>
                        </Section>
                    </div>
                </div>
            </div>

            {/* Botón de guardar flotante, visible al hacer scroll en formularios largos */}
            {isDirty && (
                <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 sm:left-auto sm:right-5 sm:translate-x-0">
                    <button onClick={submit} disabled={saving}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-admin-600 hover:bg-admin-700 text-white text-sm font-bold cursor-pointer disabled:opacity-60 shadow-2xl shadow-admin-900/30 ring-4 ring-white dark:ring-zinc-950">
                        {saving ? <><Ico.Spin />Guardando…</> : <><Ico.Save />{isEdit ? 'Guardar cambios' : 'Registrar empresa'}</>}
                    </button>
                </div>
            )}

            {/* Toasts */}
            <div className="fixed bottom-24 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-sm font-semibold text-white pointer-events-auto ${t.type === 'ok' ? 'bg-emerald-600' : 'bg-red-600'}`}>
                        {t.type === 'ok' ? <Ico.Check /> : <Ico.Xs />} {t.msg}
                    </div>
                ))}
            </div>
        </>
    );
}

EmpresaPage.layout = {
    breadcrumbs: [
        { title: 'Inicio', href: '/dashboard' },
        { title: 'Empresa', href: '/empresa' },
    ],
};
