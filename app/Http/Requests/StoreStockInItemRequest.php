<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

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
            'stock_in_id'       => ['required', 'uuid'],
            'product_item_id'   => ['required', 'uuid'],
            'unit_of_measure'   => ['required', 'string', 'max:255'],
            'tagging'           => ['required', 'string', 'max:255'],
            'total_boxes'       => ['required', 'string', 'max:255'],
            'manufactured'      => ['required', 'date'],
            'expiration'        => ['required', 'date'],
            'status'            => ['required', Rule::in(['Active', 'Inactive'])],
        ];
    }

    public function messages(): array
    {
        return [
            'product_item_id.required' => __('The product code field is required.')
        ];
    }
}
