<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // --- HELPER PRIVADO PARA VERIFICAR ADMIN ---
    // Esto evita repetir código y errores si no existe el método hasRole
    private function isAdmin() {
        $user = auth()->user();
        
        // 1. Verificación por Email (Acceso de emergencia/seguro)
        if ($user->email === 'admin@yeliscake.com') return true;

        // 2. Verificación por Rol (Relación manual)
        if ($user->roles && $user->roles->count() > 0) {
            if ($user->roles->first()->name === 'admin') return true;
        }

        return false;
    }

    // 1. LISTAR PEDIDOS PROPIOS (Historial del Cliente)
    public function index()
    {
        // ✅ SEGURIDAD: Solo trae los pedidos del usuario logueado
        $orders = Order::where('user_id', auth()->id())
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    // 2. LISTAR TODOS LOS PEDIDOS (Solo Admin)
    public function indexAll()
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $orders = Order::with(['user', 'items.product']) 
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    // 3. CREAR PEDIDO
    public function store(Request $request)
    {
        $request->validate([
            'total' => 'required|numeric',
            'items' => 'required|array',
            'address' => 'required|string',
            'phone' => 'required|string',
        ]);

        try {
            $order = DB::transaction(function () use ($request) {
                // A. Cabecera
                $newOrder = Order::create([
                    'user_id' => auth()->id(),
                    'total' => $request->total,
                    'status' => 'pendiente',
                    'address' => $request->address,
                    'phone' => $request->phone,
                ]);

                // B. Detalles
                foreach ($request->items as $item) {
                    OrderItem::create([
                        'order_id' => $newOrder->id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'price' => $item['price'],
                    ]);
                }

                return $newOrder;
            });

            return response()->json(['message' => 'Pedido creado con éxito', 'order_id' => $order->id], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al procesar: ' . $e->getMessage()], 500);
        }
    }

    // 4. CANCELAR PEDIDO (Cliente)
    public function cancel($id)
    {
        $order = Order::find($id);

        if (!$order) return response()->json(['message' => 'Pedido no encontrado'], 404);

        // Seguridad: Solo el dueño puede cancelar
        if ($order->user_id != auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Lógica de negocio: Solo si está pendiente
        if ($order->status !== 'pendiente') {
            return response()->json(['message' => 'No se puede cancelar un pedido en proceso.'], 400);
        }

        $order->status = 'cancelado';
        $order->save();

        return response()->json(['message' => 'Pedido cancelado correctamente']);
    }

    // 5. ACTUALIZAR ESTADO (Solo Admin)
    public function updateStatus(Request $request, $id)
    {
        if (!$this->isAdmin()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'status' => 'required|in:pendiente,preparando,enviado,entregado,cancelado'
        ]);

        $order = Order::find($id);
        if (!$order) return response()->json(['message' => 'Pedido no encontrado'], 404);

        $order->status = $request->status;
        $order->save();

        return response()->json(['message' => 'Estado actualizado a ' . $request->status]);
    }
}