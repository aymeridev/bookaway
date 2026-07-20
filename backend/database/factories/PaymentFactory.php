<?php

namespace Database\Factories;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(), // Crée un user auto
            'card_holder_name' => fake()->name(),
            'card_number' => fake()->creditCardNumber(),
            'expiration_date' => fake()->date('m/y', '+2 years'),
            'cvv' => fake()->numerify('###'),
            'amount' => fake()->randomFloat(2, 50, 500),
            'status' => 'success',
        ];
    }
}
