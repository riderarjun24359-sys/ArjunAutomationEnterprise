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
        validateSession: (token?: unknown) => {
            if (!token) return { valid: false, reason: "token_required" };
            const result = securityClient.validateToken(String(token));
            return { valid: result.valid, keyId: result.keyId, role: result.role };
        },
        getPermissions: () => ({ roles: securityClient.getRoles() }),
        checkPermission: (role: unknown, permission: unknown) =>
            securityClient.hasPermission(role as import("@/src/modules/security-center/types").SecurityRole, permission as import("@/src/modules/security-center/types").Permission),
        validateToken: (token: unknown) => securityClient.validateToken(String(token)),
    },
    notifications: {
        send: async (...args: unknown[]) => {
            const [authUserId, email, payload, fullName] = args;
            if (!authUserId || !email || !payload) {
                return { sent: false, reason: "auth_and_payload_required" };
            }
            const { createCommunicationHubClient } = await import("@/src/modules/communication-hub/sdk");
            const client = createCommunicationHubClient(String(authUserId), String(email), fullName as string | null | undefined);
            const result = await client.sendNotification(
                payload as import("@/src/modules/communication-hub/types").CnhSdkSendNotificationInput,
            );
            return { sent: true, channel: "communication-hub", result };
        },
        listPending: async (...args: unknown[]) => {
            const [authUserId, email, fullName] = args;
            if (!authUserId || !email) {
                return { count: 0, items: [], reason: "auth_required" };
            }
            const { communicationHubService } = await import("@/src/modules/communication-hub/sdk");
            const queue = await communicationHubService.getNotificationQueue(
                String(authUserId),
                String(email),
                fullName as string | null | undefined,
            );
            const pending = queue.filter((item) => {
                const status = `${item.status} ${item.deliveryStatus}`.toLowerCase();
                return status.includes("pending") || status.includes("queued") || status.includes("waiting");
            });
            return { count: pending.length, items: pending.slice(0, 50) };
        },
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
        getMetrics: () => ({ kpis: { source: "mission-core", tracked: true } }),
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
