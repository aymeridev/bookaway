<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreImageRequest;
use App\Http\Requests\UpdateImageRequest;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class PropertyImageController extends Controller
{
    public function store(StoreImageRequest $request, Property $property)
    {
        try {
            $file = $request->file('image');
            $filename = Str::uuid() . '.webp';

            $folderPath = "properties/{$property->id}/images";
            $fullPath = "{$folderPath}/{$filename}";


            $image = file_get_contents($file);

            Storage::disk('public')->put($fullPath, $image);

            $nextSortOrder = $property->images()->max('sort_order') + 1;

            $userId = Auth::id();

            $propertyImage = $property->images()->create([
                'path' => $fullPath,
                'sort_order' => $nextSortOrder,
                'user_id' => $userId,
            ]);

            return response()->json([
                'message' => 'Image uploadée avec succès !',
                'image' => [
                    'id' => $propertyImage->id,
                    'url' => $propertyImage->url,
                    'sort_order' => $propertyImage->sort_order,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'erreur lors du traitement de l\'image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(PropertyImage $image)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateImageRequest $request, PropertyImage $image)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property, PropertyImage $image)
    {
        try {
            // S'assurer que l'image appartient bien à la propriété
            if ($image->property_id !== $property->id) {
                return response()->json([
                    'message' => "L'image n'appartient pas à cette propriété."
                ], 404);
            }

            // S'assurer que l'utilisateur connecté est le propriétaire de la propriété (ou de l'image)
            if ($property->user_id !== Auth::id()) {
                return response()->json([
                    'message' => 'Non autorisé.'
                ], 403);
            }

            // Supprimer le fichier physique du disque
            if (Storage::disk('public')->exists($image->path)) {
                Storage::disk('public')->delete($image->path);
            }

            // Supprimer l'enregistrement en BDD
            $image->delete();

            return response()->json([
                'message' => 'Image supprimée avec succès !'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Erreur lors de la suppression de l'image.",
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
