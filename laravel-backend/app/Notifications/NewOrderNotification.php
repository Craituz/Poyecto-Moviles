<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Order;

class NewOrderNotification extends Notification
{
    use Queueable;

    private Order $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
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
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable)
    {
        return [
            'type' => 'new_order',
            'order_id' => $this->order->id,
            'user_name' => $this->order->user->name,
            'user_email' => $this->order->user->email,
            'total' => $this->order->total,
            'items_count' => $this->order->items->count(),
            'delivery_type' => $this->order->delivery_type,
            'address' => $this->order->address,
            'title' => "📋 Nuevo Pedido #{$this->order->id}",
            'body' => "Nuevo pedido de {$this->order->user->name} - Total: \${$this->order->total}",
            'icon' => '📋',
        ];
    }
}
