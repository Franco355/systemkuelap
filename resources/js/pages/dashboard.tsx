import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    Users,
    GraduationCap,
    BookOpen,
    CalendarDays,
    FileCheck2,
    Wallet,
    Mail,
    ClipboardList,
    TrendingUp,
    Building2,
    Images,
    ArrowUpRight,
    Sparkles,
} from 'lucide-react';

// -----------------------------------------------------------------------
// Tipos (deben coincidir con lo que retorna DashboardController::index)
// -----------------------------------------------------------------------
interface Kpis {
    total_miembros: number;
    miembros_habilitados: number;
    miembros_inhabilitados: number;
    total_universidades: number;
    total_paises: number;
    total_publicaciones: number;
    total_eventos: number;
    total_lineas: number;
    total_areas: number;
    certificados_emitidos: number;
    solicitudes_pendientes: number;
    pagos_por_validar: number;
    mensajes_nuevos: number;
    monto_validado_total: number;
}

interface ConteoNombre {
    nombre: string;
    total: number;
}

interface AreaConLineas {
    nombre: string;
    total_lineas: number;
}

interface Universidad {
    nombre: string;
    pais: string;
    total: number;
}

interface Crecimiento {
    periodo: string;
    total: number;
}

interface Miembro {
    idequipo_miembro: number;
    nombre: string;
    universidad: string;
    condicion: string;
    fecha_creacion: string;
}

interface Mensaje {
    idmensaje_contacto: number;
    nombres: string;
    apellidos: string;
    asunto: string;
    fecha_envio: string;
    estado: string;
}

interface Solicitud {
    idsolicitud: number;
    nombre: string;
    estado: string;
    fecha_solicitud: string;
}

interface PagoPendiente {
    idpago: number;
    nombre: string;
    monto: string;
    fecha_pago: string;
}

interface DashboardProps {
    kpis: Kpis;
    miembrosPorPais: ConteoNombre[];
    miembrosPorGenero: ConteoNombre[];
    miembrosPorGrado: ConteoNombre[];
    topUniversidades: Universidad[];
    areasInvestigacion: AreaConLineas[];
    publicacionesPorTipo: ConteoNombre[];
    publicacionesPorEstado: ConteoNombre[];
    eventosPorEstado: ConteoNombre[];
    solicitudesPorEstado: ConteoNombre[];
    crecimientoMiembros: Crecimiento[];
    ultimosMiembros: Miembro[];
    mensajesRecientes: Mensaje[];
    solicitudesPendientes: Solicitud[];
    pagosPendientesValidar: PagoPendiente[];
}

// Paleta de marca del panel — misma familia de colores que eventos, empresa,
// miembros e imágenes, para que el dashboard se sienta parte del mismo
// sistema en vez de usar los tokens genéricos de shadcn (que en modo oscuro
// caían en un morado que no combina con el resto del panel).
const PALETA = ['#1c4a7a', '#10b981', '#06b6d4', '#f59e0b', '#f43f5e', '#14b8a6', '#f97316', '#0ea5e9'];

const ESTADO_EVENTO_COLOR: Record<string, string> = {
    'Programado': '#3b82f6',
    'En curso': '#10b981',
    'Finalizado': '#a1a1aa',
    'Cancelado': '#f43f5e',
    'Pospuesto': '#f59e0b',
};

const KPI_TONOS = {
    admin: { card: 'bg-admin-50 dark:bg-admin-950/30 border-admin-200 dark:border-admin-800', icon: 'bg-admin-100 dark:bg-admin-900/40 text-admin-700 dark:text-admin-300' },
    emerald: { card: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800', icon: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' },
    cyan: { card: 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800', icon: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300' },
    amber: { card: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', icon: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' },
    rose: { card: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800', icon: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300' },
    orange: { card: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800', icon: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' },
    sky: { card: 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800', icon: 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300' },
    teal: { card: 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800', icon: 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300' },
} as const;

type Tono = keyof typeof KPI_TONOS;

function saludo(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
}

