<?php

use App\Enums\StockInStatus;
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
        Schema::create('stock_ins', function (Blueprint $table) {
            $table->id();
            $table->uuid()->unique();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('transaction_number');
            $table->string('source');
            $table->string('transaction_type_in');
            $table->date('recieved');
            $table->string('remarks')
                ->default(StockInStatus::Incomplete)
                ->index();
            $table->string('status')
                ->default(StockInStatus::Active)
                ->index();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_ins');
    }
};
