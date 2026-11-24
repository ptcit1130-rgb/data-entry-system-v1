import { Breadcrumbs } from "@/components/breadcrumbs";
import { Form, Head } from "@inertiajs/react";
import { dashboard } from "@/routes";
import { index as tenantBranchIndex } from '@/routes/tenant-branches';
import { Button } from "@/components/ui/button";
import { PlusCircle, SaveIcon } from "lucide-react";
import { useState } from "react";
import { ColumnFiltersState, ColumnVisibilityState, SortingState, useTable } from "@tanstack/react-table";
import { features } from "@/components/data-table/features";
import { columns } from "@/pages/tenant-branch/column";
import { TenantBranch } from "@/types/tenant-branch";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import InputError from "@/components/input-error";
import { destroy, store, update, show } from '@/routes/tenant-branches';
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
    tenant_branches: TenantBranch[]
}

export default function Page({ tenant_branches } : Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters]       = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
    const [rowSelection, setRowSelection]         = useState({});

    const [open, setOpen] = useState(false);
    
    const [isEditing, setIsEditing]   = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectTanantBranch, setSelectTanantBranch] = useState<TenantBranch | null>(null);
    const [branchTenantToDelete, setBranchTenantToDelete] = useState<TenantBranch | null>(null);

    const tableColumns = columns({
        onEdit: (tenantBranch) => {
            setSelectTanantBranch(tenantBranch);
            setIsEditing(true);
            setOpen(true);
        },
        onView: (tenantBranch) => {
            router.visit(show.url(tenantBranch.uuid));
        },
        onDelete: (tenantBranch) => {
           setBranchTenantToDelete(tenantBranch); 
           setDeleteOpen(true);  
        }
    });

    const table = useTable({
        features,
        data: tenant_branches,
        columns: tableColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    const formAction = isEditing && selectTanantBranch
        ? update.form(selectTanantBranch.uuid)
        : store.form();

    const deleteAction = branchTenantToDelete
        ? destroy.form(branchTenantToDelete.uuid)
        : null;

    const Optional = () => (
        <span className="text-xs italic text-muted-foreground">(optional)</span>
    );

  return (
    <>
        <Head title="Tenant Branch" />
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Breadcrumbs
                breadcrumbs={[
                    { title: "Dashboard", href: dashboard() },
                    { title: "Product items", href: tenantBranchIndex() },
                ]}
            />
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                    List of Tenants
                </h1>
                <p className="text-sm text-muted-foreground">
                    Manage a tenent branches.
                </p>
            </div>
            <div>
                <div className="flex justify-end">
                    <Button onClick={() => {setOpen(true); setSelectTanantBranch(null)}}>
                        <PlusCircle /> New
                    </Button>
                </div>
                <div className="flex items-center justify-between py-4 gap-5">
                    <Input placeholder="Filter tenant branches..." className="max-w-sm"
                        value={(table.getColumn("tenant_name")?.getFilterValue() as string) ?? ""}
                        onChange={(e) => {
                            table.getColumn("tenant_name")?.setFilterValue(e.target.value);
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
                        {isEditing ? 'Edit tenant branch.' : 'New tenant branch.'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update tenant branch information.' : 'Create a new tenant branch.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...formAction} resetOnSuccess onSuccess={() => setOpen(false)}>
                    {({ processing, errors }) => (
                        <div className="space-y-4">
                            <FieldGroup>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field className="col-span-2">
                                        <Label htmlFor="tenant_name" required>
                                            Tenant Name
                                        </Label>
                                        <Input id="tenant_name" name="tenant_name" defaultValue={selectTanantBranch?.tenant_name} />
                                        <InputError message={errors.tenant_name} />
                                    </Field>
                                    
                                    <Field>
                                        <Label htmlFor="barangay">
                                            Barangay <Optional/>
                                        </Label>
                                        <Input id="barangay" name="barangay" defaultValue={selectTanantBranch?.barangay} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="street_address">
                                            Street Address <Optional/>
                                        </Label>
                                        <Input id="street_address" name="street_address" defaultValue={selectTanantBranch?.street_address} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="city" required>
                                            City
                                        </Label>
                                        <Input id="city" name="city" defaultValue={selectTanantBranch?.city} />
                                        <InputError message={errors.city} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="province" required>
                                            Province
                                        </Label>
                                        <Input id="province" name="province" defaultValue={selectTanantBranch?.province} />
                                        <InputError message={errors.province} />
                                    </Field>

                                    <Field className="col-span-2">
                                        <Label htmlFor="contact_number">
                                            Contact Number <Optional/>
                                        </Label>
                                        <Input id="contact_number" name="contact_number" defaultValue={selectTanantBranch?.contact_number} />
                                    </Field>

                                    <Field className="col-span-2">
                                        <Label htmlFor="status" required>Status</Label>
                                        <Select name="status" defaultValue={selectTanantBranch?.status}>
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
                if (!v) setBranchTenantToDelete(null);
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
                        <Form {...deleteAction} onSuccess={() => { setDeleteOpen(false); setBranchTenantToDelete(null); }}>
                            {({ processing }) => (
                                <Button type="submit" variant="destructive" disabled={processing}>
                                    Delete
                                </Button>
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
            href: tenantBranchIndex(),
        },
    ],
};
