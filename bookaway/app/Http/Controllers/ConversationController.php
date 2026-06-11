<?php
namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Property;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    /**
     * Liste toutes les conversations avec le compte des messages non lus.
     */
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Conversation::where('user_id', $userId)
            ->orWhere('owner_id', $userId)
            ->with(['user', 'owner', 'property.images', 'messages' => function($q) {
                $q->orderBy('created_at', 'asc'); 
            }])
            ->orderBy('updated_at', 'desc')
            ->get()
            // 💡 On ajoute dynamiquement le nombre de messages non lus pour CHAQUE conversation
            ->map(function ($conversation) use ($userId) {
                $conversation->unread_count = $conversation->messages()
                    ->where('sender_id', '!=', $userId) // Reçu de l'autre personne
                    ->where('is_read', false)           // Pas encore lu
                    ->count();
                return $conversation;
            });

        return response()->json($conversations);
    }

    /**
     * Initialise ou récupère une conversation existante pour un logement
     */
    public function startConversation(Request $request)
    {
        $request->validate([
            'property_id' => 'required|exists:properties,id',
        ]);

        $user = $request->user();
        $property = Property::findOrFail($request->property_id);

        // Sécurité : On ne peut pas démarrer une discussion avec soi-même
        if ($user->id === $property->user_id) {
            return response()->json(['message' => 'Vous êtes le propriétaire de ce logement.'], 400);
        }

        // Recherche ou création du fil de discussion unique
        $conversation = Conversation::firstOrCreate([
            'user_id'     => $user->id,
            'owner_id'    => $property->user_id, // Propriétaire du logement
            'property_id' => $property->id,
        ]);

        return response()->json($conversation->load(['user', 'owner', 'property', 'messages']));
    }

    /**
     * Envoie un message dans une conversation
     */
    public function sendMessage(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $conversation = Conversation::findOrFail($id);
        $user = $request->user();

        // Sécurité : L'utilisateur doit faire partie de la conversation
        if ($user->id !== $conversation->user_id && $user->id !== $conversation->owner_id) {
            return response()->json(['message' => 'Accès interdit'], 403);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id'       => $user->id,
            'content'         => $request->content,
        ]);

        // On touche à la conversation pour mettre à jour le `updated_at` (permet de la faire remonter en haut de liste)
        $conversation->touch();

        return response()->json($message, 201);
    }

    /**
     * Marque tous les messages d'une conversation comme lus pour l'utilisateur connecté.
     */
    public function markAsRead(Request $request, $id)
    {
        $userId = $request->user()->id;

        Message::where('conversation_id', $id)
            ->where('sender_id', '!=', $userId)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'Messages marqués comme lus']);
    }
}