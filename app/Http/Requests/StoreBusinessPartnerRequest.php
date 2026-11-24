<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBusinessPartnerRequest extends FormRequest
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
            'brand_name'     => ['required', 'string', 'max:255'],
            'first_name'     => ['nullable', 'string', 'max:255'],
            'middle_name'    => ['nullable', 'string', 'max:255'],
            'last_name'      => ['nullable', 'string', 'max:255'],
            'group'          => ['required', 'string', 'max:255'],
            'status'         => ['required', 'string', 'max:255', Rule::in([
                'Active',
                'Inactive'
            ])],
        ];
    }
}
