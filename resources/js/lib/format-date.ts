export const formatDate = (value?: string | Date | null): string => {
    if (!value) return "";
    const date =
        typeof value === "string"
            ? (() => {
                  const [y, m, d] = value.slice(0, 10).split("-").map(Number);
                  return new Date(y, m - 1, d);
              })()
            : value;

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};