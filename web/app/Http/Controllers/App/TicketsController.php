<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

//Models
use App\Models\Ticket;

//Services
use App\Services\TicketsService;

//Utils|Tools
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class TicketsController extends Controller
{
    protected $ticketsService;

    public function __construct(TicketsService $ticketsService)
    {
        $this->ticketsService = $ticketsService;
    }

    /**
     * Retrieves filtered and paginated tickets, and the total count of unresolved tickets.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getData(Request $request)
    {
        try {
            $search = $request->input('search');
            $perPage = $request->input('perPage', 10);
            $sortBy = $request->input('sortBy', 'created_at');
            $orderBy = $request->input('orderBy', 'desc');
            $status = $request->input('status', 'all');
            $urgency = $request->input('urgency', 'all');

            //BuildQuery
            $query = $this->ticketsService->buildQuery($search, $sortBy, $orderBy, $status, $urgency);
            $tickets = $query->paginate($perPage);
            $totalTickets = Ticket::query()->whereNull('resolved_at')->count();

            return response()->json([
                'tickets' => $tickets,
                'totalTickets' => $totalTickets
            ]);
        } catch (Exception $e) {
            Log::error('Error getting tickets: ' . $e->getMessage());
            return response()->json(['error' => 'Error getting tickets'], 500);
        }
    }

    /**
     * Escalates the specified ticket by setting its 'escalated' flag to true.
     *
     * @param int $id The ID of the ticket to escalate.
     * @return \Illuminate\Http\JsonResponse
     */
    public function escalate($id)
    {
        try {
            $ticket = Ticket::findOrFail($id);
            $ticket->escalated = true;
            $ticket->save();

            return response()->json(['message' => 'Ticket escalated'], 200);
        } catch (Exception $e) {
            Log::error("Error escalating ticket {$id}: " . $e->getMessage());
            return response()->json(['error' => 'Could not escalate the ticket'], 500);
        }
    }

    /**
     * Schedules a follow-up for a ticket.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id   Ticket ID
     * @return \Illuminate\Http\JsonResponse
     */
    public function followUp(Request $request, $id)
    {
        $data = $request->validate([
            'follow_up_at' => ['required', 'date'],
            'notes'        => ['nullable', 'string'],
        ]);

        try {
            $this->ticketsService->createFollowUp($id, $data);

            return response()->json([
                'message' => 'Follow-up scheduled successfully'
            ], 201);
        } catch (\Exception $e) {
            Log::error("Error scheduling follow-up for ticket {$id}: " . $e->getMessage());
            return response()->json([
                'error' => 'Could not schedule the follow-up'
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:open,in_progress,resolved,closed'],
        ]);

        try {
            $ticket = Ticket::findOrFail($id);
            $ticket->status = $data['status'];
            if ($data['status'] === 'resolved') {
                $ticket->resolved_at = now();
            }
            $ticket->save();

            return response()->json([
                'message' => 'Status updated successfully',
                'status' => $ticket->status,
            ], 200);
        } catch (\Exception $e) {
            Log::error("Error updating status for ticket {$id}: " . $e->getMessage());
            return response()->json([
                'error' => 'Could not update'
            ], 500);
        }
    }
}
