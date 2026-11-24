import { TenantBranch } from "@/types/tenant-branch";
import { ProductCategory } from "@/types/product-category";

export type InventoryMovement = {
    id: number;
    tenant_branch_id: number;
    tenant_branch: TenantBranch;
    product_category_id: number;
    product_category: ProductCategory;
    area: string;
    status: string;
}