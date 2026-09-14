<?php

namespace App\Http\Middleware;

use App\Models\EmpresaKuelap;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'empresa' => fn () => $this->empresa(),
        ];
    }

    /**
     * The public-facing company profile shown in the site header and
     * footer: contact details and social links for KUÉLAP.
     *
     * @return array<string, mixed>|null
     */
    protected function empresa(): ?array
    {
        $empresa = EmpresaKuelap::query()->with('redes.tipoRed')->first();

        if (! $empresa) {
            return null;
        }

        return [
            'nombre' => $empresa->nom_empresa,
            'nombreCorto' => $empresa->nombreCorto(),
            'descripcion' => $empresa->emp_descripcion,
            'correo' => EmpresaKuelap::valueOrNull($empresa->emp_correo),
            'telefono' => EmpresaKuelap::valueOrNull($empresa->emp_telefono),
            'direccion' => EmpresaKuelap::valueOrNull($empresa->emp_direccion),
            'redes' => $empresa->redes
                ->filter(fn ($red) => $red->tipoRed !== null && trim($red->enlace) !== '')
                ->map(fn ($red) => [
                    'id' => $red->idtipos_redes,
                    'tipo' => $red->tipoRed->tipos_redes,
                    'enlace' => $red->enlace,
                ])
                ->values()
                ->all(),
        ];
    }
}
