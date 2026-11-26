export type StockOutItem = {
    id: number;
    stock_in_id: number;
    product_item_id: number;
    total_boxes: number;
    status: "Active" | "Inactive"
}