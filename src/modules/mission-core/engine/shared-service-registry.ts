import { SHARED_SERVICES } from "../constants";
import type { SharedService } from "../types";
import { createSecurityCenterClient } from "@/src/modules/security-center/sdk";
import { createGciClient } from "@/src/modules/gci/sdk";
import { aiOrchestrationService } from "@/src/modules/ai-orchestration/services/ai-orchestration.service";
import { AuditRepository } from "@/src/modules/database/repositories/audit-repository";
import type { AiSdkExecuteInput } from "@/src/modules/ai-orchestration/types";

const services = new Map<string, SharedService>();
const securityClient = createSecurityCenterClient();
const gciClient = createGciClient();
const auditRepo = new AuditRepository();

const SERVICE_METHODS: Record<string, Record<string, (...args: unknown[]) => unknown>> = {
    auth: {
        validateSession: () => ({ valid: true, userId: "platform-user" }),
        getPermissions: () => ({ roles: securityClient.getRoles() }),
        checkPermission: (role: unknown, permission: unknown) =>
            securityClient.hasPermission(role as import("@/src/modules/security-center/types").SecurityRole, permission as import("@/src/modules/security-center/types").Permission),
        validateToken: (token: unknown) => securityClient.validateToken(String(token)),
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
        translate: (input: unknown) => {
            const payload = input as { content: string; title?: string; targetLocale: import("@/src/modules/gci/types").SupportedLanguage };
            return gciClient.translate(payload);
        },
        resolveLocale: (clientId: unknown) => ({ clientId, locale: gciClient.resolveClientLocale(String(clientId)) }),
    },
    search: {
        query: (q: unknown) => ({ results: [], query: q }),
    },
    audit: {
        log: async (entry: unknown) => {
            const payload = entry as { organization_id?: string; user_id?: string; action: string; metadata?: Record<string, unknown> };
            await auditRepo.create({
                organization_id: payload.organization_id ?? null,
                user_id: payload.user_id ?? null,
                entity_type: "shared_service",
                action: payload.action as import("@/src/modules/database/types/core").AuditAction,
                metadata: payload.metadata ?? null,
            });
            return { logged: true, entry, timestamp: new Date().toISOString() };
        },
        listRecent: () => ({ entries: [] }),
    },
    ai: {
        executeTask: async (...args: unknown[]) => {
            const [authUserId, email, input, fullName] = args;
            return aiOrchestrationService.executeTask(String(authUserId), String(email), input as AiSdkExecuteInput, fullName as string | null | undefined);
        },
        resolveRoute: async (...args: unknown[]) => {
            const [authUserId, email, strategy, fullName] = args;
            return aiOrchestrationService.resolveRoute(String(authUserId), String(email), strategy as string | undefined, fullName as string | null | undefined);
        },
        routeAgent: (agentId: unknown) => ({ agentId, status: "ready", routedVia: "missionCore" }),
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
