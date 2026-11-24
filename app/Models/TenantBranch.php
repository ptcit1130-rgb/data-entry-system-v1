<?php

namespace App\Models;

use App\Enums\TenantBranchStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

#[Fillable([
    'user_id',
    'tenant_name',
    'barangay',
    'street_address',
    'city',
    'province',
    'province',
    'contact_number',
    'status',
])]
class TenantBranch extends Model
{
    use HasUuids;

    protected $appends = ['complete_address'];

    /**
     * Get the route key for the model.
     * Uses the UUID instead of the auto-incrementing ID.
     *
     * @return string
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * Get the unique ID columns for the model.
     * Laravel automatically generates UUIDs for these columns.
     *
     * @return array<int, string>
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
            'status' => TenantBranchStatus::class
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<InventoryMovement, $this>
     */
    public function inventoryMovements(): HasMany
    {
        return $this->hasMany(InventoryMovement::class);
    }

    /**
     * Interact with the user's address.
     */
    protected function completeAddress(): Attribute
    {
        return Attribute::make(
            get: fn() => collect([
                $this->barangay,
                $this->street_address,
                $this->city,
                trim("{$this->province}") ?: null,
            ])->filter()->implode(', '),
        );
    }

}