const QUICK_LINKS: { titulo: string; href: string; icono: React.ReactNode; tono: Tono; descripcion: string }[] = [
    { titulo: 'Eventos', href: '/eventos', icono: <CalendarDays className="size-5" />, tono: 'amber', descripcion: 'Gestionar el calendario' },
    { titulo: 'Empresa', href: '/empresa', icono: <Building2 className="size-5" />, tono: 'admin', descripcion: 'Ficha institucional' },
    { titulo: 'Miembros', href: '/equipo', icono: <Users className="size-5" />, tono: 'emerald', descripcion: 'Gestionar la red' },
    { titulo: 'Imágenes', href: '/imagenes', icono: <Images className="size-5" />, tono: 'cyan', descripcion: 'Galería del carrusel' },
];

export default function Dashboard({
    kpis,
    miembrosPorPais,
    miembrosPorGenero,
    miembrosPorGrado,
    topUniversidades,
    areasInvestigacion,
    publicacionesPorTipo,
    publicacionesPorEstado,
    eventosPorEstado,
    solicitudesPorEstado,
    crecimientoMiembros,
    ultimosMiembros,
    mensajesRecientes,
    solicitudesPendientes,
    pagosPendientesValidar,
}: DashboardProps) {
    const { auth } = usePage().props;
    const primerNombre = auth.user?.name?.split(' ')[0] ?? '';

    return (
        <>
            <Head title="Panel de Control" />
            <div className="flex h-full flex-1 flex-col gap-5 overflow-x-hidden rounded-xl p-4 md:p-6">

                {/* Encabezado */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-admin-600 via-admin-700 to-admin-900 p-5 text-white shadow-xl md:p-6">
                    <div className="absolute -right-10 -top-10 size-56 rounded-full bg-white/5" />
                    <div className="absolute -bottom-16 right-24 size-40 rounded-full bg-white/5" />
                    <div className="relative flex flex-col gap-1">
                        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-admin-200">
                            <Sparkles className="size-3.5" /> Red de Investigadores Latinoamericanos KUÉLAP
                        </p>
                        <h1 className="text-xl font-black md:text-2xl">
                            {saludo()}{primerNombre ? `, ${primerNombre}` : ''} 👋
                        </h1>
                        <p className="text-sm text-admin-100/80">
                            Esto es lo que está pasando hoy en el panel de control.
                        </p>
                    </div>
                </div>

                {/* Accesos rápidos */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {QUICK_LINKS.map((q) => (
                        <Link
                            key={q.href}
                            href={q.href}
                            className={`group flex items-center gap-3 rounded-2xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${KPI_TONOS[q.tono].card}`}
                        >
                            <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${KPI_TONOS[q.tono].icon}`}>
                                {q.icono}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-black text-zinc-900 dark:text-zinc-100">{q.titulo}</p>
                                <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">{q.descripcion}</p>
                            </div>
                            <ArrowUpRight className="size-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                        </Link>
                    ))}
                </div>

                {/* KPIs principales */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <TarjetaKpi
                        titulo="Miembros de la red"
                        valor={kpis.total_miembros}
                        subtexto={`${kpis.miembros_habilitados} habilitados · ${kpis.miembros_inhabilitados} inhabilitados`}
                        icono={<Users className="size-5" />}
                        tono="admin"
                    />
                    <TarjetaKpi
                        titulo="Universidades"
                        valor={kpis.total_universidades}
                        subtexto={`${kpis.total_paises} países representados`}
                        icono={<GraduationCap className="size-5" />}
                        tono="emerald"
                    />
                    <TarjetaKpi
                        titulo="Publicaciones"
                        valor={kpis.total_publicaciones}
                        subtexto={`${kpis.total_areas} áreas · ${kpis.total_lineas} líneas`}
                        icono={<BookOpen className="size-5" />}
                        tono="cyan"
                    />
                    <TarjetaKpi
                        titulo="Eventos"
                        valor={kpis.total_eventos}
                        subtexto={`${kpis.certificados_emitidos} certificados emitidos`}
                        icono={<CalendarDays className="size-5" />}
                        tono="amber"
                    />
                </div>

                {/* KPIs de gestión / alertas */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <TarjetaKpi
                        titulo="Solicitudes pendientes"
                        valor={kpis.solicitudes_pendientes}
                        subtexto="Requieren revisión"
                        icono={<ClipboardList className="size-5" />}
                        tono="rose"
                        destacar={kpis.solicitudes_pendientes > 0}
                    />
                    <TarjetaKpi
                        titulo="Pagos por validar"
                        valor={kpis.pagos_por_validar}
                        subtexto="Comprobantes sin revisar"
                        icono={<FileCheck2 className="size-5" />}
                        tono="orange"
                        destacar={kpis.pagos_por_validar > 0}
                    />
                    <TarjetaKpi
                        titulo="Mensajes nuevos"
                        valor={kpis.mensajes_nuevos}
                        subtexto="Bandeja de contacto"
                        icono={<Mail className="size-5" />}
                        tono="sky"
                        destacar={kpis.mensajes_nuevos > 0}
                    />
                    <TarjetaKpi
                        titulo="Monto validado"
                        valor={`$ ${kpis.monto_validado_total.toFixed(2)}`}
                        subtexto="Membresías pagadas y aprobadas"
                        icono={<Wallet className="size-5" />}
                        tono="teal"
                    />
                </div>

                {/* Fila de gráficos principales */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <TarjetaSeccion titulo="Crecimiento de miembros" subtitulo="Últimos 12 meses" className="lg:col-span-2">
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={crecimientoMiembros}>
                                <defs>
                                    <linearGradient id="colorMiembros" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={PALETA[0]} stopOpacity={0.4} />
                                        <stop offset="95%" stopColor={PALETA[0]} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="periodo" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip contentStyle={TOOLTIP_STYLE} />
                                <Area type="monotone" dataKey="total" name="Nuevos miembros" stroke={PALETA[0]} fill="url(#colorMiembros)" strokeWidth={2.5} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </TarjetaSeccion>

                    <TarjetaSeccion titulo="Miembros por género" subtitulo="Distribución total">
                        <GraficoDonaOVacio datos={miembrosPorGenero} />
                    </TarjetaSeccion>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <TarjetaSeccion titulo="Miembros por país" subtitulo="Top países de la red">
                        <GraficoBarrasOVacio datos={miembrosPorPais.slice(0, 8)} colorBarra={PALETA[1]} />
                    </TarjetaSeccion>

                    <TarjetaSeccion titulo="Grado académico" subtitulo="Distribución de miembros">
                        <GraficoBarrasOVacio datos={miembrosPorGrado} colorBarra={PALETA[2]} />
                    </TarjetaSeccion>

                    <TarjetaSeccion titulo="Eventos por estado" subtitulo="Estado actual del calendario">
                        <GraficoDonaOVacio datos={eventosPorEstado} colorPorNombre={ESTADO_EVENTO_COLOR} />
                    </TarjetaSeccion>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <TarjetaSeccion titulo="Publicaciones por tipo">
                        <GraficoBarrasOVacio datos={publicacionesPorTipo} colorBarra={PALETA[3]} horizontal />
                    </TarjetaSeccion>
                    <TarjetaSeccion titulo="Publicaciones por estado">
                        <GraficoBarrasOVacio datos={publicacionesPorEstado} colorBarra={PALETA[4]} horizontal />
                    </TarjetaSeccion>
                    <TarjetaSeccion titulo="Solicitudes por estado">
                        <GraficoBarrasOVacio datos={solicitudesPorEstado} colorBarra={PALETA[5]} horizontal />
                    </TarjetaSeccion>
                </div>

                {/* Tablas y listas de actividad */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <TarjetaSeccion titulo="Universidades con más miembros">
                        {topUniversidades.length === 0 ? (
                            <EstadoVacio texto="Aún no hay universidades con miembros registrados." />
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                            <th className="pb-2">Universidad</th>
                                            <th className="pb-2">País</th>
                                            <th className="pb-2 text-right">Miembros</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topUniversidades.map((u, i) => (
                                            <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800/70 last:border-0">
                                                <td className="max-w-[220px] truncate py-2.5 text-zinc-800 dark:text-zinc-200" title={u.nombre}>
                                                    {u.nombre}
                                                </td>
                                                <td className="py-2.5 text-zinc-500 dark:text-zinc-400">{u.pais}</td>
                                                <td className="py-2.5 text-right font-bold text-zinc-900 dark:text-zinc-100">{u.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </TarjetaSeccion>

                    <TarjetaSeccion titulo="Áreas de investigación" subtitulo="Con más líneas registradas">
                        {areasInvestigacion.length === 0 ? (
                            <EstadoVacio texto="No hay áreas de investigación registradas." />
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {areasInvestigacion.map((a, i) => (
                                    <li key={i} className="flex items-center justify-between gap-3">
                                        <span className="truncate text-sm text-zinc-700 dark:text-zinc-300" title={a.nombre}>
                                            {a.nombre}
                                        </span>
                                        <span className="shrink-0 rounded-full bg-admin-100 dark:bg-admin-900/40 px-2.5 py-0.5 text-xs font-bold text-admin-700 dark:text-admin-300">
                                            {a.total_lineas} {a.total_lineas === 1 ? 'línea' : 'líneas'}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </TarjetaSeccion>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <TarjetaSeccion titulo="Últimos miembros registrados" className="lg:col-span-1">
                        {ultimosMiembros.length === 0 ? (
                            <EstadoVacio texto="Todavía no se han registrado miembros." />
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {ultimosMiembros.map((m) => (
                                    <li key={m.idequipo_miembro} className="flex items-center gap-3">
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-admin-100 dark:bg-admin-900/40 text-xs font-black text-admin-700 dark:text-admin-300">
                                            {m.nombre.charAt(0)}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-200">{m.nombre}</p>
                                            <p className="truncate text-xs text-zinc-400">{m.universidad}</p>
                                        </div>
                                        <span
                                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                m.condicion === 'Habilitado'
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                    : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                                            }`}
                                        >
                                            {m.condicion}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </TarjetaSeccion>

                    <TarjetaSeccion titulo="Solicitudes por atender" className="lg:col-span-1">
                        {solicitudesPendientes.length === 0 ? (
                            <EstadoVacio texto="No hay solicitudes pendientes. ¡Al día!" />
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {solicitudesPendientes.map((s) => (
                                    <li key={s.idsolicitud} className="flex items-center justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-200">{s.nombre}</p>
                                            <p className="text-xs text-zinc-400">{s.fecha_solicitud}</p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                                            {s.estado}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </TarjetaSeccion>

                    <TarjetaSeccion titulo="Mensajes de contacto" className="lg:col-span-1">
                        {mensajesRecientes.length === 0 ? (
                            <EstadoVacio texto="No hay mensajes recientes." />
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {mensajesRecientes.map((m) => (
                                    <li key={m.idmensaje_contacto} className="flex flex-col gap-0.5">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                                {m.nombres} {m.apellidos}
                                            </p>
                                            <span className="shrink-0 text-[10px] text-zinc-400">{m.estado}</span>
                                        </div>
                                        <p className="truncate text-xs text-zinc-400">{m.asunto}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </TarjetaSeccion>
                </div>

                {pagosPendientesValidar.length > 0 && (
                    <TarjetaSeccion titulo="Pagos pendientes de validación" subtitulo="Comprobantes esperando revisión del administrador">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                        <th className="pb-2">Miembro</th>
                                        <th className="pb-2">Fecha de pago</th>
                                        <th className="pb-2 text-right">Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pagosPendientesValidar.map((p) => (
                                        <tr key={p.idpago} className="border-b border-zinc-100 dark:border-zinc-800/70 last:border-0">
                                            <td className="py-2.5 text-zinc-800 dark:text-zinc-200">{p.nombre}</td>
                                            <td className="py-2.5 text-zinc-500 dark:text-zinc-400">{p.fecha_pago}</td>
                                            <td className="py-2.5 text-right font-bold text-zinc-900 dark:text-zinc-100">$ {p.monto}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TarjetaSeccion>
                )}
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

// -----------------------------------------------------------------------
// Subcomponentes de presentación (viven en el mismo archivo para no
// fragmentar el módulo; muévelos a resources/js/components/dashboard/
// si el archivo crece demasiado).
// -----------------------------------------------------------------------

const TOOLTIP_STYLE = {
    backgroundColor: 'var(--popover)',
    borderColor: 'var(--border)',
    borderRadius: '0.75rem',
    color: 'var(--popover-foreground)',
    fontSize: 12,
};

function TarjetaKpi({
    titulo,
    valor,
    subtexto,
    icono,
    tono,
    destacar = false,
}: {
    titulo: string;
    valor: number | string;
    subtexto: string;
    icono: React.ReactNode;
    tono: Tono;
    destacar?: boolean;
}) {
    const estilo = KPI_TONOS[tono];
    return (
        <div className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md ${estilo.card} ${destacar ? 'ring-2 ring-rose-400/50 dark:ring-rose-500/40' : ''}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">{titulo}</p>
                    <p className="mt-1 text-2xl font-black tabular-nums text-zinc-900 dark:text-zinc-100">{valor}</p>
                    <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">{subtexto}</p>
                </div>
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${estilo.icon}`}>
                    {icono}
                </div>
            </div>
            {destacar && (
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    <TrendingUp className="size-3.5" />
                    Requiere atención
                </div>
            )}
        </div>
    );
}

function TarjetaSeccion({
    titulo,
    subtitulo,
    children,
    className = '',
}: {
    titulo: string;
    subtitulo?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`flex flex-col gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm ${className}`}>
            <div>
                <h2 className="text-sm font-black text-zinc-900 dark:text-zinc-100">{titulo}</h2>
                {subtitulo && <p className="text-xs text-zinc-400">{subtitulo}</p>}
            </div>
            {children}
        </div>
    );
}

function EstadoVacio({ texto }: { texto: string }) {
    return (
        <div className="flex h-32 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 text-center">
            <p className="text-xs text-zinc-400">{texto}</p>
        </div>
    );
}

function GraficoBarrasOVacio({
    datos,
    colorBarra,
    horizontal = false,
}: {
    datos: ConteoNombre[];
    colorBarra: string;
    horizontal?: boolean;
}) {
    if (datos.length === 0) {
        return <EstadoVacio texto="Sin datos suficientes todavía." />;
    }

    return (
        <ResponsiveContainer width="100%" height={240}>
            <BarChart data={datos} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ left: horizontal ? 24 : 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={!horizontal} vertical={horizontal} />
                {horizontal ? (
                    <>
                        <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} tickLine={false} axisLine={false} />
                        <YAxis type="category" dataKey="nombre" stroke="var(--muted-foreground)" fontSize={11} width={110} tickLine={false} axisLine={false} />
                    </>
                ) : (
                    <>
                        <XAxis dataKey="nombre" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
                        <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} tickLine={false} axisLine={false} />
                    </>
                )}
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
                <Bar dataKey="total" fill={colorBarra} radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

function GraficoDonaOVacio({ datos, colorPorNombre }: { datos: ConteoNombre[]; colorPorNombre?: Record<string, string> }) {
    if (datos.length === 0) {
        return <EstadoVacio texto="Sin datos suficientes todavía." />;
    }

    return (
        <ResponsiveContainer width="100%" height={240}>
            <PieChart>
                <Pie data={datos} dataKey="total" nameKey="nombre" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {datos.map((d, i) => (
                        <Cell key={i} fill={colorPorNombre?.[d.nombre] ?? PALETA[i % PALETA.length]} />
                    ))}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: 'var(--muted-foreground)' }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
        </ResponsiveContainer>
    );
}
