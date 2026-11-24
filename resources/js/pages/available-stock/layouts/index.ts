import type { ComponentType } from "react";
import Layout275ml from "./layout-275ml";
import Layout200ml from "./layout-200ml";
import Layout150250ml from "./layout-150-250ml";

export const LAYOUTS: Record<string, ComponentType> = {
    "275ml": Layout275ml,
    "200ml": Layout200ml,
    "150ml": Layout150250ml,
    "250ml": Layout150250ml,
};

export const resolveLayout = (sku?: string | null) => (
    sku ? LAYOUTS[sku.toLowerCase().replace(/\s+/g, "")] : undefined
);