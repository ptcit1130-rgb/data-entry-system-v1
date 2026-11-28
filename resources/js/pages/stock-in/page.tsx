import {
    useTable,
    type ColumnFiltersState,
    type ColumnVisibilityState,
    type SortingState,
} from "@tanstack/react-table";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Head, Form } from "@inertiajs/react";
import { dashboard } from "@/routes";
import { index as stockInIndex } from "@/routes/stock-ins";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { features } from "@/components/data-table/features";
import { columns } from "@/pages/stock-in/column";
import { StockIn } from "@/types/stock-in";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table/view-option";
import { DataTable } from "@/components/data-table/data-table";
import { 
    Dialog, 
    DialogClose, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { store, destroy, update, show } from "@/routes/stock-ins";
import { 
    AlertDialog, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { router } from "@inertiajs/react";

type Props = {
    stock_ins: StockIn[];
}

export default function Page({ stock_ins }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [open, setOpen] = useState(false);

    const [isEditing, setIsEditing]   = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [openDateReceived, setOpenDateReceived] = useState(false);

    const [dateReceived, setDateReceived] = useState<Date | undefined>(undefined);

    const [selectStockIn, setSelectStockIn] = useState<StockIn | null>(null);
    const [stockInToDelete, SetStockInToDelete] = useState<StockIn | null>(null);

    const tableColumns = columns({
        onEdit: (stockIn) => {
            setSelectStockIn(stockIn);
            setDateReceived(parseYmd(stockIn.recieved));
            setIsEditing(true);
            setOpen(true);
        },
        onView: (stockIn) => {
            router.visit(show.url(stockIn.uuid));
        },
        onDelete: (stockIn) => {
            SetStockInToDelete(stockIn); 
            setDeleteOpen(true);  
        }
    });

    const table = useTable({
        features,
        data: stock_ins,
        columns: tableColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    /**
     * Local yyyy-MM-dd (avoids the timezone shift that toISOString() causes)
     * @param date 
     * @returns 
     */
    const toYmd = (date?: Date): string => {
        if (!date) return "";
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }

    /**
     * Parse yyyy-MM-dd (or an ISO string like 2026-11-14T00:00:00.000000Z) as a LOCAL date
     */
    const parseYmd = (value?: string | null): Date | undefined => {
        if (!value) return undefined;
        const [y, m, d] = value.slice(0, 10).split("-").map(Number);
        if (!y || !m || !d) return undefined;
        return new Date(y, m - 1, d);
    };

    const deleteAction = stockInToDelete ? destroy.form(stockInToDelete.uuid) : null;
    const formAction   = isEditing && selectStockIn
        ? update.form(selectStockIn.uuid)
        : store.form();
    
    return (
        <>
            <Head title="Stock in" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs
                    breadcrumbs={[
                        { title: "Dashboard", href: dashboard() },
                        { title: "Stock in", href: stockInIndex() },
                    ]}
                />
                <div>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            List of Stock in
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage stock in records.
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => {
                            setSelectStockIn(null)
                            setDateReceived(undefined); 
                            setIsEditing(false); 
                            setOpen(true); 
                        }}>
                        <PlusCircleIcon /> New
                        </Button>
                    </div>
                    <div className="flex items-center justify-between py-4 gap-5">
                        <Input placeholder="Filter product transaction number..." className="max-w-sm"
                            value={(table.getColumn("transaction_number")?.getFilterValue() as string) ?? ""}
                            onChange={(e) => {
                                table.getColumn("transaction_number")?.setFilterValue(e.target.value);
                            }}
                        />
                        <DataTableViewOptions table={table} />
                    </div>
                    <DataTable table={table} />
                </div>
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Edit stock in.' : 'New stock in.'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Update stock in information.' : 'Create a new stock in.'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...formAction} resetOnSuccess onSuccess={() => setOpen(false)}>
                        {({ processing, errors }) => (
                            <div className="space-y-4">
                                <FieldGroup className="gap-4">
                                    <Field >
                                        <Label htmlFor="transaction_number" required>
                                            Transaction number.
                                        </Label>
                                        <Input id="transaction_number" name="transaction_number" 
                                            defaultValue={selectStockIn?.transaction_number}
                                        />
                                        <InputError message={errors.transaction_number} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="source" required>Source</Label>
                                        <Select name="source" defaultValue={selectStockIn?.source}>
                                            <SelectTrigger id="source" className="w-full">
                                                <SelectValue placeholder="Select source" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["Production", "Laoag Warehouse", "Warehouse Inventory"].map((item) => (
                                                    <SelectItem key={item} value={item}>
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.source} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="transaction_type_in" required>Transaction Type in</Label>
                                        <Select name="transaction_type_in" defaultValue={selectStockIn?.transaction_type_in}>
                                            <SelectTrigger id="transaction_type_in" className="w-full">
                                                <SelectValue placeholder="Select transaction type in" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["Pull Out", "Transfer", "Returned Stocks", "Rebox"].map((item) => (
                                                    <SelectItem key={item} value={item}>
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.source} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="recieved" required>Received</Label>
                                        <Popover open={openDateReceived} onOpenChange={setOpenDateReceived}>
                                            <PopoverTrigger asChild>
                                                <Button type="button" variant="outline" id="recieved" 
                                                    className="w-full justify-start text-left font-normal">
                                                    {dateReceived ? dateReceived.toLocaleDateString() : "Select date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={dateReceived}
                                                    defaultMonth={dateReceived}
                                                    captionLayout="dropdown"
                                                    startMonth={new Date(2000, 0)}
                                                    endMonth={new Date(2100, 11)}
                                                    onSelect={(date) => {
                                                        setDateReceived(date);
                                                        setOpenDateReceived(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <input type="hidden" name="recieved" value={toYmd(dateReceived)} />
                                        <InputError message={errors.recieved} />
                                    </Field>
                                    
                                    <Field>
                                        <Label htmlFor="status" required>Status</Label>
                                        <Select name="status" defaultValue={selectStockIn?.status}>
                                            <SelectTrigger id="status" className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["Active", "Inactive"].map((item) => (
                                                    <SelectItem key={item} value={item}>
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </Field>
                                </FieldGroup>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={processing}>
                                        <SaveIcon /> Save
                                    </Button>
                                </DialogFooter>
                            </div>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
            
            <AlertDialog open={deleteOpen} onOpenChange={(v) => {
                    setDeleteOpen(v);
                    if (!v) SetStockInToDelete(null);
                }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle> Are you absolutely sure? </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the branch
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        {deleteAction && (
                            <Form {...deleteAction} onSuccess={() => { setDeleteOpen(false); SetStockInToDelete(null); }}>
                                {({ processing }) => (
                                    <Button type="submit" variant="destructive" disabled={processing}>Delete</Button>
                                )}
                            </Form>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

Page.layout = {
    breadcrumbs: [
        {
            title: "Stock In",
            href: stockInIndex(),
        },
    ],
};