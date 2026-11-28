<?php

namespace App\Http\Controllers;

use App\Enums\RackStatus;
use App\Http\Requests\StoreStockOutItemRequest;
use App\Http\Requests\UpdateStockOutItemRequest;
use App\Models\ProductItem;
use App\Models\StockInItem;
use App\Models\StockOut;
use App\Models\StockOutItem;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Database\Eloquent\Builder;

class StockOutItemController extends Controller
{
    private const CRITICAL_DAYS = 60;   // <= 60 days left (or expired) => red
    private const MID_DAYS      = 120;  // <= 120 days => amber, otherwise green

    public function pick(StockOut $stockOut, ProductItem $productItem)
    {
        $productItem->load('productCategory');

        return Inertia::render('stock-out-item/pick', [
            'stock_out'        => $stockOut->only(['uuid', 'widrawal_slip_number']),
            'product_item'     => $productItem,
            'rack_allocations' => $this->racksWithBatch($productItem->productCategory->sku),
        ]);
    }

    /** 
     * Every occupied rack of this layout, tagged with its batch and expiration tier. 
    */
    private function racksWithBatch(string $sku): Collection
    {
        return $this->sameSku($sku)
            ->with('productItem:id,uuid')
            ->get(['id', 'uuid', 'product_item_id', 'expiration', 'total_box_distributes'])
            ->flatMap(fn(StockInItem $batch) => collect($batch->total_box_distributes)->map(fn($rack) => [
                ...$rack,
                'stock_in_item_uuid' => $batch->uuid,
                'product_item_uuid'  => $batch->productItem->uuid,
                'expiration'         => $batch->expiration->toDateString(),
                'days_left'          => $this->daysLeft($batch->expiration),
                'tier'               => $this->tier($batch->expiration),
            ]))
            ->values();
    }

    private function daysLeft(CarbonInterface $expiration): int
    {
        return (int) now()->startOfDay()->diffInDays($expiration->startOfDay(), false);
    }

    private function tier(CarbonInterface $expiration): string
    {
        $days = $this->daysLeft($expiration);

        return match (true) {
            $days <= self::CRITICAL_DAYS => 'critical',
            $days <= self::MID_DAYS      => 'mid',
            default                      => 'far',
        };
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStockOutItemRequest $request)
    {
        $data = $request->validated();

        DB::transaction(function () use ($data) {
            $stockOutId = StockOut::where('uuid', $data['stock_out_id'])->value('id');

            foreach (collect($data['picks'])->groupBy('stock_in_item_uuid') as $uuid => $rows) {
                $batch = StockInItem::where('uuid', $uuid)->lockForUpdate()->firstOrFail();
                $racks = collect($batch->total_box_distributes ?? [])->values();
                $taken = [];

                foreach ($rows as $pick) {
                    $i     = $racks->search(fn($r) => $r['rack_number'] === $pick['rack_number']);
                    $boxes = (int) $pick['boxes'];

                    /**
                     * another user may have taken this rack since the page loaded
                     */
                    if ($i === false || $boxes > (int) $racks[$i]['boxes']) {
                        throw ValidationException::withMessages([
                            'picks' => __('Rack :rack is no longer available with that quantity.', [
                                'rack' => $pick['rack_number'],
                            ]),
                        ]);
                    }

                    $rack = $racks[$i];

                    $taken[] = [
                        'rack_number'  => $rack['rack_number'],
                        'product_code' => $rack['product_code'],
                        'tagging'      => $rack['tagging'],
                        'boxes'        => $boxes,
                    ];

                    $rack['boxes'] = (int) $rack['boxes'] - $boxes;
                    if ($rack['boxes'] > 0) {
                        $rack['status'] = RackStatus::Partial->value;
                    }
                    $racks[$i] = $rack;
                }

                $takenTotal = collect($taken)->sum('boxes');
                $left       = $racks->filter(fn($r) => $r['boxes'] > 0)->values();

                $this->recordStockOut($stockOutId, $batch, $taken, $takenTotal, $data['status']);

                /**
                 * this is the "update total_box_distributes" step
                 */
                $batch->update([
                    'total_box_distributes' => $left->isEmpty() ? null : $left->all(),
                    'total_boxes'           => (int) $batch->total_boxes - $takenTotal,
                ]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Stock-out item created successfully.')]);

        return to_route('stock-outs.show', $data['stock_out_id']);
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
            ->whereHas('productItem.productCategory', fn($q) => $q->whereIn('sku', $this->skusSharing($sku)));
    }

    private function racksOf(string $sku)
    {
        return $this->sameSku($sku)
            ->get(['id', 'total_box_distributes'])
            ->flatMap(fn($i) => $i->total_box_distributes)
            ->values();
    }

    /**
     * Display the specified resource.
     */
    public function show(StockOutItem $stockOutItem)
    {
        $stockInItem = $stockOutItem->stockInItem()
            ->with('productItem.productCategory')
            ->firstOrFail();

        $sku = $stockInItem->productItem->productCategory->sku;

        return Inertia::render('available-stock/page', [
            'mode'             => 'stock-out',
            'stock_in_items'   => $stockInItem,
            'rack_allocations' => $this->racksOf($sku),
            'released_racks'   => $stockOutItem->total_box_distributes ?? [],
            'stock_out_item'   => $stockOutItem->only(['uuid', 'total_boxes']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StockOutItem $stockOutItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStockOutItemRequest $request, StockOutItem $stockOutItem)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockOutItem $stockOutItem)
    {
        //
    }
    
    /**
     * Create the stock-out item, or add to the existing row for the same batch.
     *
     * @param array<int, array<string, mixed>> $taken
     */
    private function recordStockOut(int $stockOutId, StockInItem $batch, array $taken, int $takenTotal, string $status): void
    {
        $existing = StockOutItem::query()
            ->where('stock_out_id', $stockOutId)
            ->where('stock_in_item_id', $batch->id)
            ->lockForUpdate()
            ->first();

        if ($existing) {
            $existing->update([
                'total_boxes'           => (int) $existing->total_boxes + $takenTotal,
                'total_box_distributes' => $this->mergeRacks($existing->total_box_distributes ?? [], $taken),
            ]);

            return;
        }

        StockOutItem::create([
            'stock_out_id'          => $stockOutId,
            'stock_in_item_id'      => $batch->id,
            'total_boxes'           => $takenTotal,
            'total_box_distributes' => $taken,
            'status'                => $status,
        ]);
    }

    /**
     * Combine rack lists, adding up boxes when the same rack appears twice.
     *
     * @param array<int, array<string, mixed>> $current
     * @param array<int, array<string, mixed>> $new
     * @return array<int, array<string, mixed>>
     */
    private function mergeRacks(array $current, array $new): array
    {
        return collect($current)
            ->merge($new)
            ->groupBy('rack_number')
            ->map(fn($group) => [
                ...$group->first(),
                'boxes' => $group->sum('boxes'),
            ])
            ->values()
            ->all();
    }
}
