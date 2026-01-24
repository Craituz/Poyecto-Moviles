<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(public string $token) {}

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        // Mensaje con código de 6 dígitos
        return (new MailMessage)
            ->subject('Código de verificación - Yeli\'s Cake')
            ->greeting('Hola ' . ($notifiable->name ?? 'Usuario'))
            ->line('Has solicitado restablecer tu contraseña.')
            ->line('')
            ->line('Tu código de verificación es:')
            ->line('**' . $this->token . '**')
            ->line('')
            ->line('Este código es válido por 60 minutos.')
            ->line('Ingresa este código en la app para cambiar tu contraseña.')
            ->line('Si no solicitaste este cambio, ignora este correo.')
            ->salutation('Gracias por confiar en Yeli\'s Cake');
    }
}
