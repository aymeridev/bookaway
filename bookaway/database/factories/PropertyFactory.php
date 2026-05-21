<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

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
        $type = fake()->randomElement(['camping', 'hotel']);

        // Récupérer les images d'exemple depuis le storage public
        $images = [];
        try {
            $files = Storage::disk('public')->files('properties/examples');
            $matchingFiles = array_filter($files, function ($file) use ($type) {
                return str_starts_with(basename($file), $type);
            });

            if (!empty($matchingFiles)) {
                $shuffled = fake()->shuffleArray($matchingFiles);
                $selected = array_slice($shuffled, 0, fake()->numberBetween(2, min(4, count($shuffled))));

                foreach ($selected as $file) {
                    $images[] = Storage::disk('public')->url($file);
                }
            }
        } catch (\Exception $e) {
            // Ignorer et utiliser le fallback ci-dessous si le storage n'est pas accessible
        }

        // Fallback si aucune image n'a pu être chargée dynamiquement
        if (empty($images)) {
            if ($type === 'camping') {
                $images = [
                    '/storage/properties/examples/camping_0.jpg',
                    '/storage/properties/examples/camping_1.jpg',
                    '/storage/properties/examples/camping_2.jpg',
                ];
            } else {
                $images = [
                    '/storage/properties/examples/hotel_0.jpg',
                    '/storage/properties/examples/hotel_1.jpg',
                    '/storage/properties/examples/hotel_2.jpg',
                ];
            }
        }

        return [
            'title' => fake()->sentence(4),
            'type' => $type,
            'capacity' => fake()->numberBetween(2, 8),
            'images' => $images,
            'description' => fake()->paragraph(),
            'base_price' => fake()->numberBetween(20, 60),
            'price_per_night' => fake()->numberBetween(15, 50),
            'amenities' => fake()->randomElements(['wifi', 'kitchen', 'parking', 'pool'], 3),
            'latitude' => fake()->randomFloat(8, 41, 51),
            'longitude' => fake()->randomFloat(8, 5, 9),
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure()
    {
        return $this->afterCreating(function (Property $property) {
            // Associer un utilisateur existant ou en créer un nouveau pour posséder les images
            $user = \App\Models\User::first() ?: \App\Models\User::factory()->create();

            if (is_array($property->images)) {
                foreach ($property->images as $index => $imageUrl) {
                    // Extraire le chemin relatif pour la table `images` (ex: "properties/examples/camping_0.jpg")
                    $relativePath = $imageUrl;
                    if (str_contains($imageUrl, '/storage/')) {
                        $relativePath = explode('/storage/', $imageUrl)[1];
                    }

                    $property->images()->create([
                        'path' => $relativePath,
                        'sort_order' => $index + 1,
                        'user_id' => $user->id,
                    ]);
                }
            }
        });
    }
}
