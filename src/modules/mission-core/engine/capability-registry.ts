import { PLATFORM_CAPABILITIES } from "../constants";
import type { CapabilityDefinition, CapabilityHealth } from "../types";

const capabilities = new Map<string, CapabilityDefinition>();

function uid(): string {
    return `cap-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function registerAllCapabilities(): CapabilityDefinition[] {
    for (const cap of PLATFORM_CAPABILITIES) {
        capabilities.set(cap.id, { ...cap, health: { ...cap.health, lastCheck: new Date().toISOString() } });
    }
    return listCapabilities();
}

export function registerCapability(def: CapabilityDefinition): CapabilityDefinition {
    const entry = { ...def, health: { ...def.health, lastCheck: new Date().toISOString() } };
    capabilities.set(def.id, entry);
    return entry;
}

export function getCapability(id: string): CapabilityDefinition | undefined {
    return capabilities.get(id);
}

export function updateHealth(capabilityId: string, health: Partial<CapabilityHealth>): CapabilityHealth | null {
    const cap = capabilities.get(capabilityId);
    if (!cap) return null;
    cap.health = { ...cap.health, ...health, capabilityId, lastCheck: new Date().toISOString() };
    capabilities.set(capabilityId, cap);
    return cap.health;
}

export function listCapabilities(): CapabilityDefinition[] {
    return [...capabilities.values()];
}

export function registerLegacyCapability(name: string, module: string, config: Record<string, unknown> = {}): {
    id: string;
    capabilityId: string;
} {
    const id = uid();
    const def: CapabilityDefinition = {
        id,
        name,
        route: "",
        version: String(config.version ?? "1.0"),
        status: "registered",
        health: { capabilityId: id, status: "healthy", uptime: 100, lastCheck: new Date().toISOString() },
        dependencies: [],
        apis: [],
        events: [],
    };
    capabilities.set(id, def);
    return { id, capabilityId: id };
}

export function resolveCapabilityAction(capabilityId: string, action: string, context?: import("./capability-executor").CapabilityExecutionContext): Record<string, unknown> {
    if (context) {
        throw new Error("Use executeCapabilityAction for real execution. resolveCapabilityAction is metadata-only.");
    }
    const cap = capabilities.get(capabilityId);
    if (!cap) {
        return { error: `Capability not found: ${capabilityId}`, action, processed: false };
    }
    const handler = cap.apis.find((api) => api === action || action.includes(api));
    return {
        capabilityId,
        capabilityName: cap.name,
        action,
        handler: handler ?? "generic",
        processed: false,
        requiresExecutor: true,
        timestamp: new Date().toISOString(),
    };
}

export function resetCapabilityRegistry(): void {
    capabilities.clear();
}
