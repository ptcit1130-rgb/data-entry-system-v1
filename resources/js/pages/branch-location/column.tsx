import { DataTableFeatures } from "@/components/data-table/features";
import { Checkbox } from "@/components/ui/checkbox";
import { BranchLocation } from "@/types/branch-location";
import { createColumnHelper } from "@tanstack/react-table";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye, MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";

const columnHelper = createColumnHelper<DataTableFeatures, BranchLocation>();

type columnProps = {
    onEdit  : (branch: BranchLocation) => void;
    onView  : (branch: BranchLocation) => void;
    onDelete: (branch: BranchLocation) => void;
}

export const columns = ({onEdit, onView, onDelete}: columnProps) => columnHelper.columns([
    columnHelper.display({
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() ||(table.getIsSomePageRowsSelected() && "indeterminate")}
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
    columnHelper.accessor((row) => row.business_partner?.brand_name ?? "", {
        id: "brand_name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Brand Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <span className="font-medium">{row.original.business_partner?.brand_name}</span>
        ),
    }),
    columnHelper.accessor("complete_address", {
        header: ({ column }) => (
            <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Branch Address
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ getValue }) => getValue() || "—",
    }),
    columnHelper.accessor("contact_number", {
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="-ml-3"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Contact Number
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ getValue }) => getValue() || "—",
    }),
    columnHelper.accessor("status", {
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc") }>
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        /** exact match instead of the default "includesString" */
        filterFn: (row, columnId, filterValue) => !filterValue || row.getValue(columnId) === filterValue,
    }),
    columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
            const branch = row.original;

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
                        <DropdownMenuItem onClick={() => onEdit(branch)}>
                            <PencilIcon/> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onView(branch)}>
                            <Eye/> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(branch)}>
                            <Trash2Icon/> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
]);