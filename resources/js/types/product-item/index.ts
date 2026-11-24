import { ProductCategory } from '@/types/product-category';

export type ProductItem = {
    id: number;
    uuid: string;
    product_category_id: number;
    product_category: ProductCategory;
    product_code: string;
    description: string;
    status: "Active" | "Inactive";
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