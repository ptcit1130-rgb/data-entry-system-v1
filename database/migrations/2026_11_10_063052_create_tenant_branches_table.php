<?php

use App\Enums\TenantBranchStatus;
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
        Schema::create('tenant_branches', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('tenant_name');
            $table->string('barangay')->nullable();
            $table->string('street_address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('status')
                ->default(TenantBranchStatus::Active->value)
                ->index();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenant_branches');
    }
};
