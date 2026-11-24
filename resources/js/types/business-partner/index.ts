export type BusinessPartner = {
    id: number;
    uuid: string;
    user_id: number;
    brand_name: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    group: "Customer" | "Vendor";
    status: "Active" | "Inactive";
}