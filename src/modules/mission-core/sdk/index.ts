import { missionCoreService } from "../services/mission-core.service";
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

export class MissionCoreClient {
    initializePlatform() {
        return missionCoreService.initializePlatform();
    }

    registerCapability(input: RegisterCapabilityInput): CapabilityRegistration {
        return missionCoreService.registerCapability(input);
    }

    registerAllPlatformCapabilities(): CapabilityDefinition[] {
        return missionCoreService.registerAllPlatformCapabilities();
    }

    getCapability(id: string): CapabilityDefinition | undefined {
        return missionCoreService.getCapability(id);
    }

    listPlatformCapabilities(): CapabilityDefinition[] {
        return missionCoreService.listPlatformCapabilities();
    }

    publishEvent(input: PublishEventInput): PlatformEvent {
        return missionCoreService.publishEvent(input);
    }

    publishHealthEvent(payload?: Record<string, unknown>): PlatformEvent {
        return missionCoreService.publishHealthEvent(payload);
    }

    publishPerformanceMetric(payload?: Record<string, unknown>): PlatformEvent {
        return missionCoreService.publishPerformanceMetric(payload);
    }

    publishFailureEvent(payload?: Record<string, unknown>): PlatformEvent {
        return missionCoreService.publishFailureEvent(payload);
    }

    publishRecoveryEvent(payload?: Record<string, unknown>): PlatformEvent {
        return missionCoreService.publishRecoveryEvent(payload);
    }

    publishAiRoutingEvent(payload?: Record<string, unknown>): PlatformEvent {
        return missionCoreService.publishAiRoutingEvent(payload);
    }

    publishAgentSelectedEvent(payload?: Record<string, unknown>): PlatformEvent {
        return missionCoreService.publishAgentSelectedEvent(payload);
    }

    publishAiWorkflowExecutedEvent(payload?: Record<string, unknown>): PlatformEvent {
        return missionCoreService.publishAiWorkflowExecutedEvent(payload);
    }

    publishMemoryAccessEvent(payload?: Record<string, unknown>): PlatformEvent {
        return missionCoreService.publishMemoryAccessEvent(payload);
    }

    publishKnowledgeAccessEvent(payload?: Record<string, unknown>): PlatformEvent {
        return missionCoreService.publishKnowledgeAccessEvent(payload);
    }

    publishPolicyEnforcedEvent(payload?: Record<string, unknown>): PlatformEvent {
        return missionCoreService.publishPolicyEnforcedEvent(payload);
    }

    subscribeToEvents(input: SubscribeInput): void {
        return missionCoreService.subscribeToEvents(input);
    }

    getEventLog(limit?: number): PlatformEvent[] {
        return missionCoreService.getEventLog(limit);
    }

    createAndRunWorkflow(input: CreateWorkflowInput): WorkflowInstance {
        return missionCoreService.createAndRunWorkflow(input);
    }

    getWorkflowInstances(capabilityId?: string): WorkflowInstance[] {
        return missionCoreService.getWorkflowInstances(capabilityId);
    }

    advanceWorkflowStep(instanceId: string): WorkflowInstance {
        return missionCoreService.advanceWorkflowStep(instanceId);
    }

    retryWorkflow(instanceId: string): WorkflowInstance {
        return missionCoreService.retryWorkflow(instanceId);
    }

    makeAiDecision(context: AiDecisionContext): AiDecision {
        return missionCoreService.makeAiDecision(context);
    }

    invokeSharedService(serviceId: string, method: string, args: unknown[] = []): unknown {
        return missionCoreService.invokeSharedService(serviceId, method, args);
    }

    listSharedServices(): SharedService[] {
        return missionCoreService.listSharedServices();
    }

    getPlatformHealth(): PlatformHealth {
        return missionCoreService.getPlatformHealth();
    }

    getCapabilityHealths(): CapabilityHealth[] {
        return missionCoreService.getCapabilityHealths();
    }

    getWorkflowMonitor(): WorkflowInstance[] {
        return missionCoreService.getWorkflowMonitor();
    }

    getDeveloperConsoleData(): DeveloperConsoleData {
        return missionCoreService.getDeveloperConsoleData();
    }

    enforceOrchestrationRule(from: string, to: string): void {
        return missionCoreService.enforceOrchestrationRule(from, to);
    }

    enforceSecurityPolicy(
        capabilityId: string,
        action: string,
        userContext: { userId: string; email: string; role: string; organizationId?: string | null },
    ) {
        return missionCoreService.enforceSecurityPolicy(capabilityId, action, userContext);
    }

    executeWorkflow(input: ExecuteWorkflowInput): WorkflowExecution {
        return missionCoreService.executeWorkflow(input);
    }

    getCapabilityStatus(capabilityId: string): CapabilityStatusReport | null {
        return missionCoreService.getCapabilityStatus(capabilityId);
    }

    ensureClientSuccessCapability(): CapabilityRegistration {
        return missionCoreService.ensureClientSuccessCapability();
    }

    listCapabilities(): CapabilityRegistration[] {
        return missionCoreService.listCapabilities();
    }

    listWorkflows(capabilityId?: string): WorkflowExecution[] {
        return missionCoreService.listWorkflows(capabilityId);
    }
}

export function createMissionCoreClient(): MissionCoreClient {
    return new MissionCoreClient();
}

export { missionCoreService };
