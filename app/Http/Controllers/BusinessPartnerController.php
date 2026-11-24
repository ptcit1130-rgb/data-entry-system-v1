<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBusinessPartnerRequest;
use App\Http\Requests\UpdateBusinessPartnerRequest;
use App\Models\BranchLocation;
use App\Models\BusinessPartner;
use App\Models\DistributorSpecialist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BusinessPartnerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $businessPartners = $request->user()
            ->businessPartners()
            ->latest()
            ->get();

        return Inertia::render('business-partner/page', [
            'business_partners' => $businessPartners
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreBusinessPartnerRequest $request
    ) {
        BusinessPartner::create([
            ...$request->validated(),
            'user_id' => $request->user()->id
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Business partner created successfully.')]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(BusinessPartner $businessPartner)
    {
        $branchLocations = $businessPartner
            ->branchLocations()
            ->with(['businessPartner', 'distributorSpecialist'])
            ->latest()
            ->get();

        return Inertia::render('branch-location/page', [
            'business_partner' => $businessPartner,
            'branch_locations' => $branchLocations,
            'specialists'      => DistributorSpecialist::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateBusinessPartnerRequest $request,
        BusinessPartner $businessPartner
    ) {
        $businessPartner->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Business partner updated successfully.')]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BusinessPartner $businessPartner)
    {
        $businessPartner->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Business partner deleted successfully.')]);

        return back();
    }
}
