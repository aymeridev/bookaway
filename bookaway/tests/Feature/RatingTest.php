<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Property;
use App\Models\Rating;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RatingTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_create_rating(): void
    {
        $property = Property::factory()->create([
            'user_id' => User::factory()->create()->id,
            'amenities' => [],
        ]);

        $response = $this->postJson('/api/ratings', [
            'ratable_type' => 'property',
            'ratable_id' => $property->id,
            'stars' => 5,
            'comment' => 'Excellent !',
        ]);

        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_create_rating_for_property(): void
    {
        $user = User::factory()->create();
        $owner = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $owner->id,
            'amenities' => [],
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/ratings', [
            'ratable_type' => 'property',
            'ratable_id' => $property->id,
            'stars' => 4,
            'comment' => 'Très bon logement.',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('ratings', [
            'user_id' => $user->id,
            'stars' => 4,
            'comment' => 'Très bon logement.',
            'ratable_type' => Property::class,
            'ratable_id' => $property->id,
        ]);
    }

    public function test_user_cannot_rate_themselves(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/ratings', [
            'ratable_type' => 'user',
            'ratable_id' => $user->id,
            'stars' => 5,
            'comment' => 'Je suis génial.',
        ]);

        $response->assertStatus(422);
    }

    public function test_can_retrieve_ratings_for_property(): void
    {
        $user = User::factory()->create();
        $owner = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $owner->id,
            'amenities' => [],
        ]);

        Rating::create([
            'user_id' => $user->id,
            'stars' => 5,
            'comment' => 'Génial !',
            'ratable_type' => Property::class,
            'ratable_id' => $property->id,
        ]);

        $response = $this->getJson("/api/ratings?ratable_type=property&ratable_id={$property->id}");

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'comment' => 'Génial !',
                'stars' => 5,
            ]);
    }
}
