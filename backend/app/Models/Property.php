<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Attributes\Scope;
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
        'description',
        'amenities',
        'latitude',
        'longitude'
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function units()
    {
        return $this->hasMany(Unit::class);
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



    protected function scopePublished(Builder $query): Builder
    {
        return $query->where('published', true);
    }
}
