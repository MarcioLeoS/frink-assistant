<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\RealPersonRequestService;
use Illuminate\Http\JsonResponse;
use Exception;

class RealPersonRequestController extends Controller
{
    protected $service;

    public function __construct(RealPersonRequestService $service)
    {
        $this->service = $service;
    }

    /**
     * Retrieve a list of all real person requests with customer information.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $requests = $this->service->getAllWithCustomer();
            return response()->json($requests);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error fetching requests', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Retrieve a specific real person request by its ID, including customer info.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        try {
            $request = $this->service->getByIdWithCustomer($id);
            if (!$request) {
                return response()->json(['message' => 'Not found'], 404);
            }
            return response()->json($request);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error fetching request', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Create a new real person request.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'question' => 'required|string',
                'customer_id' => 'required|exists:customers,id',
                'status' => 'required|string',
            ]);
            $created = $this->service->create($data);
            return response()->json($created, 201);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error creating request', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update an existing real person request.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $data = $request->validate([
                'viewed_at' => 'nullable|date',
                'taken_at' => 'nullable|date',
                'resolved_at' => 'nullable|date',
                'agent_id' => 'nullable|exists:users,id',
                'question' => 'nullable|string',
                'response' => 'nullable|string',
                'status' => 'nullable|string',
                'observations' => 'nullable|string',
            ]);

            $data['viewed_at'] = date('Y-m-d H:i:s', strtotime($request->input('viewed_at')));

            $updated = $this->service->update($id, $data);
            if (!$updated) {
                return response()->json(['message' => 'Not found'], 404);
            }
            return response()->json($updated);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error updating request', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Assign an agent to a real person request.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function assignAgent(Request $request, $id): JsonResponse
    {
        try {
            $data = $request->validate([
                'agent_id' => 'required|exists:users,id',
            ]);
            $updated = $this->service->assignAgent($id, $data['agent_id']);
            if (!$updated) {
                return response()->json(['message' => 'Not found'], 404);
            }
            return response()->json($updated);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error assigning agent', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete a real person request by its ID.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        try {
            $deleted = $this->service->delete($id);
            if (!$deleted) {
                return response()->json(['message' => 'Not found'], 404);
            }
            return response()->json(['message' => 'Deleted']);
        } catch (Exception $e) {
            return response()->json(['message' => 'Error deleting request', 'error' => $e->getMessage()], 500);
        }
    }
}
