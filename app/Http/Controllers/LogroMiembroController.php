<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

/**
 * Logros de un miembro (tabla `logros_miembros`), gestionados desde el panel
 * de miembros mediante el ícono de medalla en la tabla de "Miembros".
 *
 * Reglas de negocio:
 *  - Máximo MAX_LOGROS por miembro, para mantener el perfil legible.
 *  - `fecha_logro` no puede ser futura: un logro se registra después de
 *    haber ocurrido.
 *  - El archivo de evidencia es opcional; se reemplaza (borrando el
 *    anterior) o se elimina junto con el logro.
 */
class LogroMiembroController extends Controller
{
    private const MAX_LOGROS = 30;

    public function index(int $miembro): JsonResponse
    {
        if (!DB::table('equipo_miembros')->where('idequipo_miembro', $miembro)->exists()) {
            return response()->json(['success' => false, 'message' => 'Miembro no encontrado.'], 404);
        }

        return response()->json(['success' => true, 'logros' => $this->listar($miembro)]);
    }

    public function store(Request $request, int $miembro): JsonResponse
    {
        if (!DB::table('equipo_miembros')->where('idequipo_miembro', $miembro)->exists()) {
            return response()->json(['success' => false, 'message' => 'Miembro no encontrado.'], 404);
        }

        $total = DB::table('logros_miembros')->where('idequipo_miembro', $miembro)->count();
        if ($total >= self::MAX_LOGROS) {
            return response()->json([
                'success' => false,
                'message' => 'Este miembro ya alcanzó el máximo de ' . self::MAX_LOGROS . ' logros registrados.',
            ], 422);
        }

        try {
            $data = $this->validar($request);
        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Revisa los datos del formulario.', 'errors' => $e->errors()], 422);
        }

        $archivo = $request->hasFile('archivo_evidencia')
            ? $request->file('archivo_evidencia')->store('miembros/logros', 'public')
            : null;

        $id = DB::table('logros_miembros')->insertGetId([
            'idequipo_miembro' => $miembro,
            'idtipos_logro' => $data['idtipos_logro'],
            'titulo' => $data['titulo'],
            'descripcion' => $data['descripcion'],
            'fecha_logro' => $data['fecha_logro'],
            'archivo_evidencia' => $archivo,
            'created_at' => now(),
            'updated_at' => now(),
        ], 'idlogros_miembros');

        return response()->json([
            'success' => true,
            'message' => 'Logro agregado correctamente.',
            'logro' => $this->serializar($id),
        ], 201);
    }

    public function update(Request $request, int $miembro, int $logro): JsonResponse
    {
        $existente = DB::table('logros_miembros')->where('idlogros_miembros', $logro)->where('idequipo_miembro', $miembro)->first();
        if (!$existente) {
            return response()->json(['success' => false, 'message' => 'Logro no encontrado.'], 404);
        }

        try {
            $data = $this->validar($request);
        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Revisa los datos del formulario.', 'errors' => $e->errors()], 422);
        }

        $archivo = $existente->archivo_evidencia;
        if ($request->hasFile('archivo_evidencia')) {
            $nuevo = $request->file('archivo_evidencia')->store('miembros/logros', 'public');
            if ($archivo && Storage::disk('public')->exists($archivo)) {
                Storage::disk('public')->delete($archivo);
            }
            $archivo = $nuevo;
        }

        DB::table('logros_miembros')->where('idlogros_miembros', $logro)->update([
            'idtipos_logro' => $data['idtipos_logro'],
            'titulo' => $data['titulo'],
            'descripcion' => $data['descripcion'],
            'fecha_logro' => $data['fecha_logro'],
            'archivo_evidencia' => $archivo,
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Logro actualizado correctamente.',
            'logro' => $this->serializar($logro),
        ]);
    }

    public function destroy(int $miembro, int $logro): JsonResponse
    {
        $existente = DB::table('logros_miembros')->where('idlogros_miembros', $logro)->where('idequipo_miembro', $miembro)->first();
        if (!$existente) {
            return response()->json(['success' => false, 'message' => 'Logro no encontrado.'], 404);
        }

        DB::table('logros_miembros')->where('idlogros_miembros', $logro)->delete();

        if ($existente->archivo_evidencia && Storage::disk('public')->exists($existente->archivo_evidencia)) {
            Storage::disk('public')->delete($existente->archivo_evidencia);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logro eliminado correctamente.',
            'logros' => $this->listar($miembro),
        ]);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    /**
     * @return array<string, mixed>
     */
    private function validar(Request $request): array
    {
        return $request->validate([
            'idtipos_logro' => 'required|integer|exists:tipos_logro,idtipos_logro',
            'titulo' => 'required|string|max:150',
            'descripcion' => 'required|string|max:3000',
            'fecha_logro' => 'required|date|before_or_equal:today',
            'archivo_evidencia' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp|max:5120',
        ]);
    }

    private function listar(int $miembro)
    {
        return DB::table('logros_miembros as lm')
            ->join('tipos_logro as tl', 'lm.idtipos_logro', '=', 'tl.idtipos_logro')
            ->where('lm.idequipo_miembro', $miembro)
            ->orderByDesc('lm.fecha_logro')
            ->select(['lm.idlogros_miembros', 'lm.idequipo_miembro', 'lm.idtipos_logro', 'tl.nom_tipo_logro', 'lm.titulo', 'lm.descripcion', 'lm.fecha_logro', 'lm.archivo_evidencia', 'lm.created_at'])
            ->get()
            ->map(fn ($l) => $this->conUrl($l))
            ->values();
    }

    private function serializar(int $id): array
    {
        $logro = DB::table('logros_miembros as lm')
            ->join('tipos_logro as tl', 'lm.idtipos_logro', '=', 'tl.idtipos_logro')
            ->where('lm.idlogros_miembros', $id)
            ->select(['lm.idlogros_miembros', 'lm.idequipo_miembro', 'lm.idtipos_logro', 'tl.nom_tipo_logro', 'lm.titulo', 'lm.descripcion', 'lm.fecha_logro', 'lm.archivo_evidencia', 'lm.created_at'])
            ->first();

        return $this->conUrl($logro);
    }

    private function conUrl(object $logro): array
    {
        $arr = (array) $logro;
        $arr['url'] = $logro->archivo_evidencia && Storage::disk('public')->exists($logro->archivo_evidencia)
            ? Storage::url($logro->archivo_evidencia)
            : null;

        return $arr;
    }
}
