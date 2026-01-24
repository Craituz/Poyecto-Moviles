<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    // Generar y enviar código de 6 dígitos al correo
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Verificar que el usuario existe
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'No encontramos una cuenta con este correo'], 404);
        }

        // Generar código de 6 dígitos
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Guardar o actualizar el código en password_reset_tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'email' => $request->email,
                'token' => Hash::make($code), // Guardamos el hash para seguridad
                'created_at' => Carbon::now()
            ]
        );

        // Enviar notificación con el código
        $user->sendPasswordResetNotification($code);

        return response()->json(['message' => 'Te enviamos un código de verificación a tu correo'], 200);
    }

    // Restablecer la contraseña con código de 6 dígitos
    public function reset(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
            'email' => 'required|email',
            'password' => 'required|string|min:8|max:15|confirmed',
        ]);

        // Buscar el registro de reset
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json(['message' => 'Código inválido o expirado'], 400);
        }

        // Verificar que el código no haya expirado (60 minutos)
        if (Carbon::parse($resetRecord->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'El código ha expirado. Solicita uno nuevo'], 400);
        }

        // Verificar que el código coincida
        if (!Hash::check($request->code, $resetRecord->token)) {
            return response()->json(['message' => 'Código incorrecto'], 400);
        }

        // Actualizar la contraseña
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // Eliminar el código usado
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Contraseña restablecida exitosamente'], 200);
    }
}
