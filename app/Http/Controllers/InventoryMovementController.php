<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInventoryMovementRequest;
use App\Http\Requests\UpdateInventoryMovementRequest;
use App\Models\InventoryMovement;
use App\Models\TenantBranch;
use Inertia\Inertia;

class InventoryMovementController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreInventoryMovementRequest $request
    ) {
        $tenantBranchId = TenantBranch::query()
            ->where('uuid', $request->validated('tenant_branch_id'))
            ->pluck('id')
            ->first();

        InventoryMovement::create([
            ...$request->safe()->except('tenant_branch_id'),
            'tenant_branch_id' => $tenantBranchId
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Area created successfully.')]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(InventoryMovement $inventoryMovement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateInventoryMovementRequest $request,
        InventoryMovement $inventoryMovement
    ) {
        $inventoryMovement->update($request->safe()->except('tenant_branch_id'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Area updated successfully.')]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(
        InventoryMovement $inventoryMovement
    ) {
        $inventoryMovement->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Area deleted successfully.')]);

        return back();
    }
}
