export type TenantBranch = {
    id: number;
    uuid: string;
    user_id: number;
    tenant_name: string;
    barangay?: string;
    street_address?: string;
    city?: string;
    province?: string;
    complete_address?: string;
    contact_number?: string;
    status: "Active" | "Inactive";
}