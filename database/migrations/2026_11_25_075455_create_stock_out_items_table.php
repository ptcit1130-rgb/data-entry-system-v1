<?php

use App\Enums\StockOutItemStatus;
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
        Schema::create('stock_out_items', function (Blueprint $table) {
            $table->id();
            $table->uuid();

            $table->foreignId('stock_out_id')
                ->constrained()
                ->cascadeOnDelete();
            
            $table->string('total_boxes');
            $table->json('total_box_distributes')->nullable();
            $table->string('status')
                ->default(StockOutItemStatus::Active->value)
                ->index();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_out_items');
    }
};
