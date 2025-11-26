<?php

namespace App\Http\Controllers\App;

use App\Http\Controllers\Controller;

use App\Models\Alerts;
use Illuminate\Http\Request;

class AlertsController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('perPage', 20);
        $alerts = Alerts::orderByDesc('created_at')->paginate($perPage);
        return response()->json($alerts);
    }
}
