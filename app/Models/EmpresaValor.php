<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $idempresa_valores
 * @property string $nom_valores
 * @property string $descripcion
 * @property int $idempresa_kuelap
 */
class EmpresaValor extends Model
{
    protected $table = 'empresa_valores';

    protected $primaryKey = 'idempresa_valores';

    /**
     * @return BelongsTo<EmpresaKuelap, $this>
     */
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(EmpresaKuelap::class, 'idempresa_kuelap', 'idempresa_kuelap');
    }
}
