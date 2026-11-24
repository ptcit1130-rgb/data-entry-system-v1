import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DistributorSpecialist } from "@/types/distributor-specialist";
import { Checkbox } from "@/components/ui/checkbox";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";
import { DataTableFeatures } from "@/components/client-side-datatable/features";
import { StatusBadge } from "@/components/status-badge";

const columnHelper = createColumnHelper<DataTableFeatures, DistributorSpecialist>();

type ColumnProps = {
    onEdit  : (specialist: DistributorSpecialist) => void;
    onView  : (specialist: DistributorSpecialist) => void;
    onDelete: (specialist: DistributorSpecialist) => void;
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
        columnHelper.accessor("full_name", {
            header: ({ column }) => (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Full Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        }),
        columnHelper.accessor("complete_address", {
            header: ({ column }) => (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Complete Address
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ getValue }) => getValue() || "—",
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
                const specialist = row.original;

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
                            <DropdownMenuItem onClick={() => onEdit(specialist)}>
                                <PencilIcon/> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onView(specialist)}>
                                <Eye/> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(specialist)}>
                                <Trash2Icon/> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }),
    ]);