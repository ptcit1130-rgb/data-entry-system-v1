import {
    useTable,
    type ColumnFiltersState,
    type ColumnVisibilityState,
    type SortingState,
} from "@tanstack/react-table";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Head, Form } from "@inertiajs/react";
import { dashboard } from "@/routes";
import { index as inventoryMovementIndex } from "@/routes/inventory-movements";
import { Button } from "@/components/ui/button";
import { MapPin, PlusCircle, SaveIcon } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { useState } from "react";
import { features } from "@/components/data-table/features";
import { InventoryMovement } from "@/types/inventory-movements";
import { columns } from "@/pages/inventory-movement/column";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { ProductCategory } from "@/types/product-category";
import { TenantBranch } from "@/types/tenant-branch";
import { store, destroy, update } from "@/routes/inventory-movements";
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
    tenant_branches: TenantBranch;
    inventory_products: InventoryMovement[];
    product_categories: ProductCategory[];
}

export default function Page({ inventory_products, tenant_branches, product_categories } : Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [open, setOpen] = useState(false);

    const [isEditing, setIsEditing]   = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectInventoryMovement, setSelectInventoryMovement] = useState<InventoryMovement | null>(null);
    const [inventoryMovementToDelete, setInventoryMovementToDelete] = useState<InventoryMovement | null>(null);

    const tableColumns = columns({
        onEdit: (inventoryInventory) => {
            setSelectInventoryMovement(inventoryInventory);
            setIsEditing(true);
            setOpen(true);
        },
        onView: (inventoryInventory) => {
            //
        },
        onDelete: (inventoryInventory) => {
            setInventoryMovementToDelete(inventoryInventory);
            setDeleteOpen(true);
        }
    });

    const table = useTable({
        features,
        data: inventory_products,
        columns: tableColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    const actions = inventoryMovementToDelete 
        ? destroy.form(inventoryMovementToDelete.id) 
        : isEditing && selectInventoryMovement 
        ? update.form(selectInventoryMovement.id)
        : store.form();

    return (
        <>
            <Head title="Warehouses" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs
                    breadcrumbs={[
                        { title: "Dashboard", href: dashboard() },
                        { title: "Warehouses", href: inventoryMovementIndex() },
                    ]}
                />
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        List of Warehouses
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your warehouses.
                    </p>
                </div>
                <div>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <MapPin />
                            {tenant_branches.tenant_name} - {tenant_branches.complete_address}
                        </div>
                        <Button onClick={() => {setOpen(true); setSelectInventoryMovement(null)}}>
                            <PlusCircle /> New
                        </Button>
                    </div>
                    <div className="flex items-center justify-between py-4 gap-5">
                        <Input placeholder="Filter product names..." className="max-w-sm"
                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                            onChange={(e) => {
                                table.getColumn("name")?.setFilterValue(e.target.value);
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
                            {isEditing ? 'Edit area.' : 'Add area.'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Update area.' : 'Create a new area.'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...actions} onSuccess={() => setOpen(false)}>
                        {({ processing, errors }) => (
                            <div className="space-y-4">
                                <FieldGroup className="gap-4">
                                    <Input type="hidden" value={tenant_branches.uuid} name="tenant_branch_id"/>
                                    <Field>
                                        <Label htmlFor="area" required>Area</Label>
                                        <Input id="area" name="area" defaultValue={selectInventoryMovement?.area} />
                                        <InputError message={errors.area} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="product_category_id" required>Stock keeping unit - (SKU)</Label>
                                        <Select name="product_category_id" defaultValue={String(selectInventoryMovement?.product_category_id ?? "")}>
                                            <SelectTrigger id="product_category_id" className="w-full">
                                                <SelectValue placeholder="Select sku" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {product_categories.map((item) => (
                                                    <SelectItem key={item.id} value={String(item.id)}>
                                                        {item.name} - {item.sku}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.product_category_id} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="status" required>Status</Label>
                                        <Select name="status" defaultValue={selectInventoryMovement?.status}>
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
                                </FieldGroup>
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
                            This will permanently delete the branch
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
}

Page.layout = {
    breadcrumbs: [
        {
            title: "Warehouses",
            href: inventoryMovementIndex(),
        },
    ],
};
