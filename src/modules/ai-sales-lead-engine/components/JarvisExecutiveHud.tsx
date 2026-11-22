"use client";

import { useEffect, useState } from "react";
import { Activity, CalendarCheck, Clock3, PhoneCall, Users, type LucideIcon } from "lucide-react";
import { Card } from "@/src/design-os/components/Card";

type Briefing = {
    timezone: string;
    as_of: string;
    mrr_inr: number | null;
    weekly_revenue_inr: number | null;
    revenue_status: string;
    new_leads_today: number;
    calls_attempted_today: number;
    calls_connected_today: number;
    demos_booked_today: number;
    active_deals: number;
    followups_due_today: number;
    overdue_followups: number;
    urgent_highlight: string;
};

function Metric({ label, value, icon: Icon }: {
    label: string;
    value: string | number;
    icon: LucideIcon;
}) {
    return (
        <div className="rounded-2xl border border-[var(--dos-border)] bg-[var(--dos-surface)]/70 p-3">
            <div className="flex items-center justify-between gap-2 text-[var(--dos-text-tertiary)]">
                <span className="text-[11px] font-medium uppercase tracking-[0.12em]">{label}</span>
                <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-[var(--dos-text-primary)]">{value}</p>
        </div>
    );
}

export function JarvisExecutiveHud() {
    const [data, setData] = useState<Briefing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        let timer: ReturnType<typeof setInterval> | undefined;

        const refresh = async () => {
            try {
                const response = await fetch("/api/ai-sales/jarvis/briefing", {
                    method: "GET",
                    credentials: "include",
                    cache: "no-store",
                    headers: { Accept: "application/json" },
                });
                const result = await response.json() as Briefing & { error?: string };
                if (!response.ok) throw new Error(result.error || "Jarvis briefing is unavailable");
                if (!cancelled) {
                    setData(result);
                    setError(null);
                }
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load Jarvis metrics");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void refresh();
        timer = setInterval(() => void refresh(), 60_000);
        return () => {
            cancelled = true;
            if (timer) clearInterval(timer);
        };
    }, []);

    const lastUpdated = data?.as_of
        ? new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(data.as_of)) + " IST"
        : "Waiting for data";

    return (
        <Card className="overflow-hidden border-[var(--dos-border)] bg-[radial-gradient(ellipse_at_top_left,var(--dos-surface-tertiary),transparent_58%),var(--dos-surface)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="relative grid h-14 w-14 place-items-center" aria-hidden="true">
                        <span className="absolute inset-0 rounded-full border border-cyan-400/30 motion-safe:animate-ping motion-reduce:animate-none" />
                        <span className="absolute inset-1 rounded-full border border-blue-400/50" />
                        <span className="h-7 w-7 rounded-full bg-cyan-300 shadow-[0_0_22px_8px_rgba(34,211,238,0.3)]" />
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-500">Arjun Automation · Executive AI</p>
                        <h2 className="mt-1 text-xl font-semibold text-[var(--dos-text-primary)]">JARVIS Command HUD</h2>
                        <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">Sales intelligence · Asia/Kolkata · Refreshes every 60 seconds</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-[var(--dos-border)] px-3 py-1.5 text-xs text-[var(--dos-text-secondary)]">
                    <span className={"h-2 w-2 rounded-full " + (error ? "bg-amber-500" : loading ? "bg-slate-400" : "bg-emerald-500")} />
                    {error ? "Needs attention" : loading ? "Connecting" : "Metrics connected"}
                </div>
            </div>

            {error ? (
                <p role="status" className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-sm text-[var(--dos-text-secondary)]">
                    {error}
                </p>
            ) : null}

            <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                <Metric label="New leads today" value={data?.new_leads_today ?? "—"} icon={Users} />
                <Metric label="Calls attempted" value={data?.calls_attempted_today ?? "—"} icon={PhoneCall} />
                <Metric label="Calls connected" value={data?.calls_connected_today ?? "—"} icon={Activity} />
                <Metric label="Demos booked" value={data?.demos_booked_today ?? "—"} icon={CalendarCheck} />
                <Metric label="Active deals" value={data?.active_deals ?? "—"} icon={Clock3} />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--dos-border)] bg-[var(--dos-surface)]/60 px-3 py-3">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--dos-text-tertiary)]">Jarvis priority</p>
                    <p className="mt-1 text-sm text-[var(--dos-text-primary)]">{data?.urgent_highlight ?? "Loading today's sales priorities…"}</p>
                    <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">
                        {data ? data.followups_due_today + " due today · " + data.overdue_followups + " overdue" : "—"}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-[var(--dos-text-tertiary)]">Verified MRR</p>
                    <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--dos-text-primary)]">
                        {data?.mrr_inr === null || data?.mrr_inr === undefined
                            ? "Not connected"
                            : "₹" + data.mrr_inr.toLocaleString("en-IN")}
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--dos-text-tertiary)]">Updated {lastUpdated}</p>
                </div>
            </div>
        </Card>
    );
}
