<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // 1. Columna para la Foto de Perfil (Url o path)
            if (!Schema::hasColumn('users', 'image')) {
                $table->string('image')->nullable()->after('password');
            }

            // 2. Columna para el Teléfono
            if (!Schema::hasColumn('users', 'phone')) {
                $table->string('phone')->nullable()->after('image'); // Se crea después de image
            }

            // 3. Columna para la Dirección
            if (!Schema::hasColumn('users', 'address')) {
                $table->text('address')->nullable()->after('phone'); // Se crea después de phone
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Si revertimos la migración, borramos las columnas
            $table->dropColumn(['image', 'phone', 'address']);
        });
    }
};