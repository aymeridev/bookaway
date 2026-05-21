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
                    'url' => Storage::url($propertyImage->path),
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
    public function destroy(PropertyImage $image)
    {
        //
    }
}
