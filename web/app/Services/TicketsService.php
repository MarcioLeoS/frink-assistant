<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\TicketFollowUp;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;

class TicketsService
{
    public function buildQuery(
        ?string $search = null,
        ?string $sortBy = 'created_at',
        string $orderBy = 'desc',
        ?string $status,
        ?string $urgency
    ) {
        $validColumns = ['status', 'problem_type', 'urgency', 'created_at', 'name', 'phone_number', 'resolved_at'];
        $validStatus = ['open', 'closed', 'in_progress', 'resolved'];
        $validUrgencies = ['low', 'medium', 'high'];

        if (!in_array($sortBy, $validColumns)) {
            $sortBy = 'created_at';
        }


        $query = Ticket::with('customer', 'followUps.user')
            ->whereHas('customer', function ($q) use ($search) {
                if (!empty($search)) {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('phone_number', 'like', '%' . $search . '%');
                }
            });

        if (!empty($status) && $status !== 'all' && in_array($status, $validStatus)) {
            $query->where('status', $status);
        }

        if (!empty($urgency) && $urgency !== 'all' && in_array($urgency, $validUrgencies)) {
            $query->where('urgency', $urgency);
        }

        return $query->orderBy($sortBy, $orderBy);
    }

    /**
     * Creates a follow-up for the given ticket.
     *
     * @param  int    $ticketId
     * @param  array  $data       ['follow_up_at' => string, 'notes' => string|null]
     * @return TicketFollowUp
     *
     * @throws ModelNotFoundException
     */
    public function createFollowUp(int $ticketId, array $data): TicketFollowUp
    {
        $ticket = Ticket::findOrFail($ticketId);

        return $ticket->followUps()->create([
            'follow_up_at' => $data['follow_up_at'],
            'notes'        => $data['notes'] ?? null,
            'created_by'   => auth()->user()->id,
        ]);
    }
}
