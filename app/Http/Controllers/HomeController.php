<?php

namespace App\Http\Controllers;

use App\Models\AreaInvestigacion;
use App\Models\EmpresaKuelap;
use App\Models\EquipoMiembro;
use App\Models\Evento;
use App\Models\Imagen;
use App\Models\Pais;
use App\Models\Universidad;
use Illuminate\Support\Facades\Date;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('welcome', [
            'stats' => $this->stats(),
            'miembros' => $this->miembrosPreview(10),
            'paises' => $this->paises(),
            'imagenes' => $this->imagenes(),
            'eventos' => $this->eventosPreview(3),
        ]);
    }

    public function actividades(): Response
    {
        $proximas = Evento::query()
            ->where('fecha_inicio', '>=', Date::today())
            ->with(['modalidad', 'tipo'])
            ->orderBy('fecha_inicio')
            ->get();

        $pasadas = Evento::query()
            ->where('fecha_inicio', '<', Date::today())
            ->with(['modalidad', 'tipo'])
            ->orderByDesc('fecha_inicio')
            ->get();

        return Inertia::render('actividades', [
            'eventos' => $proximas->concat($pasadas)
                ->map($this->mapEvento(...))
                ->values()
                ->all(),
        ]);
    }

    public function miembros(): Response
    {
        $miembros = EquipoMiembro::query()
            ->whereHas('condicion', fn ($q) => $q->where('nom_condicion', 'Habilitado'))
            ->with(['persona', 'universidad.pais', 'gradoAcademico'])
            ->get()
            ->sortBy(fn (EquipoMiembro $miembro) => $miembro->persona?->nombreCompleto())
            ->map($this->mapMiembro(...))
            ->values()
            ->all();

        return Inertia::render('miembros', [
            'miembros' => $miembros,
            'paises' => $this->paises(),
        ]);
    }

    public function somos(): Response
    {
        $empresa = EmpresaKuelap::query()->with('valores')->first();

        return Inertia::render('somos', [
            'stats' => $this->stats(),
            'mision' => $empresa ? EmpresaKuelap::valueOrNull($empresa->emp_mision) : null,
            'vision' => $empresa ? EmpresaKuelap::valueOrNull($empresa->emp_vision) : null,
            'valores' => $empresa
                ? $empresa->valores->map(fn ($valor) => [
                    'id' => $valor->idempresa_valores,
                    'nombre' => $valor->nom_valores,
                    'descripcion' => $valor->descripcion,
                ])->values()->all()
                : [],
        ]);
    }

    /**
     * @return array<string, int>
     */
    protected function stats(): array
    {
        return [
            'investigadores' => EquipoMiembro::query()
                ->whereHas('condicion', fn ($q) => $q->where('nom_condicion', 'Habilitado'))
                ->count(),
            'universidades' => Universidad::query()->count(),
            'paises' => Universidad::query()->distinct('idpais')->count('idpais'),
            'areasInvestigacion' => AreaInvestigacion::query()->count(),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function miembrosPreview(int $limit): array
    {
        return EquipoMiembro::query()
            ->whereHas('condicion', fn ($q) => $q->where('nom_condicion', 'Habilitado'))
            ->with(['persona', 'universidad.pais', 'gradoAcademico'])
            ->latest('idequipo_miembro')
            ->limit($limit)
            ->get()
            ->map($this->mapMiembro(...))
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    protected function mapMiembro(EquipoMiembro $miembro): array
    {
        return [
            'id' => $miembro->idequipo_miembro,
            'nombre' => $miembro->persona?->nombreCompleto() ?? 'Miembro Kuélap',
            'universidad' => $miembro->universidad?->nom_universidad,
            'pais' => $miembro->universidad?->pais?->nom_pais,
            'grado' => $miembro->gradoAcademico && ! str_contains(mb_strtolower($miembro->gradoAcademico->nombre_titulo ?? ''), 'no especific')
                ? $miembro->gradoAcademico->nombre_titulo
                : null,
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function paises(): array
    {
        return Pais::query()
            ->whereHas('universidades')
            ->orderBy('nom_pais')
            ->get()
            ->map(fn (Pais $pais) => [
                'id' => $pais->idpais,
                'nombre' => $pais->nom_pais,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function imagenes(): array
    {
        return Imagen::query()
            ->orderBy('orden')
            ->get()
            ->map(fn (Imagen $imagen) => [
                'id' => $imagen->idimagenes,
                'nombre' => $imagen->nombre,
                'url' => $imagen->url(),
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function eventosPreview(int $limit): array
    {
        return Evento::query()
            ->where('fecha_inicio', '>=', Date::today())
            ->with(['modalidad', 'tipo'])
            ->orderBy('fecha_inicio')
            ->limit($limit)
            ->get()
            ->map($this->mapEvento(...))
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    protected function mapEvento(Evento $evento): array
    {
        return [
            'id' => $evento->idevento,
            'titulo' => $evento->nom_evento,
            'descripcion' => $evento->descripcion,
            'imagen' => $evento->imagenUrl(),
            'fechaInicio' => $evento->fecha_inicio->toIso8601String(),
            'modalidad' => $evento->modalidad?->nom_modalidad,
            'tipo' => $evento->tipo?->nom_tipo_evento,
            'lugar' => $evento->espacio_lugar,
            'inscripcion' => $evento->link_form_inscripcion,
            'estado' => $evento->fecha_inicio->lt(Date::today()) ? 'pasada' : 'proxima',
        ];
    }
}
