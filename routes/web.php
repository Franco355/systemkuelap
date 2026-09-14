<?php

use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ImagenController;
use App\Http\Controllers\LogroMiembroController;
use App\Http\Controllers\MiembroController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/nosotros', [HomeController::class, 'somos'])->name('somos');
Route::get('/miembros', [HomeController::class, 'miembros'])->name('miembros');
Route::get('/actividades', [HomeController::class, 'actividades'])->name('actividades');

use App\Http\Controllers\DashboardController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});


Route::middleware(['auth', 'verified'])->prefix('eventos')->name('eventos.')->group(function () {
    Route::get('/', [EventoController::class, 'index'])->name('index');
    Route::post('/', [EventoController::class, 'store'])
        ->middleware('throttle:15,1')
        ->name('store');
    Route::match(['put', 'post'], '/{id}', [EventoController::class, 'update'])
        ->whereNumber('id')
        ->middleware('throttle:20,1')
        ->name('update');
    Route::delete('/{id}', [EventoController::class, 'destroy'])
        ->whereNumber('id')
        ->name('destroy');
});

Route::middleware(['auth', 'verified'])->prefix('empresa')->name('empresa.')->group(function () {
    Route::get('/', [EmpresaController::class, 'index'])->name('index');
    Route::post('/', [EmpresaController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('store');
    Route::match(['put', 'post'], '/{id}', [EmpresaController::class, 'update'])
        ->whereNumber('id')
        ->middleware('throttle:20,1')
        ->name('update');
});

Route::middleware(['auth', 'verified'])->prefix('imagenes')->name('imagenes.')->group(function () {
    Route::get('/', [ImagenController::class, 'index'])->name('index');
    Route::post('/', [ImagenController::class, 'store'])
        ->middleware('throttle:15,1')
        ->name('store');
    Route::post('/reorder', [ImagenController::class, 'reorder'])
        ->middleware('throttle:30,1')
        ->name('reorder');
    Route::match(['put', 'post'], '/{id}', [ImagenController::class, 'update'])
        ->whereNumber('id')
        ->middleware('throttle:20,1')
        ->name('update');
    Route::delete('/{id}', [ImagenController::class, 'destroy'])
        ->whereNumber('id')
        ->name('destroy');
});

// Prefijo "equipo" (no "miembros") porque /miembros ya es la página pública.
Route::middleware(['auth', 'verified'])->prefix('equipo')->name('equipo.')->group(function () {
    Route::get('/', [MiembroController::class, 'index'])->name('index');
    Route::match(['put', 'post'], '/{id}', [MiembroController::class, 'update'])
        ->whereNumber('id')
        ->middleware('throttle:20,1')
        ->name('update');
    Route::delete('/{id}', [MiembroController::class, 'destroy'])
        ->whereNumber('id')
        ->name('destroy');

    Route::prefix('{miembro}/logros')->whereNumber('miembro')->name('logros.')->group(function () {
        Route::get('/', [LogroMiembroController::class, 'index'])->name('index');
        Route::post('/', [LogroMiembroController::class, 'store'])
            ->middleware('throttle:15,1')
            ->name('store');
        Route::match(['put', 'post'], '/{logro}', [LogroMiembroController::class, 'update'])
            ->whereNumber('logro')
            ->middleware('throttle:20,1')
            ->name('update');
        Route::delete('/{logro}', [LogroMiembroController::class, 'destroy'])
            ->whereNumber('logro')
            ->name('destroy');
    });
});

require __DIR__.'/settings.php';
