import { BranchLocation } from "@/types/branch-location";

export type TransactionTypeOut =
    | "Sales"
    | "Incentives"
    | "Claims"
    | "Replacement"
    | "Complimentary"
    | "Trade Deals"
    | "Transfer"
    | "Support"
    | "Sampling replacement"
    | "Bundling"
    | "Others";

export type StockOut = {
    id: number;
    uuid: string;
    widrawal_slip_number: string;
    delivery_slip_number: string;
    return_slip_number: string;
    branch_location_id: number;
    branch_location: BranchLocation;
    transaction_type_out: TransactionTypeOut;
    date_released: string;
    business_partner_id: number;
    total_boxes: number;
    status: "Active" | "Inactive";
};