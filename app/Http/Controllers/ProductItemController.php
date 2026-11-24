<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\ProductItem;
use Inertia\Response;
use App\Http\Requests\StoreProductItemRequest;
use App\Http\Requests\UpdateProductItemRequest;
use App\Enums\ProductCode;
use App\Models\ProductCategory;

class ProductItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $productItems = ProductItem::query()
            ->latest()
            ->with('productCategory')
            ->get();

        return Inertia::render('product-item/page', [
            'product_items' => [
                'row'  => $productItems,
                'code' => ProductCode::options(),
                'categories' => ProductCategory::all(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreProductItemRequest $request
    ) {
        ProductItem::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product item created successfully.')]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductItem $productItem)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductItemRequest $request, ProductItem $productItem)
    {
        $validated = $request->validated();

        $productItem->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product item updated successfully.')]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductItem $productItem)
    {
        $productItem->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product item deleted successfully.')]);

        return back();
    }
}
