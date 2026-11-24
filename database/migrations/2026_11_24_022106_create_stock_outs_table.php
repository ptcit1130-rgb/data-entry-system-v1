<?php

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
            $table->string('delivery_slip_umber');
            $table->string('return_slip_number');
            $table->date('date_release');
            
            $table->foreignId('business_partner_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('transaction_type_out');
            $table->date('manufacture_date');
            $table->date('expiration_date');
            $table->string('remarks');
            $table->string('racking');  

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
