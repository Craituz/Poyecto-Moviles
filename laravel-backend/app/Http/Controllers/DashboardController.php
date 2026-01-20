<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // VALIDACIÓN DE ADMIN MÁS SEGURA (Sin depender de hasRole)
        // Verificamos si tiene roles cargados y si el primero es 'admin'
        // O si usamos la relación directa:
        $isAdmin = false;
        
        // Opción 1: Si usas una relación 'roles' (como vimos en tu frontend)
        if ($user->roles && $user->roles->count() > 0) {
            if ($user->roles->first()->name === 'admin') {
                $isAdmin = true;
            }
        }
        
        // Opción 2: Si el email es el del admin (Hardcode de emergencia)
        if ($user->email === 'admin@yeliscake.com') {
            $isAdmin = true;
        }

        if (!$isAdmin) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // --- ESTADÍSTICAS ---

        // 1. Ingresos (Solo pedidos no cancelados)
        $totalIncome = Order::where('status', '!=', 'cancelado')->sum('total');

        // 2. Pedidos Totales
        $totalOrders = Order::count();

        // 3. Pendientes
        $pendingOrders = Order::where('status', 'pendiente')->count();

        // 4. Usuarios Totales
        $totalUsers = User::count();

        return response()->json([
            'income' => $totalIncome,
            'total_orders' => $totalOrders,
            'pending_orders' => $pendingOrders,
            'total_users' => $totalUsers,
        ]);
    }
}