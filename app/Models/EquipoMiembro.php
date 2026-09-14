<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $idequipo_miembro
 * @property int $id_grado_academico
 * @property int $idpersonas
 * @property int $idcondicion_miembro
 * @property int $iduniversidad
 */
class EquipoMiembro extends Model
{
    protected $table = 'equipo_miembros';

    protected $primaryKey = 'idequipo_miembro';

    /**
     * @return BelongsTo<Persona, $this>
     */
    public function persona(): BelongsTo
    {
        return $this->belongsTo(Persona::class, 'idpersonas', 'idpersonas');
    }

    /**
     * @return BelongsTo<Universidad, $this>
     */
    public function universidad(): BelongsTo
    {
        return $this->belongsTo(Universidad::class, 'iduniversidad', 'iduniversidad');
    }

    /**
     * @return BelongsTo<CondicionMiembro, $this>
     */
    public function condicion(): BelongsTo
    {
        return $this->belongsTo(CondicionMiembro::class, 'idcondicion_miembro', 'idcondicion_miembro');
    }

    /**
     * @return BelongsTo<GradoAcademico, $this>
     */
    public function gradoAcademico(): BelongsTo
    {
        return $this->belongsTo(GradoAcademico::class, 'id_grado_academico', 'id_grado_academico');
    }
}
