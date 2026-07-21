<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Property;
use App\Models\Rating;
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

        $testUser = User::factory()->create([
            'name' => 'Jean Dupont',
            'email' => 'jean.dupont@bookaway.com',
            'password' => bcrypt('password'),
            'balance' => 100000,
        ]);

        $this->call([
            PropertySeeder::class,
        ]);


        $property = Property::first();

        if ($property) {
            Booking::factory(3)->create([
                'user_id' => $testUser->id,
                'property_id' => $property->id,
            ]);
        }

        Booking::factory(10)->create();

        // création avis pour les logements
        $properties = Property::all();
        $users = User::all();

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
                    Rating::factory()->create([
                        'user_id' => $author->id,
                        'ratable_type' => Property::class,
                        'ratable_id' => $prop->id,
                    ]);
                }
            }
        }
    }
}
