import type { PlatformEvent, PublishEventInput } from "../types";

type EventHandler = (event: PlatformEvent) => void;

const eventLog: PlatformEvent[] = [];
const subscriptions = new Map<string, Set<string>>();
const handlers = new Map<string, EventHandler[]>();

function uid(): string {
    return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function publish(input: PublishEventInput): PlatformEvent {
    const event: PlatformEvent = {
        id: uid(),
        type: input.type,
        source: input.source,
        target: input.target,
        payload: input.payload ?? {},
        timestamp: new Date().toISOString(),
    };
    eventLog.push(event);
    routeEvent(event);
    return event;
}

export function subscribe(capabilityId: string, eventTypes: string[]): void {
    const existing = subscriptions.get(capabilityId) ?? new Set();
    for (const type of eventTypes) existing.add(type);
    subscriptions.set(capabilityId, existing);
}

export function onEvent(capabilityId: string, handler: EventHandler): void {
    const key = capabilityId;
    const list = handlers.get(key) ?? [];
    list.push(handler);
    handlers.set(key, list);
}

export function getEventLog(limit = 100): PlatformEvent[] {
    return eventLog.slice(-limit);
}

export function routeEvent(event: PlatformEvent): void {
    for (const [capabilityId, types] of subscriptions.entries()) {
        if (types.has(event.type) || types.has("*")) {
            const capHandlers = handlers.get(capabilityId) ?? [];
            for (const handler of capHandlers) handler(event);
        }
        if (event.target === capabilityId) {
            const capHandlers = handlers.get(capabilityId) ?? [];
            for (const handler of capHandlers) handler(event);
        }
    }
}

export function getSubscriptions(): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    for (const [capId, types] of subscriptions.entries()) {
        result[capId] = [...types];
    }
    return result;
}

export function resetEventBus(): void {
    eventLog.length = 0;
    subscriptions.clear();
    handlers.clear();
}
