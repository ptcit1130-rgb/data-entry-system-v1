<?php

namespace App\Models;

use App\Enums\ProductCategoryStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name',
    'status',
    'sku',
    'stacking'
])]
class ProductCategory extends Model
{
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'status' => ProductCategoryStatus::class
        ];
    }

    /**
     * @return HasMany<ProductItem, $this>
     */
    public function productItems(): HasMany
    {
        return $this->hasMany(ProductItem::class);
    }

    /**
     * @return HasMany<InventoryMovement, $this>
     */
    public function inventoryMovements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class);
    }

}
