<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Gestión de eventos de la incubadora.
 *
 * Reglas de negocio:
 *  - Modalidad "Presencial" -> exige espacio_lugar; se ignora/limpia cualquier plataforma.
 *  - Modalidad "Virtual"    -> exige al menos 1 plataforma con su link; espacio_lugar se fuerza a null.
 *  - link_form_inscripcion aplica al evento completo (no depende de la modalidad).
 *  - Fechas: fecha_fin >= fecha_inicio; fec_fin_inscripcion >= fec_inicio_inscripcion;
 *    fec_fin_inscripcion <= fecha_fin (no se puede cerrar inscripciones después de terminado el evento).
 *  - La identificación de "Virtual"/"Presencial" se hace por ID (resuelto una vez vía
 *    LOWER(TRIM(...))), nunca comparando el string tal cual llega del cliente.
 */
class EventoController extends Controller
{
    private const MODALIDAD_VIRTUAL    = 'Virtual';
    private const MODALIDAD_PRESENCIAL = 'Presencial';

    private const ESTADOS_AUTOMATICOS = ['Programado', 'En curso', 'Finalizado'];

    public function index(): Response
    {
        // Antes de listar, autocorrige cualquier evento cuyo estado "automático"
        // (Programado/En curso/Finalizado) ya no coincida con sus fechas reales.
        // Cancelado y Pospuesto NUNCA se tocan aquí: son decisiones manuales del admin.
        $this->sincronizarEstadosAutomaticos();

        $eventos = DB::table('evento as ev')
            ->join('estado_evento as ee', 'ev.idestado_event', '=', 'ee.idestado_event')
            ->join('modalidad as m',      'ev.idmodalidad',    '=', 'm.idmodalidad')
            ->join('tipos_evento as te',  'ev.idtipo_evento',  '=', 'te.idtipo_evento')
            ->orderByDesc('ev.fecha_inicio')
            ->select([
                'ev.idevento',
                'ev.nom_evento',
                'ev.descripcion',
                'ev.idestado_event',
                'ee.nom_estado_event',
                'ev.idmodalidad',
                'm.nom_modalidad',
                'ev.idtipo_evento',
                'te.nom_tipo_evento',
                'ev.fecha_inicio',
                'ev.fecha_fin',
                'ev.fec_inicio_inscripcion',
                'ev.fec_fin_inscripcion',
                'ev.espacio_lugar',
                'ev.link_form_inscripcion',
                'ev.image_evento',
                'ev.created_at',
                'ev.updated_at',
            ])
            ->get()
            ->map(function ($ev) {
                $arr = (array) $ev;
                $arr['image_url'] = $ev->image_evento ? Storage::url($ev->image_evento) : null;
                $arr['plataformas'] = DB::table('evento_plataforma as ep')
                    ->join('plataformas as pl', 'ep.idplataforma', '=', 'pl.idplataforma')
                    ->where('ep.idevento', $ev->idevento)
                    ->select(['ep.idevent_canal', 'ep.idplataforma', 'pl.nom_plataforma', 'ep.link_transmision'])
                    ->get();
                return $arr;
            })
            ->values();

        return Inertia::render('event/eventos', [
            'eventos'     => $eventos,
            'estados'     => DB::table('estado_evento')->orderBy('idestado_event')->get(),
            'modalidades' => DB::table('modalidad')->orderBy('nom_modalidad')->get(),
            'tiposEvento' => DB::table('tipos_evento')->orderBy('nom_tipo_evento')->get(),
            'plataformas' => DB::table('plataformas')->orderBy('nom_plataforma')->get(),
        ]);
    }

