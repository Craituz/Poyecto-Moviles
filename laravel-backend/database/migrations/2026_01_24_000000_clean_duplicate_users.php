<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Encontrar y eliminar usuarios duplicados por nombre
        $duplicateNames = DB::table('users')
            ->select('name', DB::raw('COUNT(*) as total'))
            ->groupBy('name')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('name');

        foreach ($duplicateNames as $name) {
            $users = DB::table('users')
                ->where('name', $name)
                ->orderBy('id')
                ->get();

            // Mantener el primero, eliminar los demás
            $first = true;
            foreach ($users as $user) {
                if ($first) {
                    $first = false;
                    continue;
                }
                
                // Renombrar duplicados en lugar de eliminar
                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['name' => $name . '_' . $user->id]);
            }
        }

        // Limpiar duplicados de teléfono
        $duplicatePhones = DB::table('users')
            ->whereNotNull('phone')
            ->select('phone', DB::raw('COUNT(*) as total'))
            ->groupBy('phone')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('phone');

        foreach ($duplicatePhones as $phone) {
            $users = DB::table('users')
                ->where('phone', $phone)
                ->orderBy('id')
                ->get();

            // Mantener el primero, modificar los demás
            $first = true;
            foreach ($users as $user) {
                if ($first) {
                    $first = false;
                    continue;
                }
                
                // Modificar teléfonos duplicados
                DB::table('users')
                    ->where('id', $user->id)
                    ->update(['phone' => $phone . $user->id]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No hacer nada en rollback
    }
};
