<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'card_holder_name',
        'card_number',
        'expiration_date',
        'cvv',
        'amount',
        'status'
    ];

    /**
     * Un paiement appartient à un utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function booking() 
    { 
        return $this->hasOne(Booking::class); 
    }
}