<?php

namespace App\Models;

use App\Enums\BusinessPartnerStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

#[Fillable([
    'user_id',
    'brand_name',
    'first_name',
    'middle_name',
    'last_name',
    'group',
    'contact_number',
    'status',
])]
class BusinessPartner extends Model
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
            'status' => BusinessPartnerStatus::class
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
     * @return HasMany<BranchLocation, $this>
     */
    public function branchLocations(): HasMany
    {
        return $this->hasMany(BranchLocation::class, 'partner_id');
    }

    /**
     * @return HasMany<DistributorSpecialist, $this>
     */
    public function distributorSpecialists(): HasMany
    {
        return $this->hasMany(DistributorSpecialist::class, 'specialist_id');
    }
}
