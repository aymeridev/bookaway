<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        // 1. On valide TOUTES les données (Réservation + Carte bancaire)
        $validated = $request->validate([
            // Infos Réservation
            'user_id'          => 'required|exists:users,id',
            'property_id'      => 'required|exists:properties,id',
            'number_persons'   => 'required|integer|min:1',
            'start_date'       => 'required|date|after_or_equal:today',
            'end_date'         => 'required|date|after:start_date',
            'total_price'      => 'required|numeric|min:0',
            
            // Infos Paiement requis pour le traitement
            'card_holder_name' => 'required|string|max:255',
            'card_number'      => 'required|string',
            'expiration_date'  => 'required|string',
            'cvv'              => 'required|string|max:4',
        ]);

        // 2. On utilise une transaction DB pour s'assurer que si l'un échoue, rien n'est enregistré
        try {
            $booking = DB::transaction(function () use ($validated) {
                
                // [Optionnel] C'est ici que tu brancheras ton vrai SDK de paiement (ex: Stripe)
                // Dans l'immédiat, on simule que la banque répond "success"

                // 3. Création du paiement en base de données
                $payment = Payment::create([
                    'user_id'           => $validated['user_id'],
                    'card_holder_name'  => $validated['card_holder_name'],
                    'card_number'       => bcrypt($validated['card_number']),
                    'expiration_date'   => $validated['expiration_date'],
                    'cvv'               => bcrypt($validated['cvv']),
                    'amount'            => $validated['total_price'],
                    'status'            => 'success',
                ]);

                // 4. Création de la réservation liée au paiement
                return Booking::create([
                    'user_id'        => $validated['user_id'],
                    'property_id'    => $validated['property_id'],
                    'payment_id'     => $payment->id, // On lie le paiement fraîchement créé
                    'number_persons' => $validated['number_persons'],
                    'start_date'     => $validated['start_date'],
                    'end_date'       => $validated['end_date'],
                    'total_price'    => $validated['total_price'],
                    'status'         => 'confirmed', // Confirmé directement car le paiement a réussi
                ]);
            });

            return response()->json($booking->load(['property', 'payment']), 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors du traitement de la réservation.',
                'error' => $e->getMessage()
            ], 500);
        }
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

    /**
     * Récupérer uniquement les réservations de l'utilisateur connecté.
     */
    public function myReservations(Request $request)
    {
        // On récupère l'utilisateur connecté via le Token
        $bookings = $request->user()->bookings()
            ->with([
                'property:id,title', // On ne sélectionne que les vraies colonnes existantes
                'property.images'    // On charge la RELATION des images (imbriquée)
            ])
            ->orderBy('start_date', 'desc')
            ->get();

        return response()->json($bookings);
    }
}