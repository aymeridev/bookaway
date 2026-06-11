<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'stars',
        'comment',
        'ratable_id',
        'ratable_type',
    ];

    /**
     * Get the owning ratable model (Property or User).
     */
    public function ratable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the user who wrote the rating.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
