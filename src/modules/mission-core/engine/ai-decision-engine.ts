import { getCapability, listCapabilities } from "./capability-registry";
import type { AiDecision, AiDecisionContext } from "../types";

const AGENT_MAP: Record<string, string> = {
    sales: "sales-agent",
    clientSuccess: "success-manager-agent",
    businessAssets: "document-agent",
    brandOs: "brand-agent",
    growthEngine: "growth-agent",
    hios: "healthcare-agent",
    founderOs: "founder-copilot",
    enterpriseIntelligence: "intelligence-agent",
    financeFuture: "finance-agent",
};

const EVENT_ROUTING: Record<string, string> = {
    CustomerCreated: "clientSuccess",
    ProposalApproved: "businessAssets",
    AgreementSigned: "clientSuccess",
    ProjectCreated: "clientSuccess",
    DeploymentCompleted: "clientSuccess",
    InvoicePaid: "financeFuture",
    RenewalDue: "clientSuccess",
    DealClosed: "sales",
    CampaignLaunched: "growthEngine",
    LeadGenerated: "sales",
    DecisionRequired: "founderOs",
    InsightGenerated: "enterpriseIntelligence",
};

export function decideRouting(context: AiDecisionContext): AiDecision {
    const eventType = context.eventType ?? "unknown";
    const targetId = EVENT_ROUTING[eventType] ?? context.sourceCapability ?? "clientSuccess";
    const cap = getCapability(targetId);
    const allCaps = listCapabilities();

    const fallback = allCaps.find((c) => c.status === "active") ?? allCaps[0];
    const selected = cap ?? fallback;

    const priority = eventType.includes("Renewal") || eventType.includes("Failed")
        ? "critical"
        : eventType.includes("Invoice") || eventType.includes("Agreement")
            ? "high"
            : "medium";

    return {
        capabilityId: selected?.id ?? "clientSuccess",
        agentId: AGENT_MAP[selected?.id ?? "clientSuccess"] ?? "platform-agent",
        priority,
        escalation: priority === "critical",
        routing: `/mission-core/route/${selected?.id ?? "clientSuccess"}/${eventType}`,
        reason: `Routed ${eventType} to ${selected?.name ?? "Client Success"} based on platform orchestration rules`,
    };
}

export function resetAiDecisionEngine(): void {
    /* stateless — no reset needed */
}
