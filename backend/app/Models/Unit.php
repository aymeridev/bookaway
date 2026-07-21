<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Unit extends Model
{
    /** @use HasFactory<\Database\Factories\UnitFactory> */
    use HasFactory;

    protected function casts()
    {
        return [
            'amenities' => 'array',
        ];
    }

    protected $fillable = [
        'title',
        'description',
        'capacity',
        'amenities',
        'base_fee',
        'price_per_night',
        'property_id',
    ];

    public function total_price(int $number_of_nights)
    {
        return $this->price_per_night * $number_of_nights + $this->base_fee;
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
