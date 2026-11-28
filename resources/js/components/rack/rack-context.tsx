import { createContext } from "react";
import { RackDistribution } from "@/types/stock-in-item";

export type RackAllocation = RackDistribution & {
    tier?: "critical" | "mid" | "far";
    expiration?: string;
    days_left?: number;
    product_item_uuid?: string;
    stock_in_item_uuid?: string;
};

export type PickState = {
    productUuid: string;
    selected: Map<string, number>;      // rack_number -> boxes
    onToggle: (rack: string) => void;
};

export type RackContextValue = {
    byRack: Map<string, RackAllocation>;
    released: Map<string, number>;
    query: string;
    onSelect: (rack: string) => void;
    onRemove: (rack: string) => void;
    ownRacks: Set<string>;
    busy: boolean;
    remaining: number;
    pick?: PickState;
};

export const RackContext = createContext<RackContextValue>({
    byRack: new Map(),
    released: new Map(),
    query: "",
    onSelect: () => {},
    onRemove: () => {},
    ownRacks: new Set(),
    busy: false,
    remaining: 0,
});