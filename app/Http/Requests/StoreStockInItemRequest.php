<?php

namespace App\Http\Requests;

use App\Models\ProductItem;
use App\Models\StockInItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreStockInItemRequest extends FormRequest
{   
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'stock_in_id' => [
                'required',
                'uuid',
                Rule::exists('stock_ins', 'uuid'),
            ],
            'product_item_id' => [
                'required',
                'uuid',
                Rule::exists('product_items', 'uuid'),
            ],
            'unit_of_measure' => ['required', 'string', 'max:255'],
            'tagging'         => ['required', 'string', 'max:255'],
            'total_boxes'     => ['required', 'integer', 'min:1'],
            'manufactured'    => ['required', 'date'],
            'expiration'      => ['required', 'date'],
            'status'          => ['required', Rule::in(['Active', 'Inactive'])],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $stockInId = $this->user()
                    ->stockIns()
                    ->where('uuid', $this->input('stock_in_id'))
                    ->value('id');

                $productItem = ProductItem::query()
                    ->where('uuid', $this->input('product_item_id'))
                    ->first(['id', 'product_code']);

                if (! $stockInId || ! $productItem) {
                    return;
                }

                /**
                 * Check duplicate tagging within the same transaction.
                 */
                $taggingExists = StockInItem::query()
                    ->where('tagging', $this->input('tagging'))
                    ->exists();

                if ($taggingExists) {
                    $validator->errors()->add(
                        'tagging',
                        __('This tagging already exists.')
                    );
                }

                /**
                 * Check duplicate product code within the same transaction.
                 */
                $productCodeExists = StockInItem::query()
                    ->where('stock_in_id', $stockInId)
                    ->whereHas('productItem', function ($query) use ($productItem) {
                        $query->where('product_code', $productItem->product_code);
                    })
                    ->exists();

                if ($productCodeExists) {
                    $validator->errors()->add(
                        'product_item_id',
                        __('This product code already exists.')
                    );
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'product_item_id.required' => __('The product code field is required.'),
        ];
    }
}