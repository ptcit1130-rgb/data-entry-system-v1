import { ProductItem } from "@/types/product-item";
import { StockInItem } from "@/types/stock-in-item";

export type RackDistribution = {
    rack_number: string;
    product_code: string;
    tagging: string;
    boxes: number;
    status?: "Full" | "Partial";
};

export type StockOutItem = {
    id: number;
    uuid: string;
    stock_out_id: number;
    stock_in_item_id: number;
    stock_in_item?: StockInItem & { product_item?: ProductItem };
    total_boxes: number;
    total_box_distributes: RackDistribution[] | null;
    status: "Active" | "Inactive";
};