<?php

namespace App\Models;

use App\Enums\DistributorSpecialistStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable([
    'user_id',
    'first_name',
    'middle_name',
    'suffix',
    'last_name',
    'street_address',
    'city',
    'province',
    'postal_code',
    'status',
])]
class DistributorSpecialist extends Model
{
    use HasFactory;

    protected $appends = [
        'full_name',
        'complete_address',
    ];
    
    /**
     * Interact with the user's full name.
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn() => collect([
                $this->first_name,
                $this->middle_name ? Str::upper(Str::substr($this->middle_name, 0, 1)) . '.' : null,
                $this->last_name,
                $this->suffix,
            ])->filter()->implode(' '),
        );
    }

    /**
     * Interact with the user's address.
     */
    protected function completeAddress(): Attribute
    {
        return Attribute::make(
            get: fn() => collect([
                $this->street_address,
                $this->city,
                trim("{$this->province} {$this->postal_code}") ?: null,
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
            'status' => DistributorSpecialistStatus::class
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
}
