<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Ficha institucional de KUÉLAP (empresa_kuelap).
 *
 * Reglas de negocio:
 *  - Es un registro único (singleton): solo puede existir una fila en
 *    empresa_kuelap. Se crea una sola vez (store) y luego solo se actualiza
 *    (update); nunca se permite crear una segunda ficha ni eliminarla.
 *  - El logo se sube a storage/public/empresa; en edición es opcional
 *    (se conserva el actual si no se envía uno nuevo) y el archivo anterior
 *    se borra al reemplazarlo.
 *  - Redes sociales (empresa_redes) y valores institucionales
 *    (empresa_valores) se sincronizan por reemplazo total (borrar + volver a
 *    insertar) dentro de la misma transacción que la ficha, igual que el
 *    patrón usado para las plataformas de un evento.
 *  - Cada red social solo puede aparecer una vez y su enlace debe ser una
 *    URL válida (nada de placeholders tipo "#").
 */
class EmpresaController extends Controller
{
    private const MAX_VALORES = 12;

    public function index(): Response
    {
        $empresa = DB::table('empresa_kuelap')->orderBy('idempresa_kuelap')->first();

        return Inertia::render('event/empresa', [
            'empresa' => $empresa ? $this->serializarEmpresa($empresa) : null,
            'redes' => $empresa ? $this->redesDe($empresa->idempresa_kuelap) : [],
            'valores' => $empresa ? $this->valoresDe($empresa->idempresa_kuelap) : [],
            'tiposRedes' => DB::table('tipos_redes')->orderBy('idtipos_redes')->get(),
        ]);
    }

    // ─── Store (solo si aún no existe la ficha) ─────────────────────────────

