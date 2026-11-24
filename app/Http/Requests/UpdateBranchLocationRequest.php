<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBranchLocationRequest extends FormRequest
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
            'partner_id'     => ['required', 'uuid'],
            'specialist_id'  => ['nullable', 'integer'],
            'street_address' => ['nullable', 'string', 'max:255'],
            'barangay'       => ['nullable', 'string', 'max:255'],
            'city'           => ['nullable', 'string', 'max:255'],
            'province'       => ['nullable', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:255'],
            'status'         => ['required', Rule::in(['Active', 'Inactive'])],
        ];
    }

    /**
     * Get the custom validation messages for the defined rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'partner_id.required' => 'The brand name field is required.', 
        ];
    }
}
