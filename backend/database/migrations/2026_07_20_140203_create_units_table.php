<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->comment("units for a property");
            $table->id();
            $table->string("title", 100);
            $table->foreignId("property_id")->constrained()->onDelete("cascade");
            $table->integer("capacity");
            $table->text("description");
            $table->integer("base_fee");
            $table->integer("price_per_night");
            $table->json('amenities');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
