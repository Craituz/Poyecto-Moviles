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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'required|string|min:10|max:15', // <--- NUEVO
            'address' => 'required|string|max:500',    // <--- NUEVO
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
}