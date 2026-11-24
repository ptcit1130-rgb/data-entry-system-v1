<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /**
         * This reset cached roles and permissions
         */
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        /**
         * This function is to create 3 Role from Laravel Spatie 
         */
        Role::firstOrCreate(['name' => config('platform.admin.role')]);
        Role::firstOrCreate(['name' => config('platform.audit.role')]);
        Role::firstOrCreate(['name' => config('platform.IC.role')]);
    }
}
