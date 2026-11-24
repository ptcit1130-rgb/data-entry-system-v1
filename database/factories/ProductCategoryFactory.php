<?php

namespace Database\Factories;

use App\Models\ProductCategory;
use App\Enums\ProductCategoryStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductCategory>
 */
class ProductCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'     => fake()->word(),
            'sku'      => fake()->randomElement(['150ml', '200ml', '250ml', '275ml']),
            'stacking' => fake()->randomElement(['570', '490', '405']),
            'status'   => fake()->randomElement(ProductCategoryStatus::cases())
        ];
    }

    public function active(): static
    {
        return $this->state(fn() => ['status' => ProductCategoryStatus::Active]);
    }

    public function inactive(): static
    {
        return $this->state(fn() => ['status' => ProductCategoryStatus::Inactive]);
    }
}
