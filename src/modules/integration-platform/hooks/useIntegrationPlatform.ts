"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { integrationPlatformService } from "@/src/modules/integration-platform/services/integration-platform.service";
import type {
    IntegrationHubSummary,
    CreateIntegrationHubInput,
    ConnectedServiceSummary,
    CreateConnectedServiceInput,
    ConnectorConfigSummary,
    CreateConnectorConfigInput,
    ConnectorHealthSummary,
    CreateConnectorHealthInput,
    PaymentConnectorSummary,
    CreatePaymentConnectorInput,
    PaymentConnectorHealthSummary,
    CreatePaymentConnectorHealthInput,
    PaymentRetryQueueSummary,
    CreatePaymentRetryQueueInput,
    PaymentTransactionSummary,
    CreatePaymentTransactionInput,
    AccountingConnectorSummary,
    CreateAccountingConnectorInput,
    AccountingSyncStatusSummary,
    CreateAccountingSyncStatusInput,
    ExportMappingSummary,
    CreateExportMappingInput,
    AccountingExportSummary,
    CreateAccountingExportInput,
    ApiKeySummary,
    CreateApiKeyInput,
    ApiScopeSummary,
    CreateApiScopeInput,
    RateLimitSummary,
    CreateRateLimitInput,
    ApiUsageSummary,
    CreateApiUsageInput,
    IncomingWebhookSummary,
    CreateIncomingWebhookInput,
    OutgoingWebhookSummary,
    CreateOutgoingWebhookInput,
    WebhookDeadLetterSummary,
    CreateWebhookDeadLetterInput,
    WebhookDeliveryLogSummary,
    CreateWebhookDeliveryLogInput,
    MarketplaceConnectorSummary,
    CreateMarketplaceConnectorInput,
    MarketplaceInstallationSummary,
    CreateMarketplaceInstallationInput,
    MarketplaceCompatibilitySummary,
    CreateMarketplaceCompatibilityInput,
    MarketplaceVersionSummary,
    CreateMarketplaceVersionInput,
    ApiAnalyticsSummary,
    CreateApiAnalyticsInput,
    LatencyMetricSummary,
    CreateLatencyMetricInput,
    WebhookAnalyticsSummary,
    CreateWebhookAnalyticsInput,
    UsageTrendSummary,
    CreateUsageTrendInput,
    IntegrationMetricSummary,
    CreateIntegrationMetricInput,
    IntegrationHealthSummary,
    CreateIntegrationHealthInput,
    IntegrationFailureSummary,
    CreateIntegrationFailureInput,
    AuditEntry,
    IntgDashboardStats,
    IntgPipelineInfo,
} from "@/src/modules/integration-platform/types";

