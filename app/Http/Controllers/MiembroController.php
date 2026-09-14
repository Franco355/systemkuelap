<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Gestión de miembros del equipo (tabla `equipo_miembros` + `personas`).
 *
 * Reglas de negocio:
 *  - Los miembros ingresan por `solicitudes_membresia` (fuera de este panel);
 *    aquí solo se edita y se elimina, nunca se crea uno nuevo desde cero.
 *  - Cada miembro es en realidad dos filas relacionadas 1 a 1 (`personas` +
 *    `equipo_miembros`); update() las guarda juntas en una sola transacción.
 *  - Las líneas de investigación (`equipo_miembros_lineas_investigacion`) se
 *    sincronizan por reemplazo total, igual que las redes de la empresa o
 *    las plataformas de un evento.
 *  - El CV es obligatorio a nivel de base de datos pero opcional de
 *    reemplazar aquí: se conserva el actual si no se sube uno nuevo.
 *  - destroy() bloquea el borrado si el miembro tiene certificados, pagos,
 *    publicaciones, ponencias, noticias o su solicitud de membresía original
 *    todavía lo referencian — son registros históricos que no deben perderse
 *    en cascada. Los logros y las líneas de investigación sí se eliminan en
 *    cascada porque son datos propios del perfil, no registros externos.
 */
