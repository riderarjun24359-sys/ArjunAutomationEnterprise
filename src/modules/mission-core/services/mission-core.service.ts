import { DEFAULT_WORKFLOW_TEMPLATE, MISSION_CORE_CAPABILITY_IDS } from "../constants";
import * as capabilityRegistry from "../engine/capability-registry";
import * as workflowEngine from "../engine/workflow-engine";
import * as eventBus from "../engine/event-bus";
import * as aiDecisionEngine from "../engine/ai-decision-engine";
import * as sharedServiceRegistry from "../engine/shared-service-registry";
import { ORCHESTRATION_RULES, validateNoDirectCapabilityCall } from "../lib/orchestration-rules";
import type {
    AiDecision,
    AiDecisionContext,
    CapabilityDefinition,
    CapabilityHealth,
    CapabilityRegistration,
    CapabilityStatusReport,
    CreateWorkflowInput,
    DeveloperConsoleData,
    ExecuteWorkflowInput,
    PlatformEvent,
    PlatformHealth,
    PublishEventInput,
    RegisterCapabilityInput,
    SharedService,
    SubscribeInput,
    WorkflowExecution,
    WorkflowInstance,
} from "../types";

const legacyCapabilities = new Map<string, CapabilityRegistration>();
const legacyWorkflows = new Map<string, WorkflowExecution>();

let initialized = false;

export class MissionCoreService {
    initializePlatform(): { capabilities: CapabilityDefinition[]; services: SharedService[] } {
        if (!initialized) {
            capabilityRegistry.registerAllCapabilities();
            sharedServiceRegistry.registerAllServices();
            workflowEngine.createWorkflow({ name: "Default Customer Lifecycle", steps: DEFAULT_WORKFLOW_TEMPLATE });
            initialized = true;
        }
        return {
            capabilities: capabilityRegistry.listCapabilities(),
            services: sharedServiceRegistry.listServices(),
        };
    }

    registerCapability(input: RegisterCapabilityInput): CapabilityRegistration {
        this.initializePlatform();
        const { id } = capabilityRegistry.registerLegacyCapability(input.name, input.module, input.config ?? {});
        const registration: CapabilityRegistration = {
            id,
            name: input.name,
            module: input.module,
            status: "registered",
            registeredAt: new Date().toISOString(),
            config: input.config ?? {},
        };
        legacyCapabilities.set(id, registration);
        return registration;
    }

    registerAllPlatformCapabilities(): CapabilityDefinition[] {
        this.initializePlatform();
        return capabilityRegistry.registerAllCapabilities();
    }

    registerPlatformCapability(def: CapabilityDefinition): CapabilityDefinition {
        this.initializePlatform();
        return capabilityRegistry.registerCapability(def);
    }

    getCapability(id: string): CapabilityDefinition | undefined {
        this.initializePlatform();
        return capabilityRegistry.getCapability(id);
    }

    listPlatformCapabilities(): CapabilityDefinition[] {
        this.initializePlatform();
        return capabilityRegistry.listCapabilities();
    }

    publishEvent(input: PublishEventInput): PlatformEvent {
        this.initializePlatform();
        return eventBus.publish({ ...input, source: input.source || "mission-core" });
    }

    subscribeToEvents(input: SubscribeInput): void {
        this.initializePlatform();
        eventBus.subscribe(input.capabilityId, input.eventTypes);
    }

    getEventLog(limit?: number): PlatformEvent[] {
        this.initializePlatform();
        return eventBus.getEventLog(limit);
    }

    createAndRunWorkflow(input: CreateWorkflowInput): WorkflowInstance {
        this.initializePlatform();
        const def = workflowEngine.createWorkflow(input);
        return workflowEngine.startWorkflow(def.id, input.input ?? {});
    }

    getWorkflowInstances(capabilityId?: string): WorkflowInstance[] {
        this.initializePlatform();
        return workflowEngine.listInstances(capabilityId);
    }

    advanceWorkflowStep(instanceId: string): WorkflowInstance {
        this.initializePlatform();
        return workflowEngine.advanceStep(instanceId);
    }

    retryWorkflow(instanceId: string): WorkflowInstance {
        this.initializePlatform();
        return workflowEngine.retryWorkflow(instanceId);
    }

    makeAiDecision(context: AiDecisionContext): AiDecision {
        this.initializePlatform();
        return aiDecisionEngine.decideRouting(context);
    }

    invokeSharedService(serviceId: string, method: string, args: unknown[] = []): unknown {
        this.initializePlatform();
        return sharedServiceRegistry.invokeService(serviceId, method, args);
    }

    listSharedServices(): SharedService[] {
        this.initializePlatform();
        return sharedServiceRegistry.listServices();
    }

