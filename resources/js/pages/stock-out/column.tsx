import { DataTableFeatures } from "@/components/data-table/features";
import { Checkbox } from "@/components/ui/checkbox";
import { StockOut } from "@/types/stock-out";
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
import { ArrowUpDown, MoreHorizontal, PencilIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import { formatDate } from "@/lib/format-date";
import { StatusBadge } from "@/components/status-badge";

const columnHelper = createColumnHelper<DataTableFeatures, StockOut>();

type columnProps = {
    onEdit  : (stockOut: StockOut) => void;
    onView  : (stockOut: StockOut) => void;
    onDelete: (stockOut: StockOut) => void;
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
    columnHelper.accessor("widrawal_slip_number", {
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Widrawal Slip Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    }),
    columnHelper.accessor("delivery_slip_number", {
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Delivery Slip Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    }),
    columnHelper.accessor("return_slip_number", {
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Return Slip Number
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    }),
    columnHelper.accessor((row) => row.branch_location?.business_partner?.brand_name ?? "", {
        id: "brand_name",
        header: ({ column }) => (
            <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Distributor
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    }),
    columnHelper.accessor((row) => row.branch_location?.complete_address ?? "", {
        id: "branch_address",
        header: ({ column }) => (
            <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Branch
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ getValue }) => getValue() || "—",
    }),
    columnHelper.accessor("transaction_type_out", {
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Transaction Type Out
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    }),
    columnHelper.accessor("date_released", {
        header: ({ column }) => (
            <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Released
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => formatDate(row.original.date_released),
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
            const stockOut = row.original;

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
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <PencilIcon/> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onView(stockOut)}>
                            <PlusCircleIcon /> Items
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Trash2Icon/> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
])