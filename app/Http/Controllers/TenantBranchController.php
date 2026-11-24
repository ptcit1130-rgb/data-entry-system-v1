<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTenantBranchRequest;
use App\Http\Requests\UpdateTenantBranchRequest;
use App\Models\ProductCategory;
use App\Models\TenantBranch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TenantBranchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $tenantBranches = $request->user()
            ->tenantBranches()
            ->latest()
            ->get();

        return Inertia::render('tenant-branch/page', [
            'tenant_branches' => $tenantBranches
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreTenantBranchRequest $request
    ) {
        $request->user()
            ->tenantBranches()
            ->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Tenant branch created successfully.')]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(TenantBranch $tenantBranch)
    {
        $inventoryMovement = $tenantBranch
            ->inventoryMovements()
            ->with(['tenantBranch', 'productCategory'])
            ->latest()
            ->get();

        return Inertia::render('inventory-movement/page', [
            'tenant_branches'    => $tenantBranch,
            'inventory_products' => $inventoryMovement,
            'product_categories' => ProductCategory::all()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateTenantBranchRequest $request,
        TenantBranch $tenantBranch
    ) {
        $tenantBranch->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Tenant branch updated successfully.')]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TenantBranch $tenantBranch)
    {
        $tenantBranch->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Tenant branch deleted successfully.')]);

        return back();

    }
}
