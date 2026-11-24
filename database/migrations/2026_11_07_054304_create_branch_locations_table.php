<?php

use App\Enums\BranchLocationStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('branch_locations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('partner_id')
                ->constrained('business_partners')
                ->cascadeOnDelete();

            $table->foreignId('specialist_id')
                ->nullable()
                ->constrained('distributor_specialists')
                ->cascadeOnDelete();

            $table->string('barangay')->nullable();
            $table->string('street_address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('status')
                ->default(BranchLocationStatus::Active)
                ->index();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branch_locations');
    }
};
