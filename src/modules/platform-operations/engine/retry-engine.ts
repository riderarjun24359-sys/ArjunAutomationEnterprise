import type { RetryPolicy } from "../types";
import { DEFAULT_RETRY_POLICY, exponentialBackoff } from "../lib/reliability-policies";

const policyStore: RetryPolicy[] = [
    { id: "default", name: "Default Retry", ...DEFAULT_RETRY_POLICY },
    {
        id: "workflow",
        name: "Workflow Retry",
        maxAttempts: 3,
        baseDelayMs: 2000,
        maxDelayMs: 30000,
        circuitBreakerThreshold: 5,
        circuitOpen: false,
        escalationLevel: 1,
    },
    {
        id: "integration",
        name: "Integration Retry",
        maxAttempts: 7,
        baseDelayMs: 5000,
        maxDelayMs: 120000,
        circuitBreakerThreshold: 15,
        circuitOpen: false,
        escalationLevel: 2,
    },
];

const failureCounts = new Map<string, number>();

export function getRetryPolicies(): RetryPolicy[] {
    return policyStore;
}

export function executeRetry(policyId: string, attempt: number): { delayMs: number; shouldRetry: boolean; escalated: boolean } {
    const policy = policyStore.find((p) => p.id === policyId) ?? policyStore[0];
    const failures = (failureCounts.get(policyId) ?? 0) + 1;
    failureCounts.set(policyId, failures);

    if (failures >= policy.circuitBreakerThreshold) {
        policy.circuitOpen = true;
    }

    const shouldRetry = attempt < policy.maxAttempts && !policy.circuitOpen;
    const delayMs = exponentialBackoff(attempt, policy.baseDelayMs, policy.maxDelayMs);
    const escalated = failures >= policy.escalationLevel * 3;

    return { delayMs, shouldRetry, escalated };
}

export function resetCircuitBreaker(policyId: string): void {
    const policy = policyStore.find((p) => p.id === policyId);
    if (policy) {
        policy.circuitOpen = false;
        failureCounts.set(policyId, 0);
    }
}

export function getCircuitBreakerStatus(policyId: string): { open: boolean; failures: number } {
    const policy = policyStore.find((p) => p.id === policyId);
    return { open: policy?.circuitOpen ?? false, failures: failureCounts.get(policyId) ?? 0 };
}
