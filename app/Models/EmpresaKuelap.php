<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * @property int $idempresa_kuelap
 * @property string $nom_empresa
 * @property string $emp_descripcion
 * @property string $emp_logo
 * @property string $emp_mision
 * @property string $emp_vision
 * @property string $emp_correo
 * @property string $emp_telefono
 * @property string $emp_direccion
 */
class EmpresaKuelap extends Model
{
    protected $table = 'empresa_kuelap';

    protected $primaryKey = 'idempresa_kuelap';

    /**
     * @return HasMany<EmpresaRed, $this>
     */
    public function redes(): HasMany
    {
        return $this->hasMany(EmpresaRed::class, 'idempresa_kuelap', 'idempresa_kuelap');
    }

    /**
     * @return HasMany<EmpresaValor, $this>
     */
    public function valores(): HasMany
    {
        return $this->hasMany(EmpresaValor::class, 'idempresa_kuelap', 'idempresa_kuelap');
    }

    /**
     * The short display name used for the wordmark, e.g. "Kuélap" from
     * "Red de Investigadores Latinoamericanos KUÉLAP".
     */
    public function nombreCorto(): string
    {
        $lastWord = Str::of($this->nom_empresa)->trim()->explode(' ')->last();

        return Str::ucfirst(mb_strtolower($lastWord));
    }

    /**
     * Registration data (phone, address, etc.) starts out as a "pendiente"
     * placeholder until staff fill in the real value. Treat that as absent
     * so the public site never shows unfinished internal notes.
     */
    public static function valueOrNull(?string $value): ?string
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        return Str::contains($value, 'pendiente', ignoreCase: true) ? null : $value;
    }
}
