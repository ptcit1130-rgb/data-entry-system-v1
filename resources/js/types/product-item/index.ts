import { ProductCategory } from '@/types/product-category';

export type RackOption = {
    rack_number: string;
    product_code: string;
    tagging: string;
    boxes: number;
    status: "Full" | "Partial";
    stock_in_item_uuid: string;
};

export type ProductItem = {
    id: number;
    uuid: string;
    product_category_id: number;
    product_category: ProductCategory;
    product_code: string;
    description: string;
    status: "Active" | "Inactive";
    full?: number;     
    partials?: number;
    racks?: RackOption[];
};

export type ProductCode = {
    value: string;
    items: Array<{
        code: string;
        description: string;
    }>
}

export type ProductItemPageData = {
    row: ProductItem[];
    code: ProductCode[];
    categories: ProductCategory[];
};