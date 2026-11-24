<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\DistributorSpecialist;
use App\Http\Requests\StoreDistributorSpecialistRequest;
use App\Http\Requests\UpdateDistributorSpecialistRequest;
use Illuminate\Http\Request;

class DistributorSpecialistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $specialists = $user->distributorSpecialists()->latest()->get();

        return Inertia::render('distributor-specialists/page', [
            'specialists' => $specialists
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreDistributorSpecialistRequest $request
    ) {
        DistributorSpecialist::create([
            ...$request->validated(),
            'user_id' => $request->user()->id
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Distributor specialist created successfully.')]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(
        DistributorSpecialist $distributorSpecialist
    ) {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateDistributorSpecialistRequest $request,
        DistributorSpecialist $distributorSpecialist
    ) {
        $distributorSpecialist->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Distributor specialist updated successfully.')]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(
        DistributorSpecialist $distributorSpecialist
    ) {
        $distributorSpecialist->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Distributor specialist deleted successfully.')]);

        return back();
    }
}
