<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

//Models
use App\Models\Customer;
use App\Models\Conversation;
use App\Models\Ticket;
use App\Models\TicketMarketing;
//Services
use App\Services\ConversationService;
use App\Services\CustomerFilterService;
use App\Services\CustomerService;
use Exception;
use Illuminate\Support\Facades\Log;

class CustomersController extends Controller
{
    protected $conversationService;
    protected $customerService;
    protected $customerFilterService;

    public function __construct(ConversationService $conversationService, CustomerService $customerService, CustomerFilterService $customerFilterService)
    {
        $this->conversationService = $conversationService;
        $this->customerService = $customerService;
        $this->customerFilterService = $customerFilterService;
    }


    // public function getData(Request $request)
    // {
    //     $customers = Customer::all();

    //     $customersQuantity = count($customers);

    //     return response()->json(['total' => $customersQuantity, 'customers' => $customers]);
    // }

    public function getList()
    {
        $customers = Customer::all();

        return response()->json($customers);
    }

    public function getCustomerData(Request $r)
    {
        try {
            $customers = $this->customerFilterService->fetch([
                'search'               => $r->query('search'),
                'from'                 => $r->query('from'),
                'to'                   => $r->query('to'),
                'minMessages'          => $r->query('minMessages'),
                'conversacionesLargas' => $r->query('conversacionesLargas', 'todos'),
                'ticketsSoporte'       => $r->query('ticketsSoporte', 'todos'),
                'ticketsMarketing'     => $r->query('ticketsMarketing', 'todos'),
                'recordatorios'        => $r->query('recordatorios', 'todos'),
                'seguimientos'         => $r->query('seguimientos', 'todos'),
                'personalizacion'      => $r->query('personalizacion', 'todos'),
                'feedbackNegativo'     => $r->query('feedbackNegativo', 'todos'),
                'solicitoHumano'       => $r->query('solicitoHumano', 'todos'),
                'problemasRecurrentes' => $r->query('problemasRecurrentes', 'todos'),
                'sortBy'               => $r->query('sortBy', 'name'),
                'orderBy'              => $r->query('orderBy', 'asc'),
                'perPage'              => $r->integer('perPage', 10),
            ]);

            /* --- Campos calculados para cada cliente --- */
            $customers->getCollection()->transform(function ($c) {
                $last = $c->conversations->sortByDesc('updated_at')->first();
                $c->last_contact_at = $last && $last->updated_at ? $last->updated_at->format('d/m/Y H:i') : null;
                $c->message_count = $c->conversations
                    ->sum(fn($conv) => $conv->chatContexts->count());
                return $c;
            });

            return response()->json([
                'total'     => $customers->total(),
                'customers' => $customers
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error'   => 'Query error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    public function getData(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('perPage', 10);
        $sortBy = $request->input('sortBy', 'updated_at');
        $orderBy = $request->input('orderBy', 'desc');

        //BuildQuery
        $query = $this->conversationService->buildQuery($search, $sortBy, $orderBy);
        $conversations = $query->paginate($perPage);
        $customersQuantity = Customer::count();

        return response()->json([
            'total' => $customersQuantity,
            'conversations' => $conversations
        ]);
    }

    public function getConversationEspecificData(Request $request, $id)
    {
        $conversation = Conversation::with('customer', 'chatContexts')->findOrFail($id);

        return response()->json([
            'conversation' => $conversation,
            'totalMessages' => count($conversation->chatContexts),
        ]);
    }

    public function getCustomerEspecificData(Request $request, int $id)
    {
        try {
            // 10 filas por recurso, cámbialo según necesites
            $data = $this->customerService->getCustomerData($id, 10);

            return response()->json($data);
        } catch (Exception $e) {
            Log::error('Error getting customer especific data: ' . $e->getMessage());
            return response()->json(['error' => 'Error getting customer especific data'], 500);
        }
    }

    /**
     * Get the customer activity timeline.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCustomerTimeline(Request $request, int $id)
    {
        $timeline = $this->customerService
            ->getActivityTimeline($id);

        return response()->json($timeline);
    }

    public function fetchCustomerFeedback(int $id)
    {
        $averages = $this->customerService
            ->getCustomerFeedBack($id);

        return response()->json($averages);
    }
}