    getPlatformHealth(): PlatformHealth {
        this.initializePlatform();
        const capabilities = capabilityRegistry.listCapabilities();
        const capabilityHealths = capabilities.map((c) => c.health);
        const degraded = capabilityHealths.filter((h) => h.status !== "healthy").length;
        const overall = degraded === 0 ? "healthy" : degraded > 2 ? "critical" : "degraded";

        return {
            overall,
            capabilities: capabilityHealths,
            queues: [
                { name: "events", pending: eventBus.getEventLog().length, processing: 0, failed: 0 },
                { name: "workflows", pending: workflowEngine.listInstances().filter((w) => w.status === "running").length, processing: 0, failed: workflowEngine.listInstances().filter((w) => w.status === "failed").length },
            ],
            checkedAt: new Date().toISOString(),
        };
    }

    getCapabilityHealths(): CapabilityHealth[] {
        this.initializePlatform();
        return capabilityRegistry.listCapabilities().map((c) => c.health);
    }

    updateCapabilityHealth(capabilityId: string, health: Partial<CapabilityHealth>): CapabilityHealth | null {
        this.initializePlatform();
        return capabilityRegistry.updateHealth(capabilityId, health);
    }

    getWorkflowMonitor(): WorkflowInstance[] {
        this.initializePlatform();
        return workflowEngine.listInstances();
    }

    getDeveloperConsoleData(): DeveloperConsoleData {
        this.initializePlatform();
        return {
            capabilities: capabilityRegistry.listCapabilities(),
            recentEvents: eventBus.getEventLog(20),
            activeWorkflows: workflowEngine.listInstances().filter((w) => w.status === "running" || w.status === "pending"),
            services: sharedServiceRegistry.listServices(),
            rules: ORCHESTRATION_RULES,
        };
    }

    enforceOrchestrationRule(from: string, to: string): void {
        validateNoDirectCapabilityCall(from, to);
    }

    /** @deprecated Use createAndRunWorkflow — kept for client-success bridge */
    executeWorkflow(input: ExecuteWorkflowInput): WorkflowExecution {
        this.initializePlatform();
        const capability = legacyCapabilities.get(input.capabilityId);
        if (!capability) {
            const platformCap = capabilityRegistry.getCapability(input.capabilityId);
            if (!platformCap) throw new Error(`Capability not found: ${input.capabilityId}`);
        }

        const instance = workflowEngine.runLegacyWorkflow(input.capabilityId, input.workflowName, input.payload ?? {});

        const execution: WorkflowExecution = {
            id: instance.id,
            capabilityId: input.capabilityId,
            workflowName: input.workflowName,
            status: instance.status === "failed" ? "failed" : instance.status === "completed" ? "completed" : "running",
            startedAt: instance.startedAt,
            completedAt: instance.completedAt,
            input: input.payload ?? {},
            output: instance.output,
            error: instance.error,
        };

        if (capability) {
            capability.status = execution.status === "completed" ? "completed" : "active";
            legacyCapabilities.set(capability.id, capability);
        }

        legacyWorkflows.set(execution.id, execution);
        return execution;
    }

    getCapabilityStatus(capabilityId: string): CapabilityStatusReport | null {
        this.initializePlatform();
        const capability = legacyCapabilities.get(capabilityId);
        const platformCap = capabilityRegistry.getCapability(capabilityId);

        if (!capability && !platformCap) return null;

        const related = [...legacyWorkflows.values()].filter((w) => w.capabilityId === capabilityId);
        const instances = workflowEngine.listInstances(capabilityId);
        const active = related.filter((w) => w.status === "running" || w.status === "pending").length
            + instances.filter((w) => w.status === "running" || w.status === "pending").length;
        const completed = related.filter((w) => w.status === "completed").length
            + instances.filter((w) => w.status === "completed").length;
        const last = [...related, ...instances.map((i) => ({ startedAt: i.startedAt }))]
            .sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];

        return {
            capabilityId,
            name: capability?.name ?? platformCap?.name ?? capabilityId,
            status: capability?.status ?? platformCap?.status ?? "idle",
            activeWorkflows: active,
            completedWorkflows: completed,
            lastExecutedAt: last?.startedAt,
        };
    }

    ensureClientSuccessCapability(): CapabilityRegistration {
        this.initializePlatform();
        const existing = [...legacyCapabilities.values()].find(
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
        this.initializePlatform();
        return [...legacyCapabilities.values()];
    }

    listWorkflows(capabilityId?: string): WorkflowExecution[] {
        this.initializePlatform();
        const all = [...legacyWorkflows.values()];
        return capabilityId ? all.filter((w) => w.capabilityId === capabilityId) : all;
    }
}

export const missionCoreService = new MissionCoreService();
