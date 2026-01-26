<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Obtener todas las notificaciones del usuario autenticado
     */
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->data['type'] ?? 'general',
                    'title' => $notification->data['title'] ?? 'Notificación',
                    'body' => $notification->data['body'] ?? '',
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at->toISOString(),
                ];
            });

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $request->user()->unreadNotifications()->count(),
        ]);
    }

    /**
     * Marcar una notificación como leída
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->first();

        if (!$notification) {
            return response()->json(['message' => 'Notificación no encontrada'], 404);
        }

        $notification->markAsRead();

        return response()->json(['message' => 'Notificación marcada como leída']);
    }

    /**
     * Marcar todas las notificaciones como leídas
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'Todas las notificaciones marcadas como leídas']);
    }

    /**
     * Eliminar una notificación
     */
    public function destroy(Request $request, $id)
    {
        $notification = $request->user()
            ->notifications()
            ->where('id', $id)
            ->first();

        if (!$notification) {
            return response()->json(['message' => 'Notificación no encontrada'], 404);
        }

        $notification->delete();

        return response()->json(['message' => 'Notificación eliminada']);
    }

    /**
     * Eliminar todas las notificaciones
     */
    public function destroyAll(Request $request)
    {
        $request->user()->notifications()->delete();

        return response()->json(['message' => 'Todas las notificaciones eliminadas']);
    }
}
