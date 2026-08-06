import type { IntegrationHubRawData } from "../types/raw";
import type {
    ApiKeyManagementItem,
    ApiUsageAnalyticsMetrics,
    DeveloperPortalItem,
    ExecutiveIntegrationWidgets,
    IntegrationAuditItem,
    IntegrationHubSnapshot,
    MarketplaceItem,
    OauthIntegrationItem,
    RestApiGatewayItem,
    ThirdPartyIntegrationItem,
    WebhookEngineItem,
    WorkflowTriggerItem,
} from "../types/os";
import { KNOWN_THIRD_PARTY_PROVIDERS } from "../types/os";
import { clampScore, displayProviderName, normalizeProvider, providerCategory } from "../utils/formatters";

function hubName(data: IntegrationHubRawData, hubId?: string | null): string {
    if (!hubId) return "Unknown hub";
    return data.hubs.find((h) => h.id === hubId)?.hub_name ?? "Unknown hub";
}

export function buildGateway(data: IntegrationHubRawData): RestApiGatewayItem[] {
    return data.hubs.map((hub) => {
        const keys = data.apiKeys.filter((k) => k.hub_id === hub.id);
        const limits = data.rateLimits.filter((r) => r.hub_id === hub.id);
        const usage = data.apiUsage.filter((u) => u.hub_id === hub.id);
        return {
            id: hub.id,
            hubName: hub.hub_name,
            hubKey: hub.hub_key,
            environment: hub.environment,
            status: hub.status,
            apiKeyCount: keys.length,
            rateLimitRpm: limits.reduce((s, r) => s + Number(r.rate_limit_rpm ?? 0), 0),
            usageRequests: usage.reduce((s, u) => s + Number(u.request_count ?? 0), 0),
            usageErrors: usage.reduce((s, u) => s + Number(u.error_count ?? 0), 0),
        };
    });
}

export function buildApiKeys(data: IntegrationHubRawData): ApiKeyManagementItem[] {
    return data.apiKeys.map((key) => ({
        id: key.id,
        hubName: hubName(data, key.hub_id),
        keyName: key.key_name,
        keyPrefix: key.key_prefix,
        apiVersion: key.api_version,
        status: key.status,
        scopes: data.apiScopes.filter((s) => s.api_key_id === key.id).map((s) => s.scope_key),
        expiresAt: key.expires_at ?? null,
        lastUsedAt: key.last_used_at ?? null,
    }));
}

export function buildWebhooks(data: IntegrationHubRawData): WebhookEngineItem[] {
    const incoming: WebhookEngineItem[] = data.incomingWebhooks.map((w) => ({
        id: w.id,
        direction: "incoming",
        name: w.webhook_name,
        hubName: hubName(data, w.hub_id),
        providerOrTarget: w.endpoint_path || w.provider_type,
        enabled: w.is_enabled,
        status: w.status,
        recentDeliveries: 0,
        failureCount: 0,
    }));

    const outgoing: WebhookEngineItem[] = data.outgoingWebhooks.map((w) => {
        const deliveries = data.webhookDeliveries.filter((d) => d.outgoing_webhook_id === w.id);
        const failures = deliveries.filter((d) => {
            const s = d.delivery_status.toLowerCase();
            return s.includes("fail") || s.includes("error") || Number(d.http_status) >= 400;
        }).length;
        return {
            id: w.id,
            direction: "outgoing",
            name: w.webhook_name,
            hubName: hubName(data, w.hub_id),
            providerOrTarget: w.target_url,
            enabled: w.is_enabled,
            status: w.status,
            recentDeliveries: deliveries.length,
            failureCount: failures,
        };
    });

    return [...incoming, ...outgoing];
}

export function buildOauth(data: IntegrationHubRawData): OauthIntegrationItem[] {
    return data.connectedServices.map((svc) => {
        const config = data.connectorConfigs.find((c) => c.connected_service_id === svc.id);
        const health = data.connectorHealth.find((h) => h.connected_service_id === svc.id);
        return {
            id: svc.id,
            serviceName: svc.service_name,
            providerType: svc.provider_type,
            hubName: hubName(data, svc.hub_id),
            connectorStatus: svc.connector_status,
            apiVersion: config?.api_version ?? "v1",
            status: svc.status,
            healthScore: clampScore(Number(health?.health_score ?? (svc.connector_status === "connected" ? 90 : 50))),
        };
    });
}

