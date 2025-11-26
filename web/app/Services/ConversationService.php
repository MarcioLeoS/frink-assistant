<?php

namespace App\Services;

use App\Models\Conversation;

class ConversationService
{
    public function buildQuery(?string $search = null, string $sortBy = 'updated_at', string $orderBy = 'desc')
    {
        $validColumns = ['status', 'sentiment', 'created_at', 'updated_at', 'name', 'phone_number'];

        if (!in_array($sortBy, $validColumns)) {
            $sortBy = 'updated_at';
        }

        return Conversation::with('customer', 'chatContexts')
            ->whereHas('customer', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('phone_number', 'like', '%' . $search . '%');
            })
            ->orderBy($sortBy, $orderBy);
    }
}
