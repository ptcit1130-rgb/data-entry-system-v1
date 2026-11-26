<?php

namespace App\Enums;

enum TransactionTypeOut: string
{
    case Sales               = 'Sales';
    case Incentives          = 'Incentives';
    case Claims              = 'Claims';
    case Replacement         = 'Replacement';
    case Complimentary       = 'Complimentary';
    case TradeDeals          = 'Trade Deals';
    case Transfer            = 'Transfer';
    case Support             = 'Support';
    case SamplingReplacement = 'Sampling replacement';
    case Bundling            = 'Bundling';
    case Others              = 'Others';

    
    public static function options(): array
    {
        return array_map(
            fn (self $type) => [
                'label' => $type->value,
                'value' => $type->value,
            ],
            self::cases()
        );
    }

}
