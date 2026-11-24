import { Breadcrumbs } from "@/components/breadcrumbs";
import { Head, Form } from "@inertiajs/react";
import { dashboard } from "@/routes";
import { index as productItemIndex } from "@/routes/product-items";
import { Button } from "@/components/ui/button";
import { PlusCircle, SaveIcon } from "lucide-react";
import { ProductItemPageData, ProductItem } from "@/types/product-item";
import { DataTable } from "@/components/data-table/data-table";
import { ColumnFiltersState, ColumnVisibilityState, SortingState, useTable } from "@tanstack/react-table";
import { features } from "@/components/data-table/features";
import { useState } from "react";
import { columns } from "@/pages/product-item/column";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductItemController from "@/actions/App/Http/Controllers/ProductItemController";
import { Textarea } from "@/components/ui/textarea";
import {
    Combobox,
    ComboboxCollection,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
} from "@/components/ui/combobox";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type ProductItemProps = {
    product_items: ProductItemPageData;
};

export default function Page({ product_items }: ProductItemProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters]       = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
    const [rowSelection, setRowSelection]         = useState({});

    const [open, setOpen] = useState(false);

    const [isEditing, setIsEditing]   = useState(false);
    const [deleteOpen, setDeleteOpen]   = useState(false);
    
    const [categoryId, setCategoryId] = useState<number | string>("");
    const [productName, setProductName] = useState("");
    const [sku, setSku] = useState("");
    const [stacking, setStacking] = useState("");
    const [description, setDescription] = useState("");

    const [selectedProductItem, setSelectedProductItem] = useState<ProductItem | null>(null);
    const [productItemToDelete, setProductItemToDelete] = useState<ProductItem | null>(null);

    const tableColumns = columns({
        onEdit: (productItem) => {
            setSelectedProductItem(productItem);
            setIsEditing(true);

            setCategoryId(productItem.product_category_id);
            setProductName(productItem.product_category?.name ?? "");
            setSku(productItem.product_category?.sku ?? "");
            setStacking(productItem.product_category?.stacking ?? "");
            setDescription(productItem.description ?? "");

            setOpen(true);
        },
        onView: (productItem) => {
            // under constructed
        },
        onDelete: (productItem) => {
            setProductItemToDelete(productItem);
            setDeleteOpen(true);
        },
    });
    
    const table = useTable({
        features,
        data: product_items.row,
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
    const formAction = isEditing && selectedProductItem
        ? ProductItemController.update.form(selectedProductItem.uuid)
        : ProductItemController.store.form();

    const deleteAction = productItemToDelete
        ? ProductItemController.destroy.form(productItemToDelete.uuid)
        : null;

    const AllItems = product_items.code.flatMap((g) => g.items);

    const resetFields = () => {
        setDescription("");
        setProductName("");
        setSku("");
        setStacking("");
        setCategoryId("");
        setIsEditing(false);
        setSelectedProductItem(null);
    };

    const Autofill = () => (
        <span className="text-xs italic text-muted-foreground">(autofill)</span>
    );

    type CodeItem = { code: string; description: string };

    const selectedCode = AllItems.find((i) => i.code === selectedProductItem?.product_code) ?? null;

    return (
        <>
            <Head title="Product Items" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs
                    breadcrumbs={[
                        { title: "Dashboard", href: dashboard() },
                        { title: "Product items", href: productItemIndex() },
                    ]}
                />
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        List of Product Items
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your product items.
                    </p>
                </div>
                <div>
                    <div className="flex justify-end">
                        <Button onClick={() => { resetFields(); setOpen(true)} }>
                            <PlusCircle /> New
                        </Button>
                    </div>
                    <div className="flex items-center justify-between py-4 gap-5">
                        <Input placeholder="Filter product codes..." className="max-w-sm"
                            value={(table.getColumn("product_code")?.getFilterValue() as string) ?? ""}
                            onChange={(e) => {
                                table.getColumn("product_code")?.setFilterValue(e.target.value);
                            }}
                        />
                        <DataTableViewOptions table={table} />
                    </div>
                    <DataTable table={table}/>
                </div>
            </div>

            <Dialog open={open} onOpenChange={(value) => {setOpen(value); if (!value) resetFields();}}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Edit product category.' : 'Add product category.'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing ? 'Update product category information.' : 'Create a new product category.'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form key={selectedProductItem?.uuid ?? "new"} {...formAction} onSuccess={() => { setOpen(false); resetFields(); }}>
                        {({ processing, errors }) => (
                            <div className="space-y-4 -mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                                <FieldGroup className="gap-4">
                                    <Input type="hidden" name="product_category_id" value={categoryId} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <Label htmlFor="product_code" required>Product Code</Label>
                                            <Combobox
                                                name="product_code"
                                                items={product_items.code}
                                                defaultValue={selectedCode}
                                                itemToStringLabel={(item: CodeItem) => item.code}
                                                itemToStringValue={(item: CodeItem) => item.code}
                                                filter={(item: CodeItem, query: string) => {
                                                    const queryString = query.trim().toLowerCase();
                                                    return (
                                                        item.code.toLowerCase().includes(queryString) || item.description.toLowerCase().includes(queryString)
                                                    );
                                                }}
                                                onValueChange={(item: CodeItem | null) => {
                                                    const code = item?.code;

                                                    if (!code) {
                                                        setDescription("");
                                                        setProductName("");
                                                        setSku("");
                                                        setStacking("");
                                                        setCategoryId("");
                                                        return;
                                                    }

                                                    setDescription(item.description ?? "");

                                                    const group = product_items.code.find((g) =>
                                                        g.items.some((i) => i.code === code)
                                                    );

                                                    const category = product_items.categories.find(
                                                        (c) => c.name.toLowerCase() === group?.value.toLowerCase()
                                                    );

                                                    setProductName(category?.name ?? "");
                                                    setSku(category?.sku ?? "");
                                                    setStacking(category?.stacking ?? "");
                                                    setCategoryId(category?.id ?? "");
                                                }}>
                                                <ComboboxInput id="product_code" placeholder="Search product code" showClear />
                                                <ComboboxContent onWheel={(e) => e.stopPropagation()} className="pointer-events-auto">
                                                    <ComboboxEmpty>No codes found.</ComboboxEmpty>
                                                    <ComboboxList>
                                                        {(group) => (
                                                            <ComboboxGroup key={group.value} items={group.items}>
                                                                <ComboboxLabel>{group.value}</ComboboxLabel>
                                                                <ComboboxCollection>
                                                                    {(item: CodeItem) => (
                                                                        <ComboboxItem key={item.code} value={item}>
                                                                            {item.code} - {item.description}
                                                                        </ComboboxItem>
                                                                    )}
                                                                </ComboboxCollection>
                                                            </ComboboxGroup>
                                                        )}
                                                    </ComboboxList>
                                                </ComboboxContent>
                                            </Combobox>
                                            <InputError message={errors.product_code} />
                                        </Field>

                                        <Field>
                                            <Label htmlFor="productName">
                                                Product Name - <Autofill/>
                                            </Label>
                                            <Input id="productName" 
                                                value={productName} 
                                                readOnly 
                                            />
                                        </Field>

                                        <Field>
                                            <Label htmlFor="sku">
                                                SKU - <Autofill/>
                                            </Label>
                                            <Input id="sku" 
                                                value={sku} readOnly 
                                            />
                                        </Field>

                                        <Field>
                                            <Label htmlFor="stacking">
                                                Stacking - <Autofill/>
                                            </Label>
                                            <Input id="stacking" 
                                                value={stacking} 
                                                readOnly 
                                            />
                                        </Field>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <Field>
                                            <Label htmlFor="description">Description <Autofill/></Label>
                                            <Textarea id="description" name="description"
                                                value={description} readOnly
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </Field>
                                        <Field>
                                            <Label htmlFor="status" required>Status</Label>
                                            <Select name="status" defaultValue={selectedProductItem?.status}>
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

            <AlertDialog open={deleteOpen} onOpenChange={(v) => {setDeleteOpen(v); if (!v) setProductItemToDelete(null);}}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle> Are you absolutely sure? </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the product item {`${productItemToDelete?.product_category.name}. `}
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        {deleteAction && (
                            <Form {...deleteAction} onSuccess={() => { setDeleteOpen(false); setProductItemToDelete(null); }}>
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
            title: "Product Item",
            href: productItemIndex(),
        },
    ],
};