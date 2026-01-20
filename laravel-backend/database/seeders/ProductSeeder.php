<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Chocoflan',
                'description' => 'Chocoflan cremoso con caramelo.',
                'price' => 30.00,
                'image' => null, // Dejamos null para probar tu imagen por defecto
            ],
            [
                'name' => 'Pie de manzana',
                'description' => 'Pie de manzana dulce y crujiente.',
                'price' => 32.00,
                'image' => null,
            ],
            [
                'name' => 'Cupcake de Vainilla',
                'description' => 'Suave y esponjoso.',
                'price' => 15.00,
                'image' => null,
            ],
            [
                'name' => 'Pastel de fresa',
                'description' => 'Dulce y cremoso con fresas naturales.',
                'price' => 15.00,
                'image' => null,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}