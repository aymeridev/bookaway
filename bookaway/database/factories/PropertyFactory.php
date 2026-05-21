<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
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

        return [
            'title' => fake()->sentence(4),
            'type' => $type,
            'capacity' => fake()->numberBetween(2, 8),
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
            $user = User::first() ?: User::factory()->create();
            $type = $property->type;
            $images = [];
            try {
                /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
                $disk = Storage::disk('public');
                $files = $disk->files('properties/examples');
                $matchingFiles = array_filter($files, function ($file) use ($type) {
                    return str_starts_with(basename($file), $type);
                });
                if (!empty($matchingFiles)) {
                    $shuffled = fake()->shuffleArray($matchingFiles);
                    $selected = array_slice($shuffled, 0, fake()->numberBetween(2, min(4, count($shuffled))));
                    foreach ($selected as $file) {
                        $images[] = $file;
                    }
                }
            } catch (\Exception $e) {
            }
            if (empty($images)) {
                if ($type === 'camping') {
                    $images = [
                        'properties/examples/camping_0.jpg',
                        'properties/examples/camping_1.jpg',
                        'properties/examples/camping_2.jpg',
                    ];
                } else {
                    $images = [
                        'properties/examples/hotel_0.jpg',
                        'properties/examples/hotel_1.jpg',
                        'properties/examples/hotel_2.jpg',
                    ];
                }
            }
            foreach ($images as $index => $path) {
                $property->images()->create([
                    'path' => $path,
                    'sort_order' => $index + 1,
                    'user_id' => $user->id,
                ]);
            }
        });
    }
}
