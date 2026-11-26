<?php

use App\Http\Controllers\BranchLocationController;
use App\Http\Controllers\BusinessPartnerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DistributorSpecialistController;
use App\Http\Controllers\InventoryMovementController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductItemController;
use App\Http\Controllers\StockInController;
use App\Http\Controllers\StockInItemController;
use App\Http\Controllers\StockOutController;
use App\Http\Controllers\StockOutItemController;
use App\Http\Controllers\TenantBranchController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'role:admin|audit|inventory controller'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function() {
    Route::resource('payments', PaymentController::class);
    Route::resource('product-categories', ProductCategoryController::class)
        ->except(['create', 'edit']);
    Route::resource('product-items', ProductItemController::class)
        ->except(['create', 'edit']);
    Route::resource('specialists', DistributorSpecialistController::class)
        ->parameters(['specialists' => 'distributorSpecialist'])
        ->except(['create', 'edit']);
    Route::resource('business-partners', BusinessPartnerController::class)
        ->except(['create', 'edit']);
    Route::resource('branch-locations', BranchLocationController::class)
        ->except(['create', 'edit']);
    Route::resource('tenant-branches', TenantBranchController::class)
        ->except(['create', 'edit']);
    Route::resource('inventory-movements', InventoryMovementController::class)
        ->except(['create', 'edit']);
    Route::resource('stock-ins', StockInController::class)
        ->except(['create', 'edit']);
    Route::resource('stock-in-items', StockInItemController::class)
        ->except(['create', 'edit']);

    Route::delete('stock-in-items/{stock_in_item}/racks', 
        [StockInItemController::class, 'removeRack']
    )->name('stock-in-items.racks.destroy');

    Route::resource('stock-outs', StockOutController::class)
        ->except(['create', 'edit']);
    Route::resource('stock-out-items', StockOutItemController::class)
        ->except(['create', 'edit']);
});

require __DIR__.'/settings.php';
