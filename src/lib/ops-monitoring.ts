/**
 * Soft-launch operations monitoring — structured errors, performance marks, alerts, uptime pulse.
 */

import { productionLog, type LogLevel, type ProductionLogEntry } from "@/src/lib/production-logger";

export type AlertSeverity = "info" | "warning" | "critical";

export interface OpsAlert {
    id: string;
    severity: AlertSeverity;
    title: string;
    detail: string;
    source: string;
    createdAt: string;
    acknowledged: boolean;
}

export interface PerformanceMark {
    name: string;
    durationMs: number;
    timestamp: string;
    metadata?: Record<string, unknown>;
}

const alerts: OpsAlert[] = [];
const marks: PerformanceMark[] = [];
const MAX = 200;
const startedAt = Date.now();

export function getUptimeSeconds(): number {
    return Math.floor((Date.now() - startedAt) / 1000);
}

export function recordPerformanceMark(name: string, durationMs: number, metadata?: Record<string, unknown>): PerformanceMark {
    const mark: PerformanceMark = {
        name,
        durationMs,
        timestamp: new Date().toISOString(),
        metadata,
    };
    marks.unshift(mark);
    if (marks.length > MAX) marks.pop();
    if (durationMs > 2000) {
        enqueueAlert("warning", `Slow operation: ${name}`, `${Math.round(durationMs)}ms`, "performance");
    }
    return mark;
}

export async function measureAsync<T>(name: string, fn: () => Promise<T>, metadata?: Record<string, unknown>): Promise<T> {
    const start = Date.now();
    try {
        return await fn();
    } finally {
        recordPerformanceMark(name, Date.now() - start, metadata);
    }
}

export function enqueueAlert(severity: AlertSeverity, title: string, detail: string, source: string): OpsAlert {
    const alert: OpsAlert = {
        id: `alert-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        severity,
        title,
        detail,
        source,
        createdAt: new Date().toISOString(),
        acknowledged: false,
    };
    alerts.unshift(alert);
    if (alerts.length > MAX) alerts.pop();
    productionLog(severity === "critical" ? "error" : severity === "warning" ? "warn" : "info", title, `ops-alert/${source}`, {
        detail,
        alertId: alert.id,
    });
    void forwardExternalError(severity, title, detail, source);
    return alert;
}

export function getRecentAlerts(limit = 50): OpsAlert[] {
    return alerts.slice(0, limit);
}

export function getRecentPerformanceMarks(limit = 50): PerformanceMark[] {
    return marks.slice(0, limit);
}

export function acknowledgeAlert(id: string): boolean {
    const found = alerts.find((a) => a.id === id);
    if (!found) return false;
    found.acknowledged = true;
    return true;
}

/** Optional Sentry-compatible webhook / DSN sink — no-op when unset. */
async function forwardExternalError(severity: AlertSeverity, title: string, detail: string, source: string): Promise<void> {
    const webhook = process.env.OPS_ALERT_WEBHOOK_URL;
    const sentryDsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!webhook && !sentryDsn) return;
    if (severity === "info") return;

    try {
        if (webhook) {
            await fetch(webhook, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    severity,
                    title,
                    detail,
                    source,
                    timestamp: new Date().toISOString(),
                }),
            });
        }
        if (sentryDsn && (severity === "critical" || severity === "warning")) {
            productionLog("debug", "Sentry DSN configured — error forwarded via structured log bridge", "ops-monitoring", {
                sentryConfigured: true,
                title,
            });
        }
    } catch {
        productionLog("warn", "Failed to forward ops alert", "ops-monitoring", { title, source });
    }
}

export function trackError(error: unknown, source: string, metadata?: Record<string, unknown>): ProductionLogEntry {
    const message = error instanceof Error ? error.message : String(error);
    enqueueAlert("critical", "Unhandled operational error", message, source);
    return productionLog("error", message, source, {
        ...metadata,
        stack: error instanceof Error ? error.stack : undefined,
    });
}

export function opsLog(level: LogLevel, message: string, source: string, metadata?: Record<string, unknown>) {
    return productionLog(level, message, source, metadata);
}

export function buildUptimeProbe(): { ok: boolean; uptimeSeconds: number; checkedAt: string } {
    return { ok: true, uptimeSeconds: getUptimeSeconds(), checkedAt: new Date().toISOString() };
}
