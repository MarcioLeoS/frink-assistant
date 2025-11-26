<?php
// app/Services/CustomerFilterService.php
namespace App\Services;

use App\Models\Customer;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class CustomerFilterService
{
    /** ≥ N mensajes = conversación “larga” */
    private const LONG_CONV_THRESHOLD = 25;

    /**
     * Applies multiple filters to the Customer model and returns a paginated result.
     *
     * Filters include:
     *  1. Free text search (name, email, phone number)
     *  2. Activity date range (based on conversation updates)
     *  3. Minimum number of messages in conversations
     *  4. Long conversations (based on threshold)
     *  5. Presence of support tickets, marketing tickets, or reminders
     *  6. Follow-up status
     *  7. Personalization status
     *  8. Negative feedback in conversations
     *  9. Requested human agent in conversations
     * 10. Recurring problems (≥2 tickets of the same type)
     *
     * Results are ordered and paginated according to the provided parameters.
     *
     * @param array $p Filter and pagination parameters
     * @return LengthAwarePaginator Paginated list of customers matching the filters
     */
    public function fetch(array $p): LengthAwarePaginator
    {
        $q = Customer::query()->with([
            'tickets',
            'ticketMarketings',
            'reminders',
            'followUps',
            'conversations.chatContexts',
            'personalization',
        ]);

        /* ----------- 1. Texto libre ----------- */
        if (!empty($p['search'])) {
            $s = $p['search'];
            $q->where(fn($q) => $q
                ->where('name',         'like', "%$s%")
                ->orWhere('email',       'like', "%$s%")
                ->orWhere('phone_number', 'like', "%$s%"));
        }

        /* ----------- 2. Rango de fechas (actividad) ----------- */
        if (!empty($p['from']) && !empty($p['to'])) {
            $from = Carbon::parse($p['from'])->startOfDay();
            $to   = Carbon::parse($p['to'])->endOfDay();
            $q->whereHas(
                'conversations',
                fn($c) => $c->whereBetween('updated_at', [$from, $to])
            );
        }

        /* ---- 3. Mínimo de mensajes ---- */
        if (!empty($p['minMessages'])) {
            $min = (int) $p['minMessages'];

            $q->whereHas('conversations', function (Builder $c) use ($min) {
                $c->select('conversations.customer_id')          // ✅ solo la PK
                    ->join('chat_contexts', 'conversations.id', '=', 'chat_contexts.conversation_id')
                    ->groupBy('conversations.customer_id')
                    ->havingRaw('COUNT(chat_contexts.id) >= ?', [$min]);
            });
        }

        /* ---- 4. Conversaciones largas ---- */
        if (($p['conversacionesLargas'] ?? 'todos') !== 'todos') {
            $op = $p['conversacionesLargas'] === 'si' ? '>=' : '<';

            $q->whereHas('conversations', function (Builder $c) use ($op) {
                $c->select('conversations.id')                   // ✅ sólo la PK
                    ->join('chat_contexts', 'conversations.id', '=', 'chat_contexts.conversation_id')
                    ->groupBy('conversations.id')
                    ->havingRaw("COUNT(chat_contexts.id) {$op} ?", [self::LONG_CONV_THRESHOLD]);
            });
        }

        /* ----------- 5-7. Tickets soporte / marketing / recordatorios ----------- */
        $this->presenceFilter($q, 'tickets',          $p['ticketsSoporte']   ?? 'todos');
        $this->presenceFilter($q, 'ticketMarketings', $p['ticketsMarketing'] ?? 'todos');
        $this->presenceFilter($q, 'reminders',        $p['recordatorios']    ?? 'todos');

        /* ----------- 8. Seguimientos ----------- */
        if (($p['seguimientos'] ?? 'todos') !== 'todos') {
            $status = $p['seguimientos'];
            $q->whereHas('followUps', fn($f) => $f->where('status', $status));
        }

        /* ----------- 9. Personalización ----------- */
        if (($p['personalizacion'] ?? 'todos') !== 'todos') {
            $p['personalizacion'] === 'activa'
                ? $q->whereHas('personalization', fn($p) => $p->where('enabled', true))
                : $q->whereDoesntHave('personalization');
        }

        /* ----------- 10. Feedback negativo ----------- */
        $this->presenceFilter(
            $q,
            'conversations',
            $p['feedbackNegativo'] ?? 'todos',
            fn($c) => $c->where('sentiment', 'negative')
        );

        /* ----------- 11. Solicitó humano ----------- */
        $this->presenceFilter(
            $q,
            'conversations',
            $p['solicitoHumano'] ?? 'todos',
            fn($c) => $c->where('status', 'escalated')
        );

        /* 12. Problemas recurrentes ------------------------------ */
        if (($p['problemasRecurrentes'] ?? 'todos') !== 'todos') {
            $cmp = $p['problemasRecurrentes'] === 'si' ? '>=' : '<';
            $q->whereHas('tickets', function ($t) use ($cmp) {
                $t->select('customer_id', DB::raw('COUNT(*) as ct'))
                    ->groupBy('customer_id')
                    ->havingRaw("ct {$cmp} 2");
            });
        }

        /* ----------- Orden & paginación ----------- */
        return $q->orderBy($p['sortBy']  ?? 'name', $p['orderBy'] ?? 'asc')
            ->paginate($p['perPage'] ?? 10);
    }

    /** Helper para filtros “sí / no / todos” sobre una relación */
    private function presenceFilter(
        Builder $q,
        string  $relation,
        string  $value,
        ?\Closure $constraint = null
    ): void {
        if ($value === 'todos') return;
        $method = $value === 'si' ? 'whereHas' : 'whereDoesntHave';
        $q->$method($relation, $constraint);
    }
}
