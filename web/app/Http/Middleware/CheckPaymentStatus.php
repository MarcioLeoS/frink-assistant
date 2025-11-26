<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Subscription;

class CheckPaymentStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if (env('PAYMENT_VALIDATION') !== 'true') {
            return $next($request);
        }

        // Lógica del middleware
        $subscription = Subscription::where('status', 'active')->first();

        if (!$subscription) {
            return response()->view('errors.payment-required');
        }

        $nextRenewalDate = Carbon::parse($subscription->next_renewal);
        $gracePeriodEnd = $nextRenewalDate->addDays(10);

        if (Carbon::now()->greaterThan($gracePeriodEnd)) {
            return response()->view('errors.payment-required');
        }

        return $next($request);
    }
}