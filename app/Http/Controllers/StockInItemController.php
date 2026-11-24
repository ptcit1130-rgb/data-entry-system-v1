<?php

namespace App\Http\Controllers;

use App\Enums\RackStatus;
use App\Http\Requests\StoreStockInItemRequest;
use App\Http\Requests\UpdateStockInItemRequest;
use App\Models\ProductItem;
use App\Models\StockInItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Database\Eloquent\Builder;

class StockInItemController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStockInItemRequest $request)
    {
        $stockInId = $request->user()
            ->stockIns()
            ->where('uuid', $request->validated('stock_in_id'))
            ->value('id');

        $productItemId = ProductItem::query()
            ->where('uuid', $request->validated('product_item_id'))
            ->value('id');

        StockInItem::create([
            ...$request->safe()->except(['stock_in_id', 'product_item_id']),
            'stock_in_id'     => $stockInId,
            'product_item_id' => $productItemId,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Stock-in items created successfully.'),
        ]);

        return back();
    }

    private const SHARED_LAYOUTS = [
        ['150ml', '250ml'],
    ];

    private function skusSharing(string $sku): array
    {
        foreach (self::SHARED_LAYOUTS as $group) {
            if (in_array($sku, $group, true)) {
                return $group;
            }
        }

        return [$sku];
    }

    /**
     * Stock-in items that use the same SKU (and therefore the same rack layout).
     */
    private function sameSku(string $sku): Builder
    {
        return StockInItem::query()
            ->whereNotNull('total_box_distributes')
            ->whereHas('productItem.productCategory', fn ($q) => $q->whereIn('sku', $this->skusSharing($sku)));
    }

    private function racksOf(string $sku)
    {
        return $this->sameSku($sku)
            ->get(['id', 'total_box_distributes'])
            ->flatMap(fn ($i) => $i->total_box_distributes)
            ->values();
    }

    /**
     * Display the specified resource.
     */
    public function show(StockInItem $stockInItem)
    {
        $stockInItem->load('productItem.productCategory');

        $sku = $stockInItem->productItem->productCategory->sku;

        return Inertia::render('available-stock/page', [
            'stock_in_items'   => $stockInItem,
            'rack_allocations' => $this->racksOf($sku),  
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StockInItem $stockInItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStockInItemRequest $request, StockInItem $stockInItem)
    {
        $rack = $request->validated('rack_number');

        DB::transaction(function () use ($stockInItem, $rack) {
            $item = StockInItem::query()
                ->with('productItem.productCategory')
                ->lockForUpdate()
                ->findOrFail($stockInItem->id);

            $category = $item->productItem->productCategory;

            /** lock every row of the SAME SKU that already holds racks */
            $taken = $this->sameSku($category->sku)
                ->lockForUpdate()
                ->get(['id', 'total_box_distributes'])
                ->flatMap(fn ($i) => $i->total_box_distributes)
                ->contains('rack_number', $rack);

            if ($taken) {
                throw ValidationException::withMessages([
                    'rack_number' => __('This rack is already occupied.'),
                ]);
            }

            $distributes = collect($item->total_box_distributes ?? []);
            $remaining   = $item->total_boxes - $distributes->sum('boxes');

            if ($remaining <= 0) {
                throw ValidationException::withMessages([
                    'rack_number' => __('All boxes are already allocated.'),
                ]);
            }

            $stacking = (int) $category->stacking;
            $boxes    = $stacking > 0 ? min($stacking, $remaining) : $remaining;

            $distributes->push([
                'rack_number'  => $rack,
                'product_code' => $item->productItem->product_code,
                'tagging'      => $item->tagging,
                'boxes'        => $boxes,
                'status'       => ($stacking > 0 && $boxes >= $stacking)
                    ? RackStatus::Full->value
                    : RackStatus::Partial->value,
            ]);

            $item->update(['total_box_distributes' => $distributes->all()]);
        });

        Inertia::flash('toast', [
            'type'    => 'success',
            'message' => __('Rack :rack assigned.', ['rack' => $rack]),
        ]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockInItem $stockInItem)
    {
        //
    }

    public function removeRack(Request $request, StockInItem $stockInItem)
    {
        $rack = $request->validate([
            'rack_number' => ['required', 'string', 'regex:/^(#\d{1,3}[ABC]?|P\d{1,2})$/'],
        ])['rack_number'];

        DB::transaction(function () use ($stockInItem, $rack) {
            $item = StockInItem::lockForUpdate()->findOrFail($stockInItem->id);

            $distributes = collect($item->total_box_distributes ?? []);

            /**
             * can only remove a rack that belongs to THIS stock-in item
             */
            if (! $distributes->contains('rack_number', $rack)) {
                throw ValidationException::withMessages([
                    'rack_number' => __('This rack does not belong to this stock-in item.'),
                ]);
            }

            $left = $distributes->reject(fn ($d) => $d['rack_number'] === $rack)->values();

            $item->update([
                'total_box_distributes' => $left->isEmpty() ? null : $left->all(),
            ]);
        });

        Inertia::flash('toast', ['type'    => 'success','message' => __('Rack :rack removed.', ['rack' => $rack])]);

        return back();
    }
}
