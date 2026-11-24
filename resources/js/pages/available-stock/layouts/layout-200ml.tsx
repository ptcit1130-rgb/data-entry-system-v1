import {
    Panel,
    RackRow,
    RackRows,
    numbered,
    descending,
    partial,
    minWidth,
} from "@/components/rack/rack-parts";

const COLS = 20;

/* Top block */
const BLOCK_1: RackRow[] = [
    { slots: numbered(129, 148) },
    { slots: numbered(149, 168) },
];

/* Second block (top row runs right to left) */
const BLOCK_2: RackRow[] = [
    { slots: descending(276, 257) },
    { slots: numbered(237, 256) },
];

/* Third block (top row runs right to left) */
const BLOCK_3: RackRow[] = [
    { slots: descending(236, 217) },
    { slots: numbered(197, 216) },
];

/* Bottom block: left group (cols 1-6) and right group (cols 13-20) */
const BOTTOM_LEFT: RackRow[] = [
    { slots: numbered(169, 174) },
    { slots: numbered(175, 180) },
];

const BOTTOM_RIGHT: RackRow[] = [
    { slots: numbered(181, 188) },
    { slots: numbered(189, 196) },
];

/* Partial area (leftover boxes) */
const PARTIAL_ROWS: RackRow[] = [
    { name: "PARTIAL", slots: partial(1, 16) },
    { slots: partial(17, 32) },
];

export default function Layout200ml() {
    return (
        <div className="flex flex-col gap-4" style={{ minWidth: minWidth(COLS) }}>
            <Panel cols={COLS}>
                <RackRows rows={BLOCK_1} startCol={1} />
            </Panel>

            <Panel cols={COLS}>
                <RackRows rows={BLOCK_2} startCol={1} />
            </Panel>

            <Panel cols={COLS}>
                <RackRows rows={BLOCK_3} startCol={1} />
            </Panel>

            <Panel cols={COLS}>
                <RackRows rows={BOTTOM_LEFT} startCol={1} />
                <RackRows rows={BOTTOM_RIGHT} startCol={13} />
            </Panel>

            <Panel cols={COLS}>
                <RackRows rows={PARTIAL_ROWS} startCol={3} />
            </Panel>
        </div>
    );
}