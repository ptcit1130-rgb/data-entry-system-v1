<?php

namespace App\Enums;

enum StockInStatus: string
{
    case Active     = "Active";
    case Inactive   = "Inactive";
    case Incomplete = "Incomplete";
    case Completed  = "Completed";
    case Post       = "Post";
    case Posted     = "Posted";
}
