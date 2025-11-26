<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

//Models
use App\Models\Ticket;

//Services
use App\Services\AnalyticsService;

//Utils|Tools
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class AnalyticsController extends Controller
{
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function getTicketsByPeriodAnalytics(Request $request)
    {
        $params = $request->validate([
            'period'     => ['required', Rule::in(['hour', 'day', 'month'])],
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date'   => ['nullable', 'date_format:Y-m-d'],
        ]);

        $data = $this->analyticsService->getTicketsByPeriod(
            $params['period'],
            $params['start_date'] ?? null,
            $params['end_date'] ?? null
        );

        return response()->json([
            'period' => $params['period'],
            'range'  => [
                'from' => $params['start_date'] ?? 'beginning',
                'to'   => $params['end_date'] ?? 'now',
            ],
            'data'   => $data,
        ]);
    }

    /**
     *
     *
     * Params:
     *   - start_date (optional) 'YYYY-MM-DD'
     *   - end_date   (optional) 'YYYY-MM-DD'
     */
    public function getAvgResolutionTimeAnalytics(Request $request)
    {
        $params = $request->validate([
            'period'     => ['required', Rule::in(['hour', 'day', 'month'])],
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date'   => ['nullable', 'date_format:Y-m-d'],
            'urgency'    => ['nullable', Rule::in(['low', 'medium', 'high', 'all'])],
        ]);

        $data = $this->analyticsService->getAvgResolutionTime(
            $params['period'],
            $params['start_date'] ?? null,
            $params['end_date']   ?? null
        );

        // Si se pidió una urgencia concreta, filtramos la colección:
        if (($params['urgency'] ?? 'all') !== 'all') {
            $data = $data->where('urgency', $params['urgency'])->values();
        }

        return response()->json([
            'period' => $params['period'],
            'range'  => [
                'from' => $params['start_date'] ?? 'beginning',
                'to'   => $params['end_date']   ?? 'now',
            ],
            'data'   => $data,
        ]);
    }

    public function getMessagesByPeriodAnalytics(Request $request)
    {
        $params = $request->validate([
            'period'     => ['required', Rule::in(['hour', 'day', 'month'])],
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date'   => ['nullable', 'date_format:Y-m-d'],
        ]);

        $data = $this->analyticsService->getMessagesByPeriod(
            $params['period'],
            $params['start_date'] ?? null,
            $params['end_date'] ?? null
        );

        return response()->json([
            'period' => $params['period'],
            'range'  => [
                'from' => $params['start_date'] ?? 'beginning',
                'to'   => $params['end_date']   ?? 'now',
            ],
            'data'   => $data,
        ]);
    }

    public function getDashboardMetrics()
    {
        $metrics = $this->analyticsService->getDashboardMetrics();

        return response()->json([
            'pendingRealPersonRequests'   => $metrics['pending_rpr'],
            'avgRealPersonResolutionHrs'  => $metrics['avg_rpr_hours'],
            'openMarketingTickets'        => $metrics['open_marketing_tickets'],
        ]);
    }
}
