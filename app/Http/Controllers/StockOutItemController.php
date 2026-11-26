<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStockOutItemRequest;
use App\Http\Requests\UpdateStockOutItemRequest;
use App\Models\StockOut;

class StockOutItemController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStockOutItemRequest $request)
    {
       
    }

    /**
     * Display the specified resource.
     */
    public function show(StockOut $stockOut)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StockOut $stockOut)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStockOutItemRequest $request, StockOut $stockOut)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockOut $stockOut)
    {
        //
    }
}
