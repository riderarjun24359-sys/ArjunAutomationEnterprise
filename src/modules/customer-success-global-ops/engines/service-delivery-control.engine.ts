import { DELIVERY_STAGES } from "../constants";
import type { DeliveryMilestone } from "../types";

function uid(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function buildDeliveryMilestones(engagements: number, stored: DeliveryMilestone[]): DeliveryMilestone[] {
    if (stored.length > 0) return stored;
    const stages = DELIVERY_STAGES.slice(0, Math.max(3, Math.min(6, engagements + 2)));
    return stages.map((stage, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i * 10);
        return {
            id: uid(`ms-${i}`),
            title: `${stage.charAt(0).toUpperCase() + stage.slice(1)} milestone`,
            stage,
            status: i === 0 ? "in_progress" : i === 1 ? "pending" : "pending",
            riskLevel: i === stages.length - 2 ? "medium" : "low",
            requiresClientApproval: stage === "deploy" || stage === "test",
            dueAt: d.toISOString(),
        };
    });
}

export function computeDeliveryHealth(qualityPassRate: number, milestones: DeliveryMilestone[]): number {
    const blocked = milestones.filter((m) => m.status === "blocked" || m.riskLevel === "critical").length;
    const highRisk = milestones.filter((m) => m.riskLevel === "high" || m.riskLevel === "critical").length;
    return Math.max(0, Math.min(100, Math.round(qualityPassRate - blocked * 12 - highRisk * 5)));
}

export function detectDeliveryRisks(milestones: DeliveryMilestone[]): string[] {
    const risks: string[] = [];
    for (const m of milestones) {
        if (m.riskLevel === "high" || m.riskLevel === "critical") {
            risks.push(`${m.title}: ${m.riskLevel} risk`);
        }
        if (m.requiresClientApproval && m.status !== "approved" && m.status !== "completed") {
            risks.push(`${m.title}: awaiting client approval`);
        }
    }
    return risks;
}
