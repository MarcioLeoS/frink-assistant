<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\TicketFollowUp;
use App\Models\ChatContext;
use App\Models\RealPersonRequest;
use App\Models\TicketMarketing;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;

class AnalyticsService
{

    public function getTicketsByPeriod(
        string  $period,
        ?string $startDate = null,
        ?string $endDate   = null
    ): Collection {
        /** 1) Formato de agrupación SQL */
        $fmt = match ($period) {
            'hour'  => '%Y-%m-%d %H:00:00',
            'day'   => '%Y-%m-%d',
            'month' => '%Y-%m',
            default => throw new \InvalidArgumentException("Periodo no soportado")
        };

        /** 2) Si es hour y no hay rango → últimas 48 h */
        if ($period === 'hour' && !$startDate && !$endDate) {
            $end   = now()->startOfHour();
            $start = $end->copy()->subHours(47);              // rango de 48 valores
        } else {
            $start = $startDate ? Carbon::parse($startDate)->startOfDay() : null;
            $end   = $endDate   ? Carbon::parse($endDate)->endOfDay()     : null;
        }

        /** 3) Consulta agregada */
        $query = Ticket::select(
            DB::raw("DATE_FORMAT(created_at, '$fmt') as period"),
            DB::raw('COUNT(*) as count')
        )
            ->when($start, fn($q) => $q->where('created_at', '>=', $start))
            ->when($end,   fn($q) => $q->where('created_at', '<=', $end))
            ->groupBy('period')
            ->orderBy('period');

        $rows = $query->get()->pluck('count', 'period');  // mapa label → count

        /** 4) Si no hay datos → colección vacía */
        if ($rows->isEmpty()) {
            return collect();
        }

        /* ──────────── Período “hour” ─ rellenamos huecos de 48 h ──────────── */
        if ($period === 'hour') {
            // $start y $end ya definidos arriba
            $filled = collect();
            for ($i = 0; $i < $start->diffInHours($end) + 1; $i++) {
                $label = $start->copy()->addHours($i)->format('Y-m-d H:00:00');
                $filled->push([
                    'period' => $label,
                    'count'  => $rows->get($label, 0),
                ]);
            }
            return $filled;   // 48 elementos exactos
        }

        /* ──────────── Períodos day / month (lógica previa) ──────────── */
        $firstLabel = $rows->keys()->first();
        $lastLabel  = $rows->keys()->last();

        $from = $start ?? ($period === 'day'
            ? Carbon::parse($firstLabel)          // YYYY-MM-DD
            : Carbon::parse($firstLabel . '-01'));  // YYYY-MM → día 1
        $to   = $end   ?? ($period === 'day'
            ? Carbon::parse($lastLabel)
            : Carbon::parse($lastLabel . '-01'));

        $step   = $period === 'day' ? '1 day' : '1 month';
        $format = $period === 'day' ? 'Y-m-d' : 'Y-m';

        $filled = collect(CarbonPeriod::create($from, $step, $to))
            ->map(function (Carbon $d) use ($rows, $format) {
                $lbl = $d->format($format);
                return ['period' => $lbl, 'count' => $rows->get($lbl, 0)];
            });

        return $filled->values();   // orden ascendente
    }


