<?php

namespace App\Models;

use App\Enums\StockInStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id',
    'transaction_number',
    'source',
    'transaction_type_in',
    'recieved',
    'status',
])]
class StockIn extends Model
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
            'recieved' => 'date',
            'status'   => StockInStatus::class
        ];
    }

    /**
     * @return HasMany<StockInItem, $this>
     */
    public function stockInItems(): HasMany
    {
        return $this->hasMany(StockInItem::class);
    }

    /**
     * @return HasMany<ProductItem, $this>
     */
    public function productItems(): HasMany
    {
        return $this->hasMany(ProductItem::class);
    }

}
