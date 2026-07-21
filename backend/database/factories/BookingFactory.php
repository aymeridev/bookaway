<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\Property;
use App\Models\User;
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

        $property = Property::factory()->create();
        $selectedUnit = fake()->randomElement($property->units);

        return [
            'user_id' => User::factory(),
            'property_id' => $property->id,
            'unit_id' => $selectedUnit->id,
            'payment_id' => Payment::factory(),
            'travelers' => fake()->numberBetween(1, $selectedUnit->capacity),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_price' => $selectedUnit->total_price(5),
            'status' => 'confirmed',
        ];
    }
}
