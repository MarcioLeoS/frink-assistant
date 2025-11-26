<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UsersController extends Controller
{
    /**
     * Return a list of all users or agents.
     * If the route is /agents, filter by role 'agent'.
     */
    public function index(Request $request)
    {
        // Detect if the request is for agents or all users
        if ($request->is('agents*')) {
            // Ajusta el filtro según tu modelo de roles
            $agents = User::all();
            return response()->json($agents);
        }

        // Default: return all users
        $users = User::all();
        return response()->json($users);
    }

    /**
     * Show a specific user or agent.
     */
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($user);
    }

}