    /**
     * Recalcula, en bloque, el estado de todos los eventos cuyo estado actual
     * sea uno de los "automáticos" (Programado/En curso/Finalizado). Si la
     * fecha actual ya no corresponde con ese estado, lo actualiza en BD.
     * Los eventos en Cancelado/Pospuesto se excluyen deliberadamente: son
     * decisiones manuales del administrador y no deben revertirse solas.
     */
    private function sincronizarEstadosAutomaticos(): void
    {
        $idProgramado = $this->idEstadoPorNombre('Programado');
        $idEnCurso    = $this->idEstadoPorNombre('En curso');
        $idFinalizado = $this->idEstadoPorNombre('Finalizado');

        if (!$idProgramado || !$idEnCurso || !$idFinalizado) {
            return; // catálogo incompleto; no forzamos nada
        }

        $eventos = DB::table('evento as ev')
            ->join('estado_evento as ee', 'ev.idestado_event', '=', 'ee.idestado_event')
            ->whereIn('ee.nom_estado_event', self::ESTADOS_AUTOMATICOS)
            ->select('ev.idevento', 'ev.fecha_inicio', 'ev.fecha_fin', 'ev.idestado_event')
            ->get();

        foreach ($eventos as $ev) {
            $nombreEsperado = $this->calcularEstadoAutomatico($ev->fecha_inicio, $ev->fecha_fin);
            $idEsperado = match ($nombreEsperado) {
                'Programado' => $idProgramado,
                'En curso'   => $idEnCurso,
                default      => $idFinalizado,
            };
            if ($idEsperado !== (int) $ev->idestado_event) {
                DB::table('evento')->where('idevento', $ev->idevento)->update([
                    'idestado_event' => $idEsperado,
                    'updated_at'     => now(),
                ]);
            }
        }
    }

    /** Programado si aún no empieza, Finalizado si ya terminó, En curso en medio. */
    private function calcularEstadoAutomatico(string $fechaInicio, string $fechaFin): string
    {
        $hoy = now()->toDateString();
        if ($hoy < $fechaInicio) return 'Programado';
        if ($hoy > $fechaFin)    return 'Finalizado';
        return 'En curso';
    }

    /** Resuelve el ID de un estado por nombre, normalizado (case/espacios). */
    private function idEstadoPorNombre(string $nombre): ?int
    {
        static $cache = [];
        $key = Str::lower(trim($nombre));
        if (array_key_exists($key, $cache)) return $cache[$key];

        $id = DB::table('estado_evento')
            ->whereRaw('LOWER(TRIM(nom_estado_event)) = ?', [$key])
            ->value('idestado_event');

        return $cache[$key] = $id ? (int) $id : null;
    }

    // ─── Store ──────────────────────────────────────────────────────────────

    public function store(Request $request): JsonResponse
    {
        return $this->guardar($request, null);
    }

    // ─── Update (POST + _method=PUT, por el upload de imagen multipart) ────

    public function update(Request $request, int $id): JsonResponse
    {
        $evento = DB::table('evento')->where('idevento', $id)->first();
        if (!$evento) {
            return response()->json(['success' => false, 'message' => 'Evento no encontrado.'], 404);
        }
        return $this->guardar($request, $evento);
    }

