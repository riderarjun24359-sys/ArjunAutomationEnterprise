import type { CustomerSuccessSnapshot } from "../types/os";

export function buildCustomerSuccessExecutiveBridge(snapshot: CustomerSuccessSnapshot) {
    return {
        module: "customer-success-os" as const,
        organizationId: snapshot.organizationId,
        source: snapshot.source,
        widgets: snapshot.executiveWidgets,
        stats: snapshot.stats,
        assistantSummary: snapshot.assistant.executiveSummary,
    };
}