    public function getAvgResolutionTime(
        string  $period,
        ?string $startDate = null,
        ?string $endDate   = null
    ): Collection {
        /* 1) Formato de agrupación */
        $fmt = match ($period) {
            'hour'  => '%Y-%m-%d %H:00:00',
            'day'   => '%Y-%m-%d',
            'month' => '%Y-%m',
            default => throw new \InvalidArgumentException("Periodo no soportado")
        };

        /* 2) Rango por defecto (últimas 48 h) para hour */
        if ($period === 'hour' && !$startDate && !$endDate) {
            $end   = now()->startOfHour();
            $start = $end->copy()->subHours(47);
        } else {
            $start = $startDate ? Carbon::parse($startDate)->startOfDay() : null;
            $end   = $endDate   ? Carbon::parse($endDate)->endOfDay()     : null;
        }

        /* 3) Promedio de seg → horas */
        $query = Ticket::selectRaw("
            DATE_FORMAT(created_at, '$fmt')   AS period,
            urgency,
            AVG(TIMESTAMPDIFF(SECOND, created_at,
                 COALESCE(resolved_at, updated_at))) / 3600 AS avg_hours
        ")
            ->whereIn('status', ['resolved', 'closed'])     // solo tickets finalizados
            ->whereNotNull('resolved_at')                   // si usas resolved_at
            ->when($start, fn($q) => $q->where('created_at', '>=', $start))
            ->when($end,   fn($q) => $q->where('created_at', '<=', $end))
            ->groupBy('period', 'urgency')
            ->orderBy('period');

        $rows = $query->get();          // cada fila: period | urgency | avg_hours

        /* 4) Si necesitas rellenar períodos vacíos, igual que antes */
        if ($rows->isEmpty()) {
            return collect();
        }

        if ($period === 'hour') {
            $filled = collect();
            for ($i = 0; $i <= $start->diffInHours($end); $i++) {
                $label = $start->copy()->addHours($i)->format('Y-m-d H:00:00');
                foreach (['low', 'medium', 'high'] as $urg) {
                    $found = $rows->firstWhere(
                        fn($r) =>
                        $r->period === $label && $r->urgency === $urg
                    );
                    $filled->push([
                        'period'    => $label,
                        'urgency'   => $urg,
                        'avg_hours' => $found->avg_hours ?? 0,
                    ]);
                }
            }
            return $filled;
        }

        /* day / month */
        $firstLabel = $rows->pluck('period')->min();
        $lastLabel  = $rows->pluck('period')->max();

        $from = $start ?? ($period === 'day'
            ? Carbon::parse($firstLabel)
            : Carbon::parse($firstLabel . '-01'));
        $to   = $end   ?? ($period === 'day'
            ? Carbon::parse($lastLabel)
            : Carbon::parse($lastLabel . '-01'));

        $step   = $period === 'day' ? '1 day' : '1 month';
        $format = $period === 'day' ? 'Y-m-d' : 'Y-m';

        $filled = collect(CarbonPeriod::create($from, $step, $to))
            ->flatMap(function (Carbon $d) use ($rows, $format) {
                $lbl = $d->format($format);
                return collect(['low', 'medium', 'high'])->map(function ($urg) use ($rows, $lbl) {
                    $found = $rows->firstWhere(
                        fn($r) =>
                        $r->period === $lbl && $r->urgency === $urg
                    );
                    return [
                        'period'    => $lbl,
                        'urgency'   => $urg,
                        'avg_hours' => $found->avg_hours ?? 0,
                    ];
                });
            });

        return $filled->values();
    }

    public function getMessagesByPeriod(
        string  $period,
        ?string $startDate = null,
        ?string $endDate   = null
    ): Collection {
        // 1) Formato SQL según período
        $fmt = match ($period) {
            'hour'  => '%Y-%m-%d %H:00:00',
            'day'   => '%Y-%m-%d',
            'month' => '%Y-%m',
            default => throw new \InvalidArgumentException("Periodo no soportado")
        };

        // 2) Rango por defecto para “hour”
        if ($period === 'hour' && !$startDate && !$endDate) {
            $end   = now()->startOfHour();
            $start = $end->copy()->subHours(47);
        } else {
            $start = $startDate ? Carbon::parse($startDate)->startOfDay() : null;
            $end   = $endDate   ? Carbon::parse($endDate)->endOfDay()     : null;
        }

        // 3) Consulta agregada sobre ChatContext.timestamp
        $query = ChatContext::select(
            DB::raw("DATE_FORMAT(timestamp, '$fmt') as period"),
            DB::raw('COUNT(*) as count')
        )
            ->when($start, fn($q) => $q->where('timestamp', '>=', $start))
            ->when($end,   fn($q) => $q->where('timestamp', '<=', $end))
            ->groupBy('period')
            ->orderBy('period');

        $rows = $query->get()->pluck('count', 'period');

        if ($rows->isEmpty()) {
            return collect();
        }

        // 4) Rellenar huecos
        if ($period === 'hour') {
            $filled = collect();
            for ($i = 0; $i <= $start->diffInHours($end); $i++) {
                $label = $start->copy()->addHours($i)->format('Y-m-d H:00:00');
                $filled->push(['period' => $label, 'count' => $rows->get($label, 0)]);
            }
            return $filled;
        }

        $firstLabel = $rows->keys()->first();
        $lastLabel  = $rows->keys()->last();

        $from = $start ?? ($period === 'day'
            ? Carbon::parse($firstLabel)
            : Carbon::parse($firstLabel . '-01'));

        $to = $end ?? ($period === 'day'
            ? Carbon::parse($lastLabel)
            : Carbon::parse($lastLabel . '-01'));

        $step   = $period === 'day' ? '1 day' : '1 month';
        $format = $period === 'day' ? 'Y-m-d' : 'Y-m';

        $filled = collect(CarbonPeriod::create($from, $step, $to))
            ->map(fn(Carbon $d) => [
                'period' => $d->format($format),
                'count'  => $rows->get($d->format($format), 0),
            ]);

        return $filled->values();
    }

    public function getDashboardMetrics(): array
    {
        // 1) Pending RealPersonRequest
        $pending = RealPersonRequest::where('status', 'pending')->count();

        // 2) Avg resolution time RealPersonRequest (en horas)
        // Sólo las ya resueltas (resolved_at no nulo)
        $avgSeconds = RealPersonRequest::whereNotNull('resolved_at')
            ->selectRaw('AVG(TIMESTAMPDIFF(SECOND, viewed_at, resolved_at)) as avg_sec')
            ->value('avg_sec') ?? 0;

        $avgHours = round($avgSeconds / 3600, 2);

        // 3) Open/In Progress Marketing tickets
        $openMk = TicketMarketing::whereIn('status', ['open', 'in_progress'])
            ->count();

        return [
            'pending_rpr'           => $pending,
            'avg_rpr_hours'         => $avgHours,
            'open_marketing_tickets' => $openMk,
        ];
    }
}
