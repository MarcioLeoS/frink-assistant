<?php

namespace App\Http\Controllers\Billing;

use App\Http\Controllers\Controller;

use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index(): JsonResponse
    {
        $subscription = Subscription::with('plan')->where('status', 'active')->first();

        if (!$subscription) {
            return response()->json(['data' => null], 404);
        }

        $subscription->next_renewal_formatted = $subscription->next_renewal->format('d/m/Y');

        return response()->json(['data' => $subscription]);
    }

    public function subscribe($id, Request $request): JsonResponse
    {
        $data = $request->validate([
            'interval' => 'required|string|in:month,year',
        ]);

        DB::beginTransaction();

        try {
            $subscription = Subscription::first();

            if (!$subscription) {
                $subscription = Subscription::create([
                    'plan_id' => $id,
                    'status' => 'active',
                    'next_renewal' => $data['interval'] === 'month' ? Carbon::now()->addMonth() : Carbon::now()->addYear(),
                ]);
            } else {
                $subscription->plan_id = $id;
                $subscription->status = 'active';
                $subscription->next_renewal = $data['interval'] === 'month' ? Carbon::now()->addMonth() : Carbon::now()->addYear();
            }

            DB::commit();

            return response()->json([
                'message' => 'Subscription updated successfully',
                'plan_id' => $id,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to update subscription',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
