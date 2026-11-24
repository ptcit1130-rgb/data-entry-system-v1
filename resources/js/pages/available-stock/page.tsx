import { Breadcrumbs } from "@/components/breadcrumbs";
import { Head, router } from "@inertiajs/react";
import { dashboard } from "@/routes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Package, Tag, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { StockInItem, RackDistribution } from "@/types/stock-in-item";
import { update } from "@/routes/stock-in-items";
import { destroy as destroyRack } from "@/routes/stock-in-items/racks";
import { RackContext } from "@/components/rack/rack-context";
import { resolveLayout } from "@/pages/available-stock/layouts";

export default function Page({
    stock_in_items,
    rack_allocations,
}: {
    stock_in_items: StockInItem;
    rack_allocations: RackDistribution[];
}) {
    const [query, setQuery] = useState("");
    const [busy, setBusy] = useState(false);
    const [removeTarget, setRemoveTarget] = useState<string | null>(null);

    const sku = stock_in_items.product_item?.product_category?.sku;
    const Layout = resolveLayout(sku);

    const ownRacks = useMemo(
        () => new Set((stock_in_items.total_box_distributes ?? []).map((d) => d.rack_number)),
        [stock_in_items.total_box_distributes],
    );

    const byRack = useMemo(
        () => new Map((rack_allocations ?? []).map((item) => [item.rack_number, item])),
        [rack_allocations],
    );

    const allocated = (stock_in_items.total_box_distributes ?? []).reduce(
        (sum, d) => sum + d.boxes,
        0,
    );
    
    const remaining = Number(stock_in_items.total_boxes) - allocated;

    const stockMeta = [
        { label: "Stacking:", value: stock_in_items.product_item?.product_category?.stacking, icon: Package },
        { label: "Total Boxes:", value: stock_in_items.total_boxes, icon: Package },
        { label: "Tag:", value: stock_in_items.tagging, icon: Tag },
    ];

    const handleSelect = (rack: string) => {
        router.patch(update.url(stock_in_items.uuid),
            { rack_number: rack },
            {
                preserveScroll: true,
                preserveState: true,
                only: ["stock_in_items", "rack_allocations"],
                onStart: () => setBusy(true),
                onFinish: () => setBusy(false),
            },
        );
    };

    const confirmRemove = () => {
        if (!removeTarget) return;

        router.delete(destroyRack.url(stock_in_items.uuid), {
            data          : { rack_number: removeTarget },
            preserveScroll: true,
            preserveState : true,
            only          : ["stock_in_items", "rack_allocations"],
            onStart       : () => setBusy(true),
            onSuccess     : () => setRemoveTarget(null),
            onFinish      : () => setBusy(false),
        });
    };

    const ctx = useMemo(() => (
        {
            byRack,
            query: query.trim().toLowerCase(),
            onSelect: handleSelect,
            onRemove: (rack: string) => setRemoveTarget(rack),
            ownRacks,
            busy,
            remaining,
        }), [byRack, query, busy, remaining, ownRacks, stock_in_items.uuid],
    );

    const removing = removeTarget ? byRack.get(removeTarget) : undefined;

    return (
        <>
            <Head title="Available Stocks" />

            <div className="flex h-full flex-1 flex-col gap-2 rounded-xl p-3 sm:p-4">
                <Breadcrumbs
                    breadcrumbs={[
                        { title: "Dashboard", href: dashboard() },
                        { title: "Stocks", href: "#" },
                    ]}
                />

                <div className="min-w-0">
                    <h1 className="text-2xl font-semibold tracking-tight">List of Stocks</h1>
                    <p className="text-sm text-muted-foreground">Manage stock rack allocations.</p>

                    <Card className="mt-2 w-full gap-2 border-none p-0">
                        <CardHeader className="m-0 p-0">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <CardTitle className="text-base font-semibold">
                                    {sku ?? "Product"} - Racking
                                </CardTitle>

                                <div className="flex flex-wrap items-center gap-4 px-4 py-1 shadow-sm">
                                    {stockMeta.map(({ label, value, icon: Icon }) => (
                                        <div key={label} className="flex items-center gap-2">
                                            <Icon className="size-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">{label}</span>
                                            <span className="text-sm font-semibold tabular-nums">
                                                {value ?? "—"}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <Input value={query} onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Find a slot or code…"
                                    className="w-full sm:w-64"
                                />
                            </div>
                        </CardHeader>

                        <CardContent className="m-0 overflow-x-auto p-0">
                            <TooltipProvider delayDuration={100}>
                                <RackContext.Provider value={ctx}>
                                    {Layout ? (
                                        <Layout />
                                    ) : (
                                        <p className="p-4 text-sm text-muted-foreground">
                                            No rack layout is configured for this SKU.
                                        </p>
                                    )}
                                </RackContext.Provider>
                            </TooltipProvider>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={removeTarget !== null} onOpenChange={(o) => !o && setRemoveTarget(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Remove rack {removeTarget}?</DialogTitle>
                        <DialogDescription>
                            {removing ? `${removing.boxes} boxes (Tag ${removing.tagging}) will be returned to the remaining stock.` : "This rack will be emptied."}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setRemoveTarget(null)}>
                            Cancel
                        </Button>
                        <Button type="button" variant="destructive" onClick={confirmRemove} disabled={busy}>
                            <Trash2 /> Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Page.layout = {
    breadcrumbs: [{ title: "Stocks", href: "#" }],
};