import { DEFAULT_WORKFLOW_TEMPLATE } from "../constants";
import { getCapability, resolveCapabilityAction } from "./capability-registry";
import type { CreateWorkflowInput, WorkflowDefinition, WorkflowInstance, WorkflowStep } from "../types";

const definitions = new Map<string, WorkflowDefinition>();
const instances = new Map<string, WorkflowInstance>();

function uid(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createWorkflow(input: CreateWorkflowInput): WorkflowDefinition {
    const def: WorkflowDefinition = {
        id: uid("wfdef"),
        name: input.name,
        description: `Workflow: ${input.name}`,
        steps: input.steps ?? DEFAULT_WORKFLOW_TEMPLATE.map((s) => ({ ...s })),
        createdAt: new Date().toISOString(),
    };
    definitions.set(def.id, def);
    return def;
}

export function startWorkflow(definitionId: string, input: Record<string, unknown> = {}): WorkflowInstance {
    const def = definitions.get(definitionId);
    if (!def) throw new Error(`Workflow definition not found: ${definitionId}`);

    const instance: WorkflowInstance = {
        id: uid("wfinst"),
        definitionId,
        name: def.name,
        status: "running",
        currentStepIndex: 0,
        steps: def.steps.map((s) => ({ ...s })),
        startedAt: new Date().toISOString(),
        input,
    };
    instances.set(instance.id, instance);
    return advanceStep(instance.id);
}

export function advanceStep(instanceId: string): WorkflowInstance {
    const instance = instances.get(instanceId);
    if (!instance) throw new Error(`Workflow instance not found: ${instanceId}`);

    const step = instance.steps[instance.currentStepIndex];
    if (!step) {
        instance.status = "completed";
        instance.completedAt = new Date().toISOString();
        instance.output = { completedSteps: instance.steps.length, success: true };
        instances.set(instanceId, instance);
        return instance;
    }

    const cap = getCapability(step.capabilityId);
    if (!cap) {
        instance.status = "failed";
        instance.error = `Capability not found for step: ${step.capabilityId}`;
        instances.set(instanceId, instance);
        return instance;
    }

    if (cap.status === "planned") {
        instance.output = {
            ...(instance.output ?? {}),
            [step.id]: { skipped: true, reason: "Capability planned for future", capabilityId: step.capabilityId },
        };
    } else {
        const result = resolveCapabilityAction(step.capabilityId, step.action);
        instance.output = { ...(instance.output ?? {}), [step.id]: result };
    }

    instance.currentStepIndex += 1;

    if (instance.currentStepIndex >= instance.steps.length) {
        instance.status = "completed";
        instance.completedAt = new Date().toISOString();
    } else {
        instance.status = "running";
    }

    instances.set(instanceId, instance);
    return instance;
}

export function retryWorkflow(instanceId: string): WorkflowInstance {
    const instance = instances.get(instanceId);
    if (!instance) throw new Error(`Workflow instance not found: ${instanceId}`);
    if (instance.status !== "failed") return instance;

    instance.status = "retrying";
    instance.error = undefined;
    instances.set(instanceId, instance);
    return advanceStep(instanceId);
}

export function listInstances(capabilityId?: string): WorkflowInstance[] {
    const all = [...instances.values()];
    if (!capabilityId) return all;
    return all.filter((inst) => inst.steps.some((s) => s.capabilityId === capabilityId));
}

export function listDefinitions(): WorkflowDefinition[] {
    return [...definitions.values()];
}

export function getInstance(instanceId: string): WorkflowInstance | undefined {
    return instances.get(instanceId);
}

export function runLegacyWorkflow(
    capabilityId: string,
    workflowName: string,
    payload: Record<string, unknown>,
): WorkflowInstance {
    const cap = getCapability(capabilityId);
    const step: WorkflowStep = {
        id: uid("legacy-step"),
        name: workflowName,
        capabilityId: cap?.id ?? capabilityId,
        action: workflowName,
    };
    const def = createWorkflow({ name: workflowName, steps: [step], input: payload });
    return startWorkflow(def.id, payload);
}

export function resetWorkflowEngine(): void {
    definitions.clear();
    instances.clear();
}
