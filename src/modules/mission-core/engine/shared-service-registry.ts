import { SHARED_SERVICES } from "../constants";
import type { SharedService } from "../types";

const services = new Map<string, SharedService>();

const SERVICE_METHODS: Record<string, Record<string, (...args: unknown[]) => unknown>> = {
    auth: {
        validateSession: () => ({ valid: true, userId: "platform-user" }),
        getPermissions: () => ({ roles: ["admin", "operator"] }),
    },
    notifications: {
        send: (payload: unknown) => ({ sent: true, channel: "email", payload }),
        listPending: () => ({ count: 0, items: [] }),
    },
    documentEngine: {
        generate: (template: unknown) => ({ documentId: `doc-${Date.now()}`, template }),
        listTemplates: () => ({ templates: ["proposal", "invoice", "agreement"] }),
    },
    gci: {
        translate: (content: unknown, locale: unknown) => ({ content, locale, translated: true }),
        resolveLocale: (clientId: unknown) => ({ clientId, locale: "en" }),
    },
    search: {
        query: (q: unknown) => ({ results: [], query: q }),
    },
    audit: {
        log: (entry: unknown) => ({ logged: true, entry, timestamp: new Date().toISOString() }),
        listRecent: () => ({ entries: [] }),
    },
    ai: {
        prompt: (prompt: unknown) => ({ response: "AI orchestration response", prompt }),
        routeAgent: (agentId: unknown) => ({ agentId, status: "ready" }),
    },
    analytics: {
        track: (event: unknown) => ({ tracked: true, event }),
        getMetrics: () => ({ kpis: { activeUsers: 42, workflows: 12 } }),
    },
    integrations: {
        invoke: (connector: unknown, method: unknown) => ({ connector, method, success: true }),
        listConnectors: () => ({ connectors: ["stripe", "quickbooks", "slack"] }),
    },
};

export function registerAllServices(): SharedService[] {
    for (const svc of SHARED_SERVICES) {
        services.set(svc.id, { ...svc });
    }
    return listServices();
}

export function listServices(): SharedService[] {
    return [...services.values()];
}

export function getService(serviceId: string): SharedService | undefined {
    return services.get(serviceId);
}

export function invokeService(serviceId: string, method: string, args: unknown[] = []): unknown {
    const svc = services.get(serviceId);
    if (!svc) throw new Error(`Shared service not found: ${serviceId}`);
    if (svc.status === "offline") throw new Error(`Shared service offline: ${serviceId}`);

    const methods = SERVICE_METHODS[serviceId];
    const fn = methods?.[method];
    if (!fn) {
        return { serviceId, method, args, result: "method-not-implemented", timestamp: new Date().toISOString() };
    }
    return fn(...args);
}

export function resetSharedServiceRegistry(): void {
    services.clear();
}
