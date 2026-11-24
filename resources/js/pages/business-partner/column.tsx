import { DataTableFeatures } from "@/components/data-table/features";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BusinessPartner } from "@/types/business-partner";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MapPin, MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const columnHelper = createColumnHelper<DataTableFeatures, BusinessPartner>();

type ColumnProps = {
    onEdit  : (parter: BusinessPartner) => void;
    onView  : (parter: BusinessPartner) => void;
    onDelete: (parter: BusinessPartner) => void;
}

export const columns = ({onEdit, onView, onDelete } : ColumnProps) =>  columnHelper.columns([
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
    columnHelper.accessor("brand_name", {
        header: ({ column }) => (
            <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Brand Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    }),
    columnHelper.accessor("group", {
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="-ml-3"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Group
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
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
            const businessPartner = row.original;

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
                        <DropdownMenuItem onClick={() => onEdit(businessPartner)}>
                            <PencilIcon/> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(businessPartner)}>
                            <Trash2Icon/> Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onView(businessPartner)}>
                            <MapPin/> Branch
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
]);
