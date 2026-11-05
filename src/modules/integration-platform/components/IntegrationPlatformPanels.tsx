"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { INTG_THEME, PROVIDER_TYPE_OPTIONS, CONNECTOR_STATUS_OPTIONS, API_STATUS_OPTIONS, API_VERSION_OPTIONS } from "@/src/modules/integration-platform/constants";
import type { useIntegrationPlatform } from "@/src/modules/integration-platform/hooks/useIntegrationPlatform";
import {
    integrationHubsFormSchema,
    type integrationHubsFormValues,
    connectedServicesFormSchema,
    type connectedServicesFormValues,
    connectorConfigsFormSchema,
    type connectorConfigsFormValues,
    connectorHealthFormSchema,
    type connectorHealthFormValues,
    paymentConnectorsFormSchema,
    type paymentConnectorsFormValues,
    paymentConnectorHealthFormSchema,
    type paymentConnectorHealthFormValues,
    paymentRetryQueueFormSchema,
    type paymentRetryQueueFormValues,
    paymentTransactionsFormSchema,
    type paymentTransactionsFormValues,
    accountingConnectorsFormSchema,
    type accountingConnectorsFormValues,
    accountingSyncStatusFormSchema,
    type accountingSyncStatusFormValues,
    exportMappingsFormSchema,
    type exportMappingsFormValues,
    accountingExportsFormSchema,
    type accountingExportsFormValues,
    apiKeysFormSchema,
    type apiKeysFormValues,
    apiScopesFormSchema,
    type apiScopesFormValues,
    rateLimitsFormSchema,
    type rateLimitsFormValues,
    apiUsageFormSchema,
    type apiUsageFormValues,
    incomingWebhooksFormSchema,
    type incomingWebhooksFormValues,
    outgoingWebhooksFormSchema,
    type outgoingWebhooksFormValues,
    webhookDeadLetterFormSchema,
    type webhookDeadLetterFormValues,
    webhookDeliveryLogsFormSchema,
    type webhookDeliveryLogsFormValues,
    marketplaceConnectorsFormSchema,
    type marketplaceConnectorsFormValues,
    marketplaceInstallationsFormSchema,
    type marketplaceInstallationsFormValues,
    marketplaceCompatibilityFormSchema,
    type marketplaceCompatibilityFormValues,
    marketplaceVersionsFormSchema,
    type marketplaceVersionsFormValues,
    apiAnalyticsFormSchema,
    type apiAnalyticsFormValues,
    latencyMetricsFormSchema,
    type latencyMetricsFormValues,
    webhookAnalyticsFormSchema,
    type webhookAnalyticsFormValues,
    usageTrendsFormSchema,
    type usageTrendsFormValues,
    integrationMetricsFormSchema,
    type integrationMetricsFormValues,
    integrationHealthFormSchema,
    type integrationHealthFormValues,
    integrationFailuresFormSchema,
    type integrationFailuresFormValues,
} from "@/src/modules/integration-platform/schemas";

