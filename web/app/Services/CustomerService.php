<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Conversation;
use App\Models\Ticket;
use App\Models\TicketMarketing;
use App\Models\Reminder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CustomerService
{
    /**
     * Devuelve los datos consolidados de un cliente (conversaciones y tickets).
     */
    public function getCustomerData(int $customerId, int $perPage = 10): array
    {
        return [
            'customer'         => $this->getCustomerPersonalData($customerId),
            'conversations'    => $this->getConversations($customerId, $perPage),
            'supportTickets'   => $this->getSupportTickets($customerId, $perPage),
            'marketingTickets' => $this->getMarketingTickets($customerId, $perPage),
            'reminders'        => $this->getReminders($customerId, $perPage),
        ];
    }

    public function getCustomerPersonalData($id)
    {
        return Customer::find($id);
    }

    /**
     * Conversaciones del cliente.
     */
    public function getConversations(int $customerId, int $rows): LengthAwarePaginator
    {
        return Conversation::with(['customer', 'chatContexts'])
            ->where('customer_id', $customerId)
            ->select('id', 'status', 'sentiment', 'updated_at')
            ->orderByDesc('updated_at')
            ->paginate($rows);
    }

    /**
     * Tickets de soporte del cliente.
     */
    public function getSupportTickets(int $customerId, int $rows): LengthAwarePaginator
    {
        $tickets = Ticket::query()
            ->leftJoin('customers', 'customers.id', '=', 'tickets.customer_id')
            ->leftJoin('chat_contexts', 'chat_contexts.id', '=', 'tickets.chat_context_id')
            ->where('tickets.customer_id', $customerId)
            ->select(
                'tickets.id',
                'tickets.status',
                'tickets.urgency',
                'tickets.problem_type',
                'tickets.problem_description',
                'tickets.resolution_description',
                'tickets.created_at',
                'tickets.resolved_at',
                'customers.name  as customer_name',
                'chat_contexts.message_content',
                'chat_contexts.role',
                'chat_contexts.created_at as chat_context_created_at',
                'chat_contexts.sentiment'
            )
            ->orderByDesc('tickets.created_at')
            ->paginate($rows);

        return $this->mapSupportTicketCollection($tickets);
    }

    /**
     * Tickets de marketing del cliente.
     */
    public function getMarketingTickets(int $customerId, int $rows): LengthAwarePaginator
    {
        $tickets = TicketMarketing::query()
            ->leftJoin('customers', 'customers.id', '=', 'tickets_marketing.customer_id')
            ->leftJoin('chat_contexts', 'chat_contexts.id', '=', 'tickets_marketing.chat_context_id')
            ->where('tickets_marketing.customer_id', $customerId)
            ->select(
                'tickets_marketing.id',
                'tickets_marketing.status',
                'tickets_marketing.urgency',
                'tickets_marketing.problem_type',
                'tickets_marketing.problem_description',
                'tickets_marketing.resolution_description',
                'tickets_marketing.created_at',
                'tickets_marketing.resolved_at',
                'customers.name  as customer_name',
                'chat_contexts.message_content',
                'chat_contexts.role',
                'chat_contexts.created_at as chat_context_created_at',
                'chat_contexts.sentiment'
            )
            ->orderByDesc('tickets_marketing.created_at')
            ->paginate($rows);

        return $this->mapMarketingTicketCollection($tickets);
    }

    public function getReminders(int $customerId, int $rows): LengthAwarePaginator
    {
        $reminders = Reminder::with(['category', 'followUp'])   // eager load
            ->where('customer_id', $customerId)
            ->select(
                'id',
                'content',
                'remind_at',
                'notified',
                'source',
                'description',
                'observation',
                'reminder_category_id',
                'follow_up_id',
                'created_at'
            )
            ->orderByDesc('remind_at')
            ->paginate($rows);

        return $this->mapReminderCollection($reminders);
    }

    /**
     * Devuelve el feedback de un cliente.
     *
     * @param int $customerId
     * @return array
     */
    public function getCustomerFeedBack(int $customerId)
    {
        $conversations = $this->getConversations($customerId, 10);

        if ($conversations->isEmpty()) {
            return [
                'conversation' => [],
                'chat' => [],
                'totals' => [
                    'conversations' => 0,
                    'chats' => 0,
                ],
            ];
        }

        //'positive','negative','duda','support','unknown','marketing'
        $conversationFeedback = [
            'positive' => 0,
            'negative' => 0,
            'duda' => 0,
            'support' => 0,
            'unknown' => 0,
            'marketing' => 0,
        ];

        $chatFeedback = [
            'messagePositive' => 0,
            'messageNegative' => 0,
            'messageDuda' => 0,
            'messageSupport' => 0,
            'messageUnknown' => 0,
            'messageMarketing' => 0,
        ];

        foreach ($conversations as $conversation) {
            $sentiment = $conversation->sentiment;
            if (isset($conversationFeedback[$sentiment])) {
                $conversationFeedback[$sentiment]++;
            }

            if (!empty($conversation->chatContexts)) {
                foreach ($conversation->chatContexts as $chatContex) {
                    $messageSentiment = $chatContex->sentiment;
                    $messageRole = $chatContex->role;
                    if ($messageRole !== 'assistant') {
                        $key = 'message' . ucfirst($messageSentiment);
                        if (isset($chatFeedback[$key])) {
                            $chatFeedback[$key]++;
                        }
                    }
                }
            }
        }

        return $this->getFeedbackAverage($conversationFeedback, $chatFeedback);
    }



    /**
     * Devuelve la línea de tiempo de un cliente (conversaciones y tickets).
     *
     * @param int $customerId
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getActivityTimeline(int $customerId)
    {
        // 1) ChatContexts ---------------------------------------------------
        $chat = DB::table('conversations')
            ->where('customer_id', $customerId)
            ->selectRaw("
            id,
            'conversation'  as type,
            status    as subtype,
            created_at     as occurred_at,
            1 as priority,
            JSON_OBJECT(
                'sentiment', sentiment
            ) as payload
        ");

        // 2) Tickets de soporte --------------------------------------------
        $support = DB::table('tickets')
            ->where('customer_id', $customerId)
            ->selectRaw("
            id,
            'ticket'       as type,
            'support'      as subtype,
            created_at     as occurred_at,
            2 as priority,
            JSON_OBJECT(
                'status', status,
                'urgency', urgency,
                'problem_type', problem_type,
                'problem_description', problem_description
            ) as payload
        ");

        // 3) Tickets de marketing ------------------------------------------
        $marketing = DB::table('tickets_marketing')
            ->where('customer_id', $customerId)
            ->selectRaw("
            id,
            'ticket'       as type,
            'marketing'    as subtype,
            created_at     as occurred_at,
            3 as priority,
            JSON_OBJECT(
                'status', status,
                'urgency', urgency,
                'problem_type', problem_type,
                'problem_description', problem_description
            ) as payload
        ");

        // 4) Recordatorios --------------------------------------------------
        $reminders = DB::table('reminders')
            ->where('customer_id', $customerId)
            ->selectRaw("
            id,
            'reminder'     as type,
            source         as subtype,
            remind_at      as occurred_at,
            4 as priority,
            JSON_OBJECT(
                'content', content,
                'description', description,
                'notified', notified
            ) as payload
        ");

        // 5) Follow-ups -----------------------------------------------------
        $followUps = DB::table('follow_ups')
            ->where('customer_id', $customerId)
            ->selectRaw("
            id,
            'follow_up'    as type,
            status         as subtype,
            follow_up_date as occurred_at,
            5 as priority,
            JSON_OBJECT(
                'notes', notes,
                'awaiting_reschedule', is_awaiting_reschedule_date
            ) as payload
        ");

        // 6) Unión + orden + paginación ------------------------------------
        $union = $chat
            ->unionAll($support)
            ->unionAll($marketing)
            ->unionAll($reminders)
            ->unionAll($followUps);

        // ordenar y pagina
        $timeline = DB::query()
            ->fromSub($union, 'timeline')
            ->orderBy('priority')
            ->orderByDesc('occurred_at')
            ->paginate(10);

        // 7) Transforma payload (JSON->array) y normaliza la fecha
        $timeline->getCollection()->transform(function ($item) {
            $item->occurred_at = Carbon::parse($item->occurred_at)->format('d/m/Y H:i');
            $item->payload     = json_decode($item->payload, true);
            return $item;
        });

        return $timeline;
    }

    /* ---------- Helpers ---------- */

    private function mapSupportTicketCollection(LengthAwarePaginator $tickets): LengthAwarePaginator
    {
        $tickets->getCollection()->transform(function ($t) {
            return [
                'id'          => $t->id,
                'status'      => $t->status,
                'urgency'     => $t->urgency,
                'type'        => $t->problem_type,
                'description' => $t->problem_description,
                'resolution'  => $t->resolution_description,
                'created_at'  => $t->created_at,
                'resolved_at' => $t->resolved_at,
                'chat_context' => [
                    'message'   => $t->message_content,
                    'role'      => $t->role,
                    'created_at' => $t->chat_context_created_at,
                    'sentiment' => $t->sentiment,
                ],
            ];
        });

        return $tickets;
    }

    private function mapMarketingTicketCollection(LengthAwarePaginator $tickets): LengthAwarePaginator
    {
        $tickets->getCollection()->transform(function ($t) {
            return [
                'id'          => $t->id,
                'status'      => $t->status,
                'urgency'     => $t->urgency,
                'type'        => $t->problem_type,
                'description' => $t->problem_description,
                'resolution'  => $t->resolution_description,
                'created_at'  => $t->created_at,
                'resolved_at' => $t->resolved_at,
                'customer'    => ['name' => $t->customer_name],
                'chat_context' => [
                    'message'   => $t->message_content,
                    'role'      => $t->role,
                    'created_at' => $t->chat_context_created_at,
                    'sentiment' => $t->sentiment,
                ],
            ];
        });

        return $tickets;
    }

    private function mapReminderCollection(LengthAwarePaginator $reminders): LengthAwarePaginator
    {
        $reminders->getCollection()->transform(function ($r) {
            return [
                'id'          => $r->id,
                'content'     => $r->content,
                'remind_at'   => $r->remind_at,
                'notified'    => $r->notified,
                'source'      => $r->source,
                'description' => $r->description,
                'observation' => $r->observation,
                'category'    => optional($r->category)->only('id', 'name'),
                'follow_up'   => $r->followUp
                    ? [
                        'id'          => $r->followUp->id,
                        'date'        => $r->followUp->follow_up_date,
                        'status'      => $r->followUp->status,
                        'notes'       => $r->followUp->notes,
                        'awaiting_re' => $r->followUp->is_awaiting_reschedule_date,
                    ]
                    : null,
            ];
        });

        return $reminders;
    }

    private function getFeedbackAverage($conversationFeedback, $chatFeedback): array
    {
        //Calcula promedio de la conversacion
        $totalConversations = array_sum($conversationFeedback);
        $totalChats = array_sum($chatFeedback);

        $conversationAverage = [];
        foreach ($conversationFeedback as $key => $value) {
            $conversationAverage[$key] = $totalConversations > 0
                ? round(($value / $totalConversations) * 100, 2)
                : 0;
        }

        $chatAverage = [];
        foreach ($chatFeedback as $key => $value) {
            $chatAverage[$key] = $totalChats > 0
                ? round(($value / $totalChats) * 100, 2)
                : 0;
        }

        return [
            'conversation' => $conversationAverage,
            'chat' => $chatAverage,
            'totals' => [
                'conversations' => $totalConversations,
                'chats' => $totalChats,
            ],
        ];
    }
}
