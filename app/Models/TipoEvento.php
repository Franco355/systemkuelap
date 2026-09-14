<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $idtipo_evento
 * @property string $nom_tipo_evento
 */
class TipoEvento extends Model
{
    protected $table = 'tipos_evento';

    protected $primaryKey = 'idtipo_evento';

    public $timestamps = false;
}
