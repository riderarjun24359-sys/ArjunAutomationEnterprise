import type { IntegrationHubSnapshot } from "../types/os";

export interface IntegrationHubAnalyticsSummary {
    gatewayCoverage: number;
    connectedShare: number;
    webhookHealth: number;
    marketplaceAdoption: number;
    triggerDensity: number;
    auditVelocity: number;
}

export function buildIntegrationHubAnalytics(snapshot: IntegrationHubSnapshot): IntegrationHubAnalyticsSummary {
    const third = snapshot.thirdParty.length || 1;
    const connected = snapshot.thirdParty.filter((t) => t.connectorStatus.toLowerCase() === "connected").length;
    const market = snapshot.marketplace.length || 1;
    const installed = snapshot.marketplace.filter((m) => m.installed).length;

    return {
        gatewayCoverage: snapshot.stats.hubs,
        connectedShare: Math.round((connected / third) * 100),
        webhookHealth: snapshot.executiveWidgets.webhookSuccessRate,
        marketplaceAdoption: Math.round((installed / market) * 100),
        triggerDensity: snapshot.stats.triggers,
        auditVelocity: snapshot.auditTrail.length,
    };
}
