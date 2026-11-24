import { DataTableFeatures } from "@/components/data-table/features";
import { createColumnHelper } from "@tanstack/react-table";
import { ProductItem } from '@/types/product-item';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/status-badge";

const columnHelper = createColumnHelper<DataTableFeatures, ProductItem>();

type ColumnProps = {
    onEdit  : (productItem: ProductItem) => void;
    onView  : (productItem: ProductItem) => void;
    onDelete: (productItem: ProductItem) => void;
}

export const columns = ({ onEdit, onView, onDelete } : ColumnProps) =>

columnHelper.columns([
    columnHelper.display({
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }),
    columnHelper.accessor("product_code", {
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Product Code
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    }),
    columnHelper.accessor("description", {
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Product Description
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    }),
    columnHelper.accessor((row) => row.product_category?.name ?? "", {
        id: "name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Product Name 
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <span className="font-medium">{row.original.product_category?.name}</span>
        ),
    }),
    columnHelper.accessor((row) => row.product_category?.sku ?? "", {
        id: "sku",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Stock keeping unit - (SKU) 
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <span className="font-medium">{row.original.product_category?.sku}</span>
        ),
    }),
    columnHelper.accessor((row) => row.product_category?.stacking ?? "", {
        id: "stacking",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Stacking
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <span className="font-medium">{row.original.product_category?.stacking}</span>
        ),
    }),
    columnHelper.accessor("status", {
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <StatusBadge status={row.original.status}/>,
        /** exact match instead of the default "includesString" */
        filterFn: (row, columnId, filterValue) => !filterValue || row.getValue(columnId) === filterValue,
    }),
    columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
            const productItem = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="text-muted-foreground">
                            Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(productItem)}>
                            <PencilIcon/> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onView(productItem)}>
                            <Eye/> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(productItem)}>
                            <Trash2Icon/> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
]);