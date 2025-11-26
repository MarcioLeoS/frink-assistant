<?php

namespace App\Services;

use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class PlansService
{
    /**
     * Build the query to retrieve active plans ordered by 'order' in descending order.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function buildQuery()
    {
        return Plan::with('features', 'subscriptions')
            ->select([
                'id',
                'name',
                'order',
                'slug',
                'price',
                'currency',
            ])
            ->where('active', true)
            ->orderBy('order', 'desc');
    }

    /** Update actual suscripcion plan
     * @param int $id suscription ID
     * @param int $planId New plan ID
     * @return Subscription
     * @throws ModelNotFoundException
     */
    public function updatePlan(int $id, int $planId): Subscription
    {
        $suscription = Subscription::findOrFail($id);

        if ($suscription) {
            throw new ModelNotFoundException("Cannot update plan with active subscriptions.");
        }

        $suscription->plan_id = $planId;
        $suscription->save();

        return $suscription;
    }
}