export function useIntegrationPlatform() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<IntgDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<IntgPipelineInfo | null>(null);
    const [integrationHubs, setIntegrationHubs] = useState<IntegrationHubSummary[]>([]);
    const [connectedServices, setConnectedServices] = useState<ConnectedServiceSummary[]>([]);
    const [connectorConfigs, setConnectorConfigs] = useState<ConnectorConfigSummary[]>([]);
    const [connectorHealth, setConnectorHealths] = useState<ConnectorHealthSummary[]>([]);
    const [paymentConnectors, setPaymentConnectors] = useState<PaymentConnectorSummary[]>([]);
    const [paymentConnectorHealth, setPaymentConnectorHealths] = useState<PaymentConnectorHealthSummary[]>([]);
    const [paymentRetryQueue, setPaymentRetryQueues] = useState<PaymentRetryQueueSummary[]>([]);
    const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransactionSummary[]>([]);
    const [accountingConnectors, setAccountingConnectors] = useState<AccountingConnectorSummary[]>([]);
    const [accountingSyncStatus, setAccountingSyncStatuss] = useState<AccountingSyncStatusSummary[]>([]);
    const [exportMappings, setExportMappings] = useState<ExportMappingSummary[]>([]);
    const [accountingExports, setAccountingExports] = useState<AccountingExportSummary[]>([]);
    const [apiKeys, setApiKeys] = useState<ApiKeySummary[]>([]);
    const [newApiKeySecret, setNewApiKeySecret] = useState<string | null>(null);
    const [apiScopes, setApiScopes] = useState<ApiScopeSummary[]>([]);
    const [rateLimits, setRateLimits] = useState<RateLimitSummary[]>([]);
    const [apiUsage, setApiUsages] = useState<ApiUsageSummary[]>([]);
    const [incomingWebhooks, setIncomingWebhooks] = useState<IncomingWebhookSummary[]>([]);
    const [outgoingWebhooks, setOutgoingWebhooks] = useState<OutgoingWebhookSummary[]>([]);
    const [webhookDeadLetter, setWebhookDeadLetters] = useState<WebhookDeadLetterSummary[]>([]);
    const [webhookDeliveryLogs, setWebhookDeliveryLogs] = useState<WebhookDeliveryLogSummary[]>([]);
    const [marketplaceConnectors, setMarketplaceConnectors] = useState<MarketplaceConnectorSummary[]>([]);
    const [marketplaceInstallations, setMarketplaceInstallations] = useState<MarketplaceInstallationSummary[]>([]);
    const [marketplaceCompatibility, setMarketplaceCompatibilitys] = useState<MarketplaceCompatibilitySummary[]>([]);
    const [marketplaceVersions, setMarketplaceVersions] = useState<MarketplaceVersionSummary[]>([]);
    const [apiAnalytics, setApiAnalyticss] = useState<ApiAnalyticsSummary[]>([]);
    const [latencyMetrics, setLatencyMetrics] = useState<LatencyMetricSummary[]>([]);
    const [webhookAnalytics, setWebhookAnalyticss] = useState<WebhookAnalyticsSummary[]>([]);
    const [usageTrends, setUsageTrends] = useState<UsageTrendSummary[]>([]);
    const [integrationMetrics, setIntegrationMetrics] = useState<IntegrationMetricSummary[]>([]);
    const [integrationHealth, setIntegrationHealths] = useState<IntegrationHealthSummary[]>([]);
    const [integrationFailures, setIntegrationFailures] = useState<IntegrationFailureSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [integrationHubOptions, setIntegrationHubOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
integrationHubsList,
            connectedServicesList,
            connectorConfigsList,
            connectorHealthList,
            paymentConnectorsList,
            paymentConnectorHealthList,
            paymentRetryQueueList,
            paymentTransactionsList,
            accountingConnectorsList,
            accountingSyncStatusList,
            exportMappingsList,
            accountingExportsList,
            apiKeysList,
            apiScopesList,
            rateLimitsList,
            apiUsageList,
            incomingWebhooksList,
            outgoingWebhooksList,
            webhookDeadLetterList,
            webhookDeliveryLogsList,
            marketplaceConnectorsList,
            marketplaceInstallationsList,
            marketplaceCompatibilityList,
            marketplaceVersionsList,
            apiAnalyticsList,
            latencyMetricsList,
            webhookAnalyticsList,
            usageTrendsList,
            integrationMetricsList,
            integrationHealthList,
            integrationFailuresList,
            auditLogsList,
            hubOpts,
        ] = await Promise.all([
            integrationPlatformService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(integrationPlatformService.getPipelineInfo()),
            integrationPlatformService.getIntegrationHubs(authUserId, email, fullName),
            integrationPlatformService.getConnectedServices(authUserId, email, fullName),
            integrationPlatformService.getConnectorConfigs(authUserId, email, fullName),
            integrationPlatformService.getConnectorHealths(authUserId, email, fullName),
            integrationPlatformService.getPaymentConnectors(authUserId, email, fullName),
            integrationPlatformService.getPaymentConnectorHealths(authUserId, email, fullName),
            integrationPlatformService.getPaymentRetryQueues(authUserId, email, fullName),
            integrationPlatformService.getPaymentTransactions(authUserId, email, fullName),
            integrationPlatformService.getAccountingConnectors(authUserId, email, fullName),
            integrationPlatformService.getAccountingSyncStatuss(authUserId, email, fullName),
            integrationPlatformService.getExportMappings(authUserId, email, fullName),
            integrationPlatformService.getAccountingExports(authUserId, email, fullName),
            integrationPlatformService.getApiKeys(authUserId, email, fullName),
            integrationPlatformService.getApiScopes(authUserId, email, fullName),
            integrationPlatformService.getRateLimits(authUserId, email, fullName),
            integrationPlatformService.getApiUsages(authUserId, email, fullName),
            integrationPlatformService.getIncomingWebhooks(authUserId, email, fullName),
            integrationPlatformService.getOutgoingWebhooks(authUserId, email, fullName),
            integrationPlatformService.getWebhookDeadLetters(authUserId, email, fullName),
            integrationPlatformService.getWebhookDeliveryLogs(authUserId, email, fullName),
            integrationPlatformService.getMarketplaceConnectors(authUserId, email, fullName),
            integrationPlatformService.getMarketplaceInstallations(authUserId, email, fullName),
            integrationPlatformService.getMarketplaceCompatibilitys(authUserId, email, fullName),
            integrationPlatformService.getMarketplaceVersions(authUserId, email, fullName),
            integrationPlatformService.getApiAnalyticss(authUserId, email, fullName),
            integrationPlatformService.getLatencyMetrics(authUserId, email, fullName),
            integrationPlatformService.getWebhookAnalyticss(authUserId, email, fullName),
            integrationPlatformService.getUsageTrends(authUserId, email, fullName),
            integrationPlatformService.getIntegrationMetrics(authUserId, email, fullName),
            integrationPlatformService.getIntegrationHealths(authUserId, email, fullName),
            integrationPlatformService.getIntegrationFailures(authUserId, email, fullName),
            integrationPlatformService.getAuditLogs(authUserId, email, fullName),
            integrationPlatformService.getIntegrationHubOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
integrationHubsList,
            connectedServicesList,
            connectorConfigsList,
            connectorHealthList,
            paymentConnectorsList,
            paymentConnectorHealthList,
            paymentRetryQueueList,
            paymentTransactionsList,
            accountingConnectorsList,
            accountingSyncStatusList,
            exportMappingsList,
            accountingExportsList,
            apiKeysList,
            apiScopesList,
            rateLimitsList,
            apiUsageList,
            incomingWebhooksList,
            outgoingWebhooksList,
            webhookDeadLetterList,
            webhookDeliveryLogsList,
            marketplaceConnectorsList,
            marketplaceInstallationsList,
            marketplaceCompatibilityList,
            marketplaceVersionsList,
            apiAnalyticsList,
            latencyMetricsList,
            webhookAnalyticsList,
            usageTrendsList,
            integrationMetricsList,
            integrationHealthList,
            integrationFailuresList,
            auditLogsList,
            hubOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setIntegrationHubs(result.integrationHubsList);
        setConnectedServices(result.connectedServicesList);
        setConnectorConfigs(result.connectorConfigsList);
        setConnectorHealths(result.connectorHealthList);
        setPaymentConnectors(result.paymentConnectorsList);
        setPaymentConnectorHealths(result.paymentConnectorHealthList);
        setPaymentRetryQueues(result.paymentRetryQueueList);
        setPaymentTransactions(result.paymentTransactionsList);
        setAccountingConnectors(result.accountingConnectorsList);
        setAccountingSyncStatuss(result.accountingSyncStatusList);
        setExportMappings(result.exportMappingsList);
        setAccountingExports(result.accountingExportsList);
        setApiKeys(result.apiKeysList);
        setApiScopes(result.apiScopesList);
        setRateLimits(result.rateLimitsList);
        setApiUsages(result.apiUsageList);
        setIncomingWebhooks(result.incomingWebhooksList);
        setOutgoingWebhooks(result.outgoingWebhooksList);
        setWebhookDeadLetters(result.webhookDeadLetterList);
        setWebhookDeliveryLogs(result.webhookDeliveryLogsList);
        setMarketplaceConnectors(result.marketplaceConnectorsList);
        setMarketplaceInstallations(result.marketplaceInstallationsList);
        setMarketplaceCompatibilitys(result.marketplaceCompatibilityList);
        setMarketplaceVersions(result.marketplaceVersionsList);
        setApiAnalyticss(result.apiAnalyticsList);
        setLatencyMetrics(result.latencyMetricsList);
        setWebhookAnalyticss(result.webhookAnalyticsList);
        setUsageTrends(result.usageTrendsList);
        setIntegrationMetrics(result.integrationMetricsList);
        setIntegrationHealths(result.integrationHealthList);
        setIntegrationFailures(result.integrationFailuresList);
        setAuditLogs(result.auditLogsList);
        setIntegrationHubOptions(result.hubOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

    const createIntegrationHub = useCallback(async (input: CreateIntegrationHubInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createIntegrationHub(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createConnectedService = useCallback(async (input: CreateConnectedServiceInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createConnectedService(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createConnectorConfig = useCallback(async (input: CreateConnectorConfigInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createConnectorConfig(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createConnectorHealth = useCallback(async (input: CreateConnectorHealthInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createConnectorHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPaymentConnector = useCallback(async (input: CreatePaymentConnectorInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createPaymentConnector(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPaymentConnectorHealth = useCallback(async (input: CreatePaymentConnectorHealthInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createPaymentConnectorHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPaymentRetryQueue = useCallback(async (input: CreatePaymentRetryQueueInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createPaymentRetryQueue(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPaymentTransaction = useCallback(async (input: CreatePaymentTransactionInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createPaymentTransaction(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAccountingConnector = useCallback(async (input: CreateAccountingConnectorInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createAccountingConnector(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAccountingSyncStatus = useCallback(async (input: CreateAccountingSyncStatusInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createAccountingSyncStatus(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createExportMapping = useCallback(async (input: CreateExportMappingInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createExportMapping(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAccountingExport = useCallback(async (input: CreateAccountingExportInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createAccountingExport(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createApiKey = useCallback(async (input: CreateApiKeyInput) => { if (!user) throw new Error("Authentication required"); const issued = await integrationPlatformService.createApiKey(user.id, user.email, input, user.fullName); setNewApiKeySecret(issued.secret); await refresh(); return issued; }, [user, refresh]);
    const revokeApiKey = useCallback(async (apiKeyId: string) => { if (!user) throw new Error("Authentication required"); const revoked = await integrationPlatformService.revokeApiKey(user.id, user.email, apiKeyId, user.fullName); if (revoked) await refresh(); return revoked; }, [user, refresh]);
    const clearApiKeySecret = useCallback(() => setNewApiKeySecret(null), []);
    const createApiScope = useCallback(async (input: CreateApiScopeInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createApiScope(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRateLimit = useCallback(async (input: CreateRateLimitInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createRateLimit(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createApiUsage = useCallback(async (input: CreateApiUsageInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createApiUsage(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIncomingWebhook = useCallback(async (input: CreateIncomingWebhookInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createIncomingWebhook(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOutgoingWebhook = useCallback(async (input: CreateOutgoingWebhookInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createOutgoingWebhook(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWebhookDeadLetter = useCallback(async (input: CreateWebhookDeadLetterInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createWebhookDeadLetter(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWebhookDeliveryLog = useCallback(async (input: CreateWebhookDeliveryLogInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createWebhookDeliveryLog(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMarketplaceConnector = useCallback(async (input: CreateMarketplaceConnectorInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createMarketplaceConnector(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMarketplaceInstallation = useCallback(async (input: CreateMarketplaceInstallationInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createMarketplaceInstallation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMarketplaceCompatibility = useCallback(async (input: CreateMarketplaceCompatibilityInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createMarketplaceCompatibility(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMarketplaceVersion = useCallback(async (input: CreateMarketplaceVersionInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createMarketplaceVersion(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createApiAnalytics = useCallback(async (input: CreateApiAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createApiAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLatencyMetric = useCallback(async (input: CreateLatencyMetricInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createLatencyMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createWebhookAnalytics = useCallback(async (input: CreateWebhookAnalyticsInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createWebhookAnalytics(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createUsageTrend = useCallback(async (input: CreateUsageTrendInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createUsageTrend(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIntegrationMetric = useCallback(async (input: CreateIntegrationMetricInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createIntegrationMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIntegrationHealth = useCallback(async (input: CreateIntegrationHealthInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createIntegrationHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIntegrationFailure = useCallback(async (input: CreateIntegrationFailureInput) => { if (!user) throw new Error("Authentication required"); await integrationPlatformService.createIntegrationFailure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        integrationHubs,
        createIntegrationHub,
        connectedServices,
        createConnectedService,
        connectorConfigs,
        createConnectorConfig,
        connectorHealth,
        createConnectorHealth,
        paymentConnectors,
        createPaymentConnector,
        paymentConnectorHealth,
        createPaymentConnectorHealth,
        paymentRetryQueue,
        createPaymentRetryQueue,
        paymentTransactions,
        createPaymentTransaction,
        accountingConnectors,
        createAccountingConnector,
        accountingSyncStatus,
        createAccountingSyncStatus,
        exportMappings,
        createExportMapping,
        accountingExports,
        createAccountingExport,
        apiKeys,
        createApiKey,
        revokeApiKey,
        newApiKeySecret,
        clearApiKeySecret,
        apiScopes,
        createApiScope,
        rateLimits,
        createRateLimit,
        apiUsage,
        createApiUsage,
        incomingWebhooks,
        createIncomingWebhook,
        outgoingWebhooks,
        createOutgoingWebhook,
        webhookDeadLetter,
        createWebhookDeadLetter,
        webhookDeliveryLogs,
        createWebhookDeliveryLog,
        marketplaceConnectors,
        createMarketplaceConnector,
        marketplaceInstallations,
        createMarketplaceInstallation,
        marketplaceCompatibility,
        createMarketplaceCompatibility,
        marketplaceVersions,
        createMarketplaceVersion,
        apiAnalytics,
        createApiAnalytics,
        latencyMetrics,
        createLatencyMetric,
        webhookAnalytics,
        createWebhookAnalytics,
        usageTrends,
        createUsageTrend,
        integrationMetrics,
        createIntegrationMetric,
        integrationHealth,
        createIntegrationHealth,
        integrationFailures,
        createIntegrationFailure,
        auditLogs,
        integrationHubOptions,
        refresh,
    };
}
