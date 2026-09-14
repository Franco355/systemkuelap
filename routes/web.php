<?php

use App\Http\Controllers\EventoController;
use App\Http\Controllers\HomeController;
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
    Route::post('/{id}', [EventoController::class, 'update'])
        ->whereNumber('id')
        ->middleware('throttle:20,1')
        ->name('update');
    Route::delete('/{id}', [EventoController::class, 'destroy'])
        ->whereNumber('id')
        ->name('destroy');
});

require __DIR__.'/settings.php';
