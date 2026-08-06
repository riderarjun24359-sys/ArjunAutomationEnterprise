"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type {
    ApiKeyManagementItem,
    ApiUsageAnalyticsMetrics,
    DeveloperPortalItem,
    IntegrationAuditItem,
    MarketplaceItem,
    OauthIntegrationItem,
    RestApiGatewayItem,
    ThirdPartyIntegrationItem,
    WebhookEngineItem,
    WorkflowTriggerItem,
} from "../../types/os";
import { KNOWN_THIRD_PARTY_PROVIDERS } from "../../types/os";
import { displayProviderName } from "../../utils/formatters";

export function GatewayPanel({ items }: { items: RestApiGatewayItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No API gateways" description="REST API gateways load from live intg_integration_hubs in Supabase." />;
    }
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.hubName}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.hubKey}</p>
                        </div>
                        <Badge variant={item.status.toLowerCase() === "active" ? "success" : "warning"}>{item.status}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>Env {item.environment}</span>
                        <span>Keys {item.apiKeyCount}</span>
                        <span>RPM {item.rateLimitRpm}</span>
                        <span>Requests {item.usageRequests}</span>
                        <span className="col-span-2">Errors {item.usageErrors}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}

export function ApiKeysPanel({ items }: { items: ApiKeyManagementItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No API keys" description="API key management loads from live intg_api_keys in Supabase." />;
    }
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.keyName}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.keyPrefix}… · {item.hubName}</p>
                        </div>
                        <Badge variant={item.status.toLowerCase() === "active" ? "success" : "warning"}>{item.status}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>Version {item.apiVersion}</span>
                        <span>Scopes {item.scopes.length}</span>
                        <span>Expires {item.expiresAt ?? "—"}</span>
                        <span>Last used {item.lastUsedAt ? new Date(item.lastUsedAt).toLocaleString() : "—"}</span>
                        {item.scopes.length ? <span className="col-span-2">{item.scopes.join(", ")}</span> : null}
                    </div>
                </Card>
            ))}
        </div>
    );
}

export function WebhooksPanel({ items }: { items: WebhookEngineItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No webhooks" description="Webhook engine loads incoming/outgoing webhooks and delivery logs from Supabase." />;
    }
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.name}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.hubName} · {item.direction}</p>
                        </div>
                        <Badge variant={item.enabled ? "success" : "warning"}>{item.enabled ? "enabled" : "disabled"}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span className="col-span-2 truncate">{item.providerOrTarget}</span>
                        <span>Deliveries {item.recentDeliveries}</span>
                        <span>Failures {item.failureCount}</span>
                        <span>Status {item.status}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}

export function OauthPanel({ items }: { items: OauthIntegrationItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No OAuth integrations" description="OAuth integrations load from connected services and connector configs in Supabase." />;
    }
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.serviceName}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.providerType} · {item.hubName}</p>
                        </div>
                        <Badge variant={item.healthScore >= 80 ? "success" : "warning"}>Health {item.healthScore}</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                        <span>{item.connectorStatus}</span>
                        <span>API {item.apiVersion}</span>
                        <span>Status {item.status}</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}

export function ThirdPartyPanel({ items }: { items: ThirdPartyIntegrationItem[] }) {
    return (
        <div className="space-y-4">
            <Card>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">Supported providers</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                    {KNOWN_THIRD_PARTY_PROVIDERS.map((p) => (
                        <Badge key={p} variant="info">
                            {displayProviderName(p)}
                        </Badge>
                    ))}
                </div>
            </Card>
            {items.length === 0 ? (
                <EmptyState title="No third-party connectors" description="Connect Google Workspace, Microsoft 365, Slack, WhatsApp, Stripe, Razorpay, or Zoom via live Supabase connector rows." />
            ) : (
                <div className="grid gap-3 lg:grid-cols-2">
                    {items.map((item) => (
                        <Card key={item.id}>
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-semibold text-[var(--dos-text-primary)]">{item.displayName}</p>
                                    <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.category} · {item.source}</p>
                                </div>
                                <Badge variant={item.connectorStatus.toLowerCase() === "connected" ? "success" : "warning"}>
                                    {item.connectorStatus}
                                </Badge>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--dos-text-secondary)]">
                                <span>Status {item.status}</span>
                                <span>Health {item.healthScore}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export function MarketplacePanel({ items }: { items: MarketplaceItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No marketplace listings" description="Integration marketplace loads from live marketplace connectors and installations." />;
    }
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.name}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.slug} · {item.category}</p>
                        </div>
                        <Badge variant={item.installed ? "success" : "info"}>{item.installed ? "installed" : item.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{item.description || item.providerType}</p>
                    {item.installationStatus ? (
                        <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">Install status {item.installationStatus}</p>
                    ) : null}
                </Card>
            ))}
        </div>
    );
}

