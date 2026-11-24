<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDistributorSpecialistRequest extends FormRequest
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
            'first_name'     => ['required', 'string', 'max:255'],
            'middle_name'    => ['nullable', 'string', 'max:255'],
            'suffix' => ['nullable', 'string', Rule::in(['Jr.', 'Sr.', 'II', 'III'])],
            'last_name'      => ['required', 'string', 'max:255'],
            'street_address' => ['nullable', 'string', 'max:255'],
            'city'           => ['nullable', 'string', 'max:255'],
            'province'       => ['nullable', 'string', 'max:255'],
            'postal_code'    => ['nullable', 'string', 'max:255'],
            'status'         => ['required', 'string', 'max:255', Rule::in([
                'Active',
                'Inactive'
            ])],
        ];
    }
}
