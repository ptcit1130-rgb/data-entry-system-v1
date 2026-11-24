import { Breadcrumbs } from "@/components/breadcrumbs";
import { dashboard } from "@/routes";
import { index as stockInItemIndex} from "@/routes/stock-in-items";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, SaveIcon, ReceiptText } from "lucide-react";
import { StockInItem } from "@/types/stock-in-item";
import { useState } from "react";
import { 
    ColumnFiltersState, 
    ColumnVisibilityState, 
    SortingState, 
    useTable 
} from "@tanstack/react-table";
import { features } from "@/components/data-table/features";
import { columns } from "@/pages/stock-in-item/column";
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
import { Form, Head } from "@inertiajs/react";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { StockIn } from "@/types/stock-in";
import { ProductItem } from "@/types/product-item";
import { 
    Combobox,
    ComboboxContent, 
    ComboboxEmpty, 
    ComboboxInput, 
    ComboboxItem, 
    ComboboxList 
} from "@/components/ui/combobox";
import { router } from "@inertiajs/react";
import { store, destroy, update, show } from "@/routes/stock-in-items";

type Props = {
    stock_ins: StockIn;
    stock_in_items: StockInItem[];
    product_items: ProductItem[];
}

export default function Page({ stock_in_items, stock_ins, product_items }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters]       = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
    const [rowSelection, setRowSelection]         = useState({});

    const [openDateManufactured, setOpenDateManufactured] = useState(false);

    const [dateManufactured, setDateManufactured] = useState<Date | undefined>(undefined);
    const [dateExpired, setDateExpired] = useState<Date | undefined>(undefined);
    
    const [productItem, setProductItem] = useState<ProductItem | null>(null);

    const [open, setOpen] = useState(false);

    const [isEditing, setIsEditing]   = useState(false);

    const tableColumns = columns({
        onEdit: (stockInItem) => {
            //
        },
        onView: (stockInItem) => {
            router.visit(show.url(stockInItem.uuid));
        },
        onDelete: (stockInItem) => {
            //  
        }
    });

    const table = useTable({
        features,
        data: stock_in_items,
        columns: tableColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    /**
     * Adds months without overflowing (e.g. Jun 30 + 8 months → Feb 28, not Mar 2)
     * @param date 
     * @param months 
     * @returns 
     */
    const addMonths = (date: Date, months: number): Date => {
        const result  = new Date(date.getFullYear(), date.getMonth() + months, 1);
        const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
        result.setDate(Math.min(date.getDate(), lastDay));
        return result;
    };

    /**
     * Local yyyy-MM-dd (avoids the timezone shift that toISOString() causes)
     * @param date 
     * @returns 
     */
    const toYmd = (date?: Date): string => {
        if (!date) return "";
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }

    const resetForm = () => {
        setProductItem(null);
        setDateManufactured(undefined);
        setDateExpired(undefined);
    };

    const actions = store.form();

    return (
    <>
        <Head title="Stock-in Items" />
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Breadcrumbs
                breadcrumbs={[
                    { title: "Dashboard", href: dashboard() },
                    { title: "Stock-in items", href: stockInItemIndex() },
                ]}
            />
            <div>
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        List of Stock in items
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage stock in items records.
                    </p>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <ReceiptText/> 
                        Transaction Number: <span className="text-green-500"> {stock_ins.transaction_number} </span>
                    </div>
                    <Button onClick={() => { resetForm(); setProductItem(null); setOpen(true); }}>
                        <PlusCircleIcon /> New
                    </Button>
                </div>
                <div className="flex items-center justify-between py-4 gap-5">
                    <Input placeholder="Filter tenant branches..." className="max-w-sm"
                        value={(table.getColumn("unit_of_measure")?.getFilterValue() as string) ?? ""}
                        onChange={(e) => {
                            table.getColumn("unit_of_measure")?.setFilterValue(e.target.value);
                        }}
                    />
                    <DataTableViewOptions table={table} />
                </div>
                <DataTable table={table}/>
            </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit stock-in items.' : 'New stock-in items.'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update stock-in items information.' : 'Create a new stock-in items.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...actions} onSuccess={() => { resetForm(); setOpen(false); setProductItem(null); }}>
                    {({ processing, errors }) => (
                        <div className="space-y-4">
                            <FieldGroup>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input type="hidden" name="stock_in_id" value={stock_ins.uuid}/>
                                    <Field>
                                        <Label htmlFor="product_item_id" required>Product code</Label>
                                        <Combobox 
                                            name="product_item_id" 
                                            items={product_items} 
                                            value={productItem} 
                                            onValueChange={setProductItem}
                                            itemToStringLabel={(item: ProductItem) => item.product_code}
                                            itemToStringValue={(item: ProductItem) => item.uuid}
                                            filter={(item: ProductItem, query: string) => `${item.product_code} ${item.description}`.toLowerCase().includes(query.toLowerCase())}>
                                            <ComboboxInput id="product_item_id" placeholder="Search product code" showClear />
                                            <ComboboxContent onWheel={(e) => e.stopPropagation()} className="pointer-events-auto">
                                                <ComboboxEmpty>No product found.</ComboboxEmpty>
                                                <ComboboxList>
                                                    {(item: ProductItem) => (
                                                        <ComboboxItem key={item.uuid} value={item}>
                                                            {item.product_code} - {item.description}
                                                        </ComboboxItem>
                                                    )}
                                                </ComboboxList>
                                            </ComboboxContent>
                                        </Combobox>
                                        <InputError message={errors.product_item_id} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="unit_of_measure" required>Unit of measure</Label>
                                        <Select name="unit_of_measure">
                                            <SelectTrigger id="unit_of_measure" className="w-full">
                                                <SelectValue placeholder="Select unit of measure..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["Boxes", "Pieces"].map((item) => (
                                                    <SelectItem key={item} value={item}>
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.unit_of_measure} />
                                    </Field>
                                    
                                    <Field>
                                        <Label htmlFor="tagging">
                                            Tagging
                                        </Label>
                                        <Input id="tagging" name="tagging" />
                                        <InputError message={errors.tagging} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="total_boxes" required>
                                            Total boxes
                                        </Label>
                                        <Input id="total_boxes" name="total_boxes" />
                                        <InputError message={errors.total_boxes} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="manufactured" required>Manufactured</Label>
                                        <Popover open={openDateManufactured} onOpenChange={setOpenDateManufactured}>
                                            <PopoverTrigger asChild>
                                                <Button type="button" variant="outline" id="manufactured" 
                                                    className="w-full justify-start text-left font-normal">
                                                    {dateManufactured ? dateManufactured.toLocaleDateString() : "Select date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={dateManufactured}
                                                    defaultMonth={dateManufactured}
                                                    captionLayout="dropdown"
                                                    startMonth={new Date(2000, 0)}
                                                    endMonth={new Date(2100, 11)}
                                                    onSelect={(date) => {
                                                        setDateManufactured(date);
                                                        setDateExpired(date ? addMonths(date, 8) : undefined);
                                                        setOpenDateManufactured(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <input type="hidden" name="manufactured" value={toYmd(dateManufactured)} />
                                        <InputError message={errors.manufactured} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="expiration">
                                            Expiration <span className="text-xs italic text-muted-foreground">(autofill)</span>
                                        </Label>
                                        <Input id="expiration"
                                            value={dateExpired ? dateExpired.toLocaleDateString() : ""} 
                                            readOnly
                                        />
                                        <input type="hidden" name="expiration" value={toYmd(dateExpired)} />
                                        <InputError message={errors.expiration} />
                                    </Field>

                                    <Field className="col-span-2">
                                        <Label htmlFor="status" required>Status</Label>
                                        <Select name="status">
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
                                </div>
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

Page.layout = {
    breadcrumbs: [
        {
            title: "Stock In",
            href: stockInItemIndex(),
        },
    ],
};