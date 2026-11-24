import { DataTableFeatures } from "@/components/data-table/features";
import { Checkbox } from "@/components/ui/checkbox";
import { createColumnHelper } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";
import { InventoryMovement } from "@/types/inventory-movements";
import { StatusBadge } from "@/components/status-badge";

const columnHelper = createColumnHelper<DataTableFeatures, InventoryMovement>();

type columnProps = {
    onEdit  : (inventoryMovement: InventoryMovement) => void;
    onView  : (inventoryMovement: InventoryMovement) => void;
    onDelete: (inventoryMovement: InventoryMovement) => void;
}

export const columns = ({ onEdit, onView, onDelete }: columnProps) => 
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
        columnHelper.accessor("area", {
            header: ({ column }) => {
                return (
                    <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Warehouse
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
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
                <span className="font-medium">{`${row.original.product_category?.name} - ${row.original.product_category?.sku}`}</span>
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
                const inventoryMovement = row.original;

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
                            <DropdownMenuItem onClick={() => onEdit(inventoryMovement)}>
                                <PencilIcon/> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onView(inventoryMovement)}>
                                <Eye/> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(inventoryMovement)}>
                                <Trash2Icon/> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }),
    ]);