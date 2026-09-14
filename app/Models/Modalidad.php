<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $idmodalidad
 * @property string $nom_modalidad
 */
class Modalidad extends Model
{
    protected $table = 'modalidad';

    protected $primaryKey = 'idmodalidad';

    public $timestamps = false;
}
