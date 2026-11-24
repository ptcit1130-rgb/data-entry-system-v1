import { Badge } from "@/components/ui/badge";

const statusVariants = {
    ACTIVE       : "success",
    IN_STOCK     : "success",
    LOW_STOCK    : "warning",
    EXPIRING_SOON: "warning",
    OUT_OF_STOCK : "destructive",
    EXPIRED      : "destructive",
    ARCHIVED     : "destructive",
    SUSPENDED    : "destructive",
    MAINTENANCE  : "warning",
    READ_ONLY    : "info",
    INACTIVE     : "secondary",
} as const;

export function StatusBadge({ status }: { status: string }) {
    const normalized = status.trim().toUpperCase().replaceAll(" ", "_");
    const variant    = statusVariants[normalized as keyof typeof statusVariants] ?? "secondary";

    return (
        <Badge variant={variant}>
            {normalized.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase())}
        </Badge>
    );
}
