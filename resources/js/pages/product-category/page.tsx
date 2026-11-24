import {
    useTable,
    type ColumnFiltersState,
    type ColumnVisibilityState,
    type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { dashboard } from "@/routes";
import { Head, Form } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCategory } from "@/types/product-category";
import { columns } from "@/pages/product-category/columns";
import { features } from "@/components/data-table/features";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableViewOptions } from "@/components/data-table/view-option";
import { index as productCategoryIndex } from "@/routes/product-categories";
import { Button } from "@/components/ui/button";
import { PlusCircle, SaveIcon } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import InputError from "@/components/input-error";
import { store, update, destroy } from "@/routes/product-categories";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type ProductCategoryProps = {
    product_categories: ProductCategory[];
};

export default function Page({ product_categories }: ProductCategoryProps) {
    const [sorting, setSorting]                   = useState<SortingState>([]);
    const [columnFilters, setColumnFilters]       = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
    const [rowSelection, setRowSelection]         = useState({});

    const [open, setOpen] = useState(false);
    
    const [isEditing, setIsEditing]   = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);

    const tableColumns = columns({
        onEdit: (category) => {
            setSelectedCategory(category);
            setIsEditing(true);
            setOpen(true);
        },
        onView: (category) => {
            // under constructed
        },
        onDelete: (category) => {
            setCategoryToDelete(category);
            setDeleteOpen(true);
        },
    });

    const table = useTable({
        features,
        data: product_categories,
        columns: tableColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: { sorting, columnFilters, columnVisibility, rowSelection },
    });

    /**
     * Wayfinder actions: Store, Update, and Delete.
     */
    const formAction = isEditing && selectedCategory
        ? update.form(selectedCategory.id)
        : store.form();

    const deleteAction = categoryToDelete
        ? destroy.form(categoryToDelete.id)
        : null;

    return (
        <>
            <Head title="Product Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs
                    breadcrumbs={[
                        {title: "Dashboard", href: dashboard()},
                        {title: "Product categories", href: productCategoryIndex()},
                    ]}
                />
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        List of Product category
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your product categories.
                    </p>
                </div>
                <div>
                    <div className="flex justify-end">
                        <Button onClick={() => {setOpen(true); setSelectedCategory(null)}}>
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
                        <Select value={(table.getColumn("status")?.getFilterValue() as string) ?? ""} 
                            onValueChange={(value) => table.getColumn("status")?.setFilterValue(value === "All statuses" ? undefined : value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter statuses..." />
                            </SelectTrigger>
                            <SelectContent>
                                {["All statuses","Active", "Inactive"].map((item) => (
                                    <SelectItem key={item} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <DataTableViewOptions table={table} />
                    </div>

                    <DataTable table={table} />
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Edit product category.' : 'Add product category.'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Update product category information.' : 'Create a new product category.'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form key={selectedCategory?.id ?? "new"} {...formAction} onSuccess={() => { setOpen(false); setSelectedCategory(null); setIsEditing(false); }}>
                        {({ processing, errors }) => (
                            <div className="space-y-4">
                                <FieldGroup>
                                    <Field>
                                        <Label htmlFor="name">Product Name</Label>
                                        <Input id="name" name="name" defaultValue={selectedCategory?.name ?? ""} />
                                        <InputError message={errors.name} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="sku">Stock keeping unit - (SKU)</Label>
                                        <Select name="sku" defaultValue={selectedCategory?.sku ?? ""}>
                                            <SelectTrigger id="sku" className="w-full">
                                                <SelectValue placeholder="Select sku" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["150ml", "200ml", "250ml", "275ml"].map((item) => (
                                                    <SelectItem key={item} value={item}>
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.sku} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="stacking">Stacking</Label>
                                        <Select name="stacking" defaultValue={selectedCategory?.stacking ?? ""}>
                                            <SelectTrigger id="stacking" className="w-full">
                                                <SelectValue placeholder="Select stacking" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["405", "490", "570"].map((item) => (
                                                    <SelectItem key={item} value={item}>
                                                        {item}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.sku} />
                                    </Field>

                                    <Field>
                                        <Label htmlFor="status">Status</Label>
                                        <Select name="status" defaultValue={selectedCategory?.status ?? ""}>
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

            
            <AlertDialog
                open={deleteOpen}
                onOpenChange={(v) => {
                    setDeleteOpen(v);
                    if (!v) setCategoryToDelete(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the product category {categoryToDelete?.name}.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        {deleteAction && (
                            <Form
                                {...deleteAction}
                                onSuccess={() => { setDeleteOpen(false); setCategoryToDelete(null); }}
                            >
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
}

Page.layout = {
    breadcrumbs: [
        {
            title: "Product category",
            href: productCategoryIndex(),
        },
    ],
};
