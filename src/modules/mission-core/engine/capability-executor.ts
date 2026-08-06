import { salesService } from "@/src/modules/sales/services/sales.service";
import { financeService } from "@/src/modules/finance/services/finance.service";
import { projectService } from "@/src/modules/projects/services/project.service";
import { businessAssetsService } from "@/src/modules/business-assets/services/business-assets.service";
import { clientSuccessCapabilityService, buildDefaultClientSuccessState } from "@/src/modules/client-success-capability/services/client-success-capability.service";
import { lazyMissionCoreClient } from "@/src/modules/mission-core/sdk/lazy-mission-core-client";
import { validateNoDirectCapabilityCall } from "../lib/orchestration-rules";
import type { ClientSuccessServiceContext } from "@/src/modules/client-success-capability/types";

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
    validateNoDirectCapabilityCall("missionCore", capabilityId);
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
                return { capabilityId, action, processed: true, proposalId: payload.proposalId, timestamp };
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
                const state = businessAssetsService.getDefaultState();
                missionCore().publishEvent({ type: "ProposalApproved", source: "missionCore", payload: { proposalRef: state.proposal.reference, clientId: payload.clientId } });
                return { capabilityId, action, processed: true, proposalRef: state.proposal.reference, timestamp };
            }
            case "businessAssets:sign-agreement": {
                missionCore().publishEvent({ type: "AgreementSigned", source: "missionCore", payload: { clientId: payload.clientId, agreementId: payload.agreementId } });
                return { capabilityId, action, processed: true, signed: true, clientId: payload.clientId, timestamp };
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
                const csCtx: ClientSuccessServiceContext = { authUserId, email, fullName };
                const result = await clientSuccessCapabilityService.runAiOnboarding(csCtx, String(payload.clientId ?? ""), buildDefaultClientSuccessState());
                return { capabilityId, action, processed: true, onboarding: result.profile, timestamp };
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
