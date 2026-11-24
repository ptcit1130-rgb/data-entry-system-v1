<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $configAdmin = config('platform.admin');
        $configAudit = config('platform.audit');
        $configIc    = config('platform.IC');

        /** Admin User */
        $admin = User::firstOrCreate(
            ['email' => $configAdmin['email']],
            [
                'name'     => $configAdmin['name'],
                'password' => Hash::make($configAdmin['password']),
            ]
        );
        $admin->assignRole($configAdmin['role']);

        /** Audit User */
        $audit = User::firstOrCreate(
            ['email' => $configAudit['email']],
            [
                'name'     => $configAudit['name'],
                'password' => Hash::make($configAudit['password']),
            ]
        );
        $audit->assignRole($configAudit['role']);

        /** Inventory Controller User */
        $ic = User::firstOrCreate(
            ['email' => $configIc['email']],
            [
                'name'     => $configIc['name'],
                'password' => Hash::make($configIc['password']),
            ]
        );
        $ic->assignRole($configIc['role']);
    }
}
