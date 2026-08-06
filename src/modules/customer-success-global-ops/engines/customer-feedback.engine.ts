import type { FeedbackEntry } from "../types";

function uid(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function buildDefaultFeedback(avgSatisfaction: number): FeedbackEntry[] {
    const csat = avgSatisfaction > 0 ? avgSatisfaction : 4.2;
    return [
        { id: uid("fb"), type: "csat", score: csat, comment: "Onboarding experience was smooth.", status: "reviewed", createdAt: new Date().toISOString() },
        { id: uid("fb"), type: "nps", score: 8, comment: "Would recommend with stronger reporting.", status: "open", createdAt: new Date().toISOString() },
        { id: uid("fb"), type: "feature_request", score: null, comment: "Need bulk export for invoices.", status: "open", createdAt: new Date().toISOString() },
        { id: uid("fb"), type: "improvement", score: null, comment: "Faster ticket acknowledgment.", status: "open", createdAt: new Date().toISOString() },
        { id: uid("fb"), type: "complaint", score: 2, comment: "SLA delay on last critical ticket.", status: "open", createdAt: new Date().toISOString() },
    ];
}

export function computeCsatAverage(feedback: FeedbackEntry[]): number {
    const csat = feedback.filter((f) => f.type === "csat" && f.score != null);
    if (!csat.length) return 0;
    return Math.round((csat.reduce((s, f) => s + Number(f.score), 0) / csat.length) * 10) / 10;
}

export function computeNpsScore(feedback: FeedbackEntry[]): number {
    const nps = feedback.filter((f) => f.type === "nps" && f.score != null).map((f) => Number(f.score));
    if (!nps.length) return 0;
    const promoters = nps.filter((s) => s >= 9).length;
    const detractors = nps.filter((s) => s <= 6).length;
    return Math.round(((promoters - detractors) / nps.length) * 100);
}

export function buildSatisfactionTrend(csat: number, nps: number) {
    return [
        { period: "W-3", csat: Math.max(1, csat - 0.3), nps: Math.max(-100, nps - 10) },
        { period: "W-2", csat: Math.max(1, csat - 0.1), nps: Math.max(-100, nps - 5) },
        { period: "W-1", csat, nps },
        { period: "Current", csat, nps },
    ];
}
