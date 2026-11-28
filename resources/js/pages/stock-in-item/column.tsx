import { DataTableFeatures } from "@/components/data-table/features";
import { Checkbox } from "@/components/ui/checkbox";
import { StockInItem } from "@/types/stock-in-item";
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
    Trash2Icon,
    PlusCircleIcon,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format-date";

const columnHelper = createColumnHelper<DataTableFeatures, StockInItem>();

type columnProps = {
    onEdit: (stockInItem: StockInItem) => void;
    onView: (stockInItem: StockInItem) => void;
    onDelete: (stockInItem: StockInItem) => void;
};

export const columns = ({ onEdit, onView, onDelete }: columnProps) =>
    columnHelper.columns([
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
        columnHelper.accessor((row) => row.product_item?.product_code ?? "", {
            id: "product_code",
            header: ({ column }) => {
                return (
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
                );
            },
        }),
        columnHelper.accessor((row) => row.product_item?.description ?? "", {
            id: "description",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="-ml-3"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Description
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        }),
        columnHelper.accessor(
            (row) => row.product_item?.product_category?.sku ?? "",
            {
                id: "sku",
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            className="-ml-3"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === "asc",
                                )
                            }
                        >
                            Sku
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
            },
        ),
        columnHelper.accessor("unit_of_measure", {
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="-ml-3"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Unit of Measure
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
        }),
        columnHelper.accessor("tagging", {
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="-ml-3"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Tagging
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
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
        columnHelper.accessor("racking", {
            header: "Racking Status",
            cell: ({ row }) => {
                const item       = row.original;
                const totalBoxes = Number(item.total_boxes) || 0;
                const allocated  = (item.total_box_distributes ?? []).reduce(
                    (total, rack) => total + (Number(rack.boxes) || 0), 0
                );
                const remaining = Math.max(0, totalBoxes - allocated);
                const progress  = totalBoxes > 0
                    ? Math.min(100, (allocated / totalBoxes) * 100)
                    : 0;

                return (
                    <div className="flex min-w-[160px] flex-col gap-1">
                        <div className="flex items-center justify-between gap-1">
                            <StatusBadge status={item.racking} />
                            <span className="text-xs font-medium text-muted-foreground">
                                {progress.toFixed(0)}%
                            </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div className={`h-full rounded-full transition-all ${
                                    remaining === 0 && totalBoxes > 0 ? "bg-green-500" : "bg-yellow-500"
                                }`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between gap-2 text-xs">
                            <span className="text-muted-foreground">
                                {allocated.toLocaleString()} /{" "}
                                {totalBoxes.toLocaleString()} boxes
                            </span>
                        </div>
                        {remaining > 0 && (
                            <span className="text-xs font-medium text-amber-600">
                                {remaining.toLocaleString()} boxes remaining
                            </span>
                        )}
                    </div>
                );
            },
        }),
        columnHelper.accessor("manufactured", {
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="-ml-3"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Manufactured
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => formatDate(row.original.manufactured),
        }),
        columnHelper.accessor("expiration", {
            header: ({ column }) => {
                return (
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
                );
            },
            cell: ({ row }) => formatDate(row.original.expiration),
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
                const stockInItem = row.original;

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
                            <DropdownMenuItem
                                onClick={() => onView(stockInItem)}
                            >
                                <PlusCircleIcon /> Pallet
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
