<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            // L'utilisateur qui initie la conversation (le voyageur)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            // Le propriétaire du logement
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            // Le logement concerné (pratique pour afficher une carte du logement dans le chat)
            $table->foreignId('property_id')->constrained('properties')->onDelete('cascade');
            $table->timestamps();

            // Index pour optimiser les requêtes de recherche de conversations
            $table->unique(['user_id', 'owner_id', 'property_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};