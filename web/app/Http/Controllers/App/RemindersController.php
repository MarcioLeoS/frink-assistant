<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Models
use App\Models\Customer;
use App\Models\Reminder;
use App\Models\ReminderCategory;
use App\Models\Conversation;
// Services
use App\Services\RemindersService;

// Utils/Tools
use Exception;
use Illuminate\Support\Facades\Log;


class RemindersController extends Controller
{
    private $remindersService;
    private $defaultRows;


    public function __construct(RemindersService $remindersService)
    {
        $this->remindersService = $remindersService;
        $this->defaultRows = config('constants.DEFAULT_ROWS_PAGINATION');
    }

    /**
     * Get reminders data with pagination and search functionality.
     */
    public function getData(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('perPage', $this->defaultRows);
        $sortBy = $request->input('sortBy', 'created_at');
        $orderBy = $request->input('orderBy', 'desc');
        $categoryId = $request->input('categoryId', '');

        // Build query
        $query = $this->remindersService->buildQuery($search, $sortBy, $orderBy, (int) $categoryId);
        $reminders = $query->paginate($perPage);
        $remindersQuantity = Reminder::count();

        return response()->json([
            'total' => $remindersQuantity,
            'reminders' => $reminders
        ]);
    }

    /**
     * Get specific conversation data.
     */
    public function getConversationEspecificData(Request $request, $id)
    {
        $conversation = Conversation::with('customer', 'chatContexts')->findOrFail($id);

        return response()->json([
            'conversation' => $conversation,
            'totalMessages' => count($conversation->chatContexts),
        ]);
    }

    /**
     * Get all reminder categories.
     */
    public function getCategories()
    {
        $categories = ReminderCategory::all();

        return response()->json($categories);
    }

    /**
     * Store a new reminder.
     */
    public function storeData(Request $request)
    {
        try {
            $validated = $request->validate([
                'content' => 'required|string',
                'description' => 'nullable|string',
                'observation' => 'nullable|string',
                'remind_at' => 'nullable|date',
                'customer_id' => 'required|exists:customer,id',
                'category_id' => 'required|exists:reminder_categories,id'
            ]);

            $id = $this->remindersService->storeReminder($validated);

            return response()->json($id);
        } catch (Exception $e) {
            Log::error('Error creating reminder: ' . $e->getMessage());
            return response()->json(['error' => 'Error creating reminder: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Store a new reminder category.
     */
    public function storeCategory(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string',
                'description' => 'nullable|string',
            ]);

            $id = $this->remindersService->storeCategory($validated);

            return response()->json($id);
        } catch (Exception $e) {
            Log::error('Error creating category: ' . $e->getMessage());
            return response()->json(['error' => 'Error creating category: ' . $e->getMessage()], 500);
        }
    }
}
