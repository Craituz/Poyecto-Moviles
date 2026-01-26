<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // --- LOGIN ---
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        // Creamos un nuevo token para este dispositivo
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Bienvenido ' . $user->name,
            'access_token' => $token,
            'token_type' => 'Bearer',
            // Load roles para que el frontend sepa si es admin o cliente
            'user' => $user->load('roles') 
        ], 200);
    }

    // --- REGISTRO (ACTUALIZADO) ---
    public function register(Request $request)
    {
        // 1. Validamos nombre, email, password, Y AHORA TELÉFONO Y DIRECCIÓN
        $validatedData = $request->validate([
            'name' => 'required|string|min:3|max:50|unique:users,name',
            'email' => 'required|email|max:30|unique:users,email',
            'password' => 'required|string|min:8|max:15',
            'phone' => 'required|string|size:10|unique:users,phone',
            'address' => 'required|string|max:80',
        ], [
            // Mensajes personalizados en español
            'name.required' => 'El nombre es obligatorio',
            'name.min' => 'El nombre debe tener al menos 3 caracteres',
            'name.max' => 'El nombre no puede superar los 50 caracteres',
            'name.unique' => 'Este nombre de usuario ya está en uso',
            
            'email.required' => 'El correo electrónico es obligatorio',
            'email.email' => 'El correo debe tener un formato válido',
            'email.max' => 'El correo no puede superar los 30 caracteres',
            'email.unique' => 'Este correo electrónico ya está registrado',
            
            'password.required' => 'La contraseña es obligatoria',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres',
            'password.max' => 'La contraseña no puede superar los 15 caracteres',
            
            'phone.required' => 'El teléfono es obligatorio',
            'phone.size' => 'El teléfono debe tener exactamente 10 dígitos',
            'phone.unique' => 'Este número de teléfono ya está registrado',
            
            'address.required' => 'La dirección es obligatoria',
            'address.max' => 'La dirección no puede superar los 80 caracteres',
        ]);

        // 2. Creamos el usuario guardando todos los datos
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'phone' => $validatedData['phone'],       // <--- NUEVO
            'address' => $validatedData['address'],   // <--- NUEVO
        ]);

        // 3. Asignar rol de 'cliente' automáticamente
        $clienteRole = Role::where('name', 'cliente')->first();
        if ($clienteRole) {
            $user->roles()->attach($clienteRole->id);
        }

        // 4. Generar token para Auto-Login inmediato
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('roles')
        ], 201);
    }

    // --- LOGOUT ---
    public function logout(Request $request)
    {
        // Cierra sesión solo en el dispositivo actual
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ], 200);
    }

    // --- CAMBIAR CONTRASEÑA ---
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = auth()->user();

        // Verificar que la contraseña actual es correcta
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'La contraseña actual es incorrecta'
            ], 403);
        }

        // Actualizar contraseña
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Contraseña cambiada correctamente'
        ], 200);
    }

    // --- CAMBIAR EMAIL ---
    public function changeEmail(Request $request)
    {
        $request->validate([
            'new_email' => 'required|email|unique:users,email',
            'password' => 'required|string',
        ]);

        $user = auth()->user();

        // Verificar que la contraseña es correcta
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'La contraseña es incorrecta'
            ], 403);
        }

        // Actualizar email
        $user->email = $request->new_email;
        $user->save();

        return response()->json([
            'message' => 'Correo electrónico cambiado correctamente',
            'user' => $user
        ], 200);
    }
}