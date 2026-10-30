"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    AiProviderCenter,
    CalendarProductivityBoard,
    CloudStorageBoard,
    EmailIntegrationBoard,
    ExecutiveIntegrationDashboard,
    IntegrationHealthDashboard,
    PaymentIntegrationCenter,
    SecretsManagerBoard,
    SocialPublishingHub,
    WebhookManagerBoard,
} from "../types";

function Metric({ label, value }: { label: string; value: string | number }) {
    return (
        <Card>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--dos-text-tertiary)]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--dos-text-primary)]">{value}</p>
        </Card>
    );
}

function Table({ headers, rows, empty }: { headers: string[]; rows: string[][]; empty: string }) {
    if (!rows.length) {
        return <EmptyState title={empty} description="Live tenant data will appear when records exist in Supabase." />;
    }
    return (
        <div className="overflow-x-auto rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)]">
            <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-tertiary)]">
                    <tr>
                        {headers.map((h) => (
                            <th key={h} className="px-3 py-2 font-medium">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="border-t border-[var(--dos-border)]">
                            {row.map((cell, j) => (
                                <td key={j} className="px-3 py-2 text-[var(--dos-text-secondary)]">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function AiProviderCenterPanel({ aiProviders }: { aiProviders: AiProviderCenter }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="OpenAI provider" value={aiProviders.openaiConfigured ? "Configured" : "Pending"} />
                <Metric label="Multi-provider" value={aiProviders.multiProviderReady ? "Ready" : "Single"} />
                <Metric label="Usage tracking" value={aiProviders.totalUsage} />
                <Metric label="Cost tracking" value={`₹${aiProviders.totalCostUsd}`} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">AI Provider Center</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    OpenAI provider configuration · Multi-provider architecture · Model selection · Usage tracking · Cost
                    tracking · Rate limit monitoring
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {aiProviders.rateLimitMonitors.map((r) => (
                        <Badge key={r.name} variant="info">
                            Rate limit {r.name}: {r.rpm} rpm
                        </Badge>
                    ))}
                </div>
                <Table
                    headers={["Name", "Provider", "Model", "Status", "Usage", "Errors", "Cost", "RPM"]}
                    rows={aiProviders.rows.map((r) => [
                        r.name,
                        r.provider,
                        r.model,
                        r.status,
                        String(r.usageRequests),
                        String(r.errorCount),
                        `₹${r.estimatedCostUsd}`,
                        String(r.rateLimitRpm),
                    ])}
                    empty="No AI providers"
                />
            </Card>
        </div>
    );
}

export function SecretsManagerPanel({ secrets }: { secrets: SecretsManagerBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Vault secrets" value={secrets.vaultSecrets.length} />
                <Metric label="API key metadata" value={secrets.apiKeys.length} />
                <Metric label="Env validation" value={`${secrets.envConfiguredCount}/${secrets.envHealth.length}`} />
                <Metric label="Rotation reminders" value={secrets.rotationReminders} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Secrets Manager</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Encrypted API key storage · Environment validation · Secret health checks · Rotation reminders
                </p>
                <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">
                    Secret values are never displayed — only presence, prefixes, and vault references.
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Secret", "Vault ref", "Health", "Rotation due", "Status"]}
                        rows={secrets.vaultSecrets.map((s) => [
                            s.name,
                            s.vaultRef,
                            s.health,
                            s.rotationDueAt || "—",
                            s.status,
                        ])}
                        empty="No vault secrets"
                    />
                    <Table
                        headers={["Env key", "Configured", "Category"]}
                        rows={secrets.envHealth.map((e) => [
                            e.key,
                            e.configured ? "yes" : "no",
                            e.category,
                        ])}
                        empty="No env checks"
                    />
                </div>
                <div className="mt-4">
                    <Table
                        headers={["Key name", "Prefix", "Last used", "Expires", "Status"]}
                        rows={secrets.apiKeys.map((k) => [
                            k.name,
                            k.prefix,
                            k.lastUsedAt || "—",
                            k.expiresAt || "—",
                            k.status,
                        ])}
                        empty="No API key metadata"
                    />
                </div>
            </Card>
        </div>
    );
}

export function EmailIntegrationPanel({ email }: { email: EmailIntegrationBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="SMTP configuration" value={email.smtpArchitecture ? "Ready" : "Pending"} />
                <Metric label="Channels" value={email.channels.length} />
                <Metric label="Retry queue" value={email.retryQueue} />
                <Metric label="Templates" value={email.templates.length} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Email Integration</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    SMTP configuration · Transactional email architecture · Delivery logs · Retry queue · Template management
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Channel", "Type", "Enabled", "Status"]}
                        rows={email.channels.map((c) => [
                            c.name,
                            c.type,
                            c.enabled ? "yes" : "no",
                            c.status,
                        ])}
                        empty="No email channels"
                    />
                    <Table
                        headers={["Template", "Status"]}
                        rows={email.templates.map((t) => [t.name, t.status])}
                        empty="No templates"
                    />
                </div>
                <div className="mt-4">
                    <Table
                        headers={["Recipient", "Subject", "Status", "Delivered", "Failure"]}
                        rows={email.deliveryLogs.map((d) => [
                            d.recipient,
                            d.subject,
                            d.status,
                            d.deliveredAt || "—",
                            d.failure || "—",
                        ])}
                        empty="No delivery logs"
                    />
                </div>
            </Card>
        </div>
    );
}

export function SocialPublishingPanel({ social }: { social: SocialPublishingHub }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {social.byPlatform.map((p) => (
                    <Metric key={p.platform} label={p.platform} value={p.count} />
                ))}
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Social Publishing Hub</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Official integration architecture for LinkedIn · Facebook · Instagram · X · YouTube · Account status ·
                    Publishing queue · Delivery history
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Platform", "Account", "Status", "Architecture"]}
                        rows={social.accounts.map((a) => [a.platform, a.name, a.status, a.architecture])}
                        empty="No social accounts"
                    />
                    <Table
                        headers={["Queue item", "Status", "Detail"]}
                        rows={social.publishingQueue.map((q) => [q.name, q.status, q.detail])}
                        empty="No publishing queue"
                    />
                </div>
                <div className="mt-4">
                    <Table
                        headers={["Event", "Status", "At"]}
                        rows={social.deliveryHistory.map((d) => [d.event, d.status, d.at || "—"])}
                        empty="No delivery history"
                    />
                </div>
            </Card>
        </div>
    );
}

export function PaymentIntegrationPanel({ payments }: { payments: PaymentIntegrationCenter }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Stripe" value={payments.stripeArchitecture ? "Ready" : "Pending"} />
                <Metric label="Razorpay" value={payments.razorpayArchitecture ? "Ready" : "Pending"} />
                <Metric label="Webhook monitoring" value={payments.webhooksMonitored} />
                <Metric label="Retry handling" value={payments.retryQueue} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Payment Integration Center</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Stripe · Razorpay · Webhook monitoring · Payment events · Retry handling
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Connector", "Provider", "Status"]}
                        rows={payments.connectors.map((c) => [c.name, c.provider, c.status])}
                        empty="No payment connectors"
                    />
                    <Table
                        headers={["Provider", "Amount", "Currency", "Status", "At"]}
                        rows={payments.paymentEvents.map((e) => [
                            e.provider,
                            String(e.amount),
                            e.currency,
                            e.status,
                            e.at || "—",
                        ])}
                        empty="No payment events"
                    />
                </div>
            </Card>
        </div>
    );
}

export function CalendarProductivityPanel({ calendar }: { calendar: CalendarProductivityBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Google Calendar" value={calendar.googleArchitecture ? "Ready" : "Pending"} />
                <Metric label="Outlook" value={calendar.outlookArchitecture ? "Ready" : "Pending"} />
                <Metric label="Meeting scheduling" value={calendar.meetings.length} />
                <Metric label="Reminder service" value={calendar.reminders} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Calendar & Productivity</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Google Calendar architecture · Outlook architecture · Meeting scheduling · Reminder service
                </p>
                <Table
                    headers={["Provider", "Name", "Status", "Architecture"]}
                    rows={calendar.providers.map((p) => [p.provider, p.name, p.status, p.architecture])}
                    empty="No calendar providers"
                />
            </Card>
        </div>
    );
}

export function CloudStoragePanel({ storage }: { storage: CloudStorageBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="File storage abstraction" value={storage.abstractionReady ? "Ready" : "Pending"} />
                <Metric label="Upload monitoring" value={storage.uploads.length} />
                <Metric label="Asset library" value={storage.assetLibrary.length} />
                <Metric label="Storage usage" value={storage.storageUsageScore ?? "—"} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Cloud Storage</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    File storage abstraction · Upload monitoring · Asset library · Storage usage
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Upload target", "Status", "Detail"]}
                        rows={storage.uploads.map((u) => [u.name, u.status, u.detail])}
                        empty="No upload targets"
                    />
                    <Table
                        headers={["Asset", "Category", "Status"]}
                        rows={storage.assetLibrary.map((a) => [a.name, a.category, a.status])}
                        empty="No asset library"
                    />
                </div>
            </Card>
        </div>
    );
}

export function WebhookManagerPanel({ webhooks }: { webhooks: WebhookManagerBoard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Incoming webhooks" value={webhooks.incoming.length} />
                <Metric label="Outgoing webhooks" value={webhooks.outgoing.length} />
                <Metric label="Retry policy" value={webhooks.retryPolicy.length} />
                <Metric label="Dead letters" value={webhooks.deadLetters} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Webhook Manager</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Incoming webhooks · Outgoing webhooks · Retry policy · Signature validation · Event logs
                </p>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <Table
                        headers={["Incoming", "Path", "Enabled", "Signature validation", "Status"]}
                        rows={webhooks.incoming.map((w) => [
                            w.name,
                            w.path,
                            w.enabled ? "yes" : "no",
                            w.signatureValidation ? "yes" : "no",
                            w.status,
                        ])}
                        empty="No incoming webhooks"
                    />
                    <Table
                        headers={["Outgoing", "Target", "Enabled", "Signature validation", "Status"]}
                        rows={webhooks.outgoing.map((w) => [
                            w.name,
                            w.target,
                            w.enabled ? "yes" : "no",
                            w.signatureValidation ? "yes" : "no",
                            w.status,
                        ])}
                        empty="No outgoing webhooks"
                    />
                </div>
                <div className="mt-4">
                    <Table
                        headers={["Event", "HTTP", "Status", "Latency ms", "At"]}
                        rows={webhooks.eventLogs.map((e) => [
                            e.event,
                            String(e.httpStatus),
                            e.status,
                            String(e.latencyMs),
                            e.at || "—",
                        ])}
                        empty="No event logs"
                    />
                </div>
            </Card>
        </div>
    );
}

export function IntegrationHealthPanel({ health }: { health: IntegrationHealthDashboard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Metric label="Connected services" value={health.connectedServices} />
                <Metric label="Error monitoring" value={health.errorMonitoring} />
                <Metric label="Uptime" value={health.uptimePercent == null ? "—" : `${health.uptimePercent}%`} />
                <Metric label="Latency" value={health.latencyP95Ms == null ? "—" : `${health.latencyP95Ms} ms`} />
                <Metric label="Overall" value={health.overallScore ?? "—"} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Integration Health Dashboard</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    Connected services · Sync status · Error monitoring · Uptime · Latency
                </p>
                <Table
                    headers={["Entity", "Sync status", "Last sync", "Records"]}
                    rows={health.syncStatus.map((s) => [
                        s.entity,
                        s.status,
                        s.lastSyncAt || "—",
                        String(s.records),
                    ])}
                    empty="No sync status"
                />
            </Card>
        </div>
    );
}

export function ExecutiveIntegrationPanel({ executive }: { executive: ExecutiveIntegrationDashboard }) {
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="AI usage" value={executive.aiUsage} />
                <Metric label="Integration health" value={executive.integrationHealth ?? "—"} />
                <Metric label="Cost overview" value={`₹${executive.costOverviewUsd}`} />
                <Metric label="Failure alerts" value={executive.failureAlerts} />
            </div>
            <Card>
                <h3 className="text-lg font-semibold text-[var(--dos-text-primary)]">Executive Integration Dashboard</h3>
                <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">
                    AI usage · Integration health · Cost overview · Failure alerts · Optimization recommendations
                </p>
                <p className="mt-3 text-sm text-[var(--dos-text-secondary)]">{executive.summary}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--dos-text-secondary)]">
                    {executive.recommendations.map((r) => (
                        <li key={r}>{r}</li>
                    ))}
                </ul>
            </Card>
        </div>
    );
}
