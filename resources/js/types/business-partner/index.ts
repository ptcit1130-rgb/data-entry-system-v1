import { BranchLocation } from "@/types/branch-location";

export type BusinessPartner = {
    id: number;
    uuid: string;
    user_id: number;
    brand_name: string;
    first_name: string;
    middle_name: string;
    branch_locations: BranchLocation[];
    last_name: string;
    group: "Customer" | "Vendor";
    status: "Active" | "Inactive";
}