<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PropertySeeder::class,
        ]);

        $testUser = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $property = \App\Models\Property::first();

        if ($property) {
            \App\Models\Booking::factory(3)->create([
                'user_id' => $testUser->id,
                'property_id' => $property->id,
            ]);
        }

        \App\Models\Booking::factory(10)->create();

        // création avis pour les logements
        $properties = \App\Models\Property::all();
        $users = \App\Models\User::all();

        if ($properties->count() > 0 && $users->count() > 0) {
            foreach ($properties as $prop) {
                $potentialAuthors = $users->filter(function ($u) use ($prop) {
                    return $u->id !== $prop->user_id;
                });

                if ($potentialAuthors->isEmpty()) {
                    $potentialAuthors = $users;
                }

                $numRatings = min(rand(1, 4), $potentialAuthors->count());
                $selectedAuthors = $potentialAuthors->random($numRatings);

                foreach ($selectedAuthors as $author) {
                    \App\Models\Rating::factory()->create([
                        'user_id' => $author->id,
                        'ratable_type' => \App\Models\Property::class,
                        'ratable_id' => $prop->id,
                    ]);
                }
            }
        }
    }
}
