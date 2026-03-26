<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Liste toutes les réservations avec les détails de l'annonce et du client.
     */
    public function index()
    {
        $bookings = Booking::with(['property', 'user', 'payment'])->get();
        return response()->json($bookings);
    }

    /**
     * Créer une nouvelle réservation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'property_id' => 'required|exists:properties,id',
            'payment_id' => 'nullable|exists:payments,id',
            'number_persons' => 'required|integer|min:1',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'total_price' => 'required|numeric|min:0',
            'status' => 'string|in:confirmed,pending,cancelled',
        ]);

        $booking = Booking::create($validated);

        return response()->json($booking->load(['property', 'payment']), 201);
    }

    /**
     * Afficher une réservation précise.
     */
    public function show(string $id)
    {
        $booking = Booking::with(['property', 'user', 'payment'])->findOrFail($id);
        return response()->json($booking);
    }

    /**
     * Mettre à jour une réservation (ex: changer le statut).
     */
    public function update(Request $request, string $id)
    {
        $booking = Booking::findOrFail($id);

        $validated = $request->validate([
            'number_persons' => 'sometimes|integer|min:1',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'status' => 'sometimes|string|in:confirmed,pending,cancelled',
            'payment_id' => 'sometimes|nullable|exists:payments,id',
        ]);

        $booking->update($validated);

        return response()->json($booking->load(['property', 'payment']));
    }

    /**
     * Supprimer une réservation.
     */
    public function destroy(string $id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json(null, 204);
    }
}