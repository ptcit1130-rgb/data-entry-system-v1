import { DataTable } from "@/components/client-side-datatable/data-table";
import { Head } from "@inertiajs/react";
import { columns } from "@/pages/payment/column";
import { Payment, PaymentStatuses } from "@/types/payment";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { index as paymentIndex } from "@/routes/payments";
import { dashboard } from "@/routes";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { PlusCircle } from "lucide-react";

const statuses: PaymentStatuses[] = [
    "pending",
    "success",
    "proccessing",
    "failed",
];

const data: Payment[] = Array.from({ length: 1000 }, (_, index) => ({
    id: String(index + 1),
    amount: 100 + ((index * 137) % 1900),
    status: statuses[index % statuses.length],
    email: `customer${index + 1}@example.com`,
}));

export default function Page() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Head title="Payments" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Breadcrumbs
                    breadcrumbs={[
                        { title: "Dashboard", href: dashboard() },
                        { title: "Payments", href: paymentIndex() },
                    ]}
                />
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        List of Payments
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage and monitor all payment transactions.
                    </p>
                </div>
                <div>
                    <div className="flex justify-end">
                        <Button onClick={() => setOpen(true)}> 
                            <PlusCircle /> New
                        </Button>
                    </div>
                    <DataTable columns={columns} data={data} />
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>
                            Edit profile
                        </DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. 
                            Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                        </Field>

                        <Field>
                            <Label htmlFor="username-1">Username</Label>
                            <Input id="username-1" name="username" defaultValue="@peduarte" />
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit">
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Page.layout = {
    breadcrumbs: [
        {
            title: "Payments",
            href: paymentIndex(),
        },
    ],
};
