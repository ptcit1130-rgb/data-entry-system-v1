<?php

namespace App\Models;

use App\Enums\InventoryMovementStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'tenant_branch_id',
    'product_category_id',
    'area',
    'status'
])]
class InventoryMovement extends Model
{   

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'status' => InventoryMovementStatus::class
        ];
    }

    /**
     * @return BelongsTo<TenantBranch, $this>
     */
    public function tenantBranch(): BelongsTo
    {
        return $this->belongsTo(TenantBranch::class);
    }

    /**
     * @return BelongsTo<ProductCategory, $this>
     */
    public function productCategory(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class);
    }
}
