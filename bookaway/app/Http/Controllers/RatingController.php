<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'ratable_type' => 'required|string|in:property,user',
            'ratable_id' => 'required|integer',
        ]);

        $type = $request->ratable_type === 'property' ? Property::class : User::class;
        $ratings = Rating::where('ratable_type', $type)
            ->where('ratable_id', $request->ratable_id)
            ->with('author')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($ratings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ratable_type' => 'required|string|in:property,user',
            'ratable_id' => 'required|integer',
            'stars' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $modelClass = $validated['ratable_type'] === 'property' ? Property::class : User::class;

        $ratable = $modelClass::findOrFail($validated['ratable_id']);

        if ($validated['ratable_type'] === 'user' && $validated['ratable_id'] == $request->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas vous évaluer vous-même.'
            ], 422);
        }

        $rating = Rating::create([
            'user_id' => $request->user()->id,
            'stars' => $validated['stars'],
            'comment' => $validated['comment'] ?? null,
            'ratable_type' => $modelClass,
            'ratable_id' => $validated['ratable_id'],
        ]);

        return response()->json($rating->load('author'), 201);
    }

    public function destroy(Request $request, string $id)
    {
        $rating = Rating::findOrFail($id);

        if ($rating->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Vous n\'êtes pas autorisé à supprimer cette évaluation.'
            ], 403);
        }

        $rating->delete();

        return response()->json(null, 204);
    }
}
