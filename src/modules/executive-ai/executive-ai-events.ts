import { productionLog } from "@/src/lib/production-logger";
import type { ExecutiveAgentKey } from "./constants";

export type ExecutiveAiEventType =
    | "dashboard_loaded"
    | "orchestration_started"
    | "orchestration_completed"
    | "recommendation_approved"
    | "recommendation_dismissed"
    | "approval_requested"
    | "audit_logged";

export interface ExecutiveAiEvent {
    type: ExecutiveAiEventType;
    agentKey?: ExecutiveAgentKey | "system";
    payload?: Record<string, unknown>;
    timestamp: string;
}

const listeners: Array<(event: ExecutiveAiEvent) => void> = [];

export function publishExecutiveAiEvent(event: Omit<ExecutiveAiEvent, "timestamp">): void {
    const full: ExecutiveAiEvent = { ...event, timestamp: new Date().toISOString() };
    productionLog("info", `Event: ${full.type}`, "executive-ai-events", full.payload);
    for (const listener of listeners) listener(full);
}

export function subscribeExecutiveAiEvents(listener: (event: ExecutiveAiEvent) => void): () => void {
    listeners.push(listener);
    return () => {
        const idx = listeners.indexOf(listener);
        if (idx >= 0) listeners.splice(idx, 1);
    };
}
