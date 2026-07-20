<?php

namespace Database\Factories;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('now', '+1 month');
        $endDate = (clone $startDate)->modify('+' . fake()->numberBetween(1, 10) . ' days');

        return [
            'user_id' => \App\Models\User::factory(),
            'property_id' => \App\Models\Property::factory(),
            'payment_id' => \App\Models\Payment::factory(),
            'travelers' => fake()->numberBetween(1, 6),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_price' => fake()->randomFloat(2, 100, 1000),
            'status' => 'confirmed',
        ];
    }
}
