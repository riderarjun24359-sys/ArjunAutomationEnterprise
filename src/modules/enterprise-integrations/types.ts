import type { EiCalendarProvider, EiPaymentProvider, EiSocialPlatform } from "./constants";
import type { EnvSecretHealthRow } from "./lib/env-secret-health";

export interface AiProviderRow {
    id: string;
    name: string;
    provider: string;
    model: string;
    status: string;
    usageRequests: number;
    errorCount: number;
    estimatedCostUsd: number;
    rateLimitRpm: number;
}

export interface AiProviderCenter {
    rows: AiProviderRow[];
    openaiConfigured: boolean;
    multiProviderReady: boolean;
    totalUsage: number;
    totalCostUsd: number;
    rateLimitMonitors: Array<{ name: string; rpm: number; status: string }>;
}

export interface SecretsManagerBoard {
    vaultSecrets: Array<{
        id: string;
        name: string;
        vaultRef: string;
        status: string;
        rotationDueAt: string;
        health: "healthy" | "rotate_soon" | "overdue" | "unknown";
    }>;
    apiKeys: Array<{ id: string; name: string; prefix: string; status: string; lastUsedAt: string; expiresAt: string }>;
    envHealth: EnvSecretHealthRow[];
    envConfiguredCount: number;
    rotationReminders: number;
}

export interface EmailIntegrationBoard {
    channels: Array<{ id: string; name: string; type: string; enabled: boolean; status: string }>;
    smtpArchitecture: boolean;
    deliveryLogs: Array<{ id: string; recipient: string; subject: string; status: string; deliveredAt: string; failure: string }>;
    retryQueue: number;
    templates: Array<{ id: string; name: string; status: string }>;
}

export interface SocialAccountRow {
    platform: EiSocialPlatform;
    name: string;
    status: string;
    architecture: string;
}

export interface SocialPublishingHub {
    accounts: SocialAccountRow[];
    byPlatform: Array<{ platform: EiSocialPlatform; count: number }>;
    publishingQueue: Array<{ id: string; name: string; status: string; detail: string }>;
    deliveryHistory: Array<{ id: string; event: string; status: string; at: string }>;
}

export interface PaymentIntegrationCenter {
    connectors: Array<{ id: string; name: string; provider: EiPaymentProvider | "other"; status: string }>;
    stripeArchitecture: boolean;
    razorpayArchitecture: boolean;
    webhooksMonitored: number;
    paymentEvents: Array<{ id: string; provider: string; amount: number; currency: string; status: string; at: string }>;
    retryQueue: number;
}

export interface CalendarProductivityBoard {
    providers: Array<{ provider: EiCalendarProvider; name: string; status: string; architecture: string }>;
    googleArchitecture: boolean;
    outlookArchitecture: boolean;
    meetings: Array<{ id: string; name: string; status: string; detail: string }>;
    reminders: number;
}

export interface CloudStorageBoard {
    abstractionReady: boolean;
    uploads: Array<{ id: string; name: string; status: string; detail: string }>;
    assetLibrary: Array<{ id: string; name: string; category: string; status: string }>;
    storageUsageScore: number | null;
}

export interface WebhookManagerBoard {
    incoming: Array<{ id: string; name: string; path: string; enabled: boolean; signatureValidation: boolean; status: string }>;
    outgoing: Array<{ id: string; name: string; target: string; enabled: boolean; signatureValidation: boolean; status: string }>;
    retryPolicy: Array<{ id: string; name: string; status: string; detail: string }>;
    eventLogs: Array<{ id: string; event: string; httpStatus: number; status: string; latencyMs: number; at: string }>;
    deadLetters: number;
}

export interface IntegrationHealthDashboard {
    connectedServices: number;
    syncStatus: Array<{ id: string; entity: string; status: string; lastSyncAt: string; records: number }>;
    errorMonitoring: number;
    uptimePercent: number | null;
    latencyP95Ms: number | null;
    overallScore: number | null;
}

export interface ExecutiveIntegrationDashboard {
    aiUsage: number;
    integrationHealth: number | null;
    costOverviewUsd: number;
    failureAlerts: number;
    recommendations: string[];
    summary: string;
}

export interface EnterpriseIntegrationsSnapshot {
    organizationId: string | null;
    accessGranted: boolean;
    accessDeniedReason?: string;
    fetchedAt: string;
    aiProviders: AiProviderCenter;
    secrets: SecretsManagerBoard;
    email: EmailIntegrationBoard;
    social: SocialPublishingHub;
    payments: PaymentIntegrationCenter;
    calendar: CalendarProductivityBoard;
    storage: CloudStorageBoard;
    webhooks: WebhookManagerBoard;
    health: IntegrationHealthDashboard;
    executive: ExecutiveIntegrationDashboard;
}

