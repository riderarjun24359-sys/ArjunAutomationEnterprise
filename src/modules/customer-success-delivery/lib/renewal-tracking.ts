/**
 * Renewal pipeline helpers (E, pure).
 *
 * Selects renewal forecasts needing human action from persisted rows:
 * overdue (renewal_date past, still open) and due within a horizon.
 * Terminal forecast statuses (`won`, `lost`, `cancelled`) and inactive rows
 * are excluded. Nothing is auto-renewed — owners act on the list.
 */

export interface RenewalCandidate {
    id?: string;
    forecastStatus?: string | null;
    status?: string | null;
    renewalDate?: string | null;
    forecastValue?: number | null;
}

const TERMINAL = ["won", "lost", "cancelled", "closed"];

export function selectRenewalsDue<T extends RenewalCandidate>(
    forecasts: T[],
    now: number = Date.now(),
    horizonDays = 30,
): { overdue: T[]; upcoming: T[] } {
    const horizonMs = horizonDays * 24 * 60 * 60 * 1000;
    const overdue: T[] = [];
    const upcoming: T[] = [];
    for (const forecast of forecasts) {
        if ((forecast.status ?? "active") !== "active") continue;
        if (TERMINAL.includes((forecast.forecastStatus ?? "").toLowerCase())) continue;
        if (!forecast.renewalDate) continue;
        const due = new Date(forecast.renewalDate).getTime();
        if (!Number.isFinite(due)) continue;
        if (due <= now) overdue.push(forecast);
        else if (due <= now + horizonMs) upcoming.push(forecast);
    }
    const byDate = (a: T, b: T) => String(a.renewalDate).localeCompare(String(b.renewalDate));
    overdue.sort(byDate);
    upcoming.sort(byDate);
    return { overdue, upcoming };
}

export function totalRenewalValue(forecasts: RenewalCandidate[]): number {
    return Math.round(forecasts.reduce((sum, f) => sum + (Number(f.forecastValue) || 0), 0) * 100) / 100;
}
