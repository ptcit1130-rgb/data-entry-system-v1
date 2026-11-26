import {
    useTable,
    type ColumnFiltersState,
    type ColumnVisibilityState,
    type SortingState,
} from "@tanstack/react-table";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { dashboard } from "@/routes";
import { Form, Head, router } from "@inertiajs/react";
import { PlusCircleIcon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { features } from "@/components/data-table/features";
import { columns } from "@/pages/stock-out/column";
import { StockOut } from "@/types/stock-out";
import { DataTable } from "@/components/data-table/data-table";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/data-table/view-option";
import { 
    Dialog, 
    DialogClose, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { store, show } from "@/routes/stock-outs";
import { BusinessPartner } from "@/types/business-partner";

type Props = {
    stock_outs: StockOut[];
    business_partners: BusinessPartner[];
}

export default function Page({ stock_outs, business_partners }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [open, setOpen] = useState(false);

    const [isEditing, setIsEditing]   = useState(false);

    const [openDateReleased, setOpenDateReleased] = useState(false);
    const [dateReleased, setDateReleased] = useState<Date | undefined>(undefined);

    const [partnerId, setPartnerId] = useState("");

    const branches = business_partners.find((bp) => String(bp.id) === partnerId)?.branch_locations ?? [];
    
    const tableColumns = columns({
        onEdit: (stockOut) => {
            
        },
        onView: (stockOut) => {
            router.visit(show.url(stockOut.uuid));
        },
        onDelete: (stockOut) => {
             
        }
    });

    const table = useTable({
        features,
        data: stock_outs,
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

    const formActions = store.form();

  return (
    <>
        <Head title="Stock Out" />
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
                        List of Stock Out
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage stock out records.
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
                <Form {...formActions} resetOnSuccess onSuccess={() => setOpen(false)}>
                    {({ processing, errors }) => (
                        <div className="space-y-4">
                            <FieldGroup className="gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Field >
                                        <Label htmlFor="widrawal_slip_number" required>
                                            Widrawal Slip Number
                                        </Label>
                                        <Input id="widrawal_slip_number" name="widrawal_slip_number" />
                                        <InputError message={errors.widrawal_slip_number} />
                                    </Field>

                                    <Field >
                                        <Label htmlFor="delivery_slip_number" required>
                                            Delivery Slip Number
                                        </Label>
                                        <Input id="delivery_slip_number" name="delivery_slip_number" />
                                        <InputError message={errors.delivery_slip_number} />
                                    </Field>

                                    <Field >
                                        <Label htmlFor="return_slip_number" required>
                                            Return Slip Number
                                        </Label>
                                        <Input id="return_slip_number" name="return_slip_number" />
                                        <InputError message={errors.return_slip_number} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="date_released" required>Released</Label>
                                        <Popover open={openDateReleased} onOpenChange={setOpenDateReleased}>
                                            <PopoverTrigger asChild>
                                                <Button type="button" variant="outline" id="date_released" 
                                                    className="w-full justify-start text-left font-normal">
                                                    {dateReleased ? dateReleased.toLocaleDateString() : "Select date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={dateReleased}
                                                    defaultMonth={dateReleased}
                                                    captionLayout="dropdown"
                                                    startMonth={new Date(2000, 0)}
                                                    endMonth={new Date(2100, 11)}
                                                    onSelect={(date) => {
                                                        setDateReleased(date);
                                                        setOpenDateReleased(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <input type="hidden" name="date_released" value={toYmd(dateReleased)} />
                                        <InputError message={errors.date_released} />
                                    </Field>
                                </div>
                                <Field>
                                    <Label htmlFor="distributor">Distributor</Label>
                                    <Select value={partnerId} onValueChange={setPartnerId}>
                                        <SelectTrigger id="distributor" className="w-full">
                                            <SelectValue placeholder="Select distributor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {business_partners.map((bp) => (
                                                <SelectItem key={bp.id} value={String(bp.id)}>{bp.brand_name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field>
                                    <Label htmlFor="branch_location_id" required>Branch</Label>
                                    <Select key={partnerId} name="branch_location_id" disabled={!partnerId}>
                                        <SelectTrigger id="branch_location_id" className="w-full">
                                            <SelectValue placeholder={partnerId ? "Select branch" : "Select distributor first"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {branches.map((b) => (
                                                <SelectItem key={b.id} value={String(b.id)}>
                                                    {b.complete_address || `Branch #${b.id}`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.branch_location_id} />
                                </Field>
                                <Field>
                                    <Label htmlFor="transaction_type_out" required>Transaction Type Out</Label>
                                    <Select name="transaction_type_out">
                                        <SelectTrigger id="transaction_type_out" className="w-full">
                                            <SelectValue placeholder="Select transaction type out" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[
                                                "Sales", 
                                                "Incentives",
                                                "Claims",
                                                "Replacement",
                                                "Complimentary",
                                                "Trade Deals",
                                                "Transfer",
                                                "Support",
                                                "Sampling replacement",
                                                "Bundling",
                                                "Others"
                                            ].map((item) => (
                                                <SelectItem key={item} value={item}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.status} />
                                </Field>

                                <Field>
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
            title: "Stock Out",
            href: "#",
        },
    ],
};
