<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Order;

class OrderStatusChangedNotification extends Notification
{
    use Queueable;

    private Order $order;
    private string $oldStatus;
    private string $newStatus;

    public function __construct(Order $order, string $oldStatus, string $newStatus)
    {
        $this->order = $order;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Get the status message based on the new status
     *
     * @return array
     */
    private function getStatusMessage()
    {
        $messages = [
            'pendiente' => [
                'icon' => '⏳',
                'title' => '📋 Pedido Recibido',
                'body' => 'El pedido ha sido confirmado y está en espera de procesamiento',
            ],
            'preparando' => [
                'icon' => '👨‍🍳',
                'title' => '👨‍🍳 Preparando Pedido',
                'body' => 'El pedido está siendo preparado en la cocina',
            ],
            'enviado' => [
                'icon' => '🚗',
                'title' => '🚗 Pedido en Camino',
                'body' => 'El pedido ha salido para su entrega',
            ],
            'entregado' => [
                'icon' => '✅',
                'title' => '✅ Pedido Entregado',
                'body' => 'El pedido ha sido entregado exitosamente',
            ],
            'cancelado' => [
                'icon' => '❌',
                'title' => '❌ Pedido Cancelado',
                'body' => 'El pedido ha sido cancelado',
            ],
        ];

        return $messages[$this->newStatus] ?? [
            'icon' => '🔔',
            'title' => 'Cambio de Estado',
            'body' => "El pedido cambió de {$this->oldStatus} a {$this->newStatus}",
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable)
    {
        $statusInfo = $this->getStatusMessage();

        return [
            'type' => 'order_status_changed',
            'order_id' => $this->order->id,
            'user_name' => $this->order->user->name,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'total' => $this->order->total,
            'title' => "{$statusInfo['icon']} Pedido #{$this->order->id}: {$this->newStatus}",
            'body' => $statusInfo['body'],
            'icon' => $statusInfo['icon'],
        ];
    }
}
