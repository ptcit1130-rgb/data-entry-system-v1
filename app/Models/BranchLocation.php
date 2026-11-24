<?php

namespace App\Models;

use App\Enums\BranchLocationStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

#[Fillable([
    'partner_id',
    'specialist_id',
    'barangay',
    'street_address',
    'city',
    'province',
    'contact_number',
    'status',
])]
class BranchLocation extends Model
{
    protected $appends = ['complete_address'];

    /**
     * Interact with the user's address.
     */
    protected function completeAddress(): Attribute
    {
        return Attribute::make(
            get: fn() => collect([
                $this->street_address,
                $this->city,
                trim("{$this->province}") ?: null,
            ])->filter()->implode(', '),
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    public function casts(): array
    {
        return [
            'status' => BranchLocationStatus::class
        ];
    }

    /**
     * @return BelongsTo<BusinessPartner, $this>
     */
    public function businessPartner(): BelongsTo
    {
        return $this->belongsTo(BusinessPartner::class, 'partner_id');
    }

    /**
     * @return BelongsTo<DistributorSpecialist, $this>
     */
    public function distributorSpecialist(): BelongsTo
    {
        return $this->belongsTo(DistributorSpecialist::class, 'specialist_id');
    }
}
