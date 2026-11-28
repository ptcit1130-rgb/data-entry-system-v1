import { DataTableFeatures } from "@/components/data-table/features";
import { Checkbox } from "@/components/ui/checkbox";
import { StockOutItem } from "@/types/stoct-out-item";
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
    EyeIcon,
    MoreHorizontal,
    PencilIcon,
    PlusCircleIcon,
    Trash2Icon,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format-date";

const columnHelper = createColumnHelper<DataTableFeatures, StockOutItem>();

type columnProps = {
    onEdit  : (stockOutItem: StockOutItem) => void;
    onView  : (stockOutItem: StockOutItem) => void;
    onDelete: (stockOutItem: StockOutItem) => void;
}


export const columns = ({onEdit, onView, onDelete}: columnProps) => columnHelper.columns([
    columnHelper.display({
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
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
    columnHelper.accessor((row) => row.stock_in_item?.product_item?.product_code ?? "", {
        id: "product_code",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="-ml-3"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Product Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )},
    ),
    columnHelper.accessor((row) => row.stock_in_item?.tagging ?? "", {
        id: "tagging",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="-ml-3"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }>
                Tagging
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ getValue }) => getValue() || "—",
    }),
    columnHelper.accessor("total_boxes", {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="-ml-3"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Total boxes
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ getValue }) => {
            const value = Number(getValue());

            return (
                <span className="tabular-nums">
                    {Number.isFinite(value)
                        ? value.toLocaleString("en-US")
                        : "—"}
                </span>
            );
        },
    }),
    columnHelper.accessor((row) => row.stock_in_item?.expiration ?? "", {
        id: "expiration",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="-ml-3"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Expiration
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ getValue }) => (getValue() ? formatDate(getValue()) : "—"),
    }),
    columnHelper.accessor("status", {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="-ml-3"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        /** exact match instead of the default "includesString" */
        filterFn: (row, columnId, filterValue) =>
            !filterValue || row.getValue(columnId) === filterValue,
    }),
    columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
            const stockOutItem = row.original;

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
                        <DropdownMenuItem>
                            <PencilIcon /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onView(stockOutItem)}>
                            <EyeIcon /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Trash2Icon /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }),
]);
