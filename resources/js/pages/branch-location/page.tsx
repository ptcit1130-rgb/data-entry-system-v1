import {
    useTable,
    type ColumnFiltersState,
    type ColumnVisibilityState,
    type SortingState,
} from "@tanstack/react-table";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Form, Head } from "@inertiajs/react";
import { dashboard } from "@/routes";
import { index as branchLocationIndex } from "@/routes/branch-locations";
import { Button } from "@/components/ui/button";
import { PlusCircle, SaveIcon } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { BranchLocation } from "@/types/branch-location";
import { useState } from "react";
import { features } from "@/components/data-table/features";
import { columns } from "@/pages/branch-location/column";
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
import { BusinessPartner } from "@/types/business-partner";
import { destroy, store, update } from '@/routes/branch-locations';
import { DistributorSpecialist } from "@/types/distributor-specialist";
import { 
    AlertDialog, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from "@/components/ui/alert-dialog";

type Props = {
    business_partner: BusinessPartner,
    branch_locations: BranchLocation[],
    specialists: DistributorSpecialist[]
}

export default function Page({ branch_locations, business_partner, specialists }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [open, setOpen] = useState(false);

    const [isEditing, setIsEditing]   = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectBranch, setSelectBranch] = useState<BranchLocation | null>(null);
    const [branchToDelete, setBranchToDelete] = useState<BranchLocation | null>(null);

    const tableColumns = columns({
        onEdit: (branch) => {
            setSelectBranch(branch);
            setIsEditing(true);
            setOpen(true);
        },
        onView: (branch) => {

        },
        onDelete: (branch) => {
            setBranchToDelete(branch);
            setDeleteOpen(true);
        }
    });

    const table = useTable({
        features,
        data: branch_locations,
        columns: tableColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    const actions = branchToDelete
        ? destroy.form(branchToDelete.id)
        : isEditing && selectBranch
        ? update.form(selectBranch.id)
        : store.form();

    const Optional = () => (
        <span className="text-xs italic text-muted-foreground">(optional)</span>
    );

    return (
        <>
            <Head title="Business Partner branch locations" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs
                    breadcrumbs={[
                        { title: "Dashboard", href: dashboard() },
                        {title: "Branch locations", href: branchLocationIndex()},
                    ]}
                />
                <div>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            List of Branch Locations
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage business partner branch locations.
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => {setOpen(true); setSelectBranch(null);}}>
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
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Edit distributor specialist.' : 'Add distributor specialist.'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Update distributor specialist information.' : 'Create a new distributor specialist.'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...actions} resetOnSuccess onSuccess={() => setOpen(false)}>
                        {({ processing, errors }) => (
                            <div className="space-y-4">
                                <FieldGroup>
                                    <Field>
                                        <Label htmlFor="partner_name" required>Distributor</Label>
                                        <Input id="partner_name" 
                                            value={business_partner.brand_name} 
                                            readOnly 
                                            className="bg-muted cursor-not-allowed" 
                                        />
                                        <Input type="hidden" name="partner_id" value={business_partner.uuid} />
                                        <InputError message={errors.partner_id} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="specialist_id">
                                            Specialist Name
                                        </Label>
                                        <Select 
                                            name="specialist_id" 
                                            defaultValue={String(selectBranch?.specialist_id ?? "")}>
                                            <SelectTrigger id="specialist_id" className="w-full">
                                                <SelectValue placeholder="Select Distributor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {specialists.map((item) => (
                                                    <SelectItem key={item.id} value={String(item.id)}>
                                                        {item.full_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <Label htmlFor="street_address">
                                                Street Address <Optional/>
                                            </Label>
                                            <Input id="street_address" defaultValue={selectBranch?.street_address} name="street_address" />
                                        </Field>

                                        <Field>
                                            <Label htmlFor="barangay">
                                                Barangay <Optional/>
                                            </Label>
                                            <Input id="barangay" defaultValue={selectBranch?.barangay} name="barangay" />
                                        </Field>

                                        <Field>
                                            <Label htmlFor="city">
                                                City <Optional/>
                                            </Label>
                                            <Input id="city" defaultValue={selectBranch?.city} name="city" />
                                        </Field>

                                        <Field>
                                            <Label htmlFor="province">
                                                Province <Optional/>
                                            </Label>
                                            <Input id="province" defaultValue={selectBranch?.province} name="province" />
                                        </Field>

                                        <Field className="col-span-2">
                                            <Label htmlFor="contact_number">
                                                Contact Number <Optional/>
                                            </Label>
                                            <Input id="contact_number" defaultValue={selectBranch?.contact_number} name="contact_number" />
                                        </Field>

                                        <Field className="col-span-2">
                                            <Label htmlFor="status" required>Status</Label>
                                            <Select name="status" defaultValue={selectBranch?.status}>
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

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle> Are you absolutely sure? </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the branch {`${branchToDelete?.complete_address}.`}
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        <Form {...actions} onSuccess={() => { setDeleteOpen(false) }}>
                            {({ processing }) => (
                                <Button type="submit" variant="destructive" disabled={processing}>
                                    Delete
                                </Button>
                            )}
                        </Form>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

Page.layout = {
    breadcrumbs: [
        {
            title: "Branches",
            href: branchLocationIndex(),
        },
    ],
};