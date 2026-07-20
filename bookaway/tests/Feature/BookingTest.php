<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Property;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_cancel_booking_with_reason(): void
    {
        $user = User::factory()->create();
        $owner = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $owner->id,
            'amenities' => [],
        ]);

        $booking = Booking::create([
            'user_id' => $user->id,
            'property_id' => $property->id,
            'travelers' => 2,
            'start_date' => '2026-08-01',
            'end_date' => '2026-08-10',
            'total_price' => 500,
            'status' => 'confirmed',
        ]);

        $response = $this->actingAs($user, 'sanctum')->putJson("/api/bookings/{$booking->id}", [
            'status' => 'cancelled',
            'cancellation_reason' => 'Contretemps professionnel',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'cancelled',
            'cancellation_reason' => 'Contretemps professionnel',
        ]);
    }
}
