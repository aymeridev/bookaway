<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = ['user_id', 'owner_id', 'property_id'];

    // Une conversation a plusieurs messages
    public function messages()
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'asc');
    }

    // Le voyageur impliqué
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Le bailleur impliqué
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // Le logement concerné
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}