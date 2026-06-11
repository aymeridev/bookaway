<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = ['conversation_id', 'sender_id', 'content', 'is_read'];

    public function conversation()
    {
        return $table->belongsTo(Conversation::class);
    }

    // L'expéditeur du message
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}