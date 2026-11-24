import { DataTableFeatures } from "@/components/data-table/features";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductCategory } from "@/types/product-category";
import { createColumnHelper } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Eye, MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";

const columnHelper = createColumnHelper<DataTableFeatures, ProductCategory>();

type ColumnProps = {
    onEdit  : (category: ProductCategory) => void;
    onView  : (category: ProductCategory) => void;
    onDelete: (category: ProductCategory) => void;
};

export const columns = ({ onEdit, onView, onDelete }: ColumnProps) => 
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
        columnHelper.accessor("name", {
            header: ({ column }) => {
                return (
                    <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Product Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        }),
        columnHelper.accessor("sku", {
            header: ({ column }) => {
                return (
                    <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Stock keeping unit - (SKU)
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        }),
        columnHelper.accessor("stacking", {
            header: ({ column }) => {
                return (
                    <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Stacking
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
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
                const prodCategory = row.original;

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
                            <DropdownMenuItem onClick={() => onEdit(prodCategory)}>
                                <PencilIcon/> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onView(prodCategory)}>
                                <Eye/> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(prodCategory)}>
                                <Trash2Icon/> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }),
    ]);
