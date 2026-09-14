<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $idtipos_redes
 * @property int $idempresa_kuelap
 * @property string $enlace
 */
class EmpresaRed extends Model
{
    protected $table = 'empresa_redes';

    protected $primaryKey = null;

    public $incrementing = false;

    public $timestamps = false;

    /**
     * @return BelongsTo<TipoRed, $this>
     */
    public function tipoRed(): BelongsTo
    {
        return $this->belongsTo(TipoRed::class, 'idtipos_redes', 'idtipos_redes');
    }

    /**
     * @return BelongsTo<EmpresaKuelap, $this>
     */
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(EmpresaKuelap::class, 'idempresa_kuelap', 'idempresa_kuelap');
    }
}
