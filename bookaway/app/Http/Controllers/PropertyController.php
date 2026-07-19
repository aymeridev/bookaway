<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Property::query();

        if ($request->user()) {
            $query->where('user_id', '!=', $request->user()->id);
        }

        if ($request->filled('travelers') && $request->travelers > 0) {
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

        if ($request->filled(['lat', 'lon'])) {
            $latitude = (float) $request->lat;
            $longitude = (float) $request->lon;

            $haversine = "(6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lon) - radians(?)) + sin(radians(?)) * sin(radians(lat))))";

            $query->selectRaw("*, {$haversine} as distance", [$latitude, $longitude, $latitude])
                ->whereRaw("{$haversine} <= ?", [$latitude, $longitude, $latitude, 200])
                ->orderBy('distance');
        }

        $query->with([
            'images' => function ($q) {
                $q->orderBy('sort_order', 'asc');
            },
            'ratings',
            'user'
        ]);

        $properties = $query->get();

        foreach ($properties as $property) {
            $property->ratings_avg = $property->ratings->isEmpty()
                ? null
                : round($property->ratings->avg('stars'), 1);
        }

        return response()->json($properties);
    }

    // TODO: renvoyer les logements publiés uniquement
    public function count()
    {
        return response()->json([
            "properties" => Property::count()
        ]);
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
            ->with([
                'images' => function ($q) {
                    $q->orderBy('sort_order', 'asc');
                },
                'ratings'
            ])
            ->get();

        foreach ($properties as $property) {
            $property->ratings_avg = $property->ratings->isEmpty()
                ? null
                : round($property->ratings->avg('stars'), 1);
        }

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

    /**
     * Rechercher des coordonnées géographiques par terme (proxy Nominatim).
     */
    public function geocode(Request $request)
    {
        $query = $request->query('q');

        if (!$query) {
            return response()->json([]);
        }

        $cacheKey = 'geocode_search_' . md5(strtolower(trim($query)));

        $data = Cache::remember($cacheKey, now()->addDays(1), function () use ($query) {
            try {
                $response = Http::withHeaders([
                    'User-Agent' => 'Bookaway-App/1.0',
                ])->timeout(3)->get('https://nominatim.openstreetmap.org/search', [
                    'format' => 'json',
                    'q' => $query,
                    'email' => 'ulco@ulco.fr',
                ]);

                if ($response->successful()) {
                    return $response->json();
                }
            } catch (\Exception $e) {
                Log::error("Geocoding API error: " . $e->getMessage());
            }

            return [];
        });

        return response()->json($data);
    }
}
