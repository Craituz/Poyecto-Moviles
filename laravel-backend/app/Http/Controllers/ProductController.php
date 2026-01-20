<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // <--- IMPORTANTE: Necesario para borrar archivos

class ProductController extends Controller
{
    // 1. OBTENER TODOS LOS PRODUCTOS (Para el Catálogo)
    public function index()
    {
        // Ordenamos por ID descendente para ver los nuevos primero
        return response()->json(Product::orderBy('id', 'desc')->get());
    }

    // 2. GUARDAR NUEVO PRODUCTO (Para el Admin)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096', 
        ]);

        $imageUrl = null;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = asset('storage/' . $path);
        }

        $product = Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'image' => $imageUrl, 
        ]);

        return response()->json([
            'message' => 'Producto creado exitosamente',
            'product' => $product
        ], 201);
    }

    // 3. ACTUALIZAR PRODUCTO (Editar)
    public function update(Request $request, $id)
    {
        // Buscamos el producto
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        // Validamos (todo es nullable por si solo quiere cambiar el precio y no la foto)
        $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096',
        ]);

        // Si suben una IMAGEN NUEVA
        if ($request->hasFile('image')) {
            
            // A. Borrar la imagen vieja para no llenar el servidor (Opcional pero recomendado)
            if ($product->image) {
                // Extraemos el path relativo (ej: products/foto.jpg) de la URL completa
                $oldPath = str_replace(asset('storage/'), '', $product->image);
                Storage::disk('public')->delete($oldPath);
            }

            // B. Subir la nueva
            $path = $request->file('image')->store('products', 'public');
            $product->image = asset('storage/' . $path);
        }

        // Actualizamos los textos
        $product->name = $request->name;
        $product->price = $request->price;
        $product->description = $request->description;
        
        $product->save();

        return response()->json([
            'message' => 'Producto actualizado correctamente',
            'product' => $product
        ], 200);
    }

    // 4. ELIMINAR PRODUCTO
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Producto no encontrado'], 404);
        }

        // Borrar la imagen del servidor si existe
        if ($product->image) {
            $oldPath = str_replace(asset('storage/'), '', $product->image);
            Storage::disk('public')->delete($oldPath);
        }

        // Borrar de la base de datos
        $product->delete();

        return response()->json([
            'message' => 'Producto eliminado correctamente'
        ], 200);
    }
}