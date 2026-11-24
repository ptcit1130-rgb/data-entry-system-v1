import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { 
    RackContext 
} from "@/components/rack/rack-context";
import { 
    Fragment, 
    useContext, 
    type CSSProperties, 
    type ReactNode 
} from "react";
import { 
    Tooltip, 
    TooltipContent, 
    TooltipTrigger 
} from "@/components/ui/tooltip";

export type RackRow = { 
    name?: string; 
    slots: string[]; 
};

/* helpers used by the layout files */
export const range = (from: number, to: number) => (
    Array.from({ length: to - from + 1 }, (_, i) => from + i)
);

export const numbered = (from: number, to: number) => (
    range(from, to).map((n) => `#${n}`)
);

export const partial = (from: number, to: number) => (
    range(from, to).map((n) => `P${n}`)
);

export const minWidth = (cols: number) => (
    cols * 40 + (cols - 1) * 4 + 32
);

export const descending = (from: number, to: number) => (
    range(to, from).reverse().map((n) => `#${n}`)
);

const PANEL_VARS = {
    containerType: "inline-size",
    "--label-h": "clamp(1.25rem, 1.8cqw, 1.75rem)",
    "--code-h": "clamp(2.25rem, 3.2cqw, 3.5rem)",
    "--label-fs": "clamp(8px, 0.85cqw, 11px)",
    "--code-fs": "clamp(9px, 1cqw, 13px)",
} as CSSProperties;

export const SlotCell = ({ label, style }: { label: string; style?: CSSProperties }) => {
    const { byRack, query, onSelect, onRemove, ownRacks, busy, remaining } = useContext(RackContext);

    const allocation = byRack.get(label);

    const canSelect = !allocation && !busy && remaining > 0;
    const canRemove = ownRacks.has(label);

    const dimmed = query !== "" && !(
        label.toLowerCase().includes(query) ||
        allocation?.product_code?.toLowerCase().includes(query) ||
        allocation?.tagging?.toLowerCase().includes(query)
    );

    return (
        <div className="relative min-w-0" style={style}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        aria-disabled={!canSelect}
                        onClick={() => canSelect && onSelect(label)}
                        className={cn(
                            "flex w-full min-w-0 flex-col overflow-hidden rounded-md border transition-opacity",
                            !allocation && "border-dashed",
                            canSelect ? "hover:border-foreground/40" : "cursor-default",
                            allocation?.status === "Full" && "border-green-500 bg-green-500/10",
                            allocation?.status === "Partial" && "border-amber-500 bg-amber-500/10",
                            dimmed && "opacity-25"
                        )}>
                        <span className="flex h-[var(--label-h)] items-center justify-center bg-muted px-0.5 text-[length:var(--label-fs)] font-medium">
                            {label}
                        </span>
                        <span className="flex h-[var(--code-h)] min-w-0 flex-col items-center justify-center px-0.5 text-center leading-tight">
                            {allocation ? (
                                <>
                                    <span className="w-full truncate text-[length:var(--code-fs)] font-semibold">
                                        PC: {allocation.product_code}
                                    </span>
                                    <span className="w-full truncate text-[length:var(--label-fs)] text-muted-foreground">
                                        Tag: {allocation.tagging}
                                    </span>
                                </>
                            ) : (
                                <span className="text-[length:var(--code-fs)] font-semibold">—</span>
                            )}
                        </span>
                    </button>
                </TooltipTrigger>

                <TooltipContent>
                    <div className="space-y-1">
                        <p className="font-medium">{label}</p>
                        {allocation ? (
                            <>
                                <p>Product: {allocation.product_code}</p>
                                <p>Tag: {allocation.tagging}</p>
                                <p>Boxes: {allocation.boxes}</p>
                            </>
                        ) : (
                            <p>Empty rack</p>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>

            {canRemove && (
                <button
                    type="button"
                    aria-label={`Remove ${label}`}
                    disabled={busy}
                    onClick={() => onRemove(label)}
                    className="absolute right-0.5 top-0.5 z-10 rounded p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                    <Trash2 className="size-4" />
                </button>
            )}
        </div>
    );
};

type RackRowProps = {
    rows: RackRow[];
    startCol: number;
}

export const RackRows = ({rows, startCol}: RackRowProps) => (
    <>
        {rows.map((row, rowIndex) => (
            <Fragment key={rowIndex}>
                {row.name && (
                    <div className="pointer-events-none self-center pr-2 text-right text-[length:var(--label-fs)] font-medium text-muted-foreground"
                        style={{ gridColumn: `1 / ${startCol}`, gridRow: rowIndex + 1 }}>
                        {row.name}
                    </div>
                )}
                {row.slots.map((label, index) => (
                    <SlotCell key={label} label={label}
                        style={{ gridColumn: startCol + index, gridRow: rowIndex + 1 }}
                    />
                ))}
            </Fragment>
        ))}
    </>
);

type SideBlockProps = {
    rows: string[][];
    startCol: number;
    totalRows: number;
    reverse?: boolean;
}

export const SideBlock = ({ rows, startCol, totalRows, reverse = false }: SideBlockProps) => (
    <div className="grid"
        style={{
            gridColumn: `${startCol} / span 2`,
            gridRow: `${totalRows - rows.length + 1} / span ${rows.length}`,
            ...(reverse ? { marginLeft: 6 } : { marginRight: 6 }),
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gridTemplateRows: `repeat(${rows.length}, minmax(0, 1fr))`,
            columnGap: 4,
            rowGap: 10,
        }}>
        {rows.flat().map((label) => (
            <SlotCell key={label} label={label} />
        ))}
    </div>
);

export const Panel = ({ cols, children }: { cols: number; children: ReactNode }) => (
    <div className="rounded-lg border bg-muted/20 p-4"
        style={{ ...PANEL_VARS, minWidth: minWidth(cols) }}>
        <div className="grid"
            style={{
                gridTemplateColumns: `repeat(${cols}, minmax(40px, 1fr))`,
                columnGap: 4,
                rowGap: 10,
            }}>
            {children}
        </div>
    </div>
);