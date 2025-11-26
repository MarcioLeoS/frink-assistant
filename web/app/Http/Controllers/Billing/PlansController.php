<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;
use App\Services\PlansService;
use Illuminate\Http\JsonResponse;

class PlansController extends Controller
{
    private PlansService $plansService;

    public function __construct(PlansService $plansService)
    {
        $this->plansService = $plansService;
    }

    /**
     * Display a listing of the resource with computed prices.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $plans = $this->plansService
                ->buildQuery()
                ->with(['features', 'subscriptions'])
                ->get()
                ->map(function ($plan) {
                    // Precio base mensual
                    $monthly = (float) $plan->price;
                    // Precio anual con 10% de descuento
                    $annual = round($monthly * 12 * 0.9, 2);

                    return [
                        'id'              => $plan->id,
                        'name'            => $plan->name,
                        'order'           => $plan->order,
                        'slug'            => $plan->slug,
                        'currency'        => $plan->currency,
                        'base_price'      => $monthly,
                        'monthly_price'   => $monthly,
                        'annual_price'    => $annual,
                        'monthly_label'   => number_format($monthly, 2, ',', '.') . ' ' . $plan->currency,
                        'annual_label'    => number_format($annual, 2, ',', '.') . ' ' . $plan->currency,
                        'features'        => $plan->features->map(fn($f) => [
                            'text' => $f->description ?? $f->code,
                            'ok'   => true,
                        ]),
                        'subscriptions'   => $plan->subscriptions,
                    ];
                });

            return response()->json(['data' => $plans]);
        } catch (\Exception $e) {
            return response()->json([
                'error'   => 'Failed to retrieve plans',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
