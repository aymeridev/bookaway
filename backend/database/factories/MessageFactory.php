<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Message>
 */
class MessageFactory extends Factory
{
    protected $model = Message::class;

    public function definition(): array
    {
        return [
            'conversation_id' => Conversation::factory(),
            // L'expéditeur sera écrasé dynamiquement ou généré par défaut
            'sender_id' => User::factory(), 
            'content' => fake()->paragraph(fake()->numberBetween(1, 3)),
            'is_read' => fake()->boolean(80), // 80% de chances que le message soit déjà lu
            'created_at' => fake()->dateTimeBetween('-1 week', 'now'),
        ];
    }
}