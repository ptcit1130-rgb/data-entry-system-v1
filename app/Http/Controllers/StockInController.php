<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStockInRequest;
use App\Http\Requests\UpdateStockInRequest;
use App\Models\ProductItem;
use App\Models\StockIn;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockInController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $stockIns = $request->user()
            ->stockIns()
            ->latest()
            ->get();

        return Inertia::render('stock-in/page', [
            'stock_ins' => $stockIns
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreStockInRequest $request
    ) {
        $request->user()
            ->stockIns()
            ->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Stock in created successfully.')]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(
        StockIn $stockIn
    ) {
        $stockInItems = $stockIn->stockInItems()
            ->with(['stockIn', 'productItem.productCategory'])
            ->latest()
            ->get();

        $productItems = ProductItem::query()
            ->with('productCategory:id,name,sku,stacking')
            ->orderby('product_code')
            ->latest()
            ->get();

        return Inertia::render('stock-in-item/page', [
            'stock_in_items' => $stockInItems,
            'stock_ins'      => $stockIn,
            'product_items'  => $productItems
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateStockInRequest $request,
        StockIn $stockIn
    ) {
        $stockIn->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Stock in updated successfully.')]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockIn $stockIn)
    {
        $stockIn->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Stock in deleted successfully.'),]);

        return back();
    }
}
