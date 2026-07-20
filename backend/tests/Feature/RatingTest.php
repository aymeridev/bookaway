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

    public function test_host_cannot_rate_their_own_property(): void
    {
        $owner = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $owner->id,
            'amenities' => [],
        ]);

        $response = $this->actingAs($owner, 'sanctum')->postJson('/api/ratings', [
            'ratable_type' => 'property',
            'ratable_id' => $property->id,
            'stars' => 5,
            'comment' => 'Mon logement est incroyable.',
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

    public function test_property_details_returns_avg_rating_and_hides_author_email(): void
    {
        $user1 = User::factory()->create(['email' => 'user1@example.com']);
        $user2 = User::factory()->create(['email' => 'user2@example.com']);
        $owner = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $owner->id,
            'amenities' => [],
        ]);

        Rating::create([
            'user_id' => $user1->id,
            'stars' => 5,
            'comment' => 'Parfait !',
            'ratable_type' => Property::class,
            'ratable_id' => $property->id,
        ]);

        Rating::create([
            'user_id' => $user2->id,
            'stars' => 3,
            'comment' => 'Moyen.',
            'ratable_type' => Property::class,
            'ratable_id' => $property->id,
        ]);

        $response = $this->getJson("/api/properties/{$property->id}");

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'ratings_avg' => 4,
        ]);

        // Assert that the authors' names are returned, but their emails are hidden
        $response->assertJsonFragment(['name' => $user1->name]);
        $response->assertJsonMissing(['email' => 'user1@example.com']);
        $response->assertJsonMissing(['email' => 'user2@example.com']);
    }

    public function test_properties_index_returns_avg_rating_for_each_property(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $owner = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $owner->id,
            'amenities' => [],
        ]);

        Rating::create([
            'user_id' => $user1->id,
            'stars' => 5,
            'comment' => 'Parfait !',
            'ratable_type' => Property::class,
            'ratable_id' => $property->id,
        ]);

        Rating::create([
            'user_id' => $user2->id,
            'stars' => 3,
            'comment' => 'Moyen.',
            'ratable_type' => Property::class,
            'ratable_id' => $property->id,
        ]);

        $response = $this->getJson('/api/properties');

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'id' => $property->id,
            'ratings_avg' => 4,
        ]);
    }

    public function test_user_cannot_rate_same_property_twice(): void
    {
        $user = User::factory()->create();
        $owner = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $owner->id,
            'amenities' => [],
        ]);

        // First rating should succeed
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/ratings', [
            'ratable_type' => 'property',
            'ratable_id' => $property->id,
            'stars' => 4,
            'comment' => 'Très bon logement.',
        ]);

        $response->assertStatus(201);

        // Second rating should be rejected
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/ratings', [
            'ratable_type' => 'property',
            'ratable_id' => $property->id,
            'stars' => 5,
            'comment' => 'Encore mieux la deuxième fois.',
        ]);

        $response->assertStatus(409);
        $this->assertDatabaseCount('ratings', 1);
    }

    public function test_user_cannot_rate_same_user_twice(): void
    {
        $user = User::factory()->create();
        $target = User::factory()->create();

        // First rating should succeed
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/ratings', [
            'ratable_type' => 'user',
            'ratable_id' => $target->id,
            'stars' => 4,
            'comment' => 'Bon hôte.',
        ]);

        $response->assertStatus(201);

        // Second rating should be rejected
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/ratings', [
            'ratable_type' => 'user',
            'ratable_id' => $target->id,
            'stars' => 5,
            'comment' => 'Encore meilleur hôte.',
        ]);

        $response->assertStatus(409);
        $this->assertDatabaseCount('ratings', 1);
    }
}
