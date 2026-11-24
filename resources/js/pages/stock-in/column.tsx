import { DataTableFeatures } from "@/components/data-table/features";
import { Checkbox } from "@/components/ui/checkbox";
import { StockIn } from "@/types/stock-in";
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
import { 
    ArrowUpDown, 
    MoreHorizontal, 
    PencilIcon, 
    PlusCircleIcon, 
    Trash2Icon 
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format-date";

const columnHelper = createColumnHelper<DataTableFeatures, StockIn>();

type columnProps = {
    onEdit  : (stockIn: StockIn) => void;
    onView  : (stockIn: StockIn) => void;
    onDelete: (stockIn: StockIn) => void;
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
    columnHelper.accessor("transaction_number", {
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Transaction Number (Ts no.)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    }),
    columnHelper.accessor("source", {
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Source
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    }),
    columnHelper.accessor("transaction_type_in", {
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Transaction Type In
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    }),
    columnHelper.accessor("recieved", {
        header: ({ column }) => (
            <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Received
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => formatDate(row.original.recieved),
    }),
    columnHelper.accessor("remarks", {
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="-ml-3" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Remarks
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <StatusBadge status={row.original.remarks}/>,
        /** exact match instead of the default "includesString" */
        filterFn: (row, columnId, filterValue) => !filterValue || row.getValue(columnId) === filterValue,
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
            const stockIn = row.original;

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
                        <DropdownMenuItem onClick={() => onEdit(stockIn)}>
                            <PencilIcon/> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onView(stockIn)}>
                            <PlusCircleIcon /> Items
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(stockIn)}>
                            <Trash2Icon/> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
]);