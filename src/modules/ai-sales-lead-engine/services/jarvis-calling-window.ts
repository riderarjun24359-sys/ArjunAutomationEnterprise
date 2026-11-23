/**
 * Conservative owner-briefing window in India Standard Time.
 * Monday-Saturday, 08:00 inclusive to 21:00 exclusive.
 */
export function withinJarvisCallingWindow(now = new Date()): boolean {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        hour: "2-digit",
        hourCycle: "h23",
    }).formatToParts(now);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const hour = Number(values.hour);
    return values.weekday !== "Sun" && hour >= 8 && hour < 21;
}
