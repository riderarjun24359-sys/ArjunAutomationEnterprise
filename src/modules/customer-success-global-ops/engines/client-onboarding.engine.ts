import { ONBOARDING_CHECKLIST_TEMPLATE, DELIVERY_STAGES } from "../constants";
import type { OnboardingSession } from "../types";

function uid(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function buildOnboardingSessions(activeClients: number, stored: OnboardingSession[]): OnboardingSession[] {
    if (stored.length > 0) return stored;
    const count = Math.max(1, Math.min(activeClients || 1, 3));
    return Array.from({ length: count }, (_, i) => ({
        id: uid(`ob-${i}`),
        clientName: `Client ${i + 1}`,
        status: i === 0 ? "in_progress" : i === 1 ? "ready" : "pending",
        checklistComplete: Math.min(ONBOARDING_CHECKLIST_TEMPLATE.length, 2 + i * 2),
        checklistTotal: ONBOARDING_CHECKLIST_TEMPLATE.length,
        kickoffAt: new Date(Date.now() + i * 86400000 * 3).toISOString(),
    }));
}

export function generateTimeline() {
    const start = new Date();
    return DELIVERY_STAGES.map((stage, i) => {
        const d = new Date(start);
        d.setDate(d.getDate() + i * 14);
        return { stage, dueAt: d.toISOString().slice(0, 10), owner: i < 2 ? "CS Lead" : "Delivery Lead" };
    });
}

export function buildTeamAssignment() {
    return [
        { role: "Customer Success Manager", name: "CS Manager" },
        { role: "Delivery Lead", name: "Delivery Lead" },
        { role: "Support Lead", name: "Support Lead" },
        { role: "Technical Architect", name: "Solution Architect" },
    ];
}
