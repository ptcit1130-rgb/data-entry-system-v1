<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use App\Enums\StockInItemStatus;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

#[Fillable([
    'stock_in_id',
    'product_item_id',
    'unit_of_measure',
    'tagging',
    'total_boxes',
    'total_box_distributes',
    'manufactured',
    'expiration',
    'status'
])]
class StockInItem extends Model
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
            'manufactured'          => 'date',
            'expiration'            => 'date',
            'status'                => StockInItemStatus::class,
        ];
    }

    /**
     * @return BelongsTo<StockIn, $this>
    */
    public function stockIn(): BelongsTo
    {
        return $this->belongsTo(StockIn::class);
    }

    /**
     * @return BelongsTo<ProductItem, $this>
    */
    public function productItem(): BelongsTo
    {
        return $this->belongsTo(ProductItem::class);
    }

     /**
     * @return BelongsTo<StockIn, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
}
