<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Property::query();

        if ($request->filled('travelers')) {
            $query->where('capacity', '>=', $request->travelers);
        }

        if ($request->filled(['from', 'to'])) {
            $query->whereDoesntHave('bookings', function ($q) use ($request) {
                $q->where(function ($inner) use ($request) {
                    $inner->where('start_date', '<', $request->to)
                        ->where('end_date', '>', $request->from);
                });
            });
        }

        // Filtrer par localisation (Rayon de 50km autour des coordonnées)
        if ($request->filled(['lat', 'lon'])) {
            $lat = (float) $request->lat;
            $lon = (float) $request->lon;

            $haversine = "(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude))))";

            $query->selectRaw("*, $haversine AS distance", [$lat, $lon, $lat])
                ->orderBy('distance');
        }

        $query->with(['images' => function ($q) {
            $q->orderBy('sort_order', 'asc');
        }]);

        return response()->json($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'type' => 'required|string|in:camping,hotel',
            'capacity' => 'required|integer|min:1',
            'images' => 'nullable|array',
            'description' => 'nullable|string',
            'base_price' => 'nullable|numeric',
            'price_per_night' => 'required|numeric|min:0',
            'amenities' => 'nullable|array',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $validated['user_id'] = $request->user()->id;

        $property = Property::create($validated);

        return response()->json($property, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $property = Property::with([
            'images' => function ($query) {
                $query->orderBy('sort_order', 'asc');
            },
            'bookings',
            'user',
            'ratings.author:id,name'
        ])->findOrFail($id);

        $property->ratings_avg = $property->ratings->isEmpty()
            ? null
            : round($property->ratings->avg('stars'), 1);

        return response()->json($property);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $property = Property::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:100',
            'type' => 'sometimes|string|in:camping,hotel',
            'capacity' => 'sometimes|integer|min:1',
            'images' => 'nullable|array',
            'description' => 'nullable|string',
            'base_price' => 'nullable|numeric',
            'price_per_night' => 'sometimes|numeric|min:0',
            'amenities' => 'nullable|array',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $property->update($validated);

        return response()->json($property);
    }
    public function userProperties(Request $request)
    {
        $properties = $request->user()->properties()
            ->with(['images' => function ($q) {
                $q->orderBy('sort_order', 'asc');
            }])
            ->get();
        return response()->json($properties);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $property = Property::findOrFail($id);
        $property->delete();

        return response()->json(null, 204);
    }
}
