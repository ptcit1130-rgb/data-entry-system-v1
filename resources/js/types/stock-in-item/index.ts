import { ProductItem } from "@/types/product-item";

export type RackDistribution = {
    rack_number: string;
    product_code: string;
    tagging: string;
    boxes: number;
    status: "Full" | "Partial"; 
};

export type StockInItem = {
    id: number;
    uuid: string;
    stock_in_id: number;
    product_item_id: number; 
    product_item?: ProductItem;
    unit_of_measure: string;
    tagging: string;
    number_of_pallets: string;
    total_boxes: string;
    manufactured: string;
    expiration: string;
    total_box_distributes: RackDistribution[] | null;
    status: "Active" | "Inactive";
    racking: "Completed" | "Incomplete";
}