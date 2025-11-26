<?php

namespace App\Services;

use App\Models\BotConfig;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class BotsService
{
    /**
     * Build a query for filtering and sorting bot configurations.
     *
     * @param  string|null  $search
     * @param  string       $sortBy
     * @param  string       $orderBy
     * @param  string|null  $botType
     * @param  int|null     $userId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function buildQuery(
        ?string $search   = null,
        string  $sortBy   = 'created_at',
        string  $orderBy  = 'desc',
        ?string $botType  = null,
        ?int    $userId   = null
    ) {
        $validColumns = [
            'long_prompt',
            'short_prompt',
            'bot_type',
            'bot_name',
            'bot_description',
            'created_at',
            'updated_at',
        ];

        $sortBy  = in_array($sortBy, $validColumns, true) ? $sortBy : 'created_at';
        $orderBy = strtolower($orderBy) === 'asc' ? 'asc' : 'desc';

        return BotConfig::with('user')
            ->when($search, function ($q, $search) {
                $q->where(function ($q2) use ($search) {
                    $q2->where('bot_name', 'like', "%{$search}%")
                       ->orWhere('bot_description', 'like', "%{$search}%")
                       ->orWhereHas('user', function ($q3) use ($search) {
                           $q3->where('name', 'like', "%{$search}%")
                              ->orWhere('email', 'like', "%{$search}%");
                       });
                });
            })
            ->when($botType, function ($q, $botType) {
                $q->where('bot_type', $botType);
            })
            ->when($userId, function ($q, $userId) {
                $q->where('user_id', $userId);
            })
            ->orderBy($sortBy, $orderBy);
    }

    /**
     * Store a newly created bot configuration.
     *
     * @param  array  $data
     * @return BotConfig
     */
    public function store(array $data): BotConfig
    {
        return DB::transaction(function () use ($data) {
            return BotConfig::create($data);
        });
    }

    /**
     * Retrieve the specified bot configuration.
     *
     * @param  int  $id
     * @return BotConfig
     *
     * @throws ModelNotFoundException
     */
    public function show(int $id): BotConfig
    {
        return BotConfig::withTrashed()->findOrFail($id);
    }

    /**
     * Update the specified bot configuration.
     *
     * @param  int    $id
     * @param  array  $data
     * @return BotConfig
     *
     * @throws ModelNotFoundException
     */
    public function update(int $id, array $data): BotConfig
    {
        return DB::transaction(function () use ($id, $data) {
            $bot = BotConfig::findOrFail($id);
            $bot->fill($data);
            $bot->save();
            return $bot;
        });
    }

    /**
     * Soft-delete the specified bot configuration.
     *
     * @param  int  $id
     * @return void
     *
     * @throws ModelNotFoundException
     */
    public function delete(int $id): void
    {
        $bot = BotConfig::findOrFail($id);
        $bot->delete();
    }

    /**
     * Restore a soft-deleted bot configuration.
     *
     * @param  int  $id
     * @return void
     *
     * @throws ModelNotFoundException
     */
    public function restore(int $id): void
    {
        $bot = BotConfig::withTrashed()->findOrFail($id);
        $bot->restore();
    }

    /**
     * Permanently delete the specified bot configuration.
     *
     * @param  int  $id
     * @return void
     *
     * @throws ModelNotFoundException
     */
    public function destroy(int $id): void
    {
        $bot = BotConfig::withTrashed()->findOrFail($id);
        $bot->forceDelete();
    }
}
