import { Head } from '@inertiajs/react';
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
    Globe2,
    BookOpen,
    CalendarDays,
    FileCheck2,
    Wallet,
    Mail,
    ClipboardList,
    TrendingUp,
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

// Paleta basada en tokens semánticos de shadcn/Tailwind: se adapta sola
// a claro / oscuro / sistema porque usa las variables --chart-N del tema.
const COLORES_GRAFICO = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
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
    solicitudesPorEstado,
    crecimientoMiembros,
    ultimosMiembros,
    mensajesRecientes,
    solicitudesPendientes,
    pagosPendientesValidar,
}: DashboardProps) {
    return (
        <>
            <Head title="Panel de Control" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-hidden rounded-xl p-4 md:p-6">
                {/* Encabezado */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                        Panel de Control
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Resumen general de la Red de Investigadores Latinoamericanos KUÉLAP
                    </p>
                </div>

                {/* KPIs principales */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <TarjetaKpi
                        titulo="Miembros de la red"
                        valor={kpis.total_miembros}
                        subtexto={`${kpis.miembros_habilitados} habilitados · ${kpis.miembros_inhabilitados} inhabilitados`}
                        icono={<Users className="size-5" />}
                        acento="chart-1"
                    />
                    <TarjetaKpi
                        titulo="Universidades"
                        valor={kpis.total_universidades}
                        subtexto={`${kpis.total_paises} países representados`}
                        icono={<GraduationCap className="size-5" />}
                        acento="chart-2"
                    />
                    <TarjetaKpi
                        titulo="Publicaciones"
                        valor={kpis.total_publicaciones}
                        subtexto={`${kpis.total_areas} áreas · ${kpis.total_lineas} líneas`}
                        icono={<BookOpen className="size-5" />}
                        acento="chart-3"
                    />
                    <TarjetaKpi
                        titulo="Eventos"
                        valor={kpis.total_eventos}
                        subtexto={`${kpis.certificados_emitidos} certificados emitidos`}
                        icono={<CalendarDays className="size-5" />}
                        acento="chart-4"
                    />
                </div>

                {/* KPIs de gestión / alertas */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <TarjetaKpi
                        titulo="Solicitudes pendientes"
                        valor={kpis.solicitudes_pendientes}
                        subtexto="Requieren revisión"
                        icono={<ClipboardList className="size-5" />}
                        acento="chart-5"
                        destacar={kpis.solicitudes_pendientes > 0}
                    />
                    <TarjetaKpi
                        titulo="Pagos por validar"
                        valor={kpis.pagos_por_validar}
                        subtexto="Comprobantes sin revisar"
                        icono={<FileCheck2 className="size-5" />}
                        acento="chart-1"
                        destacar={kpis.pagos_por_validar > 0}
                    />
                    <TarjetaKpi
                        titulo="Mensajes nuevos"
                        valor={kpis.mensajes_nuevos}
                        subtexto="Bandeja de contacto"
                        icono={<Mail className="size-5" />}
                        acento="chart-2"
                        destacar={kpis.mensajes_nuevos > 0}
                    />
                    <TarjetaKpi
                        titulo="Monto validado"
                        valor={`$ ${kpis.monto_validado_total.toFixed(2)}`}
                        subtexto="Membresías pagadas y aprobadas"
                        icono={<Wallet className="size-5" />}
                        acento="chart-3"
                    />
                </div>

                {/* Fila de gráficos principales */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <TarjetaSeccion titulo="Crecimiento de miembros" subtitulo="Últimos 12 meses" className="lg:col-span-2">
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={crecimientoMiembros}>
                                <defs>
                                    <linearGradient id="colorMiembros" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="periodo" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--popover)',
                                        borderColor: 'var(--border)',
                                        borderRadius: '0.5rem',
                                        color: 'var(--popover-foreground)',
                                    }}
                                />
                                <Area type="monotone" dataKey="total" name="Nuevos miembros" stroke="var(--chart-1)" fill="url(#colorMiembros)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </TarjetaSeccion>

                    <TarjetaSeccion titulo="Miembros por género" subtitulo="Distribución total">
                        <GraficoDonaOVacio datos={miembrosPorGenero} />
                    </TarjetaSeccion>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <TarjetaSeccion titulo="Miembros por país" subtitulo="Top países de la red">
                        <GraficoBarrasOVacio datos={miembrosPorPais.slice(0, 8)} colorBarra="var(--chart-2)" />
                    </TarjetaSeccion>

                    <TarjetaSeccion titulo="Grado académico" subtitulo="Distribución de miembros">
                        <GraficoBarrasOVacio datos={miembrosPorGrado} colorBarra="var(--chart-3)" />
                    </TarjetaSeccion>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <TarjetaSeccion titulo="Publicaciones por tipo">
                        <GraficoBarrasOVacio datos={publicacionesPorTipo} colorBarra="var(--chart-4)" horizontal />
                    </TarjetaSeccion>
                    <TarjetaSeccion titulo="Publicaciones por estado">
                        <GraficoBarrasOVacio datos={publicacionesPorEstado} colorBarra="var(--chart-5)" horizontal />
                    </TarjetaSeccion>
                    <TarjetaSeccion titulo="Solicitudes por estado">
                        <GraficoBarrasOVacio datos={solicitudesPorEstado} colorBarra="var(--chart-1)" horizontal />
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
                                        <tr className="border-b border-border text-left text-muted-foreground">
                                            <th className="pb-2 font-medium">Universidad</th>
                                            <th className="pb-2 font-medium">País</th>
                                            <th className="pb-2 text-right font-medium">Miembros</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topUniversidades.map((u, i) => (
                                            <tr key={i} className="border-b border-border/50 last:border-0">
                                                <td className="max-w-[220px] truncate py-2 text-foreground" title={u.nombre}>
                                                    {u.nombre}
                                                </td>
                                                <td className="py-2 text-muted-foreground">{u.pais}</td>
                                                <td className="py-2 text-right font-semibold text-foreground">{u.total}</td>
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
                                        <span className="truncate text-sm text-foreground" title={a.nombre}>
                                            {a.nombre}
                                        </span>
                                        <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
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
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                            {m.nombre.charAt(0)}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-foreground">{m.nombre}</p>
                                            <p className="truncate text-xs text-muted-foreground">{m.universidad}</p>
                                        </div>
                                        <span
                                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                m.condicion === 'Habilitado'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
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
                                            <p className="truncate text-sm font-medium text-foreground">{s.nombre}</p>
                                            <p className="text-xs text-muted-foreground">{s.fecha_solicitud}</p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
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
                                            <p className="truncate text-sm font-medium text-foreground">
                                                {m.nombres} {m.apellidos}
                                            </p>
                                            <span className="shrink-0 text-[10px] text-muted-foreground">{m.estado}</span>
                                        </div>
                                        <p className="truncate text-xs text-muted-foreground">{m.asunto}</p>
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
                                    <tr className="border-b border-border text-left text-muted-foreground">
                                        <th className="pb-2 font-medium">Miembro</th>
                                        <th className="pb-2 font-medium">Fecha de pago</th>
                                        <th className="pb-2 text-right font-medium">Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pagosPendientesValidar.map((p) => (
                                        <tr key={p.idpago} className="border-b border-border/50 last:border-0">
                                            <td className="py-2 text-foreground">{p.nombre}</td>
                                            <td className="py-2 text-muted-foreground">{p.fecha_pago}</td>
                                            <td className="py-2 text-right font-semibold text-foreground">$ {p.monto}</td>
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

function TarjetaKpi({
    titulo,
    valor,
    subtexto,
    icono,
    acento,
    destacar = false,
}: {
    titulo: string;
    valor: number | string;
    subtexto: string;
    icono: React.ReactNode;
    acento: string;
    destacar?: boolean;
}) {
    return (
        <div
            className={`group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md ${
                destacar ? 'ring-1 ring-amber-500/40' : ''
            }`}
        >
            <div
                className="absolute -right-6 -top-6 size-24 rounded-full opacity-10 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `var(--${acento})` }}
            />
            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-muted-foreground">{titulo}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{valor}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{subtexto}</p>
                </div>
                <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `color-mix(in srgb, var(--${acento}) 15%, transparent)`, color: `var(--${acento})` }}
                >
                    {icono}
                </div>
            </div>
            {destacar && (
                <div className="relative mt-3 flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                    <TrendingUp className="size-3" />
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
        <div className={`flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm ${className}`}>
            <div>
                <h2 className="text-sm font-semibold text-foreground">{titulo}</h2>
                {subtitulo && <p className="text-xs text-muted-foreground">{subtitulo}</p>}
            </div>
            {children}
        </div>
    );
}

function EstadoVacio({ texto }: { texto: string }) {
    return (
        <div className="flex h-32 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-center">
            <p className="text-xs text-muted-foreground">{texto}</p>
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
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--popover)',
                        borderColor: 'var(--border)',
                        borderRadius: '0.5rem',
                        color: 'var(--popover-foreground)',
                    }}
                    cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                />
                <Bar dataKey="total" fill={colorBarra} radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

function GraficoDonaOVacio({ datos }: { datos: ConteoNombre[] }) {
    if (datos.length === 0) {
        return <EstadoVacio texto="Sin datos suficientes todavía." />;
    }

    return (
        <ResponsiveContainer width="100%" height={240}>
            <PieChart>
                <Pie data={datos} dataKey="total" nameKey="nombre" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {datos.map((_, i) => (
                        <Cell key={i} fill={COLORES_GRAFICO[i % COLORES_GRAFICO.length]} />
                    ))}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: 'var(--muted-foreground)' }} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'var(--popover)',
                        borderColor: 'var(--border)',
                        borderRadius: '0.5rem',
                        color: 'var(--popover-foreground)',
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}