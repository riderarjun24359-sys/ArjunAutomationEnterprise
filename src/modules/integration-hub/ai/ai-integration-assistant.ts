import type { AiIntegrationAssistant, IntegrationHubSnapshot } from "../types/os";

export function buildAiIntegrationAssistant(snapshot: Omit<IntegrationHubSnapshot, "assistant">): AiIntegrationAssistant {
    const attention = [
        ...snapshot.webhooks
            .filter((w) => w.failureCount > 0)
            .slice(0, 4)
            .map((w) => `${w.name}: ${w.failureCount} delivery failure(s)`),
        ...snapshot.thirdParty
            .filter((t) => t.connectorStatus.toLowerCase() !== "connected" && t.healthScore < 70)
            .slice(0, 3)
            .map((t) => `${t.displayName} status ${t.connectorStatus}`),
        ...snapshot.apiKeys
            .filter((k) => k.status.toLowerCase() !== "active")
            .slice(0, 2)
            .map((k) => `API key ${k.keyName} is ${k.status}`),
    ].slice(0, 8);

    const webhookRecommendations = [
        snapshot.executiveWidgets.webhookSuccessRate < 95
            ? `Webhook success rate ${snapshot.executiveWidgets.webhookSuccessRate}% — inspect dead-letter and retries.`
            : `Webhook success rate healthy at ${snapshot.executiveWidgets.webhookSuccessRate}%.`,
        snapshot.stats.webhooks === 0
            ? "No webhooks configured — add incoming/outgoing hooks for CRM and billing events."
            : `${snapshot.stats.webhooks} webhook endpoint(s) active across hubs.`,
    ];

    const connectorInsights = snapshot.thirdParty.slice(0, 6).map(
        (t) => `${t.displayName}: ${t.connectorStatus} · health ${t.healthScore} · ${t.category}`,
    );

    const securityInsights = [
        `${snapshot.stats.apiKeys} API key(s) · ${snapshot.executiveWidgets.activeApiKeys} active.`,
        snapshot.apiKeys.some((k) => k.scopes.length === 0)
            ? "Some API keys lack scopes — tighten least-privilege."
            : "API key scopes are present on managed keys.",
        snapshot.stats.openFailures > 0
            ? `${snapshot.stats.openFailures} unresolved integration failure(s).`
            : "No open integration failures.",
    ];

    const dailySummary = [
        `${snapshot.stats.hubs} hub(s) · ${snapshot.stats.connectedServices} connected services.`,
        `${snapshot.stats.apiKeys} API keys · ${snapshot.stats.webhooks} webhooks · ${snapshot.stats.triggers} triggers.`,
        `Request volume ${snapshot.stats.requestVolume.toLocaleString()} · marketplace ${snapshot.stats.marketplaceListings}.`,
    ].join(" ");

    const executiveSummary = [
        dailySummary,
        attention.length ? `Attention: ${attention.slice(0, 3).join("; ")}.` : "No critical integration attention items.",
        webhookRecommendations[0],
    ].join(" ");

    return {
        dailySummary,
        attentionItems: attention,
        webhookRecommendations,
        connectorInsights,
        securityInsights,
        executiveSummary,
        generatedAt: new Date().toISOString(),
    };
}
