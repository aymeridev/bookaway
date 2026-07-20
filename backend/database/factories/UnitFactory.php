<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Unit>
 */
class UnitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => 'Chambre',
            'capacity' => fake()->numberBetween(1, 6),
            'base_fee' => fake()->numberBetween(1, 6),
            'price_per_night' => fake()->numberBetween(1, 6),
            'description' => fake()->paragraph(),
            'amenities' => [],
            'property_id' => Property::factory(),
        ];
    }

    public function forCamping(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'title' => 'Emplacement',
                'description' => 'Bungalow',
                'base_fee' => fake()->numberBetween(10, 20),
                'price_per_night' => fake()->numberBetween(15, 30),
                'amenities' => fake()->randomElements(['paid-wifi', "public-toilets", 'parking', 'pool', 'electricity'], 3)
            ];
        });
    }

    public function forHotel(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'title' => 'Chambre n°67',
                'description' => 'Situé au 3e étage',
                'base_fee' => fake()->numberBetween(10, 20),
                'price_per_night' => fake()->numberBetween(15, 30),
                'amenities' => fake()->randomElements(['wifi', 'microwave', 'climatisation', 'television'], 3)
            ];
        });
    }
}
