<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductItemRequest extends FormRequest
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
            'product_category_id' => ['required', 'integer'],
            'product_code'        => ['required', 'string', 'max:255'],
            'description'         => ['required', 'string', 'max:255'],
            'status'              => ['required', 'string', 'max:255', Rule::in(['Active', 'Inactive'])],
        ];
    }
}
