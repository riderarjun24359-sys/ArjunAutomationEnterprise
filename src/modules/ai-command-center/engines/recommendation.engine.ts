import type { AccDecision, AccRecommendation } from "../types";
import { uid } from "./engine-utils";

export function buildRecommendations(input: {
    decisions: AccDecision[];
    systemHealth: number;
    clientHealth: number;
    supportHealth: number;
    deliveryHealth: number;
    pendingAi: number;
}): AccRecommendation[] {
    const now = new Date().toISOString();
    const recs: AccRecommendation[] = input.decisions.slice(0, 4).map((d) => ({
        id: uid("rec"),
        engineKey: "aiDecision" as const,
        title: d.summary,
        detail: d.rationale,
        confidence: d.confidence,
        priority: d.confidence >= 0.88 ? "high" as const : "medium" as const,
        status: "pending" as const,
        createdAt: now,
    }));

    if (input.systemHealth < 85) {
        recs.push({
            id: uid("rec"),
            engineKey: "systemMonitor",
            title: "Run production readiness health check",
            detail: `System health ${input.systemHealth}% — validate circuit breakers and backups.`,
            confidence: 0.87,
            priority: "high",
            status: "pending",
            createdAt: now,
        });
    }
    if (input.pendingAi > 0) {
        recs.push({
            id: uid("rec"),
            engineKey: "recommendation",
            title: "Clear pending AI lifecycle recommendations",
            detail: `${input.pendingAi} pending AI items across business/delivery modules.`,
            confidence: 0.83,
            priority: "medium",
            status: "pending",
            createdAt: now,
        });
    }
    if (input.clientHealth >= 85 && input.supportHealth >= 85 && input.deliveryHealth >= 85) {
        recs.push({
            id: uid("rec"),
            engineKey: "executiveAnalytics",
            title: "Publish weekly executive operations brief",
            detail: "Health signals are strong — capture wins for leadership briefing.",
            confidence: 0.81,
            priority: "low",
            status: "pending",
            createdAt: now,
        });
    }

    return recs.sort((a, b) => b.confidence - a.confidence);
}
