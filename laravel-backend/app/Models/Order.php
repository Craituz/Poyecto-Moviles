<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['user_id', 'status', 'total', 'address', 'phone', 'latitude', 'longitude', 'delivery_type', 'location_updated_at'];

    // Un pedido pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Un pedido tiene muchos items (pasteles)
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}