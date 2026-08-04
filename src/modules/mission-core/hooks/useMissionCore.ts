"use client";

import { useCallback, useState } from "react";
import { missionCoreService } from "../services/mission-core.service";
import type {
    AiDecision,
    CapabilityDefinition,
    CapabilityHealth,
    DeveloperConsoleData,
    PlatformEvent,
    PlatformHealth,
    SharedService,
    WorkflowInstance,
} from "../types";

function loadMissionCoreState() {
    missionCoreService.initializePlatform();
    return {
        capabilities: missionCoreService.listPlatformCapabilities(),
        services: missionCoreService.listSharedServices(),
        events: missionCoreService.getEventLog(50),
        workflows: missionCoreService.getWorkflowMonitor(),
        health: missionCoreService.getPlatformHealth(),
        capabilityHealths: missionCoreService.getCapabilityHealths(),
        developerConsole: missionCoreService.getDeveloperConsoleData(),
    };
}

export function useMissionCore() {
    const [state, setState] = useState(loadMissionCoreState);
    const [lastDecision, setLastDecision] = useState<AiDecision | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const refresh = useCallback(() => {
        setState(loadMissionCoreState());
    }, []);

    const publishEvent = useCallback(async (type: string, source: string, payload?: Record<string, unknown>) => {
        setActionLoading(true);
        try {
            const event = missionCoreService.publishEvent({ type, source, payload });
            setState(loadMissionCoreState());
            return event;
        } finally {
            setActionLoading(false);
        }
    }, []);

    const subscribeToEvents = useCallback((capabilityId: string, eventTypes: string[]) => {
        missionCoreService.subscribeToEvents({ capabilityId, eventTypes });
        setState(loadMissionCoreState());
    }, []);

    const createAndRunWorkflow = useCallback(async (name: string, input?: Record<string, unknown>) => {
        setActionLoading(true);
        try {
            const instance = missionCoreService.createAndRunWorkflow({ name, input });
            setState(loadMissionCoreState());
            return instance;
        } finally {
            setActionLoading(false);
        }
    }, []);

    const makeAiDecision = useCallback((eventType: string) => {
        const decision = missionCoreService.makeAiDecision({ eventType });
        setLastDecision(decision);
        return decision;
    }, []);

    const invokeSharedService = useCallback(async (serviceId: string, method: string, args: unknown[] = []) => {
        setActionLoading(true);
        try {
            const result = missionCoreService.invokeSharedService(serviceId, method, args);
            setState(loadMissionCoreState());
            return result;
        } finally {
            setActionLoading(false);
        }
    }, []);

    return {
        loading: false,
        actionLoading,
        capabilities: state.capabilities,
        services: state.services,
        events: state.events,
        workflows: state.workflows,
        health: state.health,
        capabilityHealths: state.capabilityHealths,
        lastDecision,
        developerConsole: state.developerConsole,
        refresh,
        publishEvent,
        subscribeToEvents,
        createAndRunWorkflow,
        makeAiDecision,
        invokeSharedService,
    };
}

export type MissionCoreHookState = {
    capabilities: CapabilityDefinition[];
    services: SharedService[];
    events: PlatformEvent[];
    workflows: WorkflowInstance[];
    health: PlatformHealth;
    capabilityHealths: CapabilityHealth[];
    developerConsole: DeveloperConsoleData;
};
