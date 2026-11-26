<?php

namespace App\Enums;

enum StockOutItemStatus: string
{
    case Active   = "Active";
    case Inactive = "Inactive";
}
