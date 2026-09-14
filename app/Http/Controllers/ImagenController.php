<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Galería de imágenes del carrusel público (tabla `imagenes`).
 *
 * Reglas de negocio:
 *  - Cada imagen pertenece a la ficha institucional (empresa_kuelap); si aún
 *    no existe esa ficha, no se puede subir ninguna imagen (la FK es
 *    obligatoria y sin ficha no hay a quién asociarlas).
 *  - `orden` se autoasigna al crear (siguiente al máximo existente) y solo se
 *    modifica en bloque a través de reorder(), que reescribe 1..n de forma
 *    atómica según el arreglo de IDs que llega del cliente.
 *  - Al eliminar una imagen se recompactan los órdenes restantes (1..n) para
 *    que nunca queden huecos que confundan al usuario.
 *  - Hay un límite máximo de imágenes para no sobrecargar el carrusel de la
 *    página pública.
 *  - El archivo es obligatorio al crear y opcional al editar (se conserva el
 *    actual si no se sube uno nuevo); el archivo reemplazado o de una imagen
 *    eliminada se borra del disco.
 */
class ImagenController extends Controller
{
    private const MAX_IMAGENES = 20;

    public function index(): Response
    {
        return Inertia::render('event/imagenes', [
            'imagenes' => $this->listar(),
            'tieneEmpresa' => DB::table('empresa_kuelap')->exists(),
            'maxImagenes' => self::MAX_IMAGENES,
        ]);
    }

    // ─── Store ──────────────────────────────────────────────────────────────

    public function store(Request $request): JsonResponse
    {
        $idEmpresa = DB::table('empresa_kuelap')->orderBy('idempresa_kuelap')->value('idempresa_kuelap');
        if (!$idEmpresa) {
            return response()->json([
                'success' => false,
                'message' => 'Primero debes registrar la ficha institucional en "Empresa" antes de subir imágenes.',
            ], 409);
        }

        $total = DB::table('imagenes')->where('idempresa_kuelap', $idEmpresa)->count();
        if ($total >= self::MAX_IMAGENES) {
            return response()->json([
                'success' => false,
                'message' => 'Alcanzaste el máximo de ' . self::MAX_IMAGENES . ' imágenes. Elimina alguna para poder subir otra.',
            ], 422);
        }

        try {
            $data = $request->validate([
                'nombre' => 'required|string|max:255',
                'imagen' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:6144', 'dimensions:min_width=640,min_height=360'],
            ]);
        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Revisa los datos del formulario.', 'errors' => $e->errors()], 422);
        }

        $ruta = $request->file('imagen')->store('imagenes', 'public');
        $siguienteOrden = (int) (DB::table('imagenes')->where('idempresa_kuelap', $idEmpresa)->max('orden')) + 1;

        $id = DB::table('imagenes')->insertGetId([
            'nombre' => $data['nombre'],
            'imagen' => $ruta,
            'orden' => $siguienteOrden,
            'idempresa_kuelap' => $idEmpresa,
        ], 'idimagenes');

        return response()->json([
            'success' => true,
            'message' => 'Imagen subida correctamente.',
            'imagen' => $this->serializar(DB::table('imagenes')->where('idimagenes', $id)->first()),
        ], 201);
    }

    // ─── Update (POST + _method=PUT, por el upload de imagen multipart) ────

    public function update(Request $request, int $id): JsonResponse
    {
        $imagen = DB::table('imagenes')->where('idimagenes', $id)->first();
        if (!$imagen) {
            return response()->json(['success' => false, 'message' => 'Imagen no encontrada.'], 404);
        }

        try {
            $data = $request->validate([
                'nombre' => 'required|string|max:255',
                'imagen' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:6144', 'dimensions:min_width=640,min_height=360'],
            ]);
        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Revisa los datos del formulario.', 'errors' => $e->errors()], 422);
        }

        $ruta = $imagen->imagen;
        if ($request->hasFile('imagen')) {
            $nuevaRuta = $request->file('imagen')->store('imagenes', 'public');
            if ($ruta && Storage::disk('public')->exists($ruta)) {
                Storage::disk('public')->delete($ruta);
            }
            $ruta = $nuevaRuta;
        }

        DB::table('imagenes')->where('idimagenes', $id)->update([
            'nombre' => $data['nombre'],
            'imagen' => $ruta,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Imagen actualizada correctamente.',
            'imagen' => $this->serializar(DB::table('imagenes')->where('idimagenes', $id)->first()),
        ]);
    }

    // ─── Reorder ─────────────────────────────────────────────────────────────

    public function reorder(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'orden' => 'required|array|min:1',
                'orden.*' => 'integer|distinct|exists:imagenes,idimagenes',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Orden inválido.', 'errors' => $e->errors()], 422);
        }

        $idsActuales = DB::table('imagenes')->orderBy('idimagenes')->pluck('idimagenes')->all();
        $idsEnviados = $data['orden'];
        sort($idsActuales);
        $idsEnviadosOrdenados = $idsEnviados;
        sort($idsEnviadosOrdenados);

        if ($idsActuales !== $idsEnviadosOrdenados) {
            return response()->json([
                'success' => false,
                'message' => 'La lista de imágenes cambió mientras reordenabas. Recarga la página e inténtalo de nuevo.',
            ], 409);
        }

        DB::beginTransaction();
        try {
            foreach ($idsEnviados as $posicion => $idImagen) {
                DB::table('imagenes')->where('idimagenes', $idImagen)->update(['orden' => $posicion + 1]);
            }
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return response()->json(['success' => false, 'message' => 'Error al reordenar las imágenes.'], 500);
        }

        return response()->json(['success' => true, 'message' => 'Orden actualizado.', 'imagenes' => $this->listar()]);
    }

    // ─── Destroy ────────────────────────────────────────────────────────────

    public function destroy(int $id): JsonResponse
    {
        $imagen = DB::table('imagenes')->where('idimagenes', $id)->first();
        if (!$imagen) {
            return response()->json(['success' => false, 'message' => 'Imagen no encontrada.'], 404);
        }

        DB::beginTransaction();
        try {
            DB::table('imagenes')->where('idimagenes', $id)->delete();

            // Recompactar los órdenes restantes para que sigan siendo 1..n sin huecos.
            $restantes = DB::table('imagenes')
                ->where('idempresa_kuelap', $imagen->idempresa_kuelap)
                ->orderBy('orden')
                ->pluck('idimagenes');
            foreach ($restantes as $posicion => $idImagen) {
                DB::table('imagenes')->where('idimagenes', $idImagen)->update(['orden' => $posicion + 1]);
            }

            DB::commit();

            if ($imagen->imagen && Storage::disk('public')->exists($imagen->imagen)) {
                Storage::disk('public')->delete($imagen->imagen);
            }

            return response()->json(['success' => true, 'message' => 'Imagen eliminada correctamente.', 'imagenes' => $this->listar()]);
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return response()->json(['success' => false, 'message' => 'Error al eliminar la imagen.'], 500);
        }
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function listar()
    {
        return DB::table('imagenes')
            ->orderBy('orden')
            ->get()
            ->map(fn ($img) => $this->serializar($img))
            ->values();
    }

    private function serializar(object $imagen): array
    {
        $arr = (array) $imagen;
        $arr['url'] = $imagen->imagen && Storage::disk('public')->exists($imagen->imagen)
            ? Storage::url($imagen->imagen)
            : null;

        return $arr;
    }
}
