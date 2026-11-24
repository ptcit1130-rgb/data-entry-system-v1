<?php

use App\Enums\InventoryMovementStatus;
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
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();

            $table->foreignId('tenant_branch_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('product_category_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('area');

            $table->string('status')
                ->default(InventoryMovementStatus::Active->value)
                ->index();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};
