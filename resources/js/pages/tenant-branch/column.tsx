import { TenantBranch } from "@/types/tenant-branch";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTableFeatures } from "@/components/data-table/features";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AreaChart, ArrowUpDown, Eye, MoreHorizontal, PencilIcon, Trash2Icon } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";

const columnHelper = createColumnHelper<DataTableFeatures, TenantBranch>();

type columnProps = {
    onEdit  : (tenantBranch: TenantBranch) => void;
    onView  : (tenantBranch: TenantBranch) => void;
    onDelete: (tenantBranch: TenantBranch) => void;
}

export const columns = ({onEdit, onView, onDelete}: columnProps) => 
    
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
        columnHelper.accessor("tenant_name", {
            header: ({ column }) => {
                return (
                    <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Tenant Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        }),
        columnHelper.accessor("complete_address", {
                header: ({ column }) => (
                    <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Address
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ getValue }) => getValue() || "—",
            }),
        columnHelper.accessor("contact_number", {
            header: ({ column }) => {
                return (
                    <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                        Contact Number
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
                const tenantBranch = row.original;

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
                            <DropdownMenuItem onClick={() => onEdit(tenantBranch)}>
                                <PencilIcon/> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onView(tenantBranch)}>
                                <AreaChart/> Area
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(tenantBranch)}>
                                <Trash2Icon/> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }),
    ]);