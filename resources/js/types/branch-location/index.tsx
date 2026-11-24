import { BusinessPartner } from '@/types/business-partner';
import { DistributorSpecialist } from '@/types/distributor-specialist';

export type BranchLocation = {
    id: number;
    partner_id: number;
    specialist_id: number;
    business_partner?: BusinessPartner;
    barangay?: number;
    street_address?: number;
    city?: string;
    province?: string;
    complete_address?: string;
    contact_number: number;
    status: "Active" | "Inactive";
}