export function buildThirdParty(data: IntegrationHubRawData): ThirdPartyIntegrationItem[] {
    const fromServices: ThirdPartyIntegrationItem[] = data.connectedServices.map((svc) => ({
        id: svc.id,
        provider: normalizeProvider(svc.provider_type),
        displayName: displayProviderName(svc.provider_type),
        category: providerCategory(svc.provider_type),
        status: svc.status,
        connectorStatus: svc.connector_status,
        source: "connected_service",
        healthScore: clampScore(
            Number(data.connectorHealth.find((h) => h.connected_service_id === svc.id)?.health_score ?? 70),
        ),
    }));

    const fromPayments: ThirdPartyIntegrationItem[] = data.paymentConnectors.map((p) => ({
        id: p.id,
        provider: normalizeProvider(p.provider_type),
        displayName: displayProviderName(p.provider_type),
        category: "payments",
        status: p.status,
        connectorStatus: p.connector_status,
        source: "payment_connector",
        healthScore: p.connector_status.toLowerCase() === "connected" ? 90 : 55,
    }));

    return [...fromServices, ...fromPayments].sort((a, b) => {
        const ak = (KNOWN_THIRD_PARTY_PROVIDERS as readonly string[]).includes(a.provider) ? 0 : 1;
        const bk = (KNOWN_THIRD_PARTY_PROVIDERS as readonly string[]).includes(b.provider) ? 0 : 1;
        if (ak !== bk) return ak - bk;
        return a.displayName.localeCompare(b.displayName);
    });
}

export function buildMarketplace(data: IntegrationHubRawData): MarketplaceItem[] {
    return data.marketplaceConnectors.map((c) => {
        const install = data.marketplaceInstallations.find((i) => i.marketplace_connector_id === c.id);
        return {
            id: c.id,
            name: c.connector_name,
            slug: c.connector_slug,
            providerType: c.provider_type,
            category: c.category,
            description: c.description,
            status: c.status,
            installed: Boolean(install),
            installationStatus: install?.connector_status ?? null,
        };
    });
}

export function buildTriggers(data: IntegrationHubRawData): WorkflowTriggerItem[] {
    const automation: WorkflowTriggerItem[] = data.workflowTriggers.map((t) => {
        const workflow = data.workflows.find((w) => w.id === t.workflow_id);
        return {
            id: t.id,
            source: "automation",
            name: workflow?.name ?? t.event_name,
            triggerType: t.trigger_type,
            active: t.is_active,
            detail: t.event_name,
        };
    });

    const dweWebhook: WorkflowTriggerItem[] = data.dweWebhookTriggers.map((t) => ({
        id: t.id,
        source: "dwe_webhook",
        name: t.trigger_name,
        triggerType: "webhook",
        active: t.status.toLowerCase() === "active",
        detail: t.webhook_url,
    }));

    const dweEvent: WorkflowTriggerItem[] = data.dweEventTriggers.map((t) => ({
        id: t.id,
        source: "dwe_event",
        name: t.trigger_name,
        triggerType: "business_event",
        active: t.status.toLowerCase() === "active",
        detail: t.event_type,
    }));

    const dweTime: WorkflowTriggerItem[] = data.dweTimeTriggers.map((t) => ({
        id: t.id,
        source: "dwe_time",
        name: t.trigger_name,
        triggerType: "time",
        active: t.status.toLowerCase() === "active",
        detail: t.cron_expression,
    }));

    return [...automation, ...dweWebhook, ...dweEvent, ...dweTime];
}

