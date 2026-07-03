<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class Property extends Model
{
    use HasFactory;

    protected function casts()
    {
        return [
            'amenities' => 'array'
        ];
    }

    protected $fillable = [
        'title',
        'user_id',
        'type',
        'capacity',
        'description',
        'base_price',
        'price_per_night',
        'amenities',
        'latitude',
        'longitude'
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class, 'property_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ratings()
    {
        return $this->morphMany(Rating::class, 'ratable');
    }

    /**
     * Obtenir l'adresse géocodée via l'API Nominatim de OpenStreetMap.
     */
    public function getAddressAttribute()
    {
        if (!$this->latitude || !$this->longitude) {
            return 'Adresse non spécifiée (coordonnées manquantes)';
        }

        $cacheKey = "property_address_{$this->latitude}_{$this->longitude}";

        return Cache::remember($cacheKey, now()->addDays(7), function () {
            try {
                $response = Http::withHeaders([
                    'User-Agent' => 'Bookaway-App/1.0',
                ])->timeout(3)->get('https://nominatim.openstreetmap.org/reverse', [
                    'format' => 'json',
                    'lat' => $this->latitude,
                    'lon' => $this->longitude,
                    'email' => 'ulco@ulco.fr',
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    return $data['display_name'] ?? 'Adresse introuvable';
                }
            } catch (\Exception $e) {
                Log::error("Nominatim geocoding error: " . $e->getMessage());
            }

            return 'Adresse introuvable';
        });
    }
}

