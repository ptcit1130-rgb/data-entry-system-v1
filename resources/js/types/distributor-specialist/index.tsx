export type DistributorSpecialist = {
    id: number;
    user_id: number;
    first_name: string;
    middle_name?: string;
    suffix?: string;
    last_name: string;
    full_name: string;
    street_address?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    complete_address: string;
    status: string;
} 