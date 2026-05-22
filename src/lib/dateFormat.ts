export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};