export function buildAnalytics(data: IntegrationHubRawData): ApiUsageAnalyticsMetrics {
    const fromAnalytics = data.apiAnalytics;
    const totalRequests =
        fromAnalytics.reduce((s, a) => s + Number(a.total_requests ?? 0), 0) ||
        data.apiUsage.reduce((s, u) => s + Number(u.request_count ?? 0), 0);
    const totalErrors =
        fromAnalytics.reduce((s, a) => s + Number(a.total_errors ?? 0), 0) ||
        data.apiUsage.reduce((s, u) => s + Number(u.error_count ?? 0), 0);
    const errorRate = totalRequests <= 0 ? 0 : Math.round((totalErrors / totalRequests) * 1000) / 10;
    const avgLatencyP95Ms =
        data.latencyMetrics.length === 0
            ? 0
            : Math.round(data.latencyMetrics.reduce((s, m) => s + Number(m.p95_ms ?? 0), 0) / data.latencyMetrics.length);

    const endpointMap = new Map<string, { requests: number; errors: number }>();
    for (const u of data.apiUsage) {
        const row = endpointMap.get(u.endpoint) ?? { requests: 0, errors: 0 };
        row.requests += Number(u.request_count ?? 0);
        row.errors += Number(u.error_count ?? 0);
        endpointMap.set(u.endpoint, row);
    }
    for (const m of data.latencyMetrics) {
        if (!endpointMap.has(m.endpoint)) endpointMap.set(m.endpoint, { requests: 0, errors: 0 });
    }

    const dailyTrend = fromAnalytics
        .map((a) => ({
            date: a.metric_date,
            requests: Number(a.total_requests ?? 0),
            errors: Number(a.total_errors ?? 0),
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-14);

    return {
        totalRequests,
        totalErrors,
        errorRate,
        avgLatencyP95Ms,
        topEndpoints: [...endpointMap.entries()]
            .map(([endpoint, v]) => ({ endpoint, requests: v.requests, errors: v.errors }))
            .sort((a, b) => b.requests - a.requests)
            .slice(0, 10),
        dailyTrend,
    };
}

export function buildDeveloperPortal(
    data: IntegrationHubRawData,
    apiKeys: ApiKeyManagementItem[],
    marketplace: MarketplaceItem[],
    webhooks: WebhookEngineItem[],
): DeveloperPortalItem[] {
    const items: DeveloperPortalItem[] = [];

    for (const key of apiKeys.slice(0, 12)) {
        items.push({
            id: `key-${key.id}`,
            title: key.keyName,
            kind: "api_key",
            summary: `${key.keyPrefix}… · ${key.apiVersion} · scopes ${key.scopes.length}`,
            status: key.status,
        });
    }

    for (const scope of data.apiScopes.slice(0, 12)) {
        items.push({
            id: `scope-${scope.id}`,
            title: scope.scope_name || scope.scope_key,
            kind: "scope",
            summary: `Scope ${scope.scope_key}`,
            status: scope.status,
        });
    }

    for (const m of marketplace.slice(0, 8)) {
        items.push({
            id: `mkt-${m.id}`,
            title: m.name,
            kind: "marketplace",
            summary: m.description.slice(0, 120) || m.category,
            status: m.installed ? "installed" : m.status,
        });
    }

    for (const w of webhooks.slice(0, 8)) {
        items.push({
            id: `wh-${w.id}`,
            title: w.name,
            kind: "webhook",
            summary: `${w.direction} · ${w.providerOrTarget}`,
            status: w.enabled ? "enabled" : "disabled",
        });
    }

    for (const r of data.rateLimits.slice(0, 8)) {
        items.push({
            id: `rl-${r.id}`,
            title: r.limit_name,
            kind: "rate_limit",
            summary: `${r.rate_limit_rpm} rpm · burst ${r.burst_limit}`,
            status: r.status,
        });
    }

    return items;
}

export function buildAuditTrail(data: IntegrationHubRawData): IntegrationAuditItem[] {
    return data.auditLogs.slice(0, 40).map((a) => ({
        id: a.id,
        entityType: a.entity_type,
        action: a.action,
        summary: a.summary,
        securityLevel: a.security_level,
        occurredAt: a.created_at,
    }));
}

export function buildExecutiveWidgets(input: {
    gateway: RestApiGatewayItem[];
    thirdParty: ThirdPartyIntegrationItem[];
    apiKeys: ApiKeyManagementItem[];
    webhooks: WebhookEngineItem[];
    marketplace: MarketplaceItem[];
    analytics: ApiUsageAnalyticsMetrics;
    failures: number;
}): ExecutiveIntegrationWidgets {
    const deliveries = input.webhooks.reduce((s, w) => s + w.recentDeliveries, 0);
    const fails = input.webhooks.reduce((s, w) => s + w.failureCount, 0);
    const webhookSuccessRate = deliveries <= 0 ? 100 : clampScore(((deliveries - fails) / deliveries) * 100);

    return {
        activeHubs: input.gateway.filter((g) => g.status.toLowerCase() === "active").length,
        connectedServices: input.thirdParty.filter((t) => t.connectorStatus.toLowerCase() === "connected").length,
        activeApiKeys: input.apiKeys.filter((k) => k.status.toLowerCase() === "active").length,
        webhookSuccessRate,
        marketplaceInstalled: input.marketplace.filter((m) => m.installed).length,
        openFailures: input.failures,
        topProviders: input.thirdParty
            .filter((t) => t.connectorStatus.toLowerCase() === "connected")
            .slice(0, 8)
            .map((t) => ({ provider: t.displayName, status: t.connectorStatus })),
        requestVolume: input.analytics.totalRequests,
    };
}

export function createEmptyIntegrationHubSnapshot(): IntegrationHubSnapshot {
    return {
        organizationId: null,
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        stats: {
            hubs: 0,
            connectedServices: 0,
            apiKeys: 0,
            webhooks: 0,
            marketplaceListings: 0,
            triggers: 0,
            requestVolume: 0,
            openFailures: 0,
        },
        gateway: [],
        apiKeys: [],
        webhooks: [],
        oauth: [],
        thirdParty: [],
        marketplace: [],
        triggers: [],
        analytics: {
            totalRequests: 0,
            totalErrors: 0,
            errorRate: 0,
            avgLatencyP95Ms: 0,
            topEndpoints: [],
            dailyTrend: [],
        },
        developerPortal: [],
        auditTrail: [],
        executiveWidgets: {
            activeHubs: 0,
            connectedServices: 0,
            activeApiKeys: 0,
            webhookSuccessRate: 100,
            marketplaceInstalled: 0,
            openFailures: 0,
            topProviders: [],
            requestVolume: 0,
        },
        assistant: {
            dailySummary: "No organization context loaded.",
            attentionItems: [],
            webhookRecommendations: [],
            connectorInsights: [],
            securityInsights: [],
            executiveSummary: "Sign in to load Integration Hub.",
            generatedAt: new Date().toISOString(),
        },
    };
}

export function buildIntegrationHubSnapshot(data: IntegrationHubRawData): IntegrationHubSnapshot {
    const gateway = buildGateway(data);
    const apiKeys = buildApiKeys(data);
    const webhooks = buildWebhooks(data);
    const oauth = buildOauth(data);
    const thirdParty = buildThirdParty(data);
    const marketplace = buildMarketplace(data);
    const triggers = buildTriggers(data);
    const analytics = buildAnalytics(data);
    const developerPortal = buildDeveloperPortal(data, apiKeys, marketplace, webhooks);
    const auditTrail = buildAuditTrail(data);
    const openFailures = data.integrationFailures.filter((f) => !f.resolved_at).length;
    const executiveWidgets = buildExecutiveWidgets({
        gateway,
        thirdParty,
        apiKeys,
        webhooks,
        marketplace,
        analytics,
        failures: openFailures,
    });

    return {
        organizationId: data.organizationId,
        source: "supabase",
        fetchedAt: data.fetchedAt,
        stats: {
            hubs: gateway.length,
            connectedServices: data.connectedServices.length,
            apiKeys: apiKeys.length,
            webhooks: webhooks.length,
            marketplaceListings: marketplace.length,
            triggers: triggers.length,
            requestVolume: analytics.totalRequests,
            openFailures,
        },
        gateway,
        apiKeys,
        webhooks,
        oauth,
        thirdParty,
        marketplace,
        triggers,
        analytics,
        developerPortal,
        auditTrail,
        executiveWidgets,
        assistant: {
            dailySummary: "",
            attentionItems: [],
            webhookRecommendations: [],
            connectorInsights: [],
            securityInsights: [],
            executiveSummary: "",
            generatedAt: data.fetchedAt,
        },
    };
}
