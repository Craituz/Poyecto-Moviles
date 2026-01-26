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
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('latitude', 10, 8)->nullable()->comment('Latitud de entrega');
            $table->decimal('longitude', 11, 8)->nullable()->comment('Longitud de entrega');
            $table->enum('delivery_type', ['domicilio', 'retiro'])->default('domicilio')->comment('Tipo de entrega');
            $table->timestamp('location_updated_at')->nullable()->comment('Última actualización de ubicación');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude', 'delivery_type', 'location_updated_at']);
        });
    }
};
