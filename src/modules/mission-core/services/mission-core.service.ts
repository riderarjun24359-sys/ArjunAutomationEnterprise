import { MISSION_CORE_CAPABILITY_IDS } from "../constants";
import type {
    CapabilityRegistration,
    CapabilityStatusReport,
    ExecuteWorkflowInput,
    RegisterCapabilityInput,
    WorkflowExecution,
} from "../types";

const capabilities = new Map<string, CapabilityRegistration>();
const workflows = new Map<string, WorkflowExecution>();

function uid(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export class MissionCoreService {
    registerCapability(input: RegisterCapabilityInput): CapabilityRegistration {
        const id = uid("cap");
        const registration: CapabilityRegistration = {
            id,
            name: input.name,
            module: input.module,
            status: "registered",
            registeredAt: new Date().toISOString(),
            config: input.config ?? {},
        };
        capabilities.set(id, registration);
        return registration;
    }

    executeWorkflow(input: ExecuteWorkflowInput): WorkflowExecution {
        const capability = capabilities.get(input.capabilityId);
        if (!capability) {
            throw new Error(`Capability not found: ${input.capabilityId}`);
        }

        const execution: WorkflowExecution = {
            id: uid("wf"),
            capabilityId: input.capabilityId,
            workflowName: input.workflowName,
            status: "running",
            startedAt: new Date().toISOString(),
            input: input.payload ?? {},
        };

        workflows.set(execution.id, execution);
        capability.status = "active";

        const output = this.runWorkflowLogic(input.workflowName, input.payload ?? {});
        execution.status = "completed";
        execution.completedAt = new Date().toISOString();
        execution.output = output;
        capability.status = "completed";
        workflows.set(execution.id, execution);

        return execution;
    }

    getCapabilityStatus(capabilityId: string): CapabilityStatusReport | null {
        const capability = capabilities.get(capabilityId);
        if (!capability) return null;

        const related = [...workflows.values()].filter((w) => w.capabilityId === capabilityId);
        const active = related.filter((w) => w.status === "running" || w.status === "pending").length;
        const completed = related.filter((w) => w.status === "completed").length;
        const last = related.sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];

        return {
            capabilityId,
            name: capability.name,
            status: capability.status,
            activeWorkflows: active,
            completedWorkflows: completed,
            lastExecutedAt: last?.startedAt,
        };
    }

    ensureClientSuccessCapability(): CapabilityRegistration {
        const existing = [...capabilities.values()].find(
            (c) => c.module === MISSION_CORE_CAPABILITY_IDS.clientSuccess,
        );
        if (existing) return existing;
        return this.registerCapability({
            name: "Client Success Capability",
            module: MISSION_CORE_CAPABILITY_IDS.clientSuccess,
            config: { aiFirst: true, version: "V6" },
        });
    }

    listCapabilities(): CapabilityRegistration[] {
        return [...capabilities.values()];
    }

    listWorkflows(capabilityId?: string): WorkflowExecution[] {
        const all = [...workflows.values()];
        return capabilityId ? all.filter((w) => w.capabilityId === capabilityId) : all;
    }

    private runWorkflowLogic(workflowName: string, payload: Record<string, unknown>): Record<string, unknown> {
        switch (workflowName) {
            case "run-onboarding":
                return { phase: "onboarding", clientId: payload.clientId, stepsCompleted: 5 };
            case "provision-workspace":
                return { phase: "provisioning", projectId: uid("proj"), milestones: 4, tasks: 12 };
            case "track-delivery":
                return { phase: "delivery", checklistItems: 8, deploymentReady: true };
            case "health-monitoring":
                return { phase: "health", score: 82, alerts: 1 };
            default:
                return { phase: workflowName, processed: true };
        }
    }
}

export const missionCoreService = new MissionCoreService();