export function TriggersPanel({ items }: { items: WorkflowTriggerItem[] }) {
    if (items.length === 0) {
        return <EmptyState title="No workflow triggers" description="Triggers load from automation workflows and DWE webhook/event/time triggers in Supabase." />;
    }
    return (
        <div className="grid gap-3 lg:grid-cols-2">
            {items.map((item) => (
                <Card key={item.id}>
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.name}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.source} · {item.triggerType}</p>
                        </div>
                        <Badge variant={item.active ? "success" : "warning"}>{item.active ? "active" : "inactive"}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{item.detail}</p>
                </Card>
            ))}
        </div>
    );
}

export function AnalyticsPanel({ analytics }: { analytics: ApiUsageAnalyticsMetrics }) {
    if (analytics.totalRequests === 0 && analytics.topEndpoints.length === 0 && analytics.dailyTrend.length === 0) {
        return <EmptyState title="No API analytics" description="Usage analytics load from intg_api_usage, intg_api_analytics, and latency metrics." />;
    }
    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Requests</p>
                    <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">{analytics.totalRequests.toLocaleString()}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Errors</p>
                    <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">{analytics.totalErrors.toLocaleString()}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Error rate</p>
                    <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">{analytics.errorRate}%</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">P95 latency</p>
                    <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">{analytics.avgLatencyP95Ms}ms</p>
                </Card>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">Top endpoints</p>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                        {analytics.topEndpoints.length === 0 ? (
                            <li>No endpoint usage yet</li>
                        ) : (
                            analytics.topEndpoints.map((e) => (
                                <li key={e.endpoint} className="flex justify-between gap-2">
                                    <span className="truncate">{e.endpoint}</span>
                                    <span>
                                        {e.requests} / err {e.errors}
                                    </span>
                                </li>
                            ))
                        )}
                    </ul>
                </Card>
                <Card>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">Daily trend</p>
                    <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                        {analytics.dailyTrend.length === 0 ? (
                            <li>No daily analytics yet</li>
                        ) : (
                            analytics.dailyTrend.map((d) => (
                                <li key={d.date} className="flex justify-between gap-2">
                                    <span>{d.date}</span>
                                    <span>
                                        {d.requests} / err {d.errors}
                                    </span>
                                </li>
                            ))
                        )}
                    </ul>
                </Card>
            </div>
        </div>
    );
}

export function DeveloperPortalPanel({
    items,
    auditTrail,
}: {
    items: DeveloperPortalItem[];
    auditTrail: IntegrationAuditItem[];
}) {
    if (items.length === 0) {
        return <EmptyState title="Developer portal empty" description="Developer portal aggregates live API keys, scopes, marketplace, webhooks, and rate limits." />;
    }
    return (
        <div className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-2">
                {items.map((item) => (
                    <Card key={item.id}>
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="font-semibold text-[var(--dos-text-primary)]">{item.title}</p>
                                <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{item.kind}</p>
                            </div>
                            <Badge variant="info">{item.status}</Badge>
                        </div>
                        <p className="mt-2 text-sm text-[var(--dos-text-secondary)]">{item.summary}</p>
                    </Card>
                ))}
            </div>
            <Card>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">Integration Audit Trail</p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                    {auditTrail.length === 0 ? (
                        <li>No integration audit events yet</li>
                    ) : (
                        auditTrail.map((a) => (
                            <li key={a.id}>
                                {a.summary} · {a.action} · {a.entityType} · {a.securityLevel} · {new Date(a.occurredAt).toLocaleString()}
                            </li>
                        ))
                    )}
                </ul>
            </Card>
        </div>
    );
}

export function AiIntegrationAssistantPanel({
    assistant,
}: {
    assistant: {
        dailySummary: string;
        attentionItems: string[];
        webhookRecommendations: string[];
        connectorInsights: string[];
        securityInsights: string[];
        executiveSummary: string;
        generatedAt: string;
    };
}) {
    if (!assistant.dailySummary) {
        return <EmptyState title="No AI summary" description="Assistant output is generated from the live Integration Hub snapshot." />;
    }
    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Daily Summary</h3>
                <p className="mt-3 text-sm text-[var(--dos-text-primary)]">{assistant.dailySummary}</p>
                <p className="mt-3 text-xs text-[var(--dos-text-tertiary)]">Generated {new Date(assistant.generatedAt).toLocaleString()}</p>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Executive Summary</h3>
                <p className="mt-3 text-sm text-[var(--dos-text-primary)]">{assistant.executiveSummary}</p>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Attention</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {assistant.attentionItems.length === 0 ? (
                        <p className="text-sm text-[var(--dos-text-tertiary)]">None right now</p>
                    ) : (
                        assistant.attentionItems.map((c) => (
                            <Badge key={c} variant="warning">
                                {c}
                            </Badge>
                        ))
                    )}
                </div>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Webhook Recommendations</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                    {assistant.webhookRecommendations.map((h) => (
                        <li key={h}>• {h}</li>
                    ))}
                </ul>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Connector Insights</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                    {assistant.connectorInsights.length === 0 ? <li>No connectors yet</li> : assistant.connectorInsights.map((h) => <li key={h}>• {h}</li>)}
                </ul>
            </Card>
            <Card>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">Security Insights</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">
                    {assistant.securityInsights.map((h) => (
                        <li key={h}>• {h}</li>
                    ))}
                </ul>
            </Card>
        </div>
    );
}
