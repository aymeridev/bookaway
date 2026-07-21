<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\Property;     // Ajouté pour récupérer l'owner_id du logement
use App\Models\Conversation; // Ajouté pour l'automatisation du chat
use App\Models\Message;      // Ajouté pour l'envoi du message de bienvenue
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
            'travelers'   => 'required|integer|min:1',
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

                // Récupération du logement pour identifier le propriétaire (owner_id)
                $property = Property::findOrFail($validated['property_id']);

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
                $newBooking = Booking::create([
                    'user_id'        => $validated['user_id'],
                    'property_id'    => $validated['property_id'],
                    'payment_id'     => $payment->id, // On lie le paiement fraîchement créé
                    'travelers' => $validated['travelers'],
                    'start_date'     => $validated['start_date'],
                    'end_date'       => $validated['end_date'],
                    'total_price'    => $validated['total_price'],
                    'status'         => 'confirmed', // Confirmé directement car le paiement a réussi
                ]);

                // 5. Initialisation ou récupération de la conversation
                $conversation = Conversation::firstOrCreate([
                    'user_id'     => $validated['user_id'],
                    'owner_id'    => $property->user_id,
                    'property_id' => $property->id,
                ]);

                // 6. Envoi du message automatique de remerciement au nom du propriétaire
                $welcomeMessage = "Bonjour ! Merci pour votre réservation pour le logement \"{$property->title}\". Votre paiement a bien été validé. N'hésitez pas à me contacter ici si vous avez des questions concernant votre arrivée !";

                Message::create([
                    'conversation_id' => $conversation->id,
                    'sender_id'       => $property->user_id, // L'expéditeur est le bailleur
                    'content'         => $welcomeMessage,
                    'is_read'         => false,
                ]);

                // On force la mise à jour du timestamp de la conversation pour qu'elle remonte en premier
                $conversation->touch();

                return $newBooking;
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
        $booking = Booking::with(['property.images', 'property.user', 'user', 'payment'])->findOrFail($id);
        if ($booking->property) {
            $booking->property->setAttribute('address', $booking->property->address);
        }
        return response()->json($booking);
    }

    /**
     * Mettre à jour une réservation (ex: changer le statut).
     */
    public function update(Request $request, string $id)
    {
        $booking = Booking::findOrFail($id);

        $validated = $request->validate([
            'travelers' => 'sometimes|integer|min:1',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'status' => 'sometimes|string|in:confirmed,pending,cancelled',
            'payment_id' => 'sometimes|nullable|exists:payments,id',
            'cancellation_reason' => 'sometimes|nullable|string',
        ]);

        $booking->update($validated);

        $booking->load(['property.images', 'property.user', 'payment']);
        if ($booking->property) {
            $booking->property->setAttribute('address', $booking->property->address);
        }

        return response()->json($booking);
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
    public function MyBookings(Request $request)
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
