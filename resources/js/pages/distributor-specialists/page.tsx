import {
    useTable,
    type ColumnFiltersState,
    type ColumnVisibilityState,
    type SortingState,
} from "@tanstack/react-table";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Form, Head } from "@inertiajs/react";
import { index as specialistIndex } from "@/routes/specialists";
import { dashboard } from "@/routes";
import { Button } from "@/components/ui/button";
import { PlusCircle, SaveIcon } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { features } from "@/components/data-table/features";
import { columns } from "@/pages/distributor-specialists/columns";
import { DistributorSpecialist } from "@/types/distributor-specialist";
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
import DistributorSpecialistController from "@/actions/App/Http/Controllers/DistributorSpecialistController";
import { 
    AlertDialog, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from "@/components/ui/alert-dialog";

type DistributorSpecialistProps = {
    specialists: DistributorSpecialist[]
}

export default function Page({ specialists }: DistributorSpecialistProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [open, setOpen] = useState(false);

    const [isEditing, setIsEditing]   = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedSpecialist, setSelectedSpecialist] = useState<DistributorSpecialist | null>(null);
    const [specialistToDelete, setSpecialistToDelete] = useState<DistributorSpecialist | null>(null);

    const tablecolumns = columns({
        onEdit: (specialist) => {
            setSelectedSpecialist(specialist);
            setIsEditing(true);
            setOpen(true);
        },
        onView: (specialist) => {
            // under constructed
        },
        onDelete: (specialist) => {
            setSpecialistToDelete(specialist);
            setDeleteOpen(true);
        }
    });

    const table = useTable({
        features,
        data: specialists,
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
    const actions = specialistToDelete
        ? DistributorSpecialistController.destroy.form(specialistToDelete.id)
        : isEditing && selectedSpecialist
        ? DistributorSpecialistController.update.form(selectedSpecialist.id)
        : DistributorSpecialistController.store.form();

    const Optional = () => (
        <span className="text-xs italic text-muted-foreground">(optional)</span>
    );
    return (
        <>
            <Head title="Product Items" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs
                    breadcrumbs={[
                        { title: "Dashboard", href: dashboard() },
                        { title: "Distributor Specialists", href: specialistIndex() },
                    ]}
                />
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        List of Distributor Specialists
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage distributor specialists.
                    </p>
                </div>
                <div>
                    <div className="flex justify-end">
                        <Button onClick={() => {setOpen(true); setSelectedSpecialist(null)}}>
                            <PlusCircle /> New
                        </Button>
                    </div>
                    <div className="flex items-center justify-between py-4 gap-5">
                        <Input placeholder="Filter names..." className="max-w-sm"
                            value={(table.getColumn("full_name")?.getFilterValue() as string) ?? ""}
                            onChange={(e) => table.getColumn("full_name")?.setFilterValue(e.target.value)}
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
                    <Form {...actions} onSuccess={() => {setOpen(false); setSpecialistToDelete(null);}}>
                        {({ processing, errors }) => (
                            <div className="space-y-4">
                                <FieldGroup>
                                    <Field>
                                        <Label htmlFor="first_name" required>
                                            First Name
                                        </Label>
                                        <Input id="first_name" name="first_name" 
                                            defaultValue={selectedSpecialist?.first_name ?? ""}
                                        />
                                        <InputError message={errors.first_name} />
                                    </Field>

                                    <div className="grid grid-cols-[3fr_1fr] gap-4">
                                        <Field>
                                            <Label htmlFor="middle_name">
                                                Middle Name <Optional/>
                                            </Label>
                                            <Input id="middle_name" name="middle_name" 
                                                defaultValue={selectedSpecialist?.middle_name ?? ""}
                                            />
                                        </Field>

                                        <Field>
                                            <Label htmlFor="suffix">Suffix <Optional/></Label>
                                            <Select name="suffix" defaultValue={selectedSpecialist?.suffix ?? ""}>
                                                <SelectTrigger id="suffix" className="w-full">
                                                    <SelectValue placeholder="Suffix..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">No suffix</SelectItem>
                                                    {["Jr.", "Sr.", "II", "III"].map((item) => (
                                                        <SelectItem key={item} value={item}>
                                                            {item}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    </div>

                                    <Field>
                                        <Label htmlFor="last_name" required>
                                            Last Name
                                        </Label>
                                        <Input id="last_name" name="last_name" 
                                            defaultValue={selectedSpecialist?.last_name ?? ""}
                                        />
                                        <InputError message={errors.last_name} />
                                    </Field>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <Label htmlFor="street_address">
                                                Street Address <Optional/>
                                            </Label>
                                            <Input id="street_address" name="street_address" 
                                                defaultValue={selectedSpecialist?.street_address ?? ""}
                                            />
                                            <InputError message={errors.street_address} />
                                        </Field>

                                        <Field>
                                            <Label htmlFor="city">
                                                City <Optional/>
                                            </Label>
                                            <Input id="city" name="city" 
                                                defaultValue={selectedSpecialist?.city ?? ""}
                                            />
                                            <InputError message={errors.city} />
                                        </Field>

                                        <Field>
                                            <Label htmlFor="province">
                                                Province <Optional/>
                                            </Label>
                                            <Input id="province" name="province"
                                                defaultValue={selectedSpecialist?.province ?? ""} 
                                            />
                                            <InputError message={errors.province} />
                                        </Field>

                                        <Field>
                                            <Label htmlFor="postal_code">
                                                Postal/Zip Code <Optional/>
                                            </Label>
                                            <Input id="postal_code" name="postal_code" 
                                                defaultValue={selectedSpecialist?.postal_code ?? ""} 
                                            />
                                            <InputError message={errors.postal_code} />
                                        </Field>

                                        <Field className="col-span-2">
                                            <Label htmlFor="status" required>Status</Label>
                                            <Select name="status" defaultValue={selectedSpecialist?.status ?? ""}>
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
                            This will permanently delete the product category {`${specialistToDelete?.first_name} ${specialistToDelete?.middle_name} ${specialistToDelete?.last_name}. `}
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        <Form {...actions} onSuccess={() => { setDeleteOpen(false); setSpecialistToDelete(null)}}>
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
            title: "Distributor Specialist",
            href: specialistIndex(),
        },
    ],
};
