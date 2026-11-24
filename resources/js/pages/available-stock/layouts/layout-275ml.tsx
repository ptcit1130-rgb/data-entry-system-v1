import {
    Panel,
    RackRow,
    RackRows,
    SideBlock,
    numbered,
    partial,
    range,
    minWidth,
} from "@/components/rack/rack-parts";

const COLS = 20;

const ground = (letter: string) => range(33, 48).map((n) => `#${n}${letter}`);

const MAIN_ROWS: RackRow[] = [
    { name: "UP", slots: numbered(1, 16) },
    { name: "DOWN", slots: numbered(17, 32) },
    { name: "GROUND", slots: ground("A") },
    { slots: ground("B") },
    { slots: ground("C") },
];

const SECOND_ROWS: RackRow[] = [
    { name: "UP", slots: numbered(57, 70) },
    { name: "DOWN", slots: numbered(71, 84) },
];

const PARTIAL_ROWS: RackRow[] = [
    { name: "PARTIAL", slots: partial(1, 16) },
    { slots: partial(17, 32) },
    { slots: partial(33, 48) },
];

const LEFT_BLOCK = [
    ["#053", "#055"],
    ["#054", "#056"],
];
const RIGHT_BLOCK = [
    ["#51", "#49"],
    ["#52", "#50"],
];

export default function Layout275ml() {
    return (
        <div className="flex flex-col gap-4" style={{ minWidth: minWidth(COLS) }}>
            <Panel cols={COLS}>
                <SideBlock
                    rows={LEFT_BLOCK}
                    startCol={1}
                    totalRows={MAIN_ROWS.length}
                />
                <RackRows rows={MAIN_ROWS} startCol={3} />
                <SideBlock
                    rows={RIGHT_BLOCK}
                    startCol={19}
                    totalRows={MAIN_ROWS.length}
                    reverse
                />
            </Panel>

            <Panel cols={COLS}>
                <RackRows rows={SECOND_ROWS} startCol={4} />
            </Panel>

            <Panel cols={COLS}>
                <RackRows rows={PARTIAL_ROWS} startCol={3} />
            </Panel>
        </div>
    );
};