    public function store(Request $request): JsonResponse
    {
        if (DB::table('empresa_kuelap')->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'La ficha institucional ya existe. Debes editarla en lugar de crear una nueva.',
            ], 409);
        }

        return $this->guardar($request, null);
    }

    // ─── Update (POST + _method=PUT, por el upload de logo multipart) ──────

    public function update(Request $request, int $id): JsonResponse
    {
        $empresa = DB::table('empresa_kuelap')->where('idempresa_kuelap', $id)->first();
        if (!$empresa) {
            return response()->json(['success' => false, 'message' => 'Ficha institucional no encontrada.'], 404);
        }

        return $this->guardar($request, $empresa);
    }

    private function guardar(Request $request, ?object $empresaExistente): JsonResponse
    {
        $esEdicion = $empresaExistente !== null;

        try {
            $data = $request->validate([
                'nom_empresa' => 'required|string|max:150',
                'emp_descripcion' => 'required|string|max:45',
                'emp_mision' => 'required|string|max:5000',
                'emp_vision' => 'required|string|max:5000',
                'emp_correo' => 'required|email:filter|max:80',
                // Acepta el formato normal o el placeholder "PENDIENTE" que trae la data importada,
                // para que se pueda guardar el resto del formulario sin forzar a completar el teléfono ya mismo.
                'emp_telefono' => ['required', 'string', 'max:15', 'regex:/^(pendiente|[0-9+()\-\s]{6,15})$/i'],
                'emp_direccion' => 'required|string|max:200',
                'emp_logo' => [
                    $esEdicion ? 'nullable' : 'required',
                    'file',
                    'mimetypes:image/jpeg,image/png,image/webp,image/svg+xml',
                    'max:2048',
                ],
                'redes' => 'nullable|string', // JSON: [{idtipos_redes, enlace}]
                'valores' => 'nullable|string', // JSON: [{idempresa_valores?, nom_valores, descripcion}]
            ]);
        } catch (ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Revisa los datos del formulario.', 'errors' => $e->errors()], 422);
        }

        // ── Redes sociales: cada tipo una sola vez, enlace debe ser una URL real ──
        $redes = [];
        $rawRedes = json_decode($request->input('redes', '[]'), true);
        if (is_array($rawRedes)) {
            $idsTiposValidos = DB::table('tipos_redes')->pluck('idtipos_redes')->all();
            $idsUsados = [];

            foreach ($rawRedes as $i => $r) {
                $idTipo = (int) ($r['idtipos_redes'] ?? 0);
                $enlace = trim((string) ($r['enlace'] ?? ''));

                if ($enlace === '') {
                    continue; // el admin dejó ese tipo de red sin completar
                }
                if (!in_array($idTipo, $idsTiposValidos, true)) {
                    return response()->json(['success' => false, 'message' => 'Tipo de red social inválido en la posición ' . ($i + 1) . '.'], 422);
                }
                if (!filter_var($enlace, FILTER_VALIDATE_URL) || !preg_match('/^https?:\/\//i', $enlace)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'El enlace de la red social en la posición ' . ($i + 1) . ' no es una URL válida (debe empezar con http:// o https://).',
                    ], 422);
                }
                if (in_array($idTipo, $idsUsados, true)) {
                    return response()->json(['success' => false, 'message' => 'No repitas el mismo tipo de red social más de una vez.'], 422);
                }

                $idsUsados[] = $idTipo;
                $redes[] = ['idtipos_redes' => $idTipo, 'enlace' => $enlace];
            }
        }

        // ── Valores institucionales: nombre único, sin vacíos, límite razonable ──
        $valores = [];
        $rawValores = json_decode($request->input('valores', '[]'), true);
        if (is_array($rawValores)) {
            if (count($rawValores) > self::MAX_VALORES) {
                return response()->json(['success' => false, 'message' => 'No puedes registrar más de ' . self::MAX_VALORES . ' valores institucionales.'], 422);
            }

            $nombresUsados = [];
            foreach ($rawValores as $i => $v) {
                $nombre = trim((string) ($v['nom_valores'] ?? ''));
                $descripcion = trim((string) ($v['descripcion'] ?? ''));

                if ($nombre === '' && $descripcion === '') {
                    continue; // fila vacía, se ignora
                }
                if ($nombre === '' || $descripcion === '') {
                    return response()->json([
                        'success' => false,
                        'message' => 'El valor institucional en la posición ' . ($i + 1) . ' necesita nombre y descripción.',
                    ], 422);
                }
                if (mb_strlen($nombre) > 100) {
                    return response()->json(['success' => false, 'message' => 'El nombre del valor en la posición ' . ($i + 1) . ' es demasiado largo (máx. 100 caracteres).'], 422);
                }
                if (mb_strlen($descripcion) > 2000) {
                    return response()->json(['success' => false, 'message' => 'La descripción del valor en la posición ' . ($i + 1) . ' es demasiado larga (máx. 2000 caracteres).'], 422);
                }

                $clave = Str::lower($nombre);
                if (in_array($clave, $nombresUsados, true)) {
                    return response()->json(['success' => false, 'message' => 'No repitas el mismo nombre de valor institucional ("' . $nombre . '").'], 422);
                }

                $nombresUsados[] = $clave;
                $valores[] = ['nom_valores' => $nombre, 'descripcion' => $descripcion];
            }
        }

        // ── Logo ──────────────────────────────────────────────────────────
        $rutaLogo = $empresaExistente->emp_logo ?? null;
        if ($request->hasFile('emp_logo')) {
            $nuevaRuta = $request->file('emp_logo')->store('empresa', 'public');
            if ($esEdicion && $rutaLogo && Storage::disk('public')->exists($rutaLogo)) {
                Storage::disk('public')->delete($rutaLogo);
            }
            $rutaLogo = $nuevaRuta;
        }

        $payload = [
            'nom_empresa' => $data['nom_empresa'],
            'emp_descripcion' => $data['emp_descripcion'],
            'emp_mision' => $data['emp_mision'],
            'emp_vision' => $data['emp_vision'],
            'emp_correo' => $data['emp_correo'],
            'emp_telefono' => $data['emp_telefono'],
            'emp_direccion' => $data['emp_direccion'],
            'emp_logo' => $rutaLogo,
            'updated_at' => now(),
        ];

        DB::beginTransaction();
        try {
            if ($esEdicion) {
                $idEmpresa = $empresaExistente->idempresa_kuelap;
                DB::table('empresa_kuelap')->where('idempresa_kuelap', $idEmpresa)->update($payload);
            } else {
                $payload['created_at'] = now();
                $idEmpresa = DB::table('empresa_kuelap')->insertGetId($payload);
            }

            DB::table('empresa_redes')->where('idempresa_kuelap', $idEmpresa)->delete();
            foreach ($redes as $r) {
                DB::table('empresa_redes')->insert([
                    'idtipos_redes' => $r['idtipos_redes'],
                    'idempresa_kuelap' => $idEmpresa,
                    'enlace' => $r['enlace'],
                ]);
            }

            DB::table('empresa_valores')->where('idempresa_kuelap', $idEmpresa)->delete();
            foreach ($valores as $v) {
                DB::table('empresa_valores')->insert([
                    'nom_valores' => $v['nom_valores'],
                    'descripcion' => $v['descripcion'],
                    'idempresa_kuelap' => $idEmpresa,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return response()->json(['success' => false, 'message' => 'Error al guardar la ficha institucional.'], 500);
        }

        $empresaGuardada = DB::table('empresa_kuelap')->where('idempresa_kuelap', $idEmpresa)->first();

        return response()->json([
            'success' => true,
            'message' => $esEdicion ? 'Ficha institucional actualizada correctamente.' : 'Ficha institucional registrada correctamente.',
            'empresa' => $this->serializarEmpresa($empresaGuardada),
            'redes' => $this->redesDe($idEmpresa),
            'valores' => $this->valoresDe($idEmpresa),
        ], $esEdicion ? 200 : 201);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function serializarEmpresa(object $empresa): array
    {
        $arr = (array) $empresa;
        $arr['emp_logo_url'] = $empresa->emp_logo && Storage::disk('public')->exists($empresa->emp_logo)
            ? Storage::url($empresa->emp_logo)
            : null;

        return $arr;
    }

    private function redesDe(int $idEmpresa)
    {
        return DB::table('empresa_redes as er')
            ->join('tipos_redes as tr', 'er.idtipos_redes', '=', 'tr.idtipos_redes')
            ->where('er.idempresa_kuelap', $idEmpresa)
            ->orderBy('tr.idtipos_redes')
            ->select(['er.idtipos_redes', 'tr.tipos_redes as nom_tipo_red', 'er.enlace'])
            ->get();
    }

    private function valoresDe(int $idEmpresa)
    {
        return DB::table('empresa_valores')
            ->where('idempresa_kuelap', $idEmpresa)
            ->orderBy('idempresa_valores')
            ->get();
    }
}
