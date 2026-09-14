<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * @property int $idpersonas
 * @property string $nombres
 * @property string $apell_paterno
 * @property string $apell_materno
 */
class Persona extends Model
{
    protected $table = 'personas';

    protected $primaryKey = 'idpersonas';

    public function nombreCompleto(): string
    {
        $apellidos = collect([$this->apell_paterno, $this->apell_materno])
            ->filter(fn (?string $apellido) => $apellido && strtoupper(trim($apellido)) !== 'N/A')
            ->implode(' ');

        return Str::of("{$this->nombres} {$apellidos}")->squish()->toString();
    }
}
