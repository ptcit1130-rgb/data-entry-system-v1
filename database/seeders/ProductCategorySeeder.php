<?php

namespace Database\Seeders;

use App\Enums\ProductCategoryStatus;
use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       
        ProductCategory::factory()
            ->count(4)
            ->sequence(
                ['name' => 'Kiddo', 'sku' => '150ml', 'stacking' => '570', 'status' => ProductCategoryStatus::Active],
                ['name' => 'Smally', 'sku' => '200ml', 'stacking' => '490', 'status' => ProductCategoryStatus::Inactive],
                ['name' => 'Yippy', 'sku' => '250ml', 'stacking' => '405', 'status' => ProductCategoryStatus::Active],
                ['name' => 'Biggy', 'sku' => '275ml', 'stacking' => '405', 'status' => ProductCategoryStatus::Inactive],
            )
            ->create();
        
    }
}
