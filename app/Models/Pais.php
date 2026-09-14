<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $idpais
 * @property string $nom_pais
 */
class Pais extends Model
{
    protected $table = 'pais';

    protected $primaryKey = 'idpais';

    public $timestamps = false;

    /**
     * @return HasMany<Universidad, $this>
     */
    public function universidades(): HasMany
    {
        return $this->hasMany(Universidad::class, 'idpais', 'idpais');
    }
}
