<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $idarea_investigacion
 * @property string $nom_area_investigacion
 * @property string|null $descripcion
 */
class AreaInvestigacion extends Model
{
    protected $table = 'areas_investigacion';

    protected $primaryKey = 'idarea_investigacion';
}
