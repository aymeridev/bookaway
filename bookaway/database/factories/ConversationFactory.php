<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Conversation>
 */
class ConversationFactory extends Factory
{
    protected $model = Conversation::class;

    public function definition(): array
    {
        // On récupère une propriété existante de manière aléatoire (ou on en crée une)
        $property = Property::inRandomOrder()->first() ?? Property::factory()->create();

        return [
            // Le voyageur (celui qui pose des questions)
            'user_id' => User::factory(), 
            // Le bailleur (le propriétaire lié au logement choisi)
            'owner_id' => $property->user_id ?? User::factory(), 
            'property_id' => $property->id,
        ];
    }
}