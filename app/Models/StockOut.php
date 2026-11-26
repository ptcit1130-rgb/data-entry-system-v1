<?php

namespace App\Models;

use App\Enums\StockOutStatus;
use App\Enums\TransactionTypeOut;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'widrawal_slip_number',
    'delivery_slip_number',
    'return_slip_number',
    'date_released',
    'transaction_type_out',
    'branch_location_id',
    'status',
])]
class StockOut extends Model
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
            'total_boxes'          => 'integer',
            'transaction_type_out' => TransactionTypeOut::class,
            'status'               => StockOutStatus::class,
        ];
    }

    /**
    * @return BelongsTo<BranchLocation, $this>
    */
    public function branchLocation(): BelongsTo
    {
        return $this->belongsTo(BranchLocation::class);
    }

    /**
    * @return HasMany<StockOutItem, $this>
    */
    public function stockOutItems(): HasMany
    {
        return $this->hasMany(StockOutItem::class);
    }
}
