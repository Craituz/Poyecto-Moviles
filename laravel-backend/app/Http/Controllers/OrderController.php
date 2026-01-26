<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Notifications\NewOrderNotification;
use App\Notifications\OrderStatusChangedNotification;
use App\Services\ExpoNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

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
            'delivery_type' => 'required|in:domicilio,retiro',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
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
                    'delivery_type' => $request->delivery_type,
                    'latitude' => $request->latitude,
                    'longitude' => $request->longitude,
                    'location_updated_at' => now(),
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

            // 📢 NOTIFICACIÓN AL ADMINISTRADOR
            $this->notifyAdminNewOrder($order);

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

    // 5. ACTUALIZAR UBICACIÓN DE PEDIDO (Cliente - Solo si es domicilio)
    public function updateOrderLocation(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Pedido no encontrado'], 404);
        }

        // Seguridad: Solo el dueño del pedido
        if ($order->user_id != auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Validación: Solo si es entrega a domicilio
        if ($order->delivery_type !== 'domicilio') {
            return response()->json(['message' => 'Solo pedidos a domicilio pueden actualizar ubicación'], 400);
        }

        // Validación: Solo si el pedido está en pendiente o preparando
        if (!in_array($order->status, ['pendiente', 'preparando'])) {
            return response()->json(['message' => 'No puedes actualizar la ubicación en este estado del pedido'], 400);
        }

        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $order->latitude = $request->latitude;
        $order->longitude = $request->longitude;
        $order->location_updated_at = now();
        $order->save();

        return response()->json([
            'message' => 'Ubicación de entrega actualizada correctamente',
            'order' => $order
        ]);
    }

    // 6. ACTUALIZAR ESTADO (Solo Admin)
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

        $oldStatus = $order->status;
        $order->status = $request->status;
        $order->save();

        // 📢 NOTIFICACIÓN AL CLIENTE (Cambio de estado)
        $this->notifyClientOrderStatusChanged($order, $oldStatus, $request->status);

        return response()->json(['message' => 'Estado actualizado a ' . $request->status]);
    }

    // --- MÉTODOS PRIVADOS PARA NOTIFICACIONES ---

    /**
     * Notificar al administrador sobre un nuevo pedido
     * 
     * @param Order $order
     */
    private function notifyAdminNewOrder(Order $order)
    {
        try {
            // 1. Guardar notificación en la base de datos
            $admin = User::where('email', 'admin@yeliscake.com')->first();
            
            if ($admin) {
                // Enviar notificación en base de datos
                $admin->notify(new NewOrderNotification($order));

                // 2. Enviar push notification a través de Expo
                $expoService = new ExpoNotificationService();
                $tokens = $admin->pushTokens()->active()->pluck('token')->toArray();

                if (!empty($tokens)) {
                    $expoService->sendNotification(
                        $tokens,
                        "📋 Nuevo Pedido #{$order->id}",
                        "Nuevo pedido de {$order->user->name} - Total: \${$order->total}",
                        [
                            'type' => 'new_order',
                            'order_id' => (string) $order->id,
                            'user_name' => $order->user->name,
                        ]
                    );
                }
            }
        } catch (\Exception $e) {
            \Log::error('Error al notificar nuevo pedido', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Notificar al cliente sobre cambio de estado del pedido
     * 
     * @param Order $order
     * @param string $oldStatus
     * @param string $newStatus
     */
    private function notifyClientOrderStatusChanged(Order $order, string $oldStatus, string $newStatus)
    {
        try {
            // 1. Guardar notificación en la base de datos
            $order->user->notify(new OrderStatusChangedNotification($order, $oldStatus, $newStatus));

            // 2. Enviar push notification a través de Expo
            $expoService = new ExpoNotificationService();
            $tokens = $order->user->pushTokens()->active()->pluck('token')->toArray();

            if (!empty($tokens)) {
                // Mensaje personalizado según el estado
                $messages = [
                    'pendiente' => '📋 Tu pedido ha sido confirmado',
                    'preparando' => '👨‍🍳 Tu pedido está siendo preparado',
                    'enviado' => '🚗 Tu pedido está en camino',
                    'entregado' => '✅ Tu pedido ha sido entregado',
                    'cancelado' => '❌ Tu pedido ha sido cancelado',
                ];

                $expoService->sendNotification(
                    $tokens,
                    "Pedido #{$order->id} - {$newStatus}",
                    $messages[$newStatus] ?? "Tu pedido cambió a {$newStatus}",
                    [
                        'type' => 'order_status_changed',
                        'order_id' => (string) $order->id,
                        'status' => $newStatus,
                    ]
                );
            }
        } catch (\Exception $e) {
            \Log::error('Error al notificar cambio de estado', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}