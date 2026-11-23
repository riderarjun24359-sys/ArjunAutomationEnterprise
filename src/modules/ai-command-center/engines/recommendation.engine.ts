import type { AccDecision, AccRecommendation } from "../types";

export function buildRecommendations(input: {
    decisions: AccDecision[];
    systemHealth: number | null;
    clientHealth: number | null;
    supportHealth: number | null;
    deliveryHealth: number | null;
    pendingAi: number | null;
    organizationId?: string | null;
}): AccRecommendation[] {
    const now = new Date().toISOString();
    const stableId = (engineKey: string, title: string) => {
        const source = `${input.organizationId ?? "unresolved"}:${engineKey}:${title}`;
        const hash = (seed: number) => {
            let value = seed >>> 0;
            for (let i = 0; i < source.length; i += 1) {
                value = Math.imul(value ^ source.charCodeAt(i), 16777619) >>> 0;
            }
            return value.toString(16).padStart(8, "0");
        };
        const a = hash(2166136261);
        const b = hash(2246822519);
        const c = hash(3266489917);
        const d = hash(668265263);
        return `${a}-${b.slice(0, 4)}-5${c.slice(1, 4)}-a${d.slice(1, 4)}-${a}${b.slice(0, 4)}`;
    };
    const recs: AccRecommendation[] = input.decisions.slice(0, 4).map((d) => ({
        id: stableId("aiDecision", d.summary),
        engineKey: "aiDecision" as const,
        title: d.summary,
        detail: d.rationale,
        confidence: d.confidence,
        priority: d.confidence >= 0.88 ? "high" as const : "medium" as const,
        status: "pending" as const,
        createdAt: now,
    }));

    if (input.systemHealth !== null && input.systemHealth < 85) {
        recs.push({
            id: stableId("systemMonitor", "Run production readiness health check"),
            engineKey: "systemMonitor",
            title: "Run production readiness health check",
            detail: `System health ${input.systemHealth}% — validate circuit breakers and backups.`,
            confidence: 0.87,
            priority: "high",
            status: "pending",
            createdAt: now,
        });
    }
    if (input.pendingAi !== null && input.pendingAi > 0) {
        recs.push({
            id: stableId("recommendation", "Clear pending AI lifecycle recommendations"),
            engineKey: "recommendation",
            title: "Clear pending AI lifecycle recommendations",
            detail: `${input.pendingAi} pending AI items across business/delivery modules.`,
            confidence: 0.83,
            priority: "medium",
            status: "pending",
            createdAt: now,
        });
    }
    if (input.clientHealth !== null && input.supportHealth !== null && input.deliveryHealth !== null && input.clientHealth >= 85 && input.supportHealth >= 85 && input.deliveryHealth >= 85) {
        recs.push({
            id: stableId("executiveAnalytics", "Publish weekly executive operations brief"),
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
