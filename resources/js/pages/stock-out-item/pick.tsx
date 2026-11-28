import { useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { dashboard } from "@/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RackContext, RackAllocation } from "@/components/rack/rack-context";
import { resolveLayout } from "@/pages/available-stock/layouts";
import { store } from "@/routes/stock-out-items";
import { ProductItem } from "@/types/product-item";

type Props = {
    stock_out: { uuid: string; widrawal_slip_number: string };
    product_item: ProductItem;
    rack_allocations: RackAllocation[];
};

const LEGEND = [
    { label: "Critical (≤ 60 days)", dot: "bg-red-500" },
    { label: "Mid (≤ 120 days)",     dot: "bg-amber-500" },
    { label: "Far (> 120 days)",     dot: "bg-green-500" },
];

export default function Page({ stock_out, product_item, rack_allocations }: Props) {
    const [selected, setSelected]     = useState<Map<string, number>>(new Map());
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors]         = useState<Record<string, string>>({});

    const Layout = resolveLayout(product_item.product_category?.sku);

    const byRack = useMemo(
        () => new Map(rack_allocations.map((r) => [r.rack_number, r])),
        [rack_allocations],
    );

    const toggle = (rack: string) =>
        setSelected((prev) => {
            const next = new Map(prev);
            if (next.has(rack)) next.delete(rack);
            else next.set(rack, byRack.get(rack)!.boxes);      // default: the whole rack
            return next;
        });

    const setBoxes = (rack: string, value: number) => {
        const max = byRack.get(rack)!.boxes;
        setSelected((prev) => new Map(prev).set(rack, Math.max(1, Math.min(max, value || 1))));
    };

    const total = [...selected.values()].reduce((a, b) => a + b, 0);

    const mine = rack_allocations.filter((r) => r.product_item_uuid === product_item.uuid);

    const available = mine.reduce((s, r) => s + r.boxes, 0);
    const byTier = (t: "critical" | "mid" | "far") =>
        mine.filter((r) => r.tier === t).reduce((s, r) => s + r.boxes, 0);

    const left = available - total; // what stays on the racks after this stock-out

    const submit = () =>
        router.post(
            store.url(),
            {
                stock_out_id: stock_out.uuid,
                status: "Active",
                picks: [...selected].map(([rack_number, boxes]) => ({
                    rack_number,
                    boxes,
                    stock_in_item_uuid: byRack.get(rack_number)!.stock_in_item_uuid,
                })),
            },
            {
                onStart:  () => setProcessing(true),
                onError:  (e) => setErrors(e),
                onFinish: () => setProcessing(false),
            },
        );

    const ctx = useMemo(() => ({
        byRack,
        released: new Map<string, number>(),
        query: "",
        onSelect: () => {},
        onRemove: () => {},
        ownRacks: new Set<string>(),
        busy: false,
        remaining: 0,
        pick: { productUuid: product_item.uuid, selected, onToggle: toggle },
    }), [byRack, selected, product_item.uuid]);

    return (
        <>
            <Head title="Select racks" />
            <div className="flex flex-col gap-3 p-4">
                <Breadcrumbs breadcrumbs={[
                    { title: "Dashboard", href: dashboard() },
                    { title: "Stock out", href: "#" },
                ]} />

                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Select racks to take out</h1>
                    <p className="text-sm text-muted-foreground">
                        {product_item.product_code} — {product_item.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {LEGEND.map((l) => (
                        <span key={l.label} className="flex items-center gap-1">
                            <span className={`size-2 rounded-full ${l.dot}`} /> {l.label}
                        </span>
                    ))}
                    <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">
                        <div className="rounded-md border p-2">
                            <div className="text-xs text-muted-foreground">Available</div>
                            <div className="font-semibold tabular-nums">{available.toLocaleString()}</div>
                        </div>
                        <div className="rounded-md border border-red-500/50 p-2">
                            <div className="text-xs text-muted-foreground">Critical</div>
                            <div className="font-semibold tabular-nums">{byTier("critical").toLocaleString()}</div>
                        </div>
                        <div className="rounded-md border border-amber-500/50 p-2">
                            <div className="text-xs text-muted-foreground">Mid</div>
                            <div className="font-semibold tabular-nums">{byTier("mid").toLocaleString()}</div>
                        </div>
                        <div className="rounded-md border border-green-500/50 p-2">
                            <div className="text-xs text-muted-foreground">Far</div>
                            <div className="font-semibold tabular-nums">{byTier("far").toLocaleString()}</div>
                        </div>
                        <div className="rounded-md border p-2">
                            <div className="text-xs text-muted-foreground">Left after pick</div>
                            <div className="font-semibold tabular-nums">{left.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
                    <Card className="border-none p-0">
                        <CardContent className="overflow-x-auto p-0">
                            <TooltipProvider delayDuration={100}>
                                <RackContext.Provider value={ctx}>
                                    {Layout ? <Layout /> : <p className="p-4 text-sm">No rack layout for this SKU.</p>}
                                </RackContext.Provider>
                            </TooltipProvider>
                        </CardContent>
                    </Card>

                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="text-base">Selected ({selected.size})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {[...selected].map(([rack, boxes]) => {
                                const r = byRack.get(rack)!;
                                return (
                                    <div key={rack} className="flex items-center gap-2 text-sm">
                                        <span className="w-14 font-medium">{rack}</span>
                                        <span className="text-xs text-muted-foreground">exp {r.expiration}</span>
                                        <Input type="number" min={1} max={r.boxes} value={boxes}
                                            className="ml-auto h-8 w-20"
                                            onChange={(e) => setBoxes(rack, Number(e.target.value))} />
                                    </div>
                                );
                            })}

                            {(errors.picks || errors.stock_out_id) && (
                                <p className="text-sm text-destructive">{errors.picks ?? errors.stock_out_id}</p>
                            )}

                            <div className="border-t pt-2 text-sm font-semibold">Total boxes: {total}</div>
                            <Button className="w-full" disabled={!selected.size || processing} onClick={submit}>
                                Confirm stock-out
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}