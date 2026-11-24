<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\BranchLocation;
use App\Http\Requests\StoreBranchLocationRequest;
use App\Http\Requests\UpdateBranchLocationRequest;

class BranchLocationController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreBranchLocationRequest $request
    ) {
        $partnerId = $request->user()
            ->businessPartners()
            ->where('uuid', $request->validated('partner_id'))
            ->pluck('id')
            ->first();


        BranchLocation::create([
            ...$request->safe()->except('partner_id'),
            'partner_id' => $partnerId
        ]);

        return back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBranchLocationRequest $request, BranchLocation $branchLocation) {

        $branchLocation->update($request->safe()->except('partner_id'));
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Branch location updated successfully.')]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BranchLocation $branchLocation)
    {
        $branchLocation->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Branch location deleted successfully.')]);

        return back();
    }
}
