import type { OrganizationOperationsData } from "./organization-operations-data.service";
import type {
    ExecutiveChartPoint,
    ExecutiveChartsBundle,
    ProjectStatusSlice,
    TaskCompletionStats,
} from "../types";

const MONTH_COUNT = 6;

function monthKey(date: Date): string {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
    const [y, m] = key.split("-").map(Number);
    const d = new Date(Date.UTC(y, m - 1, 1));
    return d.toLocaleString("en-US", { month: "short", year: "2-digit", timeZone: "UTC" });
}

function lastNMonthKeys(n: number, now = new Date()): string[] {
    const keys: string[] = [];
    const cursor = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    for (let i = n - 1; i >= 0; i -= 1) {
        const d = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() - i, 1));
        keys.push(monthKey(d));
    }
    return keys;
}

function isCompletedTask(status: string): boolean {
    const s = status.toLowerCase();
    return ["done", "completed", "closed"].includes(s);
}

export function buildRevenueTrend(data: OrganizationOperationsData, now = new Date()): ExecutiveChartPoint[] {
    const keys = lastNMonthKeys(MONTH_COUNT, now);
    const totals = new Map(keys.map((k) => [k, 0]));

    for (const payment of data.payments) {
        const key = monthKey(new Date(payment.payment_date || payment.created_at));
        if (totals.has(key)) totals.set(key, (totals.get(key) ?? 0) + Number(payment.amount ?? 0));
    }

    if ([...totals.values()].every((v) => v === 0)) {
        for (const inv of data.invoices) {
            const key = monthKey(new Date(inv.paid_at || inv.issue_date || inv.created_at));
            if (totals.has(key)) totals.set(key, (totals.get(key) ?? 0) + Number(inv.amount_paid ?? 0));
        }
    }

    return keys.map((key) => ({
        key,
        label: monthLabel(key),
        value: Math.round(totals.get(key) ?? 0),
    }));
}

export function buildClientGrowth(data: OrganizationOperationsData, now = new Date()): ExecutiveChartPoint[] {
    const keys = lastNMonthKeys(MONTH_COUNT, now);
    const createdByMonth = new Map(keys.map((k) => [k, 0]));

    for (const client of data.clients) {
        const key = monthKey(new Date(client.created_at));
        if (createdByMonth.has(key)) {
            createdByMonth.set(key, (createdByMonth.get(key) ?? 0) + 1);
        }
    }

    let cumulative = data.clients.filter((c) => {
        const created = new Date(c.created_at);
        const firstKey = keys[0];
        const [y, m] = firstKey.split("-").map(Number);
        return created < new Date(Date.UTC(y, m - 1, 1));
    }).length;

    return keys.map((key) => {
        cumulative += createdByMonth.get(key) ?? 0;
        return {
            key,
            label: monthLabel(key),
            value: cumulative,
        };
    });
}

export function buildProjectStatusDistribution(data: OrganizationOperationsData): ProjectStatusSlice[] {
    const counts = new Map<string, number>();
    for (const project of data.projects) {
        const status = (project.status || "unknown").toLowerCase();
        counts.set(status, (counts.get(status) ?? 0) + 1);
    }
    return [...counts.entries()]
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count);
}

export function buildTaskCompletionStats(data: OrganizationOperationsData): TaskCompletionStats {
    const total = data.tasks.length;
    const completed = data.tasks.filter((t) => isCompletedTask(t.status)).length;
    const open = Math.max(0, total - completed);
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, open, rate };
}

export function buildExecutiveCharts(data: OrganizationOperationsData, now = new Date()): ExecutiveChartsBundle {
    return {
        revenueTrend: buildRevenueTrend(data, now),
        clientGrowth: buildClientGrowth(data, now),
        projectStatus: buildProjectStatusDistribution(data),
        taskCompletion: buildTaskCompletionStats(data),
        source: "supabase",
        fetchedAt: data.fetchedAt,
    };
}

export function createEmptyExecutiveCharts(): ExecutiveChartsBundle {
    return {
        revenueTrend: [],
        clientGrowth: [],
        projectStatus: [],
        taskCompletion: { total: 0, completed: 0, open: 0, rate: 0 },
        source: "fallback",
        fetchedAt: new Date().toISOString(),
    };
}
