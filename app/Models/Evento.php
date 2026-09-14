<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $idevento
 * @property string $nom_evento
 * @property string $descripcion
 * @property int $idestado_event
 * @property int $idmodalidad
 * @property int $idtipo_evento
 * @property \Illuminate\Support\Carbon $fecha_inicio
 * @property \Illuminate\Support\Carbon $fecha_fin
 * @property string|null $espacio_lugar
 * @property string|null $link_form_inscripcion
 * @property string $image_evento
 */
class Evento extends Model
{
    protected $table = 'evento';

    protected $primaryKey = 'idevento';

    protected function casts(): array
    {
        return [
            'fecha_inicio' => 'date',
            'fecha_fin' => 'date',
            'fec_inicio_inscripcion' => 'date',
            'fec_fin_inscripcion' => 'date',
        ];
    }

    public function imagenUrl(): string
    {
        return Storage::disk('public')->url($this->image_evento);
    }

    /**
     * @return BelongsTo<Modalidad, $this>
     */
    public function modalidad(): BelongsTo
    {
        return $this->belongsTo(Modalidad::class, 'idmodalidad', 'idmodalidad');
    }

    /**
     * @return BelongsTo<TipoEvento, $this>
     */
    public function tipo(): BelongsTo
    {
        return $this->belongsTo(TipoEvento::class, 'idtipo_evento', 'idtipo_evento');
    }

    /**
     * @return BelongsTo<EstadoEvento, $this>
     */
    public function estado(): BelongsTo
    {
        return $this->belongsTo(EstadoEvento::class, 'idestado_event', 'idestado_event');
    }
}
