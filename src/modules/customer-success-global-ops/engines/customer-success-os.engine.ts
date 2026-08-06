import { ONBOARDING_CHECKLIST_TEMPLATE } from "../constants";
import type { EscalationRecord, HealthScoreEntry, RenewalRecord, SuccessPlan } from "../types";

function uid(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function buildDefaultSuccessPlans(clientCount: number): SuccessPlan[] {
    if (clientCount === 0) {
        return [
            {
                id: uid("plan"),
                title: "Enterprise platform adoption",
                goals: [
                    { title: "Active users", metric: "Users", target: "80%" },
                    { title: "Time to value", metric: "Days", target: "30" },
                ],
                status: "active",
                healthScore: 78,
                ownerName: "CS Manager",
            },
        ];
    }
    return Array.from({ length: Math.min(clientCount, 5) }, (_, i) => ({
        id: uid(`plan-${i}`),
        title: `Success plan ${i + 1}`,
        goals: [
            { title: "Adoption", metric: "Users", target: "75%" },
            { title: "CSAT", metric: "Score", target: "4.5" },
        ],
        status: "active" as const,
        healthScore: 70 + ((i * 7) % 25),
        ownerName: "CS Manager",
    }));
}

export function computeHealthScores(plans: SuccessPlan[], openTickets: number): HealthScoreEntry[] {
    return plans.map((p, i) => {
        const penalty = openTickets > 5 ? 8 : openTickets > 2 ? 4 : 0;
        const score = Math.max(20, Math.min(100, Math.round(p.healthScore - penalty)));
        return {
            clientId: p.clientId ?? `client-${i}`,
            clientName: p.title.replace("Success plan", "Client").replace("Enterprise platform adoption", "Primary Client"),
            score,
            trend: score >= 80 ? "up" : score < 60 ? "down" : "stable",
            riskLevel: score >= 75 ? "low" : score >= 55 ? "medium" : "high",
        } as HealthScoreEntry;
    });
}

export function buildRenewals(clientCount: number): RenewalRecord[] {
    const count = Math.max(1, Math.min(clientCount, 4));
    return Array.from({ length: count }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + 30 + i * 45);
        return {
            id: uid(`ren-${i}`),
            clientName: `Client ${i + 1}`,
            renewalDate: d.toISOString().slice(0, 10),
            amount: 12000 + i * 3500,
            probability: 65 + i * 8,
            status: i === 0 ? "in_negotiation" : "upcoming",
        };
    });
}

export function buildEscalations(incidents: number): EscalationRecord[] {
    if (incidents === 0) return [];
    return Array.from({ length: Math.min(incidents, 5) }, (_, i) => ({
        id: uid(`esc-${i}`),
        clientName: `Client ${i + 1}`,
        reason: i === 0 ? "SLA breach on P1 ticket" : "Health score decline",
        severity: i === 0 ? "critical" : "high",
        status: "open",
    }));
}

export function getOnboardingChecklistTemplate() {
    return ONBOARDING_CHECKLIST_TEMPLATE.map((label, i) => ({
        id: `cl-${i}`,
        label,
        completed: i < 2,
    }));
}