    private function guardar(Request $request, ?object $eventoExistente): JsonResponse
    {
        $esEdicion = $eventoExistente !== null;

        try {
            $data = $request->validate([
                'nom_evento'             => 'required|string|max:500',
                'descripcion'            => 'required|string|max:5000',
                // 'automatico' deja que el sistema calcule Programado/En curso/Finalizado
                // según las fechas; 'cancelado'/'pospuesto' son decisiones manuales del admin.
                'estado_modo'            => 'required|in:automatico,cancelado,pospuesto',
                'idmodalidad'            => 'required|integer|exists:modalidad,idmodalidad',
                'idtipo_evento'          => 'required|integer|exists:tipos_evento,idtipo_evento',
                'fecha_inicio'           => 'required|date',
                'fecha_fin'              => 'required|date|after_or_equal:fecha_inicio',
                'fec_inicio_inscripcion' => 'required|date',
                'fec_fin_inscripcion'    => 'required|date|after_or_equal:fec_inicio_inscripcion|before_or_equal:fecha_fin',
                'espacio_lugar'          => 'nullable|string|max:500',
                'link_form_inscripcion'  => 'nullable|url|max:2000',
                'image_evento'           => [$esEdicion ? 'nullable' : 'required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
                'plataformas'            => 'nullable|string', // JSON: [{idplataforma, link_transmision}]
            ]);
        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Revisa los datos del formulario.', 'errors' => $e->errors()], 422);
        }

        // ── Resolver el estado real a guardar ──────────────────────────────
        if ($data['estado_modo'] === 'automatico') {
            $nombreAuto = $this->calcularEstadoAutomatico($data['fecha_inicio'], $data['fecha_fin']);
            $idEstado = $this->idEstadoPorNombre($nombreAuto);
        } else {
            $idEstado = $this->idEstadoPorNombre($data['estado_modo'] === 'cancelado' ? 'Cancelado' : 'Pospuesto');
        }
        if (!$idEstado) {
            return response()->json(['success' => false, 'message' => 'El catálogo de estados no está configurado correctamente.'], 500);
        }

        $esVirtual = $this->idModalidad(self::MODALIDAD_VIRTUAL) === (int) $data['idmodalidad'];
        $esPresencial = $this->idModalidad(self::MODALIDAD_PRESENCIAL) === (int) $data['idmodalidad'];

        // ── Defensa en profundidad según modalidad ──────────────────────
        $plataformas = [];
        if ($esVirtual) {
            $data['espacio_lugar'] = null;

            $raw = json_decode($request->input('plataformas', '[]'), true);
            if (!is_array($raw) || count($raw) === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Debes agregar al menos una plataforma con su enlace de transmisión para un evento virtual.',
                    'errors'  => ['plataformas' => 'Agrega al menos una plataforma.'],
                ], 422);
            }

            $idsPlataformasValidas = DB::table('plataformas')->pluck('idplataforma')->all();
            foreach ($raw as $i => $p) {
                $idPlat = (int) ($p['idplataforma'] ?? 0);
                $link   = trim((string) ($p['link_transmision'] ?? ''));

                if (!in_array($idPlat, $idsPlataformasValidas, true)) {
                    return response()->json(['success' => false, 'message' => "Plataforma inválida en la posición " . ($i + 1) . "."], 422);
                }
                if ($link === '' || !filter_var($link, FILTER_VALIDATE_URL)) {
                    return response()->json(['success' => false, 'message' => "El enlace de la plataforma " . ($i + 1) . " no es una URL válida."], 422);
                }
                $plataformas[] = ['idplataforma' => $idPlat, 'link_transmision' => $link];
            }

            $idsUsados = array_column($plataformas, 'idplataforma');
            if (count($idsUsados) !== count(array_unique($idsUsados))) {
                return response()->json(['success' => false, 'message' => 'No repitas la misma plataforma más de una vez.'], 422);
            }
        } elseif ($esPresencial) {
            if (empty($data['espacio_lugar'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'El lugar/espacio es obligatorio para un evento presencial.',
                    'errors'  => ['espacio_lugar' => 'Campo obligatorio.'],
                ], 422);
            }
            $plataformas = [];
        }

        // ── Imagen ────────────────────────────────────────────────────────
        $rutaImagen = $eventoExistente->image_evento ?? null;
        if ($request->hasFile('image_evento')) {
            $nuevaRuta = $request->file('image_evento')->store('eventos', 'public');
            if ($esEdicion && $rutaImagen) {
                Storage::disk('public')->delete($rutaImagen);
            }
            $rutaImagen = $nuevaRuta;
        }

        $payload = [
            'nom_evento'             => $data['nom_evento'],
            'descripcion'            => $data['descripcion'],
            'idestado_event'         => $idEstado,
            'idmodalidad'            => $data['idmodalidad'],
            'idtipo_evento'          => $data['idtipo_evento'],
            'fecha_inicio'           => $data['fecha_inicio'],
            'fecha_fin'              => $data['fecha_fin'],
            'fec_inicio_inscripcion' => $data['fec_inicio_inscripcion'],
            'fec_fin_inscripcion'    => $data['fec_fin_inscripcion'],
            'espacio_lugar'          => $data['espacio_lugar'] ?? null,
            'link_form_inscripcion'  => $data['link_form_inscripcion'] ?? null,
            'image_evento'           => $rutaImagen,
            'updated_at'             => now(),
        ];

