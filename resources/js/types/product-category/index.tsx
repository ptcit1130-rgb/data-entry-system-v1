export type ProductCategory = {
    id: number;
    name: string;
    sku: string;
    stacking: string;
    status: "Active" | "Inactive";
}