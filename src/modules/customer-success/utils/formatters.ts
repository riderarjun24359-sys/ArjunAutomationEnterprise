export function formatRelativeTime(iso: string, nowMs = Date.now()): string {
    const minutes = Math.floor((nowMs - new Date(iso).getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function clampScore(n: number): number {
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
}

export function daysUntil(iso: string | null | undefined, now = new Date()): number | null {
    if (!iso) return null;
    const diff = new Date(iso).getTime() - now.getTime();
    return Math.ceil(diff / 86400000);
}

export function asStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => {
            if (typeof item === "string") return item;
            if (item && typeof item === "object" && "name" in item) return String((item as { name: unknown }).name);
            if (item && typeof item === "object" && "title" in item) return String((item as { title: unknown }).title);
            return JSON.stringify(item);
        })
        .filter(Boolean);
}

export function trendFromScores(current: number, previous: number): "up" | "down" | "flat" {
    if (current > previous + 2) return "up";
    if (current < previous - 2) return "down";
    return "flat";
}
