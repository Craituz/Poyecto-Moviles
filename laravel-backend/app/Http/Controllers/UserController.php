<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage; // <--- Importante para borrar fotos viejas

class UserController extends Controller
{
    // 1. LISTAR USUARIOS (Solo para Admin)
    public function index()
    {
        // Verificamos que quien pide la lista sea admin
        if (!auth()->user()->hasRole('admin')) {
            return response()->json(['message' => 'No autorizado'], 403);
        }
        return response()->json(User::with('roles')->get());
    }

    // 2. ACTUALIZAR USUARIO (Perfil completo: Foto, Dirección, Teléfono, Roles, etc.)
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // SEGURIDAD: Solo puedes editarte a ti mismo O ser admin
        $currentUser = auth()->user();
        if ($currentUser->id != $id && !$currentUser->hasRole('admin')) {
            return response()->json(['message' => 'No tienes permiso para editar este usuario'], 403);
        }

        // Validación (Agregamos phone, address e image)
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,'.$id,
            'phone' => 'nullable|string',       // <--- NUEVO
            'address' => 'nullable|string',     // <--- NUEVO
            'image' => 'nullable|image|max:4096', // <--- NUEVO (Máx 4MB)
            'role_name' => 'nullable|string', 
            'password' => 'nullable|string|min:8'
        ]);

        // --- LÓGICA DE SEGURIDAD "ÚLTIMO ADMIN" (Si intentan cambiar rol) ---
        if ($request->has('role_name')) {
            $isCurrentlyAdmin = $user->hasRole('admin');
            $isDemoting = $request->role_name !== 'admin';

            if ($isCurrentlyAdmin && $isDemoting) {
                $adminCount = User::whereHas('roles', function ($q) { $q->where('name', 'admin'); })->count();
                if ($adminCount <= 1) {
                    return response()->json([
                        'message' => 'No es posible realizar esta acción. El sistema requiere mantener al menos un Administrador activo.'
                    ], 403);
                }
            }
        }
        // ---------------------------------------------

        // --- MANEJO DE IMAGEN DE PERFIL ---
        if ($request->hasFile('image')) {
            // 1. Si el usuario ya tenía foto, la borramos para no ocupar espacio
            if ($user->image) {
                // Convertimos la URL completa a path relativo para poder borrarla
                $oldPath = str_replace(asset('storage/'), '', $user->image);
                Storage::disk('public')->delete($oldPath);
            }
            
            // 2. Guardamos la nueva
            $path = $request->file('image')->store('users', 'public');
            $user->image = asset('storage/' . $path);
        }

        // Actualizar datos básicos
        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;       // <--- NUEVO
        $user->address = $request->address;   // <--- NUEVO
        
        // Si envió contraseña nueva, la actualizamos
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        
        $user->save();

        // Actualizar Rol (SOLO SI ES ADMIN QUIEN LO PIDE)
        if ($currentUser->hasRole('admin') && $request->has('role_name')) {
            $role = Role::where('name', $request->role_name)->first();
            if ($role) {
                $user->roles()->sync([$role->id]);
            }
        }

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => $user->load('roles') // Devolvemos el usuario actualizado para que la App refresque los datos
        ]);
    }

    // 3. ELIMINAR USUARIO (Cliente borrándose a sí mismo O Admin borrando a otros)
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $currentUser = auth()->user();

        // SEGURIDAD: Solo puedes borrarte a ti mismo O ser admin
        if ($currentUser->id != $id && !$currentUser->hasRole('admin')) {
            return response()->json(['message' => 'No tienes permiso'], 403);
        }

        // SEGURIDAD "ÚLTIMO ADMIN": ¿Es el usuario a borrar un admin?
        if ($user->hasRole('admin')) {
            $adminCount = User::whereHas('roles', function ($q) { $q->where('name', 'admin'); })->count();
            
            // Si es el último admin, PROHIBIDO borrarlo (aunque sea él mismo)
            if ($adminCount <= 1) {
                return response()->json([
                    'message' => 'Acción denegada: No se puede eliminar al único Administrador existente en la plataforma.'
                ], 403);
            }
        }
        
        // Si tiene foto, borrarla antes de borrar al usuario
        if ($user->image) {
            $oldPath = str_replace(asset('storage/'), '', $user->image);
            Storage::disk('public')->delete($oldPath);
        }

        $user->delete();

        return response()->json(['message' => 'Cuenta eliminada correctamente']);
    }
}