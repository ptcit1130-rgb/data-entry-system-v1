<?php

namespace App\Http\Controllers;

use Inertia\Response;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        return Inertia::render('dashboard', [
            'stats' => [
                'name' => $user->name,
            ],
        ]);
    }
}
