<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Liste tous les utilisateurs.
     */
    public function index()
    {
        return response()->json(User::all());
    }

    /**
     * Créer un nouvel utilisateur.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json($user, 201);
    }

    public function show(string $id)
    {
        $user = User::with(['bookings.property', 'payments', 'ratingsReceived.author:id,name'])->findOrFail($id);
        return response()->json($user);
    }

    public function addFunds(Request $request)
    {

        $validated = $request->validate([
            'amount' => 'numeric|min:1|max:10000'
        ]);
        $request->user()->increment('balance', $validated['amount']);

        return response()->json(['balance' => $request->user()->balance]);
    }

    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'  => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return response()->json($user);
    }

    /**
     * Supprimer un utilisateur.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(null, 204);
    }

    public function properties(string $id)
    {
        $user = User::findOrFail($id);
        $properties = $user->properties()
            ->with(['images' => function ($q) {
                $q->orderBy('sort_order', 'asc');
            }])
            ->get();

        return response()->json($properties);
    }
}
