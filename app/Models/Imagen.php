<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $idimagenes
 * @property string $nombre
 * @property string $imagen
 * @property int $orden
 * @property int $idempresa_kuelap
 */
class Imagen extends Model
{
    protected $table = 'imagenes';

    protected $primaryKey = 'idimagenes';

    public $timestamps = false;

    /**
     * @return BelongsTo<EmpresaKuelap, $this>
     */
    public function empresa(): BelongsTo
    {
        return $this->belongsTo(EmpresaKuelap::class, 'idempresa_kuelap', 'idempresa_kuelap');
    }

    public function url(): string
    {
        return Storage::disk('public')->url($this->imagen);
    }
}
