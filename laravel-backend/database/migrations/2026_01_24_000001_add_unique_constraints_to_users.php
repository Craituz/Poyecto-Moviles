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
            // Agregar índices únicos para nombre y teléfono
            $table->unique('name');
            $table->unique('phone');
            
            // Cambiar phone y address de nullable a required
            $table->string('phone', 15)->nullable(false)->change();
            $table->text('address')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Remover índices únicos
            $table->dropUnique(['name']);
            $table->dropUnique(['phone']);
            
            // Volver a hacer nullable
            $table->string('phone', 15)->nullable()->change();
            $table->text('address')->nullable()->change();
        });
    }
};
