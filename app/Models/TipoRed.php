<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $idtipos_redes
 * @property string $tipos_redes
 */
class TipoRed extends Model
{
    protected $table = 'tipos_redes';

    protected $primaryKey = 'idtipos_redes';

    public $timestamps = false;

    /**
     * @return HasMany<EmpresaRed, $this>
     */
    public function empresaRedes(): HasMany
    {
        return $this->hasMany(EmpresaRed::class, 'idtipos_redes', 'idtipos_redes');
    }
}
