<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id_grado_academico
 * @property string $abreviatura
 * @property string|null $nombre_titulo
 */
class GradoAcademico extends Model
{
    protected $table = 'grado_academico';

    protected $primaryKey = 'id_grado_academico';

    public $timestamps = false;
}
