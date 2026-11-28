<?php

namespace App\Http\Requests;

use App\Enums\RackStatus;
use App\Enums\StockOutItemStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStockOutItemRequest extends FormRequest
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
            'stock_out_id'               => ['required', 'uuid', 'exists:stock_outs,uuid'],
            'status'                     => ['required', Rule::enum(StockOutItemStatus::class)],
            'picks'                      => ['required', 'array', 'min:1'],
            'picks.*.stock_in_item_uuid' => ['required', 'uuid', 'exists:stock_in_items,uuid'],
            'picks.*.rack_number'        => ['required', 'string', 'distinct'],
            'picks.*.boxes'              => ['required', 'integer', 'min:1'],
        ];
    }
}
