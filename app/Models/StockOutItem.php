<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

#[Fillable([
    'stock_out_id',
    'stock_in_item_id',
    'total_boxes',
    'total_box_distributes',
    'status',
])]
class StockOutItem extends Model
{   
    use HasUuids;

    /**
     * Get the route key for the model.
     *
     * @return string The column name used for route model binding.
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * Get the unique ID columns for the model.
     *
     * @return array<int, string> The columns that should receive unique IDs.
     */
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'total_box_distributes' => 'array',
            'total_boxes'           => 'integer',
        ];
    }

    /**
    * @return BelongsTo<StockOut, $this>
    */
    public function stockOut(): BelongsTo
    {
        return $this->belongsTo(StockOut::class);
    }

    /**
     * @return BelongsTo<StockInItem, $this>
     */
    public function stockInItem(): BelongsTo
    {
        return $this->belongsTo(StockInItem::class);
    }

    /**
     * @return HasOneThrough<ProductItem,StockInItem, $this>
     */
    public function productItem(): HasOneThrough
    {
        return $this->hasOneThrough(
            ProductItem::class,
            StockInItem::class,
            'id',
            'id',
            'stock_in_item_id',
            'product_item_id'
        );
    }
}