type IntegrationPlatformData = ReturnType<typeof useIntegrationPlatform>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-orange-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-orange-600">{meta}</p> : null}</div>;
}
function IntegrationHubSelect({ data, ...props }: { data: IntegrationPlatformData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select integration hub</option>{data.integrationHubOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>;
}

export function IntegrationPlatformOverviewPanel({ data }: { data: IntegrationPlatformData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Integration Platform summary" description="Connected services, payment & accounting connectors, public API, webhooks, marketplace, analytics, and ops dashboard" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Integration Hubs" subtitle={`${data.stats?.totalIntegrationHubs ?? 0} total`} meta={`${data.stats?.activeIntegrationHubs ?? 0} active • ${data.stats?.connectedServiceCount ?? 0} connected services`} />
                <ListCard title="Connectors" subtitle={`${data.stats?.activeConnectorCount ?? 0} active connectors`} meta={`${data.stats?.pendingRetryCount ?? 0} pending retries • ${data.stats?.failedTransactionCount ?? 0} failed transactions`} />
                <ListCard title="Health" subtitle={`${(data.stats?.avgHealthScore ?? 0).toFixed(1)} avg health score`} meta={`${data.stats?.openFailureCount ?? 0} open failures`} />
                <ListCard title="Audit Trail" subtitle={`${data.stats?.auditCount ?? 0} audit entries`} meta="Security-first integration operations" />
            </div></Card>
            <Card hover><SectionHeader title="Integration pipeline" description={`${pipeline?.previousStage ?? "configured"} → ${pipeline?.currentStage ?? "active"} → ${pipeline?.nextStage ?? "degraded"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Integration pipeline stages will appear as hubs are configured." />}
            </div></Card>
        </div>
    );
}

export function IntegrationHubsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<integrationHubsFormValues>({ resolver: zodResolver(integrationHubsFormSchema), defaultValues: {"hubKey":"","hubName":"","environment":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Integration Hubs" description="Enterprise integration platform integration hubs" /><div className="mt-6 space-y-3">
                {data.integrationHubs.length === 0 ? <EmptyState title="No integration hubs" description="Create the first integration hubs record." /> : data.integrationHubs.map((item) => (
                    <ListCard key={item.id} title={String(item.hubName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.hubKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create integration hubs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIntegrationHub(v))}>
                <input {...form.register("hubKey")} placeholder="hubKey" className={inputClass} />
                <input {...form.register("hubName")} placeholder="hubName" className={inputClass} />
                <input {...form.register("environment")} placeholder="environment" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ConnectedServicesPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<connectedServicesFormValues>({ resolver: zodResolver(connectedServicesFormSchema), defaultValues: {"integrationHubId":"","serviceKey":"","serviceName":"","providerType":"","connectorStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Connected Services" description="Enterprise integration platform connected services" /><div className="mt-6 space-y-3">
                {data.connectedServices.length === 0 ? <EmptyState title="No connected services" description="Create the first connected services record." /> : data.connectedServices.map((item) => (
                    <ListCard key={item.id} title={String(item.serviceName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.serviceKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create connected services" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createConnectedService(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("serviceKey")} placeholder="serviceKey" className={inputClass} />
                <input {...form.register("serviceName")} placeholder="serviceName" className={inputClass} />
                <select {...form.register("providerType")} className={inputClass}>{PROVIDER_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <select {...form.register("connectorStatus")} className={inputClass}>{CONNECTOR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ConnectorConfigsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<connectorConfigsFormValues>({ resolver: zodResolver(connectorConfigsFormSchema), defaultValues: {"integrationHubId":"","configKey":"","configName":"","providerType":"","apiVersion":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Connector Configs" description="Enterprise integration platform connector configs" /><div className="mt-6 space-y-3">
                {data.connectorConfigs.length === 0 ? <EmptyState title="No connector configs" description="Create the first connector configs record." /> : data.connectorConfigs.map((item) => (
                    <ListCard key={item.id} title={String(item.configName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.configKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create connector configs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createConnectorConfig(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("configKey")} placeholder="configKey" className={inputClass} />
                <input {...form.register("configName")} placeholder="configName" className={inputClass} />
                <select {...form.register("providerType")} className={inputClass}>{PROVIDER_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <select {...form.register("apiVersion")} className={inputClass}>{API_VERSION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ConnectorHealthsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<connectorHealthFormValues>({ resolver: zodResolver(connectorHealthFormSchema), defaultValues: {"integrationHubId":"","healthKey":"","healthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Connector Health" description="Enterprise integration platform connector health" /><div className="mt-6 space-y-3">
                {data.connectorHealth.length === 0 ? <EmptyState title="No connector health" description="Create the first connector health record." /> : data.connectorHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.healthKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create connector health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createConnectorHealth(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("healthScore", { valueAsNumber: true })} placeholder="healthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PaymentConnectorsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<paymentConnectorsFormValues>({ resolver: zodResolver(paymentConnectorsFormSchema), defaultValues: {"integrationHubId":"","connectorKey":"","connectorName":"","providerType":"","connectorStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Payment Connectors" description="Enterprise integration platform payment connectors" /><div className="mt-6 space-y-3">
                {data.paymentConnectors.length === 0 ? <EmptyState title="No payment connectors" description="Create the first payment connectors record." /> : data.paymentConnectors.map((item) => (
                    <ListCard key={item.id} title={String(item.connectorName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.connectorKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create payment connectors" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPaymentConnector(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("connectorKey")} placeholder="connectorKey" className={inputClass} />
                <input {...form.register("connectorName")} placeholder="connectorName" className={inputClass} />
                <select {...form.register("providerType")} className={inputClass}>{PROVIDER_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <select {...form.register("connectorStatus")} className={inputClass}>{CONNECTOR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PaymentConnectorHealthsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<paymentConnectorHealthFormValues>({ resolver: zodResolver(paymentConnectorHealthFormSchema), defaultValues: {"integrationHubId":"","healthKey":"","healthScore":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Payment Connector Health" description="Enterprise integration platform payment connector health" /><div className="mt-6 space-y-3">
                {data.paymentConnectorHealth.length === 0 ? <EmptyState title="No payment connector health" description="Create the first payment connector health record." /> : data.paymentConnectorHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.healthKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create payment connector health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPaymentConnectorHealth(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("healthScore", { valueAsNumber: true })} placeholder="healthScore" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PaymentRetryQueuesPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<paymentRetryQueueFormValues>({ resolver: zodResolver(paymentRetryQueueFormSchema), defaultValues: {"integrationHubId":"","queueKey":"","transactionRef":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Payment Retry Queue" description="Enterprise integration platform payment retry queue" /><div className="mt-6 space-y-3">
                {data.paymentRetryQueue.length === 0 ? <EmptyState title="No payment retry queue" description="Create the first payment retry queue record." /> : data.paymentRetryQueue.map((item) => (
                    <ListCard key={item.id} title={String(item.queueKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.queueKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create payment retry queue" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPaymentRetryQueue(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("queueKey")} placeholder="queueKey" className={inputClass} />
                <input {...form.register("transactionRef")} placeholder="transactionRef" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PaymentTransactionsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<paymentTransactionsFormValues>({ resolver: zodResolver(paymentTransactionsFormSchema), defaultValues: {"integrationHubId":"","transactionKey":"","amount":0,"transactionStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Payment Transactions" description="Enterprise integration platform payment transactions" /><div className="mt-6 space-y-3">
                {data.paymentTransactions.length === 0 ? <EmptyState title="No payment transactions" description="Create the first payment transactions record." /> : data.paymentTransactions.map((item) => (
                    <ListCard key={item.id} title={String(item.transactionKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.transactionKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create payment transactions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPaymentTransaction(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("transactionKey")} placeholder="transactionKey" className={inputClass} />
                <input type="number" step="any" {...form.register("amount", { valueAsNumber: true })} placeholder="amount" className={inputClass} />
                <select {...form.register("transactionStatus")} className={inputClass}>{API_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AccountingConnectorsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<accountingConnectorsFormValues>({ resolver: zodResolver(accountingConnectorsFormSchema), defaultValues: {"integrationHubId":"","connectorKey":"","connectorName":"","providerType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Accounting Connectors" description="Enterprise integration platform accounting connectors" /><div className="mt-6 space-y-3">
                {data.accountingConnectors.length === 0 ? <EmptyState title="No accounting connectors" description="Create the first accounting connectors record." /> : data.accountingConnectors.map((item) => (
                    <ListCard key={item.id} title={String(item.connectorName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.connectorKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create accounting connectors" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAccountingConnector(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("connectorKey")} placeholder="connectorKey" className={inputClass} />
                <input {...form.register("connectorName")} placeholder="connectorName" className={inputClass} />
                <select {...form.register("providerType")} className={inputClass}>{PROVIDER_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AccountingSyncStatussPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<accountingSyncStatusFormValues>({ resolver: zodResolver(accountingSyncStatusFormSchema), defaultValues: {"integrationHubId":"","syncKey":"","entityType":"","syncStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Accounting Sync Status" description="Enterprise integration platform accounting sync status" /><div className="mt-6 space-y-3">
                {data.accountingSyncStatus.length === 0 ? <EmptyState title="No accounting sync status" description="Create the first accounting sync status record." /> : data.accountingSyncStatus.map((item) => (
                    <ListCard key={item.id} title={String(item.syncKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.entityType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create accounting sync status" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAccountingSyncStatus(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("syncKey")} placeholder="syncKey" className={inputClass} />
                <input {...form.register("entityType")} placeholder="entityType" className={inputClass} />
                <select {...form.register("syncStatus")} className={inputClass}>{CONNECTOR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ExportMappingsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<exportMappingsFormValues>({ resolver: zodResolver(exportMappingsFormSchema), defaultValues: {"integrationHubId":"","mappingKey":"","mappingName":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Export Mappings" description="Enterprise integration platform export mappings" /><div className="mt-6 space-y-3">
                {data.exportMappings.length === 0 ? <EmptyState title="No export mappings" description="Create the first export mappings record." /> : data.exportMappings.map((item) => (
                    <ListCard key={item.id} title={String(item.mappingName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.mappingKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create export mappings" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createExportMapping(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("mappingKey")} placeholder="mappingKey" className={inputClass} />
                <input {...form.register("mappingName")} placeholder="mappingName" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AccountingExportsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<accountingExportsFormValues>({ resolver: zodResolver(accountingExportsFormSchema), defaultValues: {"integrationHubId":"","exportKey":"","exportType":"","exportStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Accounting Exports" description="Enterprise integration platform accounting exports" /><div className="mt-6 space-y-3">
                {data.accountingExports.length === 0 ? <EmptyState title="No accounting exports" description="Create the first accounting exports record." /> : data.accountingExports.map((item) => (
                    <ListCard key={item.id} title={String(item.exportKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.exportType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create accounting exports" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAccountingExport(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("exportKey")} placeholder="exportKey" className={inputClass} />
                <input {...form.register("exportType")} placeholder="exportType" className={inputClass} />
                <select {...form.register("exportStatus")} className={inputClass}>{API_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ApiKeysPanel({ data }: { data: IntegrationPlatformData }) {
    const [issuedToken, setIssuedToken] = useState<string | null>(null);
    const [managementError, setManagementError] = useState<string | null>(null);
    const [busyKeyId, setBusyKeyId] = useState<string | null>(null);
    const form = useForm<apiKeysFormValues>({ resolver: zodResolver(apiKeysFormSchema), defaultValues: { integrationHubId: "", keyName: "", apiVersion: "v1" } });
    const manageKey = async (item: (typeof data.apiKeys)[number], action: "rotate" | "revoke") => {
        const confirmed = action === "revoke"
            ? window.confirm("Revoke this API key? Existing integrations using it will stop working.")
            : window.confirm("Rotate this API key? The old secret will stop working immediately.");
        if (!confirmed) return;
        setBusyKeyId(item.id);
        setManagementError(null);
        try {
            const token = await data.manageApiKey({ action, apiKeyId: item.id, integrationHubId: item.integrationHubId });
            setIssuedToken(token);
        } catch (error) {
            setManagementError(error instanceof Error ? error.message : "Unable to manage API key");
        } finally {
            setBusyKeyId(null);
        }
    };
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover>
                <SectionHeader title="API Keys" description="Organization-scoped API credentials. Secret values are never stored or displayed again." />
                <div className="mt-6 space-y-3">
                    {data.apiKeys.length === 0 ? <EmptyState title="No API keys" description="Issue the first API key for an integration hub." /> : data.apiKeys.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                            <ListCard title={String(item.keyName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.apiVersion}`} meta={item.status} />
                            {item.status === "active" ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <button type="button" disabled={busyKeyId === item.id} onClick={() => void manageKey(item, "rotate")} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold disabled:opacity-50 dark:border-slate-700"> {busyKeyId === item.id ? "Please wait…" : "Rotate key"} </button>
                                    <button type="button" disabled={busyKeyId === item.id} onClick={() => void manageKey(item, "revoke")} className="rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-50 dark:border-red-900 dark:text-red-300">Revoke</button>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </Card>
            <Card hover>
                <SectionHeader title="Issue API key" description="Only organization owners and administrators can issue keys." />
                <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (values) => {
                    const token = await data.createApiKey(values);
                    setIssuedToken(token);
                    form.reset({ integrationHubId: "", keyName: "", apiVersion: "v1" });
                })}>
                    <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                    <input {...form.register("keyName")} placeholder="Key name" className={inputClass} />
                    <select {...form.register("apiVersion")} className={inputClass}>
                        {API_VERSION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    <SaveButton loading={form.formState.isSubmitting} label="Issue one-time key" />
                </form>
                {managementError ? <p role="alert" className="mt-4 text-sm text-red-600">{managementError}</p> : null}
                {issuedToken ? (
                    <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Copy this secret now</p>
                        <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">This is the only time the full key will be shown. It cannot be recovered later.</p>
                        <input aria-label="New API key secret" readOnly value={issuedToken} onFocus={(event) => event.currentTarget.select()} className="mt-3 w-full rounded-xl border border-amber-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 dark:bg-slate-950 dark:text-slate-100" />
                    </div>
                ) : null}
            </Card>
        </div>
    );
}

export function ApiScopesPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<apiScopesFormValues>({ resolver: zodResolver(apiScopesFormSchema), defaultValues: {"integrationHubId":"","scopeKey":"","scopeName":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Api Scopes" description="Enterprise integration platform api scopes" /><div className="mt-6 space-y-3">
                {data.apiScopes.length === 0 ? <EmptyState title="No api scopes" description="Create the first api scopes record." /> : data.apiScopes.map((item) => (
                    <ListCard key={item.id} title={String(item.scopeName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.scopeKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create api scopes" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createApiScope(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("scopeKey")} placeholder="scopeKey" className={inputClass} />
                <input {...form.register("scopeName")} placeholder="scopeName" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RateLimitsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<rateLimitsFormValues>({ resolver: zodResolver(rateLimitsFormSchema), defaultValues: {"integrationHubId":"","limitKey":"","limitName":"","rateLimitRpm":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Rate Limits" description="Enterprise integration platform rate limits" /><div className="mt-6 space-y-3">
                {data.rateLimits.length === 0 ? <EmptyState title="No rate limits" description="Create the first rate limits record." /> : data.rateLimits.map((item) => (
                    <ListCard key={item.id} title={String(item.limitName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.limitKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create rate limits" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRateLimit(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("limitKey")} placeholder="limitKey" className={inputClass} />
                <input {...form.register("limitName")} placeholder="limitName" className={inputClass} />
                <input type="number" step="any" {...form.register("rateLimitRpm", { valueAsNumber: true })} placeholder="rateLimitRpm" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ApiUsagesPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<apiUsageFormValues>({ resolver: zodResolver(apiUsageFormSchema), defaultValues: {"integrationHubId":"","usageKey":"","endpoint":"","requestCount":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Api Usage" description="Enterprise integration platform api usage" /><div className="mt-6 space-y-3">
                {data.apiUsage.length === 0 ? <EmptyState title="No api usage" description="Create the first api usage record." /> : data.apiUsage.map((item) => (
                    <ListCard key={item.id} title={String(item.usageKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.requestCount} requests`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create api usage" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createApiUsage(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("usageKey")} placeholder="usageKey" className={inputClass} />
                <input {...form.register("endpoint")} placeholder="endpoint" className={inputClass} />
                <input type="number" step="any" {...form.register("requestCount", { valueAsNumber: true })} placeholder="requestCount" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IncomingWebhooksPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<incomingWebhooksFormValues>({ resolver: zodResolver(incomingWebhooksFormSchema), defaultValues: {"integrationHubId":"","webhookKey":"","webhookName":"","providerType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Incoming Webhooks" description="Enterprise integration platform incoming webhooks" /><div className="mt-6 space-y-3">
                {data.incomingWebhooks.length === 0 ? <EmptyState title="No incoming webhooks" description="Create the first incoming webhooks record." /> : data.incomingWebhooks.map((item) => (
                    <ListCard key={item.id} title={String(item.webhookName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.webhookKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create incoming webhooks" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIncomingWebhook(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("webhookKey")} placeholder="webhookKey" className={inputClass} />
                <input {...form.register("webhookName")} placeholder="webhookName" className={inputClass} />
                <select {...form.register("providerType")} className={inputClass}>{PROVIDER_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OutgoingWebhooksPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<outgoingWebhooksFormValues>({ resolver: zodResolver(outgoingWebhooksFormSchema), defaultValues: {"integrationHubId":"","webhookKey":"","webhookName":"","targetUrl":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Outgoing Webhooks" description="Enterprise integration platform outgoing webhooks" /><div className="mt-6 space-y-3">
                {data.outgoingWebhooks.length === 0 ? <EmptyState title="No outgoing webhooks" description="Create the first outgoing webhooks record." /> : data.outgoingWebhooks.map((item) => (
                    <ListCard key={item.id} title={String(item.webhookName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.webhookKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create outgoing webhooks" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOutgoingWebhook(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("webhookKey")} placeholder="webhookKey" className={inputClass} />
                <input {...form.register("webhookName")} placeholder="webhookName" className={inputClass} />
                <input {...form.register("targetUrl")} placeholder="targetUrl" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WebhookDeadLettersPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<webhookDeadLetterFormValues>({ resolver: zodResolver(webhookDeadLetterFormSchema), defaultValues: {"integrationHubId":"","deadLetterKey":"","eventType":"","deadLetterStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Webhook Dead Letter" description="Enterprise integration platform webhook dead letter" /><div className="mt-6 space-y-3">
                {data.webhookDeadLetter.length === 0 ? <EmptyState title="No webhook dead letter" description="Create the first webhook dead letter record." /> : data.webhookDeadLetter.map((item) => (
                    <ListCard key={item.id} title={String(item.deadLetterKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.deadLetterStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create webhook dead letter" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWebhookDeadLetter(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("deadLetterKey")} placeholder="deadLetterKey" className={inputClass} />
                <input {...form.register("eventType")} placeholder="eventType" className={inputClass} />
                <select {...form.register("deadLetterStatus")} className={inputClass}>{API_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WebhookDeliveryLogsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<webhookDeliveryLogsFormValues>({ resolver: zodResolver(webhookDeliveryLogsFormSchema), defaultValues: {"integrationHubId":"","deliveryKey":"","eventType":"","deliveryStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Webhook Delivery Logs" description="Enterprise integration platform webhook delivery logs" /><div className="mt-6 space-y-3">
                {data.webhookDeliveryLogs.length === 0 ? <EmptyState title="No webhook delivery logs" description="Create the first webhook delivery logs record." /> : data.webhookDeliveryLogs.map((item) => (
                    <ListCard key={item.id} title={String(item.deliveryKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.deliveryStatus}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create webhook delivery logs" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWebhookDeliveryLog(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("deliveryKey")} placeholder="deliveryKey" className={inputClass} />
                <input {...form.register("eventType")} placeholder="eventType" className={inputClass} />
                <select {...form.register("deliveryStatus")} className={inputClass}>{API_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MarketplaceConnectorsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<marketplaceConnectorsFormValues>({ resolver: zodResolver(marketplaceConnectorsFormSchema), defaultValues: {"integrationHubId":"","connectorSlug":"","connectorName":"","providerType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Marketplace Connectors" description="Enterprise integration platform marketplace connectors" /><div className="mt-6 space-y-3">
                {data.marketplaceConnectors.length === 0 ? <EmptyState title="No marketplace connectors" description="Create the first marketplace connectors record." /> : data.marketplaceConnectors.map((item) => (
                    <ListCard key={item.id} title={String(item.connectorName)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.connectorSlug}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create marketplace connectors" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMarketplaceConnector(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("connectorSlug")} placeholder="connectorSlug" className={inputClass} />
                <input {...form.register("connectorName")} placeholder="connectorName" className={inputClass} />
                <select {...form.register("providerType")} className={inputClass}>{PROVIDER_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MarketplaceInstallationsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<marketplaceInstallationsFormValues>({ resolver: zodResolver(marketplaceInstallationsFormSchema), defaultValues: {"integrationHubId":"","installationKey":"","connectorStatus":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Marketplace Installations" description="Enterprise integration platform marketplace installations" /><div className="mt-6 space-y-3">
                {data.marketplaceInstallations.length === 0 ? <EmptyState title="No marketplace installations" description="Create the first marketplace installations record." /> : data.marketplaceInstallations.map((item) => (
                    <ListCard key={item.id} title={String(item.installationKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.installationKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create marketplace installations" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMarketplaceInstallation(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("installationKey")} placeholder="installationKey" className={inputClass} />
                <select {...form.register("connectorStatus")} className={inputClass}>{CONNECTOR_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MarketplaceCompatibilitysPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<marketplaceCompatibilityFormValues>({ resolver: zodResolver(marketplaceCompatibilityFormSchema), defaultValues: {"integrationHubId":"","compatibilityKey":"","minApiVersion":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Marketplace Compatibility" description="Enterprise integration platform marketplace compatibility" /><div className="mt-6 space-y-3">
                {data.marketplaceCompatibility.length === 0 ? <EmptyState title="No marketplace compatibility" description="Create the first marketplace compatibility record." /> : data.marketplaceCompatibility.map((item) => (
                    <ListCard key={item.id} title={String(item.compatibilityKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.minApiVersion}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create marketplace compatibility" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMarketplaceCompatibility(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("compatibilityKey")} placeholder="compatibilityKey" className={inputClass} />
                <select {...form.register("minApiVersion")} className={inputClass}>{API_VERSION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MarketplaceVersionsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<marketplaceVersionsFormValues>({ resolver: zodResolver(marketplaceVersionsFormSchema), defaultValues: {"integrationHubId":"","versionKey":"","versionNumber":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Marketplace Versions" description="Enterprise integration platform marketplace versions" /><div className="mt-6 space-y-3">
                {data.marketplaceVersions.length === 0 ? <EmptyState title="No marketplace versions" description="Create the first marketplace versions record." /> : data.marketplaceVersions.map((item) => (
                    <ListCard key={item.id} title={String(item.versionNumber)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.versionKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create marketplace versions" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMarketplaceVersion(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("versionKey")} placeholder="versionKey" className={inputClass} />
                <input {...form.register("versionNumber")} placeholder="versionNumber" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ApiAnalyticssPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<apiAnalyticsFormValues>({ resolver: zodResolver(apiAnalyticsFormSchema), defaultValues: {"integrationHubId":"","analyticsKey":"","errorRate":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Api Analytics" description="Enterprise integration platform api analytics" /><div className="mt-6 space-y-3">
                {data.apiAnalytics.length === 0 ? <EmptyState title="No api analytics" description="Create the first api analytics record." /> : data.apiAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create api analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createApiAnalytics(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("errorRate", { valueAsNumber: true })} placeholder="errorRate" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LatencyMetricsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<latencyMetricsFormValues>({ resolver: zodResolver(latencyMetricsFormSchema), defaultValues: {"integrationHubId":"","metricsKey":"","p95Ms":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Latency Metrics" description="Enterprise integration platform latency metrics" /><div className="mt-6 space-y-3">
                {data.latencyMetrics.length === 0 ? <EmptyState title="No latency metrics" description="Create the first latency metrics record." /> : data.latencyMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.metricsKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create latency metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLatencyMetric(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("p95Ms", { valueAsNumber: true })} placeholder="p95Ms" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function WebhookAnalyticssPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<webhookAnalyticsFormValues>({ resolver: zodResolver(webhookAnalyticsFormSchema), defaultValues: {"integrationHubId":"","analyticsKey":"","successRate":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Webhook Analytics" description="Enterprise integration platform webhook analytics" /><div className="mt-6 space-y-3">
                {data.webhookAnalytics.length === 0 ? <EmptyState title="No webhook analytics" description="Create the first webhook analytics record." /> : data.webhookAnalytics.map((item) => (
                    <ListCard key={item.id} title={String(item.analyticsKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.analyticsKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create webhook analytics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createWebhookAnalytics(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("analyticsKey")} placeholder="analyticsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("successRate", { valueAsNumber: true })} placeholder="successRate" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function UsageTrendsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<usageTrendsFormValues>({ resolver: zodResolver(usageTrendsFormSchema), defaultValues: {"integrationHubId":"","trendKey":"","trendDirection":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Usage Trends" description="Enterprise integration platform usage trends" /><div className="mt-6 space-y-3">
                {data.usageTrends.length === 0 ? <EmptyState title="No usage trends" description="Create the first usage trends record." /> : data.usageTrends.map((item) => (
                    <ListCard key={item.id} title={String(item.trendKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.trendDirection}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create usage trends" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createUsageTrend(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("trendKey")} placeholder="trendKey" className={inputClass} />
                <input {...form.register("trendDirection")} placeholder="trendDirection" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IntegrationMetricsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<integrationMetricsFormValues>({ resolver: zodResolver(integrationMetricsFormSchema), defaultValues: {"metricsKey":"","overallSuccessRate":0} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Integration Metrics" description="Enterprise integration platform integration metrics" /><div className="mt-6 space-y-3">
                {data.integrationMetrics.length === 0 ? <EmptyState title="No integration metrics" description="Create the first integration metrics record." /> : data.integrationMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${(item.overallSuccessRate ?? 0).toFixed(1)}% success rate`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create integration metrics" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIntegrationMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="metricsKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallSuccessRate", { valueAsNumber: true })} placeholder="overallSuccessRate" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IntegrationHealthsPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<integrationHealthFormValues>({ resolver: zodResolver(integrationHealthFormSchema), defaultValues: {"healthKey":"","overallScore":0,"disasterRecoveryMode":false} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Integration Health" description="Enterprise integration platform integration health" /><div className="mt-6 space-y-3">
                {data.integrationHealth.length === 0 ? <EmptyState title="No integration health" description="Create the first integration health record." /> : data.integrationHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`Score ${item.overallScore}${item.disasterRecoveryMode ? " • DR mode" : ""}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create integration health" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIntegrationHealth(v))}>
                <input {...form.register("healthKey")} placeholder="healthKey" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="overallScore" className={inputClass} />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("disasterRecoveryMode")} /> disasterRecoveryMode</label>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IntegrationFailuresPanel({ data }: { data: IntegrationPlatformData }) {
    const form = useForm<integrationFailuresFormValues>({ resolver: zodResolver(integrationFailuresFormSchema), defaultValues: {"integrationHubId":"","failureKey":"","providerType":""} });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Integration Failures" description="Enterprise integration platform integration failures" /><div className="mt-6 space-y-3">
                {data.integrationFailures.length === 0 ? <EmptyState title="No integration failures" description="Create the first integration failures record." /> : data.integrationFailures.map((item) => (
                    <ListCard key={item.id} title={String(item.failureKey)} subtitle={`${item.hubName ? item.hubName + " • " : ""}${item.providerType}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create integration failures" description="Add a new record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIntegrationFailure(v))}>
                <IntegrationHubSelect data={data} {...form.register("integrationHubId")} />
                <input {...form.register("failureKey")} placeholder="failureKey" className={inputClass} />
                <select {...form.register("providerType")} className={inputClass}>{PROVIDER_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IntegrationPlatformAuditLogsPanel({ data }: { data: IntegrationPlatformData }) {
    return (
        <Card hover><SectionHeader title="Integration Platform audit history" description="Security-first audit trail for connectors, API keys, webhooks, and marketplace operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for integration operations." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
            ))}
        </div></Card>
    );
}

export function IntegrationPlatformSdkPanel({ data }: { data: IntegrationPlatformData }) {
    return (
        <Card hover><SectionHeader title="Shared Integration Platform SDK" description="Import from @/src/modules/integration-platform/sdk for service connection, API key issuance, and webhook registration" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createIntegrationPlatformClient()" subtitle="Factory for module-scoped Integration Platform client with auth context" meta="Primary SDK for enterprise integration operations" />
            <ListCard title="sdkConnectService()" subtitle="Connect external service with AI orchestration" meta="moduleSource: integration_platform" />
            <ListCard title="sdkIssueApiKey()" subtitle="Issue API key with knowledge context" meta="v1/v2/v3 API versions" />
            <ListCard title="sdkRegisterWebhook()" subtitle="Register outgoing webhook with audit trail" meta="Event-driven integration delivery" />
            <p className="text-xs text-slate-500">Theme: {INTG_THEME.primary} • Integration hubs loaded: {data.integrationHubs.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createIntegrationPlatformClient } from "@/src/modules/integration-platform/sdk";

const intg = createIntegrationPlatformClient(userId, email, fullName);
await intg.connectService({ integrationHubId, serviceKey: "svc-001", serviceName: "Stripe" });
await intg.issueApiKey({ integrationHubId, keyName: "prod-key", apiVersion: "v1" });
await intg.registerWebhook({ integrationHubId, webhookKey: "wh-001", webhookName: "Events" });`}</pre>
        </div></Card>
    );
}
