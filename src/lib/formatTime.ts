export const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

// export const TweleveFormatTime = (iso: string) => {
//     return new Date(iso).toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//     });
// };

// export const TweleveFormatTime = (isoString: string): string => {
//     const date = new Date(isoString);
//     const hours = date.getUTCHours();
//     const minutes = String(date.getUTCMinutes()).padStart(2, "0");
//     const modifier = hours >= 12 ? "PM" : "AM";
//     const displayHours = hours % 12 || 12;
//     return `${displayHours}:${minutes} ${modifier}`;
// };

export const TweleveFormatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const modifier = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${modifier}`;
};

export const toHHMM = (timeStr: string): string => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};
