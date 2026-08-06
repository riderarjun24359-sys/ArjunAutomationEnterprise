import { lazyMissionCoreClient } from "../sdk/lazy-mission-core-client";
import { createWorkflow, listDefinitions, runWorkflowToCompletion } from "../engine/workflow-engine";
import { DEFAULT_WORKFLOW_TEMPLATE } from "../constants";
import { executeCapabilityAction } from "../engine/capability-executor";
import { logApiAudit } from "@/src/lib/api-audit";

let lifecycleDefinitionId: string | null = null;

function ensureLifecycleWorkflow() {
    lazyMissionCoreClient().initializePlatform();
    if (!lifecycleDefinitionId) {
        const existing = listDefinitions().find((d) => d.name === "Customer Lifecycle");
        if (existing) {
            lifecycleDefinitionId = existing.id;
        } else {
            const def = createWorkflow({ name: "Customer Lifecycle", steps: DEFAULT_WORKFLOW_TEMPLATE });
            lifecycleDefinitionId = def.id;
        }
    }
    return lifecycleDefinitionId;
}

export interface LeadIntakeInput {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message?: string;
    source: string;
}

export class CustomerJourneyService {
    async intakeLead(input: LeadIntakeInput, context: { authUserId: string; email: string; fullName?: string | null; organizationId?: string | null }) {
        const leadResult = await executeCapabilityAction("sales", "qualify-lead", {
            authUserId: context.authUserId,
            email: context.email,
            fullName: context.fullName,
            organizationId: context.organizationId,
            payload: {
                leadName: input.name,
                companyName: input.company ?? "Unknown",
                email: input.email,
                phone: input.phone ?? "",
                source: input.source,
                message: input.message,
            },
        });

        await logApiAudit({
            action: "lead_intake",
            userId: context.authUserId,
            organizationId: context.organizationId,
            metadata: { email: input.email, source: input.source, leadResult },
        });

        lazyMissionCoreClient().publishEvent({ type: "LeadGenerated", source: "customerJourney", payload: leadResult });

        return leadResult;
    }

    async runFullLifecycle(context: { authUserId: string; email: string; fullName?: string | null; organizationId?: string | null; payload?: Record<string, unknown> }) {
        const definitionId = ensureLifecycleWorkflow();
        if (!definitionId) throw new Error("Customer lifecycle workflow unavailable");

        const instance = await runWorkflowToCompletion(definitionId, {
            authUserId: context.authUserId,
            email: context.email,
            fullName: context.fullName,
            organizationId: context.organizationId,
            ...context.payload,
        });

        await logApiAudit({
            action: "customer_lifecycle_completed",
            userId: context.authUserId,
            organizationId: context.organizationId,
            metadata: { workflowInstanceId: instance.id, status: instance.status },
        });

        return instance;
    }
}

export const customerJourneyService = new CustomerJourneyService();
