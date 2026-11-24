import {
    Panel,
    RackRow,
    RackRows,
    SideBlock,
    numbered,
    partial,
    minWidth,
} from "@/components/rack/rack-parts";

/**
 * Shared by 150ml and 250ml.
 * Grid: cols 1-2 = left block, col 3 = gap, cols 4-17 = main racks.
 */
const COLS = 17;
const MAIN_START = 4;

/* Top block: 14 racks per row */
const TOP_BLOCK: RackRow[] = [
    { slots: numbered(85, 98) },
    { slots: numbered(99, 112) },
];

/* Left block (2 x 2), sits under the top block on the far left */
const LEFT_BLOCK = [
    ["#113", "#115"],
    ["#114", "#116"],
];

/* Lower blocks */
const LOWER_LEFT: RackRow[] = [
    { slots: numbered(117, 118) },
    { slots: numbered(119, 120) },
];

const LOWER_RIGHT: RackRow[] = [
    { slots: numbered(121, 124) },
    { slots: numbered(125, 128) },
];

/* Partial area (leftover boxes): 15 per row fits cols 3-17 */
const PARTIAL_ROWS: RackRow[] = [
    { name: "PARTIAL", slots: partial(1, 15) },
    { slots: partial(16, 30) },
];

export default function Layout150250ml() {
    return (
        <div className="flex flex-col gap-4" style={{ minWidth: minWidth(COLS) }}>
            <Panel cols={COLS}>
                <RackRows rows={TOP_BLOCK} startCol={MAIN_START} />
                <SideBlock rows={LEFT_BLOCK} startCol={1} totalRows={4} />
            </Panel>

            <Panel cols={COLS}>
                <RackRows rows={LOWER_LEFT} startCol={MAIN_START} />
                <RackRows rows={LOWER_RIGHT} startCol={MAIN_START + 5} />
            </Panel>

            <Panel cols={COLS}>
                <RackRows rows={PARTIAL_ROWS} startCol={3} />
            </Panel>
        </div>
    );
}