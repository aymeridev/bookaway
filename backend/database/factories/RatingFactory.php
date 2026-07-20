<?php

namespace Database\Factories;

use App\Models\Rating;
use App\Models\User;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Rating>
 */
class RatingFactory extends Factory
{
    private static array $comments = [
        "Très agréable séjour ! Le logement était très propre et l'accueil chaleureux.",
        "Super emplacement, proche de tout. Je recommande vivement.",
        "Logement conforme à la description. La piscine était géniale !",
        "Très bon rapport qualité-prix. Un peu bruyant le soir mais supportable.",
        "Un endroit magnifique et reposant. Hâte de revenir !",
        "Accueil parfait, propriétaire très sympathique. Le lit était super confortable.",
        "Bon séjour dans l'ensemble. Propreté impeccable.",
        "Superbe vue, logement bien équipé. Merci pour ce séjour !",
        "Une expérience incroyable, les équipements sont haut de gamme et le cadre est enchanteur.",
        "Rien à redire, tout était absolument parfait du début à la fin. Nous reviendrons sans hésiter !",
    ];

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => function () {
                return User::inRandomOrder()->first()?->id ?? User::factory()->create()->id;
            },
            'stars' => fake()->numberBetween(3, 5),
            'comment' => fake()->randomElement(self::$comments),
            'ratable_type' => Property::class,
            'ratable_id' => function () {
                return Property::inRandomOrder()->first()?->id ?? Property::factory()->create()->id;
            },
        ];
    }
}
