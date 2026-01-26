<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PushToken extends Model
{
    protected $fillable = ['user_id', 'token', 'device_type', 'is_active'];

    // Un token pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope para obtener tokens activos de un usuario
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
