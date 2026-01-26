<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController; 
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\PushTokenController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| RUTAS PÚBLICAS (Sin Login)
|--------------------------------------------------------------------------
*/

// Autenticación
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
// Recuperación de contraseña
Route::post('/password/forgot', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/password/reset', [PasswordResetController::class, 'reset']);

// Catálogo: Disponible para todos
Route::get('/products', [ProductController::class, 'index']); 


/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS (Requieren Token)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Cerrar Sesión
    Route::post('/logout', [AuthController::class, 'logout']);

    // Cambiar Contraseña y Email
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    Route::post('/change-email', [AuthController::class, 'changeEmail']);

    // Datos del usuario logueado
    Route::get('/user', function (Request $request) {
        return $request->user()->load('roles');
    });

    // --- GESTIÓN DE PRODUCTOS (ADMIN) ---
    Route::post('/products', [ProductController::class, 'store']); // Crear
    Route::put('/products/{id}', [ProductController::class, 'update']); // Editar
    Route::delete('/products/{id}', [ProductController::class, 'destroy']); // Eliminar

    // --- GESTIÓN DE USUARIOS (ADMIN / CLIENTE) ---
    Route::get('/users', [UserController::class, 'index']);      // Listar
    Route::put('/users/{id}', [UserController::class, 'update']); // Editar
    Route::post('/users/{id}', [UserController::class, 'update']); // Alias POST para editar con fotos
    Route::delete('/users/{id}', [UserController::class, 'destroy']); // Eliminar
    Route::post('/users/{id}/location', [UserController::class, 'updateLocation']); // Guardar ubicación

    // --- GESTIÓN DE PEDIDOS (NUEVO BLOQUE COMPLETO) ---
    
    // 1. Cliente: Ver sus pedidos
    Route::get('/orders', [OrderController::class, 'index']); 

    // 2. Cliente: Crear pedido (Checkout)
    Route::post('/orders', [OrderController::class, 'store']); 

    // 2.5. Cliente: Actualizar ubicación del pedido (Solo domicilio)
    Route::put('/orders/{id}/location', [OrderController::class, 'updateOrderLocation']);

    // 3. Cliente: Cancelar pedido (Solo si está pendiente)
    Route::put('/orders/{id}/cancel', [OrderController::class, 'cancel']); 

    // 4. Admin: Ver TODOS los pedidos (Dashboard)
    Route::get('/admin/orders', [OrderController::class, 'indexAll']); 

    // 5. Admin: Cambiar estado (Preparando, Enviado, etc.)
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']); 

    // --- PUSH NOTIFICATIONS (REGISTRO DE TOKENS) ---
    Route::post('/push-tokens/register', [PushTokenController::class, 'register']);
    Route::get('/push-tokens', [PushTokenController::class, 'index']);
    Route::delete('/push-tokens/{id}', [PushTokenController::class, 'destroy']);

    // --- NOTIFICACIONES (IN-APP) ---
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::delete('/notifications', [NotificationController::class, 'destroyAll']);

    // --- DASHBOARD ADMIN
    Route::get('/admin/stats', [DashboardController::class, 'index']);



});