<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreImageRequest;
use App\Http\Requests\UpdateImageRequest;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class PropertyImageController extends Controller
{
    public function store(StoreImageRequest $request, Property $property)
    {
        $request->validate([
            'image' => [
                'required',
                'image',
                'mimes:jpeg,png,webp',
                'max:10240', // 10MO
            ]
        ]);





        try {
            $file = $request->file('image');
            $filename = Str::uuid() . '.webp';

            $folderPath = "properties/{$property->id}/images";
            $fullPath = "{$folderPath}/{$filename}";


            $image = Image::read($file);

            Storage::disk('public')->put($fullPath, (string) $image);

            $nextSortOrder = $property->images()->max('sort_order') + 1;


            $propertyImage = $property->images()->create([
                'path' => $fullPath,
                'sort_order' => $nextSortOrder,
            ]);

            return response()->json([
                'message' => 'Image uploadée avec succès !',
                'image' => [
                    'id' => $propertyImage->id,
                    'url' => Storage::url($propertyImage->path),
                    'is_primary' => $propertyImage->is_primary,
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
    public function show(Image $image)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateImageRequest $request, Image $image)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
        //
    }
}
