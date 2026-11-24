<?php

namespace App\Http\Controllers;

use App\Enums\ProductCategoryStatus;
use App\Http\Requests\StoreProductCategoryRequest;
use App\Http\Requests\UpdateProductCategoryRequest;
use App\Models\ProductCategory;
use Illuminate\Auth\Events\Validated;
use Inertia\Inertia;
use Inertia\Response;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $productCategories = ProductCategory::latest()->get();

        return Inertia::render('product-category/page', [
            'product_categories' => $productCategories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductCategoryRequest $request)
    {
        $validated = $request->validated();

        ProductCategory::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product category created successfully.')]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductCategory $productCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductCategoryRequest $request, ProductCategory $productCategory)
    {
        $validated = $request->validated();

        $productCategory->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product category updated successfully.')]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCategory $productCategory)
    {
        $productCategory->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product category deleted successfully.')]);

        return back();
    }
}
