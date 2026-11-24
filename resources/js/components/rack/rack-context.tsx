import { createContext } from "react";
import { RackDistribution } from "@/types/stock-in-item";

export type RackContextValue = {
    byRack: Map<string, RackDistribution>;
    query: string;
    onSelect: (rack: string) => void;
    onRemove: (rack: string) => void;
    ownRacks: Set<string>;
    busy: boolean;
    remaining: number;
};

export const RackContext = createContext<RackContextValue>({
    byRack: new Map(),
    query: "",
    onSelect: () => {},
    onRemove: () => {},
    ownRacks: new Set(),
    busy: false,
    remaining: 0,
});