<?php

namespace Database\Factories;

use App\Models\PropertyImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PropertyImage>
 */
class PropertyImageFactory extends Factory
{
    protected $model = PropertyImage::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'path' => 'properties/placeholder.webp',
            'sort_order' => 1,
            'user_id' => \App\Models\User::factory(),
            'property_id' => \App\Models\Property::factory(),
        ];
    }
}
