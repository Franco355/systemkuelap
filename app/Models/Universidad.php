<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $iduniversidad
 * @property string $siglas
 * @property string $nom_universidad
 * @property int $idpais
 */
class Universidad extends Model
{
    protected $table = 'universidades';

    protected $primaryKey = 'iduniversidad';

    /**
     * @return BelongsTo<Pais, $this>
     */
    public function pais(): BelongsTo
    {
        return $this->belongsTo(Pais::class, 'idpais', 'idpais');
    }

    /**
     * @return HasMany<EquipoMiembro, $this>
     */
    public function miembros(): HasMany
    {
        return $this->hasMany(EquipoMiembro::class, 'iduniversidad', 'iduniversidad');
    }
}
