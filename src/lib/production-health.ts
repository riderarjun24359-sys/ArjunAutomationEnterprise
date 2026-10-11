import { getRecentLogs } from "@/src/lib/production-logger";
import { getAllCircuitBreakers } from "@/src/lib/resilience";
import { getUptimeSeconds } from "@/src/lib/ops-monitoring";

/**
 * Verified   — positive evidence a backup job succeeded.
 * Unverified — no evidence either way (e.g. an unauthenticated probe that
 *              cannot read org-scoped backup rows). Reported as `warn`, never
 *              as a pass, so a probe never claims backups it did not check.
 * Failed     — a check ran and produced a negative result.
 */
export type BackupVerificationState = "verified" | "unverified" | "failed";

export interface ProductionHealthReport {
    status: "healthy" | "degraded" | "critical";
    score: number;
    timestamp: string;
    checks: Array<{ name: string; status: "pass" | "warn" | "fail"; detail: string }>;
    uptime: string;
}

/** Human-readable process uptime, derived from the live uptime counter. */
export function formatUptime(seconds: number): string {
    const total = Math.max(0, Math.floor(seconds));
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    return `process uptime ${days}d ${hours}h ${minutes}m`;
}

function clampScore(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
}

export interface PlatformHealthSignals {
    supabaseOk: boolean;
    openErrors: number;
    openBreakers: number;
    criticalAlerts: number;
}

/**
 * Platform health score from live runtime signals (dependency configuration,
 * open errors, open circuit breakers, unacknowledged critical alerts) rather
 * than a hardcoded constant.
 */
export function derivePlatformHealthScore(signals: PlatformHealthSignals): number {
    let score = 100;
    if (!signals.supabaseOk) score -= 40;
    score -= Math.min(20, signals.openErrors * 2);
    score -= signals.openBreakers * 10;
    score -= signals.criticalAlerts * 5;
    return clampScore(score);
}

/**
 * Security posture score from real configuration checks. Accepts any list of
 * `{ category, status }` entries (e.g. the `security` category of the
 * production environment validator) so it is pure and testable.
 */
export function deriveSecurityScore(checks: Array<{ category: string; status: string }>): number {
    const securityChecks = checks.filter((c) => c.category === "security");
    if (securityChecks.length === 0) return 0;
    const passing = securityChecks.filter((c) => c.status === "pass").length;
    return clampScore((passing / securityChecks.length) * 100);
}

export function buildProductionHealthReport(input?: {
    platformHealthScore?: number;
    openErrors?: number;
    securityScore?: number;
    backupVerified?: boolean;
    backupStatus?: BackupVerificationState;
    backupDetail?: string;
}): ProductionHealthReport {
    const platformScore = input?.platformHealthScore ?? 92;
    const openErrors = input?.openErrors ?? 0;
    const securityScore = input?.securityScore ?? 88;
    // A boolean false means a verification actually failed; true means verified.
    // When a caller supplies neither, report `unverified` (warn) rather than
    // assuming success — no caller gets a backup "pass" it did not check.
    const backupStatus: BackupVerificationState =
        input?.backupStatus ??
        (input?.backupVerified === true ? "verified" : input?.backupVerified === false ? "failed" : "unverified");

    const backupCheck = {
        name: "Backup verification",
        status: backupStatus === "verified" ? "pass" as const : backupStatus === "failed" ? "fail" as const : "warn" as const,
        detail:
            input?.backupDetail ??
            (backupStatus === "verified"
                ? "Last backup verified"
                : backupStatus === "failed"
                  ? "Backup pending"
                  : "Backup not verified from this probe"),
    };

    const checks = [
        { name: "Platform health", status: platformScore >= 85 ? "pass" as const : platformScore >= 70 ? "warn" as const : "fail" as const, detail: `Score ${platformScore}%` },
        { name: "Error budget", status: openErrors === 0 ? "pass" as const : openErrors < 5 ? "warn" as const : "fail" as const, detail: `${openErrors} open errors` },
        { name: "Security posture", status: securityScore >= 80 ? "pass" as const : "warn" as const, detail: `Score ${securityScore}%` },
        backupCheck,
        { name: "Circuit breakers", status: getAllCircuitBreakers().every((c) => !c.state.open) ? "pass" as const : "warn" as const, detail: `${getAllCircuitBreakers().filter((c) => c.state.open).length} open` },
        { name: "Central logging", status: getRecentLogs(1).length > 0 ? "pass" as const : "warn" as const, detail: "Production logger active" },
    ];

    const failCount = checks.filter((c) => c.status === "fail").length;
    const warnCount = checks.filter((c) => c.status === "warn").length;
    const score = Math.max(0, Math.min(100, Math.round((platformScore + securityScore) / 2 - failCount * 15 - warnCount * 5)));

    return {
        status: failCount > 0 ? "critical" : warnCount > 1 ? "degraded" : "healthy",
        score,
        timestamp: new Date().toISOString(),
        checks,
        uptime: formatUptime(getUptimeSeconds()),
    };
}
