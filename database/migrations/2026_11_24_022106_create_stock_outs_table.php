<?php

use App\Enums\StockOutStatus;
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
        Schema::create('stock_outs', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();

            $table->string('widrawal_slip_number');
            $table->string('delivery_slip_number');
            $table->string('return_slip_number');
            $table->string('transaction_type_out');
            $table->date('date_released');
            $table->foreignId('branch_location_id')
                ->constrained('branch_locations')
                ->cascadeOnDelete();
            $table->string('status')
                ->default(StockOutStatus::Active->value)
                ->index();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_outs');
    }
};
