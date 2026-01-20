<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Crear los Roles del sistema
        $adminRole = Role::create([
            'name' => 'admin', 
            'description' => 'Administrador total'
        ]);
        
        $clienteRole = Role::create([
            'name' => 'cliente', 
            'description' => 'Cliente de la App'
        ]);

        // 2. Crear el Usuario Admin específico para Yeli's Cake
        $admin = User::create([
            'name' => 'Administrador',
            'email' => 'admin@yeliscake.com',
            'password' => Hash::make('admin123'),
        ]);

        // 3. Asignar el rol de admin al usuario creado
        $admin->roles()->attach($adminRole->id);
        $this->call(ProductSeeder::class);
    }
}