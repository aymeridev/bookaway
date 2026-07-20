<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Liste tous les paiements (avec l'utilisateur qui a payé).
     */
    public function index()
    {
        return response()->json(Payment::with('user')->get());
    }

    /**
     * Enregistrer un nouveau paiement.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'          => 'required|exists:users,id',
            'card_holder_name' => 'required|string|max:255',
            'card_number'      => 'required|string',
            'expiration_date'  => 'required|string',
            'cvv'              => 'required|string|max:4',
            'amount'           => 'required|numeric|min:0',
            'status'           => 'string|in:pending,success,failed',
        ]);

        $payment = Payment::create($validated);

        return response()->json($payment, 201);
    }

    /**
     * Voir un paiement spécifique.
     */
    public function show(string $id)
    {
        $payment = Payment::with(['user', 'booking'])->findOrFail($id);
        return response()->json($payment);
    }

    /**
     * Mettre à jour un paiement (ex: changer le statut).
     */
    public function update(Request $request, string $id)
    {
        $payment = Payment::findOrFail($id);

        $validated = $request->validate([
            'status' => 'sometimes|string|in:pending,success,failed',
        ]);

        $payment->update($validated);

        return response()->json($payment);
    }

    /**
     * Supprimer un paiement.
     */
    public function destroy(string $id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json(null, 204);
    }
}