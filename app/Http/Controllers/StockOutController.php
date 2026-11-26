<?php

namespace App\Http\Controllers;

use App\Enums\RackStatus;
use App\Http\Requests\StoreStockOutRequest;
use App\Http\Requests\UpdateStockOutRequest;
use App\Models\BusinessPartner;
use App\Models\ProductItem;
use App\Models\StockIn;
use App\Models\StockOut;
use App\Models\StockOutItem;
use Inertia\Inertia;

class StockOutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stockOut = StockOut::query()
            ->with('branchLocation.businessPartner')
            ->latest()
            ->get();

        $businessPartner = BusinessPartner::query()
            ->with('branchLocations')
            ->orderBy('brand_name')
            ->get(['id', 'brand_name']);

        return Inertia::render('stock-out/page', [
            'stock_outs'        => $stockOut,
            'business_partners' => $businessPartner,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreStockOutRequest $request
    ) {
        StockOut::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Stock-out created successfully.')]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(StockOut $stockOut)
    {   
        $stockOutItem = StockOutItem::query()
            ->where('stock_out_id', $stockOut->id)
            ->latest()
            ->get();

        $productItems = ProductItem::query()
            ->with('stockInItems')
            ->get()
            ->map(function (ProductItem $product) {
                $racks = $product
                    ->stockInItems
                    ->flatMap(fn($item) => $item->total_box_distributes ?? []);
                
                return [
                    'product_code' => $product->product_code,
                    'description'  => $product->description,
                    'full'         => (int) $racks->where('status', RackStatus::Full->value)->sum('boxes'),
                    'partials'     => (int) $racks->where('status', RackStatus::Partial->value)->sum('boxes'),
                ];
            });

        return Inertia::render('stock-out-item/page', [
            'stock_out'       => $stockOut,
            'stoct_out_items' => $stockOutItem,
            'product_items'   => $productItems,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStockOutRequest $request, StockOut $stockOut)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockOut $stockOut)
    {
        //
    }
}
