<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
