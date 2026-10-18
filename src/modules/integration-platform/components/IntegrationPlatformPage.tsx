"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    IntegrationPlatformOverviewPanel,
    IntegrationHubsPanel,
    ConnectedServicesPanel,
    ConnectorConfigsPanel,
    ConnectorHealthsPanel,
    PaymentConnectorsPanel,
    PaymentConnectorHealthsPanel,
    PaymentRetryQueuesPanel,
    PaymentTransactionsPanel,
    AccountingConnectorsPanel,
    AccountingSyncStatussPanel,
    ExportMappingsPanel,
    AccountingExportsPanel,
    ApiKeysPanel,
    ApiScopesPanel,
    RateLimitsPanel,
    ApiUsagesPanel,
    IncomingWebhooksPanel,
    OutgoingWebhooksPanel,
    WebhookDeadLettersPanel,
    WebhookDeliveryLogsPanel,
    MarketplaceConnectorsPanel,
    MarketplaceInstallationsPanel,
    MarketplaceCompatibilitysPanel,
    MarketplaceVersionsPanel,
    ApiAnalyticssPanel,
    LatencyMetricsPanel,
    WebhookAnalyticssPanel,
    UsageTrendsPanel,
    IntegrationMetricsPanel,
    IntegrationHealthsPanel,
    IntegrationFailuresPanel,
    IntegrationPlatformAuditLogsPanel,
    IntegrationPlatformSdkPanel,
} from "@/src/modules/integration-platform/components/IntegrationPlatformPanels";
import { IntegrationPlatformStats } from "@/src/modules/integration-platform/components/IntegrationPlatformStats";
import { INTG_TABS } from "@/src/modules/integration-platform/constants";
import { useIntegrationPlatform } from "@/src/modules/integration-platform/hooks/useIntegrationPlatform";

const tabs = [
    { id: INTG_TABS.overview, label: "Overview" },
    { id: INTG_TABS.integrationHubs, label: "Integration Hubs" },
    { id: INTG_TABS.connectedServices, label: "Connected Services" },
    { id: INTG_TABS.connectorConfigs, label: "Connector Configs" },
    { id: INTG_TABS.connectorHealth, label: "Connector Health" },
    { id: INTG_TABS.paymentConnectors, label: "Payment Connectors" },
    { id: INTG_TABS.paymentConnectorHealth, label: "Payment Connector Health" },
    { id: INTG_TABS.paymentRetryQueue, label: "Payment Retry Queue" },
    { id: INTG_TABS.paymentTransactions, label: "Payment Transactions" },
    { id: INTG_TABS.accountingConnectors, label: "Accounting Connectors" },
    { id: INTG_TABS.accountingSyncStatus, label: "Accounting Sync Status" },
    { id: INTG_TABS.exportMappings, label: "Export Mappings" },
    { id: INTG_TABS.accountingExports, label: "Accounting Exports" },
    { id: INTG_TABS.apiKeys, label: "Api Keys" },
    { id: INTG_TABS.apiScopes, label: "Api Scopes" },
    { id: INTG_TABS.rateLimits, label: "Rate Limits" },
    { id: INTG_TABS.apiUsage, label: "Api Usage" },
    { id: INTG_TABS.incomingWebhooks, label: "Incoming Webhooks" },
    { id: INTG_TABS.outgoingWebhooks, label: "Outgoing Webhooks" },
    { id: INTG_TABS.webhookDeadLetter, label: "Webhook Dead Letter" },
    { id: INTG_TABS.webhookDeliveryLogs, label: "Webhook Delivery Logs" },
    { id: INTG_TABS.marketplaceConnectors, label: "Marketplace Connectors" },
    { id: INTG_TABS.marketplaceInstallations, label: "Marketplace Installations" },
    { id: INTG_TABS.marketplaceCompatibility, label: "Marketplace Compatibility" },
    { id: INTG_TABS.marketplaceVersions, label: "Marketplace Versions" },
    { id: INTG_TABS.apiAnalytics, label: "Api Analytics" },
    { id: INTG_TABS.latencyMetrics, label: "Latency Metrics" },
    { id: INTG_TABS.webhookAnalytics, label: "Webhook Analytics" },
    { id: INTG_TABS.usageTrends, label: "Usage Trends" },
    { id: INTG_TABS.integrationMetrics, label: "Integration Metrics" },
    { id: INTG_TABS.integrationHealth, label: "Integration Health" },
    { id: INTG_TABS.integrationFailures, label: "Integration Failures" },
    { id: INTG_TABS.auditLogs, label: "Audit Logs" },
    { id: INTG_TABS.api, label: "SDK" },
] as const;

export function IntegrationPlatformPage() {
    const integrationPlatform = useIntegrationPlatform();
    const [activeTab, setActiveTab] = useState<(typeof INTG_TABS)[keyof typeof INTG_TABS]>(INTG_TABS.overview);

    if (integrationPlatform.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Integration Platform" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">V2 Program A Sprint 6</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Integration Platform</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Integration layer for the entire SaaS platform: connected services, payment & accounting connectors, public API platform, webhook delivery, integration marketplace, API analytics, and integration operations dashboard with security-first audit and the shared Integration Platform SDK.
                </p>
            </motion.header>
            <IntegrationPlatformStats stats={integrationPlatform.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-orange-600 text-white" : "border border-slate-200 text-slate-600 hover:border-orange-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === INTG_TABS.overview ? <IntegrationPlatformOverviewPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.integrationHubs ? <IntegrationHubsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.connectedServices ? <ConnectedServicesPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.connectorConfigs ? <ConnectorConfigsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.connectorHealth ? <ConnectorHealthsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.paymentConnectors ? <PaymentConnectorsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.paymentConnectorHealth ? <PaymentConnectorHealthsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.paymentRetryQueue ? <PaymentRetryQueuesPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.paymentTransactions ? <PaymentTransactionsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.accountingConnectors ? <AccountingConnectorsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.accountingSyncStatus ? <AccountingSyncStatussPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.exportMappings ? <ExportMappingsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.accountingExports ? <AccountingExportsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.apiKeys ? <ApiKeysPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.apiScopes ? <ApiScopesPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.rateLimits ? <RateLimitsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.apiUsage ? <ApiUsagesPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.incomingWebhooks ? <IncomingWebhooksPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.outgoingWebhooks ? <OutgoingWebhooksPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.webhookDeadLetter ? <WebhookDeadLettersPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.webhookDeliveryLogs ? <WebhookDeliveryLogsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.marketplaceConnectors ? <MarketplaceConnectorsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.marketplaceInstallations ? <MarketplaceInstallationsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.marketplaceCompatibility ? <MarketplaceCompatibilitysPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.marketplaceVersions ? <MarketplaceVersionsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.apiAnalytics ? <ApiAnalyticssPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.latencyMetrics ? <LatencyMetricsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.webhookAnalytics ? <WebhookAnalyticssPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.usageTrends ? <UsageTrendsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.integrationMetrics ? <IntegrationMetricsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.integrationHealth ? <IntegrationHealthsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.integrationFailures ? <IntegrationFailuresPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.auditLogs ? <IntegrationPlatformAuditLogsPanel data={integrationPlatform} /> : null}
            {activeTab === INTG_TABS.api ? <IntegrationPlatformSdkPanel data={integrationPlatform} /> : null}
        </div>
    );
}
