<?php

return [
    'admin' => [
        'role'     => env('USER_ROLE','admin'),
        'email'    => env('USER_EMAIL','ptcadmin@example.com'),
        'name'     => env('USER_NAME','PTC Foodspheer Asia Corp.'),
        'password' => env('USER_PASSWORD','password')
    ],
    'audit' => [
        'role'     => env('USER_ROLE','audit'),
        'email'    => env('USER_EMAIL','ptcaudit@example.com'),
        'name'     => env('USER_NAME','PTC Foodspheer Asia Corp.'),
        'password' => env('USER_PASSWORD','password')
    ],
    'IC' => [
        'role'     => env('USER_ROLE','inventory controller'),
        'email'    => env('USER_EMAIL','ptcic@example.com'),
        'name'     => env('USER_NAME','PTC Foodspheer Asia Corp.'),
        'password' => env('USER_PASSWORD','password')
    ]
];
