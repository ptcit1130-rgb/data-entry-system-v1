<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInventoryMovementRequest extends FormRequest
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
            'tenant_branch_id'    => ['required', 'uuid'],
            'product_category_id' => ['required', 'integer'],
            'area'                => ['required', 'string', 'max:255'],
            'status'              => ['required', 'string', 'max:255', Rule::in([
                'Active',
                'Inactive'
            ])],
        ];
    }

    public function messages(): array
    {
        return [
            'product_category_id.required' => 'The sku field is required.'
        ];
    }
}
