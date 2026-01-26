<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Role;
use App\Notifications\ResetPasswordNotification;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',   // Mantenemos tus campos personalizados
        'address', // Mantenemos tus campos personalizados
        'image',
        'latitude',  // Nueva: Latitud de ubicación
        'longitude', // Nueva: Longitud de ubicación
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- RELACIONES ---

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Un usuario tiene múltiples tokens push para notificaciones
     */
    public function pushTokens()
    {
        return $this->hasMany(PushToken::class);
    }

    // --- NUEVA FUNCIÓN AUXILIAR (La que arregla el error) ---
    // Permite usar $user->hasRole('admin') en los controladores
    public function hasRole($roleName)
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    /**
     * Enviar notificación personalizada de restablecimiento de contraseña.
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}