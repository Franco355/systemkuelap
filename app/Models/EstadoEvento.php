<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $idestado_event
 * @property string $nom_estado_event
 */
class EstadoEvento extends Model
{
    protected $table = 'estado_evento';

    protected $primaryKey = 'idestado_event';

    public $timestamps = false;
}
