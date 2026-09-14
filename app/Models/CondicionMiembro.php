<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $idcondicion_miembro
 * @property string $nom_condicion
 */
class CondicionMiembro extends Model
{
    protected $table = 'condicion_miembro';

    protected $primaryKey = 'idcondicion_miembro';

    public $timestamps = false;
}
