<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Id de la empresa/red activa. Kuélap solo maneja un registro en
     * empresa_kuelap, pero se deja como constante por si en el futuro
     * se soporta multi-tenant.
     */
    private const ID_EMPRESA = 1;

    public function index(Request $request)
    {
        $esAdministrador = DB::table('usuario_roles')
            ->where('users_id', $request->user()->id)
            ->where('roles_idroles', 1) // 1 = Administrador
            ->exists();

        abort_unless($esAdministrador, 403, 'No tienes permisos para ver el panel de control.');

        return Inertia::render('dashboard', [
            'kpis'                     => $this->obtenerKpis(),
            'miembrosPorPais'          => $this->miembrosPorPais(),
            'miembrosPorGenero'        => $this->miembrosPorGenero(),
            'miembrosPorGrado'         => $this->miembrosPorGrado(),
            'topUniversidades'         => $this->topUniversidades(),
            'areasInvestigacion'       => $this->areasConMasLineas(),
            'publicacionesPorTipo'     => $this->publicacionesPorTipo(),
            'publicacionesPorEstado'   => $this->publicacionesPorEstado(),
            'eventosPorEstado'         => $this->eventosPorEstado(),
            'solicitudesPorEstado'     => $this->solicitudesPorEstado(),
            'crecimientoMiembros'      => $this->crecimientoMiembrosUltimos12Meses(),
            'ultimosMiembros'          => $this->ultimosMiembros(),
            'mensajesRecientes'        => $this->mensajesRecientes(),
            'solicitudesPendientes'    => $this->solicitudesPendientes(),
            'pagosPendientesValidar'   => $this->pagosPendientesValidar(),
        ]);
    }

    private function obtenerKpis(): array
    {
        $totalMiembros = DB::table('equipo_miembros')->count();
        $habilitados = DB::table('equipo_miembros')
            ->where('idcondicion_miembro', 1)
            ->count();

        return [
            'total_miembros'        => $totalMiembros,
            'miembros_habilitados'  => $habilitados,
            'miembros_inhabilitados'=> $totalMiembros - $habilitados,
            'total_universidades'   => DB::table('universidades')->count(),
            'total_paises'          => DB::table('equipo_miembros as em')
                ->join('universidades as u', 'u.iduniversidad', '=', 'em.iduniversidad')
                ->distinct('u.idpais')
                ->count('u.idpais'),
            'total_publicaciones'   => DB::table('publicaciones')->count(),
            'total_eventos'         => DB::table('evento')->count(),
            'total_lineas'          => DB::table('lineas_investigacion')->count(),
            'total_areas'           => DB::table('areas_investigacion')->count(),
            'certificados_emitidos' => DB::table('certificados')->count(),
            'solicitudes_pendientes'=> DB::table('solicitudes_membresia')
                ->whereIn('idestado_solicitud', [1, 2, 3]) // Pendiente / En revisión / Pre-aprobada
                ->count(),
            'pagos_por_validar'     => DB::table('pagos_membresia')
                ->where('idestado_pago', 1) // Pendiente de validación
                ->count(),
            'mensajes_nuevos'       => DB::table('mensajes_contacto')
                ->where('idestado_mensaje', 1) // Nuevo
                ->count(),
            'monto_validado_total'  => (float) DB::table('pagos_membresia')
                ->where('idestado_pago', 2) // Validado
                ->sum('monto'),
        ];
    }

    private function miembrosPorPais(): array
    {
        return DB::table('equipo_miembros as em')
            ->join('universidades as u', 'u.iduniversidad', '=', 'em.iduniversidad')
            ->join('pais as p', 'p.idpais', '=', 'u.idpais')
            ->select('p.nom_pais as nombre', DB::raw('COUNT(*) as total'))
            ->groupBy('p.idpais', 'p.nom_pais')
            ->orderByDesc('total')
            ->get()
            ->toArray();
    }

    private function miembrosPorGenero(): array
    {
        return DB::table('equipo_miembros as em')
            ->join('personas as per', 'per.idpersonas', '=', 'em.idpersonas')
            ->join('genero as g', 'g.idgenero', '=', 'per.idgenero')
            ->select('g.nom_genero as nombre', DB::raw('COUNT(*) as total'))
            ->groupBy('g.idgenero', 'g.nom_genero')
            ->get()
            ->toArray();
    }

    private function miembrosPorGrado(): array
    {
        return DB::table('equipo_miembros as em')
            ->join('grado_academico as ga', 'ga.id_grado_academico', '=', 'em.id_grado_academico')
            ->select('ga.abreviatura as nombre', DB::raw('COUNT(*) as total'))
            ->groupBy('ga.id_grado_academico', 'ga.abreviatura')
            ->orderByDesc('total')
            ->get()
            ->toArray();
    }

    private function topUniversidades(int $limite = 8): array
    {
        return DB::table('equipo_miembros as em')
            ->join('universidades as u', 'u.iduniversidad', '=', 'em.iduniversidad')
            ->join('pais as p', 'p.idpais', '=', 'u.idpais')
            ->select('u.nom_universidad as nombre', 'p.nom_pais as pais', DB::raw('COUNT(*) as total'))
            ->groupBy('u.iduniversidad', 'u.nom_universidad', 'p.nom_pais')
            ->orderByDesc('total')
            ->limit($limite)
            ->get()
            ->toArray();
    }

    private function areasConMasLineas(int $limite = 8): array
    {
        return DB::table('areas_investigacion as a')
            ->leftJoin('lineas_investigacion as l', 'l.idarea_investigacion', '=', 'a.idarea_investigacion')
            ->select('a.nom_area_investigacion as nombre', DB::raw('COUNT(l.idlinea_investigacion) as total_lineas'))
            ->groupBy('a.idarea_investigacion', 'a.nom_area_investigacion')
            ->orderByDesc('total_lineas')
            ->limit($limite)
            ->get()
            ->toArray();
    }

    private function publicacionesPorTipo(): array
    {
        return DB::table('publicaciones as pub')
            ->join('tipos_publicacion as tp', 'tp.idtipo_publicacion', '=', 'pub.idtipo_publicacion')
            ->select('tp.nom_tipo_publicacion as nombre', DB::raw('COUNT(*) as total'))
            ->groupBy('tp.idtipo_publicacion', 'tp.nom_tipo_publicacion')
            ->get()
            ->toArray();
    }

    private function publicacionesPorEstado(): array
    {
        return DB::table('publicaciones as pub')
            ->join('estado_publicacion as ep', 'ep.idestado_publicacion', '=', 'pub.idestado_publicacion')
            ->select('ep.nom_estado_publicacion as nombre', DB::raw('COUNT(*) as total'))
            ->groupBy('ep.idestado_publicacion', 'ep.nom_estado_publicacion')
            ->get()
            ->toArray();
    }

    private function eventosPorEstado(): array
    {
        return DB::table('evento as e')
            ->join('estado_evento as ee', 'ee.idestado_event', '=', 'e.idestado_event')
            ->select('ee.nom_estado_event as nombre', DB::raw('COUNT(*) as total'))
            ->groupBy('ee.idestado_event', 'ee.nom_estado_event')
            ->get()
            ->toArray();
    }

    private function solicitudesPorEstado(): array
    {
        // LEFT JOIN + subconsulta para no perder estados sin solicitudes
        return DB::table('estado_solicitud as es')
            ->leftJoin('solicitudes_membresia as sm', 'sm.idestado_solicitud', '=', 'es.idestado_solicitud')
            ->select('es.nom_estado_solicitud as nombre', DB::raw('COUNT(sm.idsolicitud) as total'))
            ->groupBy('es.idestado_solicitud', 'es.nom_estado_solicitud')
            ->get()
            ->toArray();
    }

    private function crecimientoMiembrosUltimos12Meses(): array
    {
        $desde = Carbon::now()->subMonths(11)->startOfMonth();

        $filas = DB::table('equipo_miembros')
            ->select(DB::raw("DATE_FORMAT(fecha_creacion, '%Y-%m') as periodo"), DB::raw('COUNT(*) as total'))
            ->where('fecha_creacion', '>=', $desde)
            ->groupBy('periodo')
            ->pluck('total', 'periodo');

        // Rellenamos los 12 meses aunque no tengan registros, para que
        // el gráfico de línea no muestre huecos.
        $resultado = [];
        for ($i = 0; $i < 12; $i++) {
            $mes = Carbon::now()->subMonths(11 - $i);
            $clave = $mes->format('Y-m');
            $resultado[] = [
                'periodo' => $mes->translatedFormat('M Y'),
                'total'   => (int) ($filas[$clave] ?? 0),
            ];
        }

        return $resultado;
    }

    private function ultimosMiembros(int $limite = 6): array
    {
        return DB::table('equipo_miembros as em')
            ->join('personas as per', 'per.idpersonas', '=', 'em.idpersonas')
            ->join('universidades as u', 'u.iduniversidad', '=', 'em.iduniversidad')
            ->join('condicion_miembro as cm', 'cm.idcondicion_miembro', '=', 'em.idcondicion_miembro')
            ->select(
                'em.idequipo_miembro',
                DB::raw("CONCAT(per.nombres, ' ', per.apell_paterno) as nombre"),
                'u.siglas as universidad',
                'cm.nom_condicion as condicion',
                'em.fecha_creacion'
            )
            ->orderByDesc('em.fecha_creacion')
            ->limit($limite)
            ->get()
            ->toArray();
    }

    private function mensajesRecientes(int $limite = 5): array
    {
        return DB::table('mensajes_contacto as mc')
            ->join('estado_mensaje as em', 'em.idestado_mensaje', '=', 'mc.idestado_mensaje')
            ->where('mc.idempresa_kuelap', self::ID_EMPRESA)
            ->select('mc.idmensaje_contacto', 'mc.nombres', 'mc.apellidos', 'mc.asunto', 'mc.fecha_envio', 'em.nom_estado_mensaje as estado')
            ->orderByDesc('mc.fecha_envio')
            ->limit($limite)
            ->get()
            ->toArray();
    }

    private function solicitudesPendientes(int $limite = 5): array
    {
        return DB::table('solicitudes_membresia as sm')
            ->join('personas as per', 'per.idpersonas', '=', 'sm.idpersonas')
            ->join('estado_solicitud as es', 'es.idestado_solicitud', '=', 'sm.idestado_solicitud')
            ->whereIn('sm.idestado_solicitud', [1, 2, 3])
            ->select(
                'sm.idsolicitud',
                DB::raw("CONCAT(per.nombres, ' ', per.apell_paterno) as nombre"),
                'es.nom_estado_solicitud as estado',
                'sm.fecha_solicitud'
            )
            ->orderBy('sm.fecha_solicitud')
            ->limit($limite)
            ->get()
            ->toArray();
    }

    private function pagosPendientesValidar(int $limite = 5): array
    {
        return DB::table('pagos_membresia as pm')
            ->join('equipo_miembros as em', 'em.idequipo_miembro', '=', 'pm.idequipo_miembro')
            ->join('personas as per', 'per.idpersonas', '=', 'em.idpersonas')
            ->where('pm.idestado_pago', 1)
            ->select(
                'pm.idpago',
                DB::raw("CONCAT(per.nombres, ' ', per.apell_paterno) as nombre"),
                'pm.monto',
                'pm.fecha_pago'
            )
            ->orderBy('pm.fecha_pago')
            ->limit($limite)
            ->get()
            ->toArray();
    }
}