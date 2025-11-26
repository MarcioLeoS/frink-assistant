<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Throwable;

//Services
use App\Services\BotsService;

//Utils|Tools
use Exception;
use Illuminate\Support\FacadesLog;
use Illuminate\Validation\Rule;


class BotsController extends Controller
{
    protected $botsService;

    public function __construct(BotsService $botsService)
    {
        $this->botsService = $botsService;
    }

    /**
     * Retrieves filtered and paginated bots config.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $search = $request->input('search');
            $perPage = $request->input('perPage', 10);
            $sortBy = $request->input('sortBy', 'created_at');
            $orderBy = $request->input('orderBy', 'desc');
            $botType = $request->input('botType', null);
            $userId = $request->input('userId', null);

            //BuildQuery
            $query = $this->botsService->buildQuery($search, $sortBy, $orderBy, $botType, $userId);
            $botsConfig = $query->paginate($perPage);

            return response()->json([
                'botsConfig' => $botsConfig
            ]);
        } catch (Exception $e) {
            Log::error('Error getting bots configs: ' . $e->getMessage());
            return response()->json(['error' => 'Error getting bots configs'], 500);
        }
    }

    /**
     * POST /bot-configs
     * Create a new bot configuration.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'long_prompt'      => 'required|string',
                'short_prompt'     => 'nullable|string',
                'bot_type'         => 'required|string',
                'bot_name'         => 'required|string',
                'bot_description'  => 'nullable|string',
            ]);

            $validated['user_id'] = $request->user()->id;

            $bot = $this->botsService->store($validated);

            return response()->json($bot, 201);
        } catch (ValidationException $e) {
            // Laravel will return 422 automatically, but we can customize if needed
            return response()->json(['errors' => $e->errors()], 422);
        } catch (Throwable $e) {
            Log::error("Failed to create bot config: {$e->getMessage()}");
            return response()->json(['error' => 'Could not create bot configuration'], 500);
        }
    }


    /**
     * PUT|PATCH /bot-configs/{id}
     * Update an existing bot configuration.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'long_prompt'      => 'sometimes|required|string',
                'short_prompt'     => 'sometimes|required|string',
                'bot_type'         => 'sometimes|required|string',
                'bot_name'         => 'sometimes|required|string',
                'bot_description'  => 'nullable|string',
                'user_id'          => 'sometimes|required|integer|exists:users,id',
            ]);

            $bot = $this->botsService->update($id, $validated);

            return response()->json($bot);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Bot configuration not found'], 404);
        } catch (Throwable $e) {
            Log::error("Failed to update bot config: {$e->getMessage()}");
            return response()->json(['error' => 'Could not update bot configuration'], 500);
        }
    }

    /**
     * DELETE /bot-configs/{id}
     * Soft-delete a bot configuration.
     */
    public function delete(int $id): JsonResponse
    {
        try {
            $this->botsService->delete($id);
            return response()->json(null, 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Bot configuration not found'], 404);
        } catch (Throwable $e) {
            Log::error("Failed to delete bot config: {$e->getMessage()}");
            return response()->json(['error' => 'Could not delete bot configuration'], 500);
        }
    }

    /**
     * PATCH /bot-configs/{id}/restore
     * Restore a soft-deleted bot configuration.
     */
    public function restore(int $id): JsonResponse
    {
        try {
            $this->botsService->restore($id);
            return response()->json(null, 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Bot configuration not found'], 404);
        } catch (Throwable $e) {
            Log::error("Failed to restore bot config: {$e->getMessage()}");
            return response()->json(['error' => 'Could not restore bot configuration'], 500);
        }
    }

    /**
     * DELETE /bot-configs/{id}/force
     * Permanently delete a bot configuration.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->botsService->destroy($id);
            return response()->json(null, 204);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Bot configuration not found'], 404);
        } catch (Throwable $e) {
            Log::error("Failed to permanently delete bot config: {$e->getMessage()}");
            return response()->json(['error' => 'Could not permanently delete bot configuration'], 500);
        }
    }
}
