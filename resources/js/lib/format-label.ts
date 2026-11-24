export const formatLabel = (id: string) => {
    const text = id.replace(/_/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
}
