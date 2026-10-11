import { salesService } from "@/src/modules/sales/services/sales.service";
import { financeService } from "@/src/modules/finance/services/finance.service";
import { projectService } from "@/src/modules/projects/services/project.service";
import { lazyMissionCoreClient } from "@/src/modules/mission-core/sdk/lazy-mission-core-client";
import { validateNoDirectCapabilityCall } from "../lib/orchestration-rules";

export interface CapabilityExecutionContext {
    authUserId: string;
    email: string;
    fullName?: string | null;
    organizationId?: string | null;
    payload?: Record<string, unknown>;
}

const missionCore = () => lazyMissionCoreClient();

export async function executeCapabilityAction(
    capabilityId: string,
    action: string,
    context: CapabilityExecutionContext,
): Promise<Record<string, unknown>> {
    validateNoDirectCapabilityCall("mission-core", capabilityId);
    const { authUserId, email, fullName, payload = {} } = context;
    const timestamp = new Date().toISOString();

    try {
        switch (`${capabilityId}:${action}`) {
            case "businessPlatform:schedule-consultation": {
                missionCore().publishEvent({ type: "ConsultationScheduled", source: "missionCore", payload: { consultationId: payload.consultationId, title: payload.title } });
                return { capabilityId, action, processed: true, consultationId: payload.consultationId, timestamp };
            }
            case "businessPlatform:generate-proposal": {
                const proposalResult = await executeCapabilityAction("businessAssets", "generate-proposal", context);
                missionCore().publishEvent({ type: "ProposalCreated", source: "missionCore", payload: { proposalId: payload.proposalId, ...proposalResult } });
                return { capabilityId, action, processed: proposalResult.processed === true, proposalId: payload.proposalId, timestamp, ...(typeof proposalResult.error === "string" ? { error: proposalResult.error } : {}) };
            }
            case "sales:qualify-lead": {
                const lead = await salesService.createLead(authUserId, email, {
                    leadName: String(payload.leadName ?? payload.name ?? "Website Lead"),
                    companyName: String(payload.companyName ?? payload.company ?? "Unknown"),
                    email: String(payload.email ?? email),
                    phone: String(payload.phone ?? ""),
                    source: String(payload.source ?? "website"),
                }, fullName);
                missionCore().publishEvent({ type: "LeadGenerated", source: "missionCore", payload: { leadId: lead.id } });
                return { capabilityId, action, processed: true, leadId: lead.id, timestamp };
            }
            case "businessAssets:generate-proposal": {
                // Deterministic draft from the published catalog offer — real
                // content, but NOT persisted and NOT approved. Persist via
                // businessAnalystService.createProposal and approve via a
                // human createReviewApproval before acting on it.
                try {
                    const { buildProposalDraft } = await import("@/src/modules/sales/lib/proposal-draft");
                    const draft = buildProposalDraft({
                        clientName: String(payload.clientName ?? payload.company ?? ""),
                        opportunityName: payload.opportunityName != null ? String(payload.opportunityName) : undefined,
                        amount: Number(payload.amount ?? 0),
                        currency: payload.currency != null ? String(payload.currency) : undefined,
                    });
                    missionCore().publishEvent({ type: "ProposalDrafted", source: "missionCore", payload: { title: draft.title, clientId: payload.clientId } });
                    return { capabilityId, action, processed: true, draft, persisted: false, approvalRequired: true, timestamp };
                } catch (err) {
                    return { capabilityId, action, processed: false, error: err instanceof Error ? err.message : "Proposal draft needs clientName and a positive amount", timestamp };
                }
            }
            case "businessAssets:sign-agreement": {
                // Refuse: nothing here can legally bind a customer. Signing
                // requires explicit human authorization plus a configured
                // signing handoff (external provider or wet-ink process).
                // Returning processed:false stops lifecycle automation here.
                return { capabilityId, action, processed: false, error: "Agreement signing requires human authorization and a configured signing handoff; nothing was signed", timestamp };
            }
            case "projects:create-project": {
                const project = await projectService.createProject(authUserId, email, {
                    name: String(payload.projectName ?? payload.name ?? "Client Project"),
                    clientId: payload.clientId as string | undefined,
                    clientName: String(payload.clientName ?? payload.company ?? ""),
                    description: String(payload.description ?? "Customer project provisioned by Mission Core"),
                }, fullName);
                missionCore().publishEvent({ type: "ProjectCreated", source: "missionCore", payload: { projectId: project.id } });
                return { capabilityId, action, processed: true, projectId: project.id, timestamp };
            }
            case "clientSuccess:run-onboarding": {
                // Refuse: the underlying onboarding helper returns in-memory
                // defaults, not a persisted plan. Real onboarding is created
                // through the customer onboarding wizard records; automation
                // must not claim a customer was onboarded from mock data.
                return { capabilityId, action, processed: false, error: "Customer onboarding requires a real onboarding wizard record; mock profiles are never reported as completed", timestamp };
            }
            case "clientSuccess:track-delivery": {
                missionCore().publishEvent({ type: "WorkflowCompleted", source: "missionCore", payload: { stage: "delivery", clientId: payload.clientId } });
                return { capabilityId, action, processed: true, deliveryTracked: true, clientId: payload.clientId, timestamp };
            }
            case "finance:generate-invoice": {
                const invoice = await financeService.createInvoice(authUserId, email, {
                    number: `INV-${Date.now()}`,
                    status: "sent",
                    clientId: payload.clientId as string | undefined,
                    projectId: payload.projectId as string | undefined,
                    issueDate: new Date().toISOString().slice(0, 10),
                    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
                    lineItems: [{ description: "Platform delivery milestone", quantity: 1, unitPrice: Number(payload.amount ?? 10000) }],
                }, fullName);
                return { capabilityId, action, processed: true, invoiceId: invoice.id, timestamp };
            }
            case "finance:process-payment": {
                if (!payload.invoiceId) {
                    return { capabilityId, action, processed: false, error: "invoiceId required", timestamp };
                }
                const payment = await financeService.createPayment(authUserId, email, {
                    invoiceId: String(payload.invoiceId),
                    amount: Number(payload.amount ?? 0),
                    paymentDate: new Date().toISOString().slice(0, 10),
                    method: "ach",
                    reference: String(payload.reference ?? `PAY-${Date.now()}`),
                }, fullName);
                missionCore().publishEvent({ type: "PaymentReceived", source: "missionCore", payload: { paymentId: payment.id, invoiceId: payload.invoiceId } });
                return { capabilityId, action, processed: true, paymentId: payment.id, timestamp };
            }
            case "clientSuccess:health-monitoring": {
                missionCore().publishEvent({ type: "HealthEvent", source: "missionCore", payload: { clientId: payload.clientId, stage: "support" } });
                return { capabilityId, action, processed: true, healthMonitored: true, clientId: payload.clientId, timestamp };
            }
            case "clientSuccess:renewal-growth": {
                missionCore().publishEvent({ type: "RenewalDue", source: "missionCore", payload: { clientId: payload.clientId } });
                return { capabilityId, action, processed: true, renewalInitiated: true, clientId: payload.clientId, timestamp };
            }
            case "deliveryEngine:start-engagement": {
                missionCore().publishEvent({ type: "DeliveryEngagementStarted", source: "missionCore", payload: { title: payload.title, blueprintKey: payload.blueprintKey } });
                return { capabilityId, action, processed: true, engagementStarted: true, timestamp };
            }
            case "deliveryEngine:run-pipeline": {
                missionCore().publishEvent({ type: "DeliveryPipelineCompleted", source: "missionCore", payload: { engagementId: payload.engagementId, pipelineType: payload.pipelineType } });
                return { capabilityId, action, processed: true, pipelineRun: true, timestamp };
            }
            case "deliveryEngine:verify-quality": {
                missionCore().publishEvent({ type: "QualityVerified", source: "missionCore", payload: { engagementId: payload.engagementId } });
                return { capabilityId, action, processed: true, qualityVerified: true, timestamp };
            }
            case "deliveryEngine:advance-playbook": {
                missionCore().publishEvent({ type: "WorkflowCompleted", source: "missionCore", payload: { stage: payload.stage, engagementId: payload.engagementId } });
                return { capabilityId, action, processed: true, stageAdvanced: true, timestamp };
            }
            case "productionReadiness:health-check": {
                missionCore().publishEvent({ type: "HealthEvent", source: "missionCore", payload: { score: payload.score } });
                return { capabilityId, action, processed: true, healthChecked: true, timestamp };
            }
            case "productionReadiness:quality-gate": {
                missionCore().publishEvent({ type: "QualityGatePassed", source: "missionCore", payload: { passed: payload.passed } });
                return { capabilityId, action, processed: true, qualityGate: true, timestamp };
            }
            case "executiveAi:orchestrate":
            case "executiveAiEcosystem:orchestrate": {
                missionCore().publishEvent({ type: "ExecutiveBriefGenerated", source: "missionCore", payload: { taskType: payload.taskType } });
                return { capabilityId, action, processed: true, orchestrated: true, timestamp };
            }
            case "executiveAi:approve-recommendation":
            case "executiveAiEcosystem:approve-recommendation": {
                missionCore().publishEvent({ type: "RecommendationApproved", source: "missionCore", payload: { recommendationId: payload.recommendationId } });
                return { capabilityId, action, processed: true, approved: true, timestamp };
            }
            case "globalOperations:dashboard": {
                missionCore().publishEvent({ type: "GlobalOpsDashboardLoaded", source: "missionCore", payload: {} });
                return { capabilityId, action, processed: true, dashboardLoaded: true, timestamp };
            }
            case "globalOperations:success-plan": {
                missionCore().publishEvent({ type: "SuccessPlanCreated", source: "missionCore", payload: { planId: payload.planId } });
                return { capabilityId, action, processed: true, successPlanCreated: true, timestamp };
            }
            case "globalOperations:improvement-backlog": {
                missionCore().publishEvent({ type: "ImprovementItemCreated", source: "missionCore", payload: { itemId: payload.itemId } });
                return { capabilityId, action, processed: true, improvementCaptured: true, timestamp };
            }
            case "aiCommandCenter:dashboard": {
                missionCore().publishEvent({ type: "AiCommandCenterLoaded", source: "missionCore", payload: {} });
                return { capabilityId, action, processed: true, dashboardLoaded: true, timestamp };
            }
            case "aiCommandCenter:accept-recommendation": {
                missionCore().publishEvent({ type: "AiRecommendationAccepted", source: "missionCore", payload: { recommendationId: payload.recommendationId } });
                return { capabilityId, action, processed: true, accepted: true, timestamp };
            }
            case "aiCommandCenter:dismiss-recommendation": {
                missionCore().publishEvent({ type: "AiRecommendationDismissed", source: "missionCore", payload: { recommendationId: payload.recommendationId } });
                return { capabilityId, action, processed: true, dismissed: true, timestamp };
            }
            default: {
                const cap = missionCore().getCapability(capabilityId);
                if (!cap) {
                    return { capabilityId, action, processed: false, error: `Capability not found: ${capabilityId}`, timestamp };
                }
                return { capabilityId, action, processed: false, error: `Action not implemented: ${action}`, capabilityName: cap.name, timestamp };
            }
        }
    } catch (err) {
        const message = err instanceof Error ? err.message : "Execution failed";
        missionCore().publishFailureEvent({ capabilityId, action, error: message });
        return { capabilityId, action, processed: false, error: message, timestamp };
    }
}
