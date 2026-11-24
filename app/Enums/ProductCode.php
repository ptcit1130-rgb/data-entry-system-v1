<?php

namespace App\Enums;

enum ProductCode: string
{
    // Smally
    case AS  = 'Apple Smally';
    case OS  = 'Orange Smally';
    case PS  = 'Pineapple Smally';
    case LS  = 'Lemon Tea Smally';
    case MS  = 'Mango Smally';
    case DS  = 'Dalandan Smally';
    case CS  = 'Calamansi Smally';
    case MBS = 'Mix Berry Smally';
    case OMS = 'Orange Mango Smally';

    // Kiddo
    case AK = 'Apple Kiddo';
    case OK = 'Orange Kiddo';
    case PK = 'Pineapple Kiddo';

    // Yippy
    case AY = 'Apple Yippy';
    case OY = 'Orange Yippy';
    case GY = 'Guyabano Yippy';

    // Biggy
    case AB  = 'Apple Biggy';
    case OB  = 'Orange Biggy';
    case PB  = 'Pineapple Biggy';
    case MB  = 'Mango Biggy';
    case GB  = 'Guyabano Biggy';
    case LB  = 'Lychee Biggy';
    case CB  = 'Calamansi Biggy';
    case GVB = 'Guava Biggy';

    public function category(): string
    {
        return match ($this) {
            self::AS, self::OS, self::PS, self::LS, self::MS, self::DS, self::CS, self::MBS, self::OMS => 'Smally',

            self::AK, self::OK, self::PK => 'Kiddo',

            self::AY, self::OY, self::GY => 'Yippy',

            self::AB, self::OB, self::PB, self::MB, self::GB, self::LB, self::CB, self::GVB => 'Biggy',
        };
    }

    /** Grouped options for the combobox. */
    public static function options(): array
    {
        return collect(self::cases())
            ->groupBy(fn (self $c) => $c->category())
            ->map(fn ($codes, $category) => [
                'value' => $category,
                'items' => $codes->map(fn (self $c) => [
                    'code'        => $c->name,   
                    'description' => $c->value,
                ])->values()->all(),
            ])
            ->values()
            ->all();
    }
}
