<?php

use App\Enums\StockInItemStatus;
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
        Schema::create('stock_in_items', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();

            $table->foreignId('stock_in_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('product_item_id')
                ->constrained()
                ->cascadeOnDelete();
            
            $table->string('unit_of_measure');
            $table->string('tagging');
            $table->string('total_boxes');
            $table->json('total_box_distributes')->nullable();
            $table->date('manufactured');
            $table->date('expiration');
            $table->string('status')
                ->default(StockInItemStatus::Active->value)
                ->index();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_in_items');
    }
};
