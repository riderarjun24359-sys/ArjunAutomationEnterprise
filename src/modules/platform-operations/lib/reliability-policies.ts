import type { HealthStatus, RetryPolicy } from "../types";

export const DEFAULT_RETRY_POLICY: Omit<RetryPolicy, "id" | "name"> = {
    maxAttempts: 5,
    baseDelayMs: 1000,
    maxDelayMs: 60000,
    circuitBreakerThreshold: 10,
    circuitOpen: false,
    escalationLevel: 0,
};

export function computeReliabilityScore(input: {
    healthScore: number;
    openErrors: number;
    activeIncidents: number;
    backupSuccessRate: number;
}): number {
    const errorPenalty = Math.min(input.openErrors * 2, 20);
    const incidentPenalty = Math.min(input.activeIncidents * 5, 25);
    const backupBonus = input.backupSuccessRate * 0.1;
    return Math.max(0, Math.min(100, Math.round(input.healthScore - errorPenalty - incidentPenalty + backupBonus)));
}

export function mapUptimeToStatus(uptime: number): HealthStatus {
    if (uptime >= 99.5) return "healthy";
    if (uptime >= 98) return "degraded";
    if (uptime >= 95) return "critical";
    return "offline";
}

export function exponentialBackoff(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
    return Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
}