export interface EnterpriseIntegrationsRawData {
    organizationId: string;
    membershipRole: string | null;
    envHealth: EnvSecretHealthRow[];
    hubs: Array<{ id: string; hub_name: string; environment: string; status: string }>;
    connectedServices: Array<{
        id: string;
        service_name: string;
        provider_type: string;
        connector_status: string;
        credentials_ref: string;
        status: string;
    }>;
    connectorConfigs: Array<{
        id: string;
        config_name: string;
        provider_type: string;
        api_version: string;
        status: string;
    }>;
    connectorHealth: Array<{
        id: string;
        health_score: number;
        last_check_at: string;
        status: string;
    }>;
    paymentConnectors: Array<{
        id: string;
        connector_name: string;
        provider_type: string;
        connector_status: string;
        credentials_ref: string;
        status: string;
    }>;
    paymentHealth: Array<{ id: string; health_score: number; latency_ms: number; status: string }>;
    paymentRetries: Array<{ id: string; transaction_ref: string; retry_count: number; last_error: string; status: string }>;
    paymentTransactions: Array<{
        id: string;
        provider_type: string;
        amount: number;
        currency: string;
        transaction_status: string;
        processed_at: string | null;
        status: string;
    }>;
    apiKeys: Array<{
        id: string;
        key_name: string;
        key_prefix: string;
        expires_at: string | null;
        last_used_at: string | null;
        status: string;
    }>;
    rateLimits: Array<{ id: string; limit_name: string; rate_limit_rpm: number; burst_limit: number; status: string }>;
    apiUsage: Array<{
        id: string;
        endpoint: string;
        request_count: number;
        error_count: number;
        period_start: string;
        status: string;
    }>;
    incomingWebhooks: Array<{
        id: string;
        webhook_name: string;
        endpoint_path: string;
        provider_type: string;
        webhook_signing_key_hash: string;
        is_enabled: boolean;
        status: string;
    }>;
    outgoingWebhooks: Array<{
        id: string;
        webhook_name: string;
        target_url: string;
        webhook_signing_key_hash: string;
        is_enabled: boolean;
        status: string;
    }>;
    webhookDeadLetters: Array<{ id: string; event_type: string; retry_count: number; last_error: string; status: string }>;
    webhookDeliveryLogs: Array<{
        id: string;
        event_type: string;
        http_status: number;
        delivery_status: string;
        delivered_at: string | null;
        latency_ms: number;
        status: string;
    }>;
    marketplace: Array<{
        id: string;
        connector_name: string;
        provider_type: string;
        category: string;
        description: string;
        status: string;
    }>;
    installations: Array<{ id: string; installation_key: string; connector_status: string; status: string }>;
    latencyMetrics: Array<{ id: string; endpoint: string; p95_ms: number; metric_date: string; status: string }>;
    integrationMetrics: Array<{
        id: string;
        metric_date: string;
        active_connectors: number;
        total_api_calls: number;
        total_webhook_deliveries: number;
        overall_success_rate: number;
        status: string;
    }>;
    integrationHealth: Array<{
        id: string;
        overall_score: number;
        uptime_percent: number;
        active_connectors: number;
        degraded_connectors: number;
        summary: string;
        status: string;
    }>;
    integrationFailures: Array<{
        id: string;
        provider_type: string;
        error_message: string;
        retry_count: number;
        failed_at: string;
        status: string;
    }>;
    accountingSync: Array<{
        id: string;
        entity_type: string;
        last_sync_at: string | null;
        records_synced: number;
        sync_status: string;
        status: string;
    }>;
    secrets: Array<{
        id: string;
        secret_name: string;
        vault_ref: string;
        rotation_due_at: string | null;
        secret_status: string;
        status: string;
    }>;
    emailChannels: Array<{
        id: string;
        channel_name: string;
        channel_type: string;
        is_enabled: boolean;
        status: string;
    }>;
    emailQueue: Array<{
        id: string;
        recipient: string;
        subject: string;
        delivery_status: string;
        retry_count: number;
        delivered_at: string | null;
        failure_reason: string;
        status: string;
    }>;
    emailTemplates: Array<{ id: string; template_name: string; status: string }>;
    retryPolicies: Array<{ id: string; policy_name: string; status: string; max_retries: number }>;
    deliveryFailures: Array<{ id: string; failure_reason: string; status: string; created_at: string }>;
    aiAgents: Array<{ id: string; name: string; model: string; status: string; max_tokens: number; description: string }>;
}
