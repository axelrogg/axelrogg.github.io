/**
 * Converts a Date object to a string in the format "DD-MM-YYYY".
 *
 * @param {Date} date - The Date object to be converted.
 * @returns {string} A string representing the date in "DD-MM-YYYY" format.
 */
export function readableDate(date: Date): string {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const day = days[date.getUTCDay()];
    const daynum = String(date.getUTCDate()).padStart(2, "0");
    const month = months[date.getUTCMonth() - 1];
    const year = date.getUTCFullYear();

    return `${day} ${daynum}, ${month} ${year}`;
}
