<?php

namespace App\Enums;

enum StockOutStatus: string
{
    case Active   = "Active";
    case Inactive = "Inactive";
}
