<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use App\Enums\TransactionTypeOut;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class StoreStockOutRequest extends FormRequest
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
            'widrawal_slip_number' => ['required'],
            'delivery_slip_number' => ['required'],
            'return_slip_number'   => ['required'],
            'date_released'        => ['required', 'date'],
            'transaction_type_out' => ['required', 'string', 'max:255', Rule::enum(TransactionTypeOut::class)],
            'branch_location_id'   => ['required', 'integer', 'exists:branch_locations,id'],
            'status'               => ['required', 'string', 'max:255', Rule::in(['Active', 'Inactive'])],
        ];
    }
}