        DB::beginTransaction();
        try {
            if ($esEdicion) {
                $idEvento = $eventoExistente->idevento;
                DB::table('evento')->where('idevento', $idEvento)->update($payload);
            } else {
                $payload['created_at'] = now();
                $idEvento = DB::table('evento')->insertGetId($payload);
            }

            DB::table('evento_plataforma')->where('idevento', $idEvento)->delete();
            foreach ($plataformas as $p) {
                DB::table('evento_plataforma')->insert([
                    'idevento'         => $idEvento,
                    'idplataforma'     => $p['idplataforma'],
                    'link_transmision' => $p['link_transmision'],
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ]);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return response()->json(['success' => false, 'message' => 'Error al guardar el evento.'], 500);
        }

        $eventoGuardado = DB::table('evento as ev')
            ->join('estado_evento as ee', 'ev.idestado_event', '=', 'ee.idestado_event')
            ->join('modalidad as m',      'ev.idmodalidad',    '=', 'm.idmodalidad')
            ->join('tipos_evento as te',  'ev.idtipo_evento',  '=', 'te.idtipo_evento')
            ->where('ev.idevento', $idEvento)
            ->select([
                'ev.idevento',
                'ev.nom_evento',
                'ev.descripcion',
                'ev.idestado_event',
                'ee.nom_estado_event',
                'ev.idmodalidad',
                'm.nom_modalidad',
                'ev.idtipo_evento',
                'te.nom_tipo_evento',
                'ev.fecha_inicio',
                'ev.fecha_fin',
                'ev.fec_inicio_inscripcion',
                'ev.fec_fin_inscripcion',
                'ev.espacio_lugar',
                'ev.link_form_inscripcion',
                'ev.image_evento',
                'ev.created_at',
                'ev.updated_at',
            ])
            ->first();

        $arr = (array) $eventoGuardado;
        $arr['image_url'] = $eventoGuardado->image_evento ? Storage::url($eventoGuardado->image_evento) : null;
        $arr['plataformas'] = DB::table('evento_plataforma as ep')
            ->join('plataformas as pl', 'ep.idplataforma', '=', 'pl.idplataforma')
            ->where('ep.idevento', $idEvento)
            ->select(['ep.idevent_canal', 'ep.idplataforma', 'pl.nom_plataforma', 'ep.link_transmision'])
            ->get();

        return response()->json([
            'success' => true,
            'message' => $esEdicion ? 'Evento actualizado correctamente.' : 'Evento creado correctamente.',
            'evento'  => $arr,
        ], $esEdicion ? 200 : 201);
    }
    // ─── Destroy ────────────────────────────────────────────────────────────

    public function destroy(int $id): JsonResponse
    {
        $evento = DB::table('evento')->where('idevento', $id)->first();
        if (!$evento) {
            return response()->json(['success' => false, 'message' => 'Evento no encontrado.'], 404);
        }

        // No permitir borrar si ya tiene inscripciones asociadas (integridad).
        $tieneInscripciones = DB::table('insc_participante')->where('idevento', $id)->exists();
        if ($tieneInscripciones) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes eliminar este evento porque ya tiene inscripciones registradas. Cámbialo a "Cancelado" en su lugar.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            DB::table('evento_plataforma')->where('idevento', $id)->delete();
            DB::table('evento')->where('idevento', $id)->delete();
            DB::commit();

            if ($evento->image_evento) {
                Storage::disk('public')->delete($evento->image_evento);
            }

            return response()->json(['success' => true, 'message' => 'Evento eliminado correctamente.']);
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return response()->json(['success' => false, 'message' => 'Error al eliminar el evento.'], 500);
        }
    }

    // ─── Helper: resuelve el ID de una modalidad por nombre, normalizado ────

    private function idModalidad(string $nombre): ?int
    {
        static $cache = [];
        $key = Str::lower($nombre);
        if (array_key_exists($key, $cache)) {
            return $cache[$key];
        }

        $id = DB::table('modalidad')
            ->whereRaw('LOWER(TRIM(nom_modalidad)) = ?', [$key])
            ->value('idmodalidad');

        return $cache[$key] = $id ? (int) $id : null;
    }
}
