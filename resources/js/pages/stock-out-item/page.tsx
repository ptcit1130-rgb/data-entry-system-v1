import {
    useTable,
    type ColumnFiltersState,
    type ColumnVisibilityState,
    type SortingState,
} from "@tanstack/react-table";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { dashboard } from "@/routes";
import { StockOutItem } from "@/types/stoct-out-item";
import { Form, Head } from "@inertiajs/react";
import { PlusCircleIcon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { features } from "@/components/data-table/features";
import { columns } from "@/pages/stock-out-item/column";
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
import { 
    Field, 
    FieldGroup 
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { ProductItem } from "@/types/product-item";
import { store } from "@/routes/stock-out-items";
import { StockOut } from "@/types/stock-out";

type Props = {
    stock_out      : StockOut;
    stoct_out_items: StockOutItem[];
    product_items  : ProductItem[];
}

export default function Page({ stock_out, stoct_out_items, product_items }: Props) {
    const [sorting, setSorting]                   = useState<SortingState>([]);
    const [columnFilters, setColumnFilters]       = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
    const [rowSelection, setRowSelection]         = useState({});

    const [open, setOpen] = useState(false);

    const [isEditing, setIsEditing]   = useState(false);
    
    const [selectedCode, setSelectedCode] = useState("");

    const table = useTable({
        features,
        data: stoct_out_items,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    const selected = product_items.find((product) => (
        product.uuid === selectedCode
    ));

    const full     = selected?.full ?? 0;
    const partials = selected?.partials ?? 0;
    const total    = full + partials;

    const stockCard = !selected
        ? { box: "border-dashed bg-muted/30 text-muted-foreground", dot: "bg-muted-foreground/40", label: "No product selected" }
        : total === 0
        ? { box: "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400", dot: "bg-red-500", label: "Out of stock" }
        : total <= 10
            ? { box: "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400", dot: "bg-orange-500", label: "Low stock" }
            : { box: "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400", dot: "bg-green-500", label: "In stock" };
    
    const formaterNumber = (value: number) => value.toLocaleString("en-US");

    const formAction = store.form();

    return (
        <>
            <Head title="Stock Out Items" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs
                    breadcrumbs={[
                        { title: "Dashboard", href: dashboard() },
                        { title: "Stock out", href: "#" },
                    ]}
                />
                <div>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            List of Stock Out Items
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage stock out items records.
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => setOpen(true)}>
                            <PlusCircleIcon /> New
                        </Button>
                    </div>
                    <div className="flex items-center justify-between py-4 gap-5">
                        <Input placeholder="Filter distributors..." className="max-w-sm"
                            value={(table.getColumn("brand_name")?.getFilterValue() as string) ?? ""}
                            onChange={(e) => {
                                table.getColumn("brand_name")?.setFilterValue(e.target.value);
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
                            {isEditing ? 'Edit stock out.' : 'New stock out.'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Update stock out information.' : 'Create a new stock out.'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...formAction} resetOnSuccess onSuccess={() => { setOpen(false); setSelectedCode(""); }}>
                        {({ processing, errors }) => (
                            <div className="space-y-4">
                                <Input type="hidden" name="stock_out_id" value={stock_out.uuid} />
                                <FieldGroup className="gap-4">
                                    <Field>
                                        <Label htmlFor="product_item_id" required>Product code</Label>
                                        <Select value={selectedCode} onValueChange={setSelectedCode}>
                                            <SelectTrigger id="product_item_id" className="w-full">
                                                <SelectValue placeholder="Select product code" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {product_items.map((p) => (
                                                    <SelectItem key={p.id} value={p.uuid}>
                                                        {p.product_code} — {p.description}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.product_item_id} />
                                    </Field>

                                    <Field>
                                        <div className="flex justify-between gap-2">
                                            <Label>Available stocks</Label>
                                            <div className="flex gap-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500" /> Out</span>
                                                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-orange-500" /> Low (≤10)</span>
                                                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-green-500" /> In stock</span>
                                            </div>
                                        </div>
                                        
                                        <div className={`rounded-md ${stockCard.box}`}>
                                            <div className="flex items-center gap-2 border-b px-4 py-2 text-xs font-medium">
                                                <span className={`size-2 rounded-full ${stockCard.dot}`} />
                                                {stockCard.label}
                                            </div>

                                            <div className="grid grid-cols-2 divide-x divide-inherit">
                                                <div className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5 text-xs opacity-80">
                                                        Full Stocks
                                                    </div>
                                                    <div className="text-xl font-semibold">{selected ? formaterNumber(full) : "—"}</div>
                                                </div>
                                                <div className="px-4 py-3">
                                                    <div className="flex items-center gap-1.5 text-xs opacity-80">
                                                        Partial Stocks
                                                    </div>
                                                    <div className="text-xl font-semibold">{selected ? formaterNumber(partials) : "—"}</div>
                                                </div>
                                            </div>

                                            <div className="border-t px-4 py-3">
                                                <div className="text-xs font-medium opacity-80">Total of Stocks</div>
                                                <div className="text-2xl font-bold leading-tight">{selected ? formaterNumber(total) : "—"}</div>
                                            </div>
                                        </div>
                                    </Field>

                                    {/* <Separator /> */}

                                    <Field>
                                        <Label htmlFor="total_boxes" required>Total boxes</Label>
                                        <Input id="total_boxes" name="total_boxes" type="number" min={1} max={total} disabled={!selected || total === 0} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="status" required>Status</Label>
                                        <Select name="status">
                                            <SelectTrigger id="status" className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["Active", "Inactive"].map((item) => (
                                                    <SelectItem key={item} value={item}>{item}</SelectItem>
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
        </>
    );
};
