import type { CostUsageRecord } from "../types";

const RECORDS: CostUsageRecord[] = [
    { id: "cost-1", model: "gpt-4", tokens: 1250000, requests: 4200, costUsd: 125.50, department: "Engineering", customer: "Acme Corp", recordedAt: new Date().toISOString() },
    { id: "cost-2", model: "claude-3", tokens: 890000, requests: 3100, costUsd: 89.20, department: "Sales", recordedAt: new Date().toISOString() },
    { id: "cost-3", model: "gemini-pro", tokens: 450000, requests: 1800, costUsd: 45.00, department: "Support", customer: "Beta Inc", recordedAt: new Date().toISOString() },
];

export function getCostUsageRecords(): CostUsageRecord[] {
    return RECORDS;
}

export function getTotalTokens(): number {
    return RECORDS.reduce((sum, r) => sum + r.tokens, 0);
}

export function getTotalCost(): number {
    return Math.round(RECORDS.reduce((sum, r) => sum + r.costUsd, 0) * 100) / 100;
}

export function getUsageByDepartment(): Record<string, number> {
    return RECORDS.reduce((acc, r) => {
        acc[r.department] = (acc[r.department] ?? 0) + r.costUsd;
        return acc;
    }, {} as Record<string, number>);
}

export function getOptimizationRecommendations(): string[] {
    return [
        "Switch high-volume tasks to gpt-4o-mini for 60% cost reduction",
        "Enable prompt caching for repeated onboarding flows",
        "Consolidate parallel agent calls in workflow wf-review",
    ];
}
