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

export function daysOverdue(iso: string | null | undefined, now = new Date()): number | null {
    const remaining = daysUntil(iso, now);
    if (remaining === null) return null;
    return remaining < 0 ? Math.abs(remaining) : 0;
}

export function money(n: number): number {
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 100) / 100;
}

export function monthKey(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Unknown";
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function trendFromValues(current: number, previous: number): "up" | "down" | "flat" {
    if (current > previous * 1.02) return "up";
    if (current < previous * 0.98) return "down";
    return "flat";
}
