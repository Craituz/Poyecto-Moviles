<?php

namespace App\Http\Controllers;

use App\Models\PushToken;
use Illuminate\Http\Request;

class PushTokenController extends Controller
{
    /**
     * Registrar o actualizar el token push del usuario actual
     * 
     * POST /api/push-tokens/register
     */
    public function register(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'device_type' => 'nullable|string|in:mobile,web,desktop',
        ]);

        $user = auth()->user();

        // Buscar si el token ya existe para este usuario
        $pushToken = PushToken::where('user_id', $user->id)
            ->where('token', $request->token)
            ->first();

        if ($pushToken) {
            // Actualizar si ya existe
            $pushToken->update([
                'is_active' => true,
                'device_type' => $request->device_type ?? 'mobile',
            ]);
            $message = 'Token actualizado correctamente';
        } else {
            // Crear nuevo token
            $pushToken = PushToken::create([
                'user_id' => $user->id,
                'token' => $request->token,
                'device_type' => $request->device_type ?? 'mobile',
                'is_active' => true,
            ]);
            $message = 'Token registrado correctamente';
        }

        return response()->json([
            'message' => $message,
            'token_id' => $pushToken->id,
        ]);
    }

    /**
     * Desactivar un token push
     * 
     * DELETE /api/push-tokens/{id}
     */
    public function destroy($id)
    {
        $pushToken = PushToken::findOrFail($id);

        // Verificar que el token pertenece al usuario autenticado
        if ($pushToken->user_id !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $pushToken->update(['is_active' => false]);

        return response()->json(['message' => 'Token desactivado correctamente']);
    }

    /**
     * Listar los tokens push del usuario actual
     * 
     * GET /api/push-tokens
     */
    public function index()
    {
        $tokens = auth()->user()->pushTokens()->get();

        return response()->json($tokens);
    }
}
