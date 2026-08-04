import { DR_METRICS } from "../constants";
import type { DisasterRecoveryPlan } from "../types";

const drPlans: DisasterRecoveryPlan[] = [
    {
        id: "dr-primary",
        name: "Primary Region Failover",
        rpoMinutes: 15,
        rtoMinutes: 60,
        status: "active",
        lastValidatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        failoverReady: true,
    },
    {
        id: "dr-database",
        name: "Database Point-in-Time Recovery",
        rpoMinutes: 5,
        rtoMinutes: 30,
        status: "tested",
        lastValidatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        failoverReady: true,
    },
    {
        id: "dr-config",
        name: "Configuration Restore Playbook",
        rpoMinutes: 60,
        rtoMinutes: 120,
        status: "draft",
        failoverReady: false,
    },
];

export function getDisasterRecoveryPlans(): DisasterRecoveryPlan[] {
    return drPlans;
}

export function validateFailover(planId: string): { valid: boolean; rpo: number; rto: number } {
    const plan = drPlans.find((p) => p.id === planId);
    if (!plan) return { valid: false, rpo: 0, rto: 0 };
    plan.lastValidatedAt = new Date().toISOString();
    plan.status = "tested";
    return { valid: true, rpo: plan.rpoMinutes, rto: plan.rtoMinutes };
}

export function getDrMetrics(): typeof DR_METRICS {
    return DR_METRICS;
}

export function activateFailover(planId: string): { activated: boolean; planId: string } {
    const plan = drPlans.find((p) => p.id === planId);
    if (!plan?.failoverReady) return { activated: false, planId };
    return { activated: true, planId };
}
