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
    }
}
