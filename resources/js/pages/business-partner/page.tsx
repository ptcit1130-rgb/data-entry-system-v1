import {
    useTable,
    type ColumnFiltersState,
    type ColumnVisibilityState,
    type SortingState,
} from "@tanstack/react-table";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Head, Form } from "@inertiajs/react";
import { dashboard } from "@/routes";
import { Button } from "@/components/ui/button";
import { PlusCircle, SaveIcon } from "lucide-react";
import { useState } from "react";
import { features } from "@/components/data-table/features";
import { BusinessPartner } from "@/types/business-partner";
import { columns } from "@/pages/business-partner/column";
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
import { 
    AlertDialog, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { index as businessParter, store, update, destroy, show } from "@/routes/business-partners";
import { router } from "@inertiajs/react";

type Props = {
    business_partners: BusinessPartner[]
}

export default function Page({ business_partners }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [open, setOpen] = useState(false);

    const [isEditing, setIsEditing]   = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedBusinessPartner, setSelectedBusinessPartner] = useState<BusinessPartner | null>(null);
    const [businessPartnerToDelete, setBusinessPartnerToDelete] = useState<BusinessPartner | null>(null);

    const tablecolumns = columns({
        onEdit: (businessPartner) => {
            setSelectedBusinessPartner(businessPartner);
            setIsEditing(true);
            setOpen(true);
        },
        onView: (businessPartner) => {
            router.visit(show.url(businessPartner.uuid));
        },
        onDelete: (businessPartner) => {
            setBusinessPartnerToDelete(businessPartner);
            setDeleteOpen(true);
        }
    });

    const table = useTable({
        features,
        data: business_partners,
        columns: tablecolumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    /**
     * Wayfinder actions: Store, Update, and Delete.
     */
    const formAction = isEditing && selectedBusinessPartner
        ? update.form(selectedBusinessPartner.uuid)
        : store.form();

    const deleteAction = businessPartnerToDelete
        ? destroy.form(businessPartnerToDelete.uuid)
        : null;

    const Optional = () => (
        <span className="text-xs italic text-muted-foreground">(optional)</span>
    );

    return (
        <>
            <Head title="Business Partners" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs
                    breadcrumbs={[
                        { title: "Dashboard", href: dashboard() },
                        {title: "Business Partners", href: businessParter()},
                    ]}
                />
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        List of Business Partners
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your business partners records.
                    </p>
                </div>
                <div>
                    <div className="flex justify-end">
                        <Button onClick={() => { setSelectedBusinessPartner(null); setIsEditing(false); setOpen(true); }}>
                            <PlusCircle /> New
                        </Button>
                    </div>
                    <div className="flex items-center justify-between py-4 gap-5">
                        <Input placeholder="Filter brand names..." className="max-w-sm"
                            value={(table.getColumn("brand_name")?.getFilterValue() as string) ?? ""}
                            onChange={(e) => table.getColumn("brand_name")?.setFilterValue(e.target.value)}
                        />
                        <DataTableViewOptions table={table} />
                    </div>
                    <DataTable table={table}/>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Edit business partner.' : 'Add business partner.'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Update business partner information.' : 'Create a new business partner.'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form key={selectedBusinessPartner?.uuid ?? "new"} {...formAction}
                            onSuccess={() => { setOpen(false); setSelectedBusinessPartner(null); setIsEditing(false); }}>
                        {({ processing, errors }) => (
                            <div className="space-y-4">
                                <FieldGroup>
                                    <Field>
                                        <Label htmlFor="brand_name" required>
                                            Brand Name
                                        </Label>
                                        <Input id="brand_name" name="brand_name" 
                                            defaultValue={selectedBusinessPartner?.brand_name ?? ""} 
                                        />
                                        <InputError message={errors.brand_name} />
                                    </Field>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <Label htmlFor="first_name">
                                                First Name <Optional/>
                                            </Label>
                                            <Input id="first_name" name="first_name" 
                                                defaultValue={selectedBusinessPartner?.first_name ?? ""} 
                                            />
                                        </Field>

                                        <Field>
                                            <Label htmlFor="middle_name">
                                                Middle Name <Optional/>
                                            </Label>
                                            <Input id="middle_name" name="middle_name" 
                                                defaultValue={selectedBusinessPartner?.middle_name ?? ""} 
                                            />
                                        </Field>

                                        <Field className="col-span-2">
                                            <Label htmlFor="last_name">
                                                Last Name <Optional/>
                                            </Label>
                                            <Input id="last_name" name="last_name" 
                                                defaultValue={selectedBusinessPartner?.last_name ?? ""} 
                                            />
                                        </Field>
                                        
                                        <Field>
                                            <Label htmlFor="group" required>
                                                Group
                                            </Label>
                                            <Select name="group" defaultValue={selectedBusinessPartner?.group ?? ""}>
                                                <SelectTrigger id="group" className="w-full">
                                                    <SelectValue placeholder="Select group" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {["Customer", "Vendor"].map((item) => (
                                                        <SelectItem key={item} value={item}>
                                                            {item}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.group} />
                                        </Field>

                                        <Field>
                                            <Label htmlFor="status" required>
                                                Status
                                            </Label>
                                            <Select name="status" defaultValue={selectedBusinessPartner?.status ?? ""}>
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

            <AlertDialog open={deleteOpen} onOpenChange={(v) => {
                setDeleteOpen(v);
                if (!v) setBusinessPartnerToDelete(null);
            }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the business partner {businessPartnerToDelete?.brand_name}.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        {deleteAction && (
                            <Form {...deleteAction} onSuccess={() => { setDeleteOpen(false); setBusinessPartnerToDelete(null); }}>
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
}

Page.layout = {
    breadcrumbs: [
        {
            title: "Business Partner",
            href: businessParter(),
        },
    ],
};
