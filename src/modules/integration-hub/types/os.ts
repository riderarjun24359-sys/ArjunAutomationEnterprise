export type IntegrationHubOsTab =
    | "gateway"
    | "api-keys"
    | "webhooks"
    | "oauth"
    | "third-party"
    | "marketplace"
    | "triggers"
    | "analytics"
    | "developer"
    | "assistant";

export interface RestApiGatewayItem {
    id: string;
    hubName: string;
    hubKey: string;
    environment: string;
    status: string;
    apiKeyCount: number;
    rateLimitRpm: number;
    usageRequests: number;
    usageErrors: number;
}

export interface ApiKeyManagementItem {
    id: string;
    hubName: string;
    keyName: string;
    keyPrefix: string;
    apiVersion: string;
    status: string;
    scopes: string[];
    expiresAt: string | null;
    lastUsedAt: string | null;
}

export interface WebhookEngineItem {
    id: string;
    direction: "incoming" | "outgoing";
    name: string;
    hubName: string;
    providerOrTarget: string;
    enabled: boolean;
    status: string;
    recentDeliveries: number;
    failureCount: number;
}

export interface OauthIntegrationItem {
    id: string;
    serviceName: string;
    providerType: string;
    hubName: string;
    connectorStatus: string;
    apiVersion: string;
    status: string;
    healthScore: number;
}

export interface ThirdPartyIntegrationItem {
    id: string;
    provider: string;
    displayName: string;
    category: "productivity" | "messaging" | "payments" | "meetings" | "other";
    status: string;
    connectorStatus: string;
    source: "connected_service" | "payment_connector";
    healthScore: number;
}

export interface MarketplaceItem {
    id: string;
    name: string;
    slug: string;
    providerType: string;
    category: string;
    description: string;
    status: string;
    installed: boolean;
    installationStatus: string | null;
}

export interface WorkflowTriggerItem {
    id: string;
    source: "automation" | "dwe_webhook" | "dwe_event" | "dwe_time";
    name: string;
    triggerType: string;
    active: boolean;
    detail: string;
}

export interface ApiUsageAnalyticsMetrics {
    totalRequests: number;
    totalErrors: number;
    errorRate: number;
    avgLatencyP95Ms: number;
    topEndpoints: Array<{ endpoint: string; requests: number; errors: number }>;
    dailyTrend: Array<{ date: string; requests: number; errors: number }>;
}

export interface DeveloperPortalItem {
    id: string;
    title: string;
    kind: "api_key" | "scope" | "marketplace" | "webhook" | "rate_limit";
    summary: string;
    status: string;
}

export interface IntegrationAuditItem {
    id: string;
    entityType: string;
    action: string;
    summary: string;
    securityLevel: string;
    occurredAt: string;
}

export interface ExecutiveIntegrationWidgets {
    activeHubs: number;
    connectedServices: number;
    activeApiKeys: number;
    webhookSuccessRate: number;
    marketplaceInstalled: number;
    openFailures: number;
    topProviders: Array<{ provider: string; status: string }>;
    requestVolume: number;
}

export interface AiIntegrationAssistant {
    dailySummary: string;
    attentionItems: string[];
    webhookRecommendations: string[];
    connectorInsights: string[];
    securityInsights: string[];
    executiveSummary: string;
    generatedAt: string;
}

export interface IntegrationHubOsStats {
    hubs: number;
    connectedServices: number;
    apiKeys: number;
    webhooks: number;
    marketplaceListings: number;
    triggers: number;
    requestVolume: number;
    openFailures: number;
}

export interface IntegrationHubSnapshot {
    organizationId: string | null;
    source: "supabase" | "fallback";
    fetchedAt: string;
    stats: IntegrationHubOsStats;
    gateway: RestApiGatewayItem[];
    apiKeys: ApiKeyManagementItem[];
    webhooks: WebhookEngineItem[];
    oauth: OauthIntegrationItem[];
    thirdParty: ThirdPartyIntegrationItem[];
    marketplace: MarketplaceItem[];
    triggers: WorkflowTriggerItem[];
    analytics: ApiUsageAnalyticsMetrics;
    developerPortal: DeveloperPortalItem[];
    auditTrail: IntegrationAuditItem[];
    executiveWidgets: ExecutiveIntegrationWidgets;
    assistant: AiIntegrationAssistant;
}

export const KNOWN_THIRD_PARTY_PROVIDERS = [
    "google_workspace",
    "microsoft_365",
    "slack",
    "whatsapp_business",
    "stripe",
    "razorpay",
    "zoom",
] as const;