class MiembroController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('member/miembros', [
            'miembros' => $this->listar(),
            'catalogos' => [
                'generos' => DB::table('genero')->orderBy('nom_genero')->get(),
                'condiciones' => DB::table('condicion_miembro')->orderBy('idcondicion_miembro')->get(),
                'gradosAcademicos' => DB::table('grado_academico')->orderBy('id_grado_academico')->get(),
                'paises' => DB::table('pais')->orderBy('nom_pais')->get(),
                'universidades' => DB::table('universidades')->orderBy('nom_universidad')->get(),
                'tiposMembresia' => DB::table('tipos_membresia')->where('activo', 1)->orderBy('nom_tipo_membresia')->get(),
                'tiposLogro' => DB::table('tipos_logro')->orderBy('nom_tipo_logro')->get(),
                'lineasInvestigacion' => DB::table('lineas_investigacion as li')
                    ->join('areas_investigacion as ai', 'li.idarea_investigacion', '=', 'ai.idarea_investigacion')
                    ->orderBy('ai.nom_area_investigacion')
                    ->orderBy('li.linea_investigacion')
                    ->select(['li.idlinea_investigacion', 'li.linea_investigacion', 'li.idarea_investigacion', 'ai.nom_area_investigacion'])
                    ->get(),
            ],
        ]);
    }

    // ─── Update (POST + _method=PUT, por el upload de CV multipart) ────────

    public function update(Request $request, int $id): JsonResponse
    {
        $miembro = DB::table('equipo_miembros')->where('idequipo_miembro', $id)->first();
        if (!$miembro) {
            return response()->json(['success' => false, 'message' => 'Miembro no encontrado.'], 404);
        }

        try {
            $data = $request->validate([
                'nombres' => 'required|string|max:100',
                'apell_paterno' => 'required|string|max:70',
                'apell_materno' => 'required|string|max:70',
                'dni' => ['required', 'string', 'max:20', 'regex:/^[A-Za-z0-9.\-]+$/'],
                // Acepta el formato normal o el placeholder "PENDIENTE" que trae la data importada,
                // para que se pueda guardar el resto del formulario sin forzar a completar el teléfono ya mismo.
                'telefono' => ['required', 'string', 'max:20', 'regex:/^(pendiente|[0-9+()\-\s]{6,20})$/i'],
                'direccion' => 'nullable|string|max:2000',
                'idgenero' => 'required|integer|exists:genero,idgenero',
                'email_miembro' => [
                    'required', 'email:filter', 'max:80',
                    Rule::unique('equipo_miembros', 'email_miembro')->ignore($id, 'idequipo_miembro'),
                ],
                'idcondicion_miembro' => 'required|integer|exists:condicion_miembro,idcondicion_miembro',
                'id_grado_academico' => 'required|integer|exists:grado_academico,id_grado_academico',
                'iduniversidad' => 'required|integer|exists:universidades,iduniversidad',
                'idtipo_membresia' => 'required|integer|exists:tipos_membresia,idtipo_membresia',
                'cv_archivo' => 'nullable|file|mimes:pdf|max:5120',
                'lineas' => 'nullable|string', // JSON: [idlinea_investigacion, ...]
            ]);
        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Revisa los datos del formulario.', 'errors' => $e->errors()], 422);
        }

        // ── Líneas de investigación: deben existir y no repetirse ──────────
        $lineas = [];
        $rawLineas = json_decode($request->input('lineas', '[]'), true);
        if (is_array($rawLineas)) {
            $idsValidos = DB::table('lineas_investigacion')->pluck('idlinea_investigacion')->all();
            foreach ($rawLineas as $idLinea) {
                $idLinea = (int) $idLinea;
                if (!in_array($idLinea, $idsValidos, true)) {
                    return response()->json(['success' => false, 'message' => 'Una de las líneas de investigación seleccionadas no es válida.'], 422);
                }
                $lineas[] = $idLinea;
            }
            $lineas = array_values(array_unique($lineas));
        }

        // ── CV ────────────────────────────────────────────────────────────
        $rutaCv = $miembro->cv_archivo;
        if ($request->hasFile('cv_archivo')) {
            $nuevaRuta = $request->file('cv_archivo')->store('miembros/cv', 'public');
            if ($rutaCv && Storage::disk('public')->exists($rutaCv)) {
                Storage::disk('public')->delete($rutaCv);
            }
            $rutaCv = $nuevaRuta;
        }

        DB::beginTransaction();
        try {
            DB::table('personas')->where('idpersonas', $miembro->idpersonas)->update([
                'nombres' => $data['nombres'],
                'apell_paterno' => $data['apell_paterno'],
                'apell_materno' => $data['apell_materno'],
                'dni' => $data['dni'],
                'telefono' => $data['telefono'],
                'direccion' => $data['direccion'] ?? null,
                'idgenero' => $data['idgenero'],
                'updated_at' => now(),
            ]);

            DB::table('equipo_miembros')->where('idequipo_miembro', $id)->update([
                'email_miembro' => $data['email_miembro'],
                'idcondicion_miembro' => $data['idcondicion_miembro'],
                'id_grado_academico' => $data['id_grado_academico'],
                'iduniversidad' => $data['iduniversidad'],
                'idtipo_membresia' => $data['idtipo_membresia'],
                'cv_archivo' => $rutaCv,
                'updated_at' => now(),
            ]);

            DB::table('equipo_miembros_lineas_investigacion')->where('idequipo_miembro', $id)->delete();
            foreach ($lineas as $idLinea) {
                DB::table('equipo_miembros_lineas_investigacion')->insert([
                    'idequipo_miembro' => $id,
                    'idlinea_investigacion' => $idLinea,
                ]);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return response()->json(['success' => false, 'message' => 'Error al guardar el miembro.'], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Miembro actualizado correctamente.',
            'miembro' => $this->serializar($id),
        ]);
    }

    // ─── Destroy ────────────────────────────────────────────────────────────

    public function destroy(int $id): JsonResponse
    {
        $miembro = DB::table('equipo_miembros')->where('idequipo_miembro', $id)->first();
        if (!$miembro) {
            return response()->json(['success' => false, 'message' => 'Miembro no encontrado.'], 404);
        }

        $bloqueos = [
            'certificados' => DB::table('certificados')->where('equipo_miembros_idequipo_miembro', $id)->count(),
            'ponencias en eventos' => DB::table('evento_ponentes')->where('equipo_miembros_idequipo_miembro', $id)->count(),
            'noticias publicadas' => DB::table('noticias')->where('idequipo_miembro', $id)->count(),
            'pagos de membresía' => DB::table('pagos_membresia')->where('idequipo_miembro', $id)->count(),
            'cargos asignados' => DB::table('periodo_miembro_cargo')->where('idequipo_miembro', $id)->count(),
            'publicaciones' => DB::table('publicaciones')->where('idequipo_miembro', $id)->count(),
            'su solicitud de membresía' => DB::table('solicitudes_membresia')->where('idequipo_miembro', $id)->count(),
        ];
        $bloqueos = array_filter($bloqueos);
        if (!empty($bloqueos)) {
            $detalle = collect($bloqueos)->map(fn ($n, $label) => "{$n} {$label}")->implode(', ');
            return response()->json([
                'success' => false,
                'message' => "No puedes eliminar este miembro porque tiene registros asociados: {$detalle}. Cámbialo a \"Inhabilitado\" en su lugar.",
            ], 422);
        }

        DB::beginTransaction();
        try {
            $archivosLogros = DB::table('logros_miembros')->where('idequipo_miembro', $id)->pluck('archivo_evidencia')->filter()->all();
            DB::table('logros_miembros')->where('idequipo_miembro', $id)->delete();
            DB::table('equipo_miembros_lineas_investigacion')->where('idequipo_miembro', $id)->delete();
            DB::table('equipo_miembros')->where('idequipo_miembro', $id)->delete();
            DB::table('personas')->where('idpersonas', $miembro->idpersonas)->delete();

            DB::commit();

            foreach ($archivosLogros as $archivo) {
                if (Storage::disk('public')->exists($archivo)) {
                    Storage::disk('public')->delete($archivo);
                }
            }
            if ($miembro->cv_archivo && Storage::disk('public')->exists($miembro->cv_archivo)) {
                Storage::disk('public')->delete($miembro->cv_archivo);
            }

            return response()->json(['success' => true, 'message' => 'Miembro eliminado correctamente.']);
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return response()->json(['success' => false, 'message' => 'Error al eliminar el miembro.'], 500);
        }
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    /**
     * @return array<int, array<string, mixed>>
     */
    private function listar(): array
    {
        $base = DB::table('equipo_miembros as em')
            ->join('personas as p', 'em.idpersonas', '=', 'p.idpersonas')
            ->join('genero as g', 'p.idgenero', '=', 'g.idgenero')
            ->join('condicion_miembro as cm', 'em.idcondicion_miembro', '=', 'cm.idcondicion_miembro')
            ->join('grado_academico as ga', 'em.id_grado_academico', '=', 'ga.id_grado_academico')
            ->join('universidades as u', 'em.iduniversidad', '=', 'u.iduniversidad')
            ->join('pais as pa', 'u.idpais', '=', 'pa.idpais')
            ->join('tipos_membresia as tm', 'em.idtipo_membresia', '=', 'tm.idtipo_membresia')
            ->orderBy('p.nombres')
            ->select([
                'em.idequipo_miembro', 'em.idpersonas', 'em.email_miembro', 'em.cv_archivo',
                'em.idcondicion_miembro', 'cm.nom_condicion',
                'em.id_grado_academico', 'ga.abreviatura', 'ga.nombre_titulo',
                'em.iduniversidad', 'u.siglas', 'u.nom_universidad', 'u.idpais', 'pa.nom_pais',
                'em.idtipo_membresia', 'tm.nom_tipo_membresia',
                'em.fecha_creacion', 'em.created_at', 'em.updated_at',
                'p.nombres', 'p.apell_paterno', 'p.apell_materno', 'p.dni', 'p.telefono', 'p.direccion', 'p.idgenero', 'g.nom_genero',
            ])
            ->get();

        $lineasPorMiembro = DB::table('equipo_miembros_lineas_investigacion as eli')
            ->join('lineas_investigacion as li', 'eli.idlinea_investigacion', '=', 'li.idlinea_investigacion')
            ->join('areas_investigacion as ai', 'li.idarea_investigacion', '=', 'ai.idarea_investigacion')
            ->select(['eli.idequipo_miembro', 'li.idlinea_investigacion', 'li.linea_investigacion', 'ai.nom_area_investigacion'])
            ->get()
            ->groupBy('idequipo_miembro');

        $logrosPorMiembro = DB::table('logros_miembros')
            ->select('idequipo_miembro', DB::raw('COUNT(*) as total'))
            ->groupBy('idequipo_miembro')
            ->pluck('total', 'idequipo_miembro');

        return $base->map(function ($m) use ($lineasPorMiembro, $logrosPorMiembro) {
            $arr = (array) $m;
            $arr['nombreCompleto'] = $this->nombreCompleto($m->nombres, $m->apell_paterno, $m->apell_materno);
            $arr['cv_url'] = $m->cv_archivo && Storage::disk('public')->exists($m->cv_archivo)
                ? Storage::url($m->cv_archivo)
                : null;
            $arr['lineas'] = ($lineasPorMiembro->get($m->idequipo_miembro) ?? collect())
                ->map(fn ($l) => [
                    'idlinea_investigacion' => $l->idlinea_investigacion,
                    'linea_investigacion' => $l->linea_investigacion,
                    'nom_area_investigacion' => $l->nom_area_investigacion,
                ])
                ->values();
            $arr['logros_count'] = (int) ($logrosPorMiembro[$m->idequipo_miembro] ?? 0);

            return $arr;
        })->values()->all();
    }

    private function serializar(int $id): array
    {
        return collect($this->listar())->firstWhere('idequipo_miembro', $id) ?? [];
    }

    private function nombreCompleto(string $nombres, string $paterno, string $materno): string
    {
        $apellidos = collect([$paterno, $materno])
            ->filter(fn (?string $a) => $a && Str::upper(trim($a)) !== 'N/A')
            ->implode(' ');

        return Str::squish("{$nombres} {$apellidos}");
    }
}
