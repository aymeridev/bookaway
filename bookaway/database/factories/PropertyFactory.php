<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Property>
 */
class PropertyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'type' => "camping",
            'capacity' => fake()->numberBetween(2, 8),
            'images' => [fake()->imageUrl(), fake()->imageUrl()],
            'description' => fake()->paragraph(),
            'base_price' => fake()->numberBetween(20, 60),
            'price_per_night' => fake()->numberBetween(15, 50),
            'amenities' => fake()->randomElements(['wifi', 'kitchen', 'parking', 'pool'], 3),
            'latitude' => fake()->randomFloat(8, 41, 51),
            'longitude' => fake()->randomFloat(8, 5, 9),
        ];
    }
}
