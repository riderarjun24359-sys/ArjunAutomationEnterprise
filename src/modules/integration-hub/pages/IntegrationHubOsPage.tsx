"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { SkeletonLoader } from "@/src/design-os/motion/components/SkeletonLoader";
import { INTEGRATION_HUB_OS_TABS, INTEGRATION_HUB_OS_THEME } from "@/src/modules/integration-hub/constants/os";
import { useIntegrationHubOs } from "@/src/modules/integration-hub/hooks/useIntegrationHubOs";
import { listIntegrationHubPlatformLinks } from "@/src/modules/integration-hub/integrations/platform-bridges";
import type { IntegrationHubOsTab } from "@/src/modules/integration-hub/types/os";
import {
    AiIntegrationAssistantPanel,
    AnalyticsPanel,
    ApiKeysPanel,
    DeveloperPortalPanel,
    GatewayPanel,
    MarketplacePanel,
    OauthPanel,
    ThirdPartyPanel,
    TriggersPanel,
    WebhooksPanel,
} from "@/src/modules/integration-hub/components/os/IntegrationHubPanels";

const TABS: Array<{ id: IntegrationHubOsTab; label: string }> = [
    { id: INTEGRATION_HUB_OS_TABS.gateway, label: "API Gateway" },
    { id: INTEGRATION_HUB_OS_TABS.apiKeys, label: "API Keys" },
    { id: INTEGRATION_HUB_OS_TABS.webhooks, label: "Webhooks" },
    { id: INTEGRATION_HUB_OS_TABS.oauth, label: "OAuth" },
    { id: INTEGRATION_HUB_OS_TABS.thirdParty, label: "Third-party" },
    { id: INTEGRATION_HUB_OS_TABS.marketplace, label: "Marketplace" },
    { id: INTEGRATION_HUB_OS_TABS.triggers, label: "Triggers" },
    { id: INTEGRATION_HUB_OS_TABS.analytics, label: "Analytics" },
    { id: INTEGRATION_HUB_OS_TABS.developer, label: "Developer Portal" },
    { id: INTEGRATION_HUB_OS_TABS.assistant, label: "AI Assistant" },
];

function Skeleton() {
    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <SkeletonLoader className="h-8 w-72" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i}>
                        <SkeletonLoader className="h-16 w-full" />
                    </Card>
                ))}
            </div>
            <Card>
                <SkeletonLoader className="h-64 w-full" />
            </Card>
        </PageTransition>
    );
}

export function IntegrationHubOsPage() {
    const { snapshot, loading, error } = useIntegrationHubOs();
    const [tab, setTab] = useState<IntegrationHubOsTab>(INTEGRATION_HUB_OS_TABS.gateway);
    const links = listIntegrationHubPlatformLinks();

    if (loading) return <Skeleton />;
    if (error) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState title="Unable to load Integration Hub" description={error} />
            </PageTransition>
        );
    }
    if (!snapshot) {
        return (
            <PageTransition className="mx-auto max-w-7xl">
                <EmptyState title="Sign in required" description="Sign in to access Integration Hub & Public API Platform." />
            </PageTransition>
        );
    }

    const stats = [
        { label: "Hubs", value: String(snapshot.stats.hubs) },
        { label: "Services", value: String(snapshot.stats.connectedServices) },
        { label: "API Keys", value: String(snapshot.stats.apiKeys) },
        { label: "Webhooks", value: String(snapshot.stats.webhooks) },
        { label: "Marketplace", value: String(snapshot.stats.marketplaceListings) },
        { label: "Triggers", value: String(snapshot.stats.triggers) },
        { label: "Requests", value: snapshot.stats.requestVolume.toLocaleString() },
        { label: "Failures", value: String(snapshot.stats.openFailures) },
    ];

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-6">
            <div>
                <Badge variant="info">{INTEGRATION_HUB_OS_THEME.badge}</Badge>
                <h1 className="mt-3 text-2xl font-bold text-[var(--dos-text-primary)] sm:text-3xl">{INTEGRATION_HUB_OS_THEME.title}</h1>
                <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{INTEGRATION_HUB_OS_THEME.subtitle}</p>
                <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">
                    Data: {snapshot.source} · Org {snapshot.organizationId ?? "—"}
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((s) => (
                    <Card key={s.label}>
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">{s.label}</p>
                        <p className="mt-2 text-2xl font-bold text-[var(--dos-text-primary)]">{s.value}</p>
                    </Card>
                ))}
            </div>

            <Card>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dos-text-tertiary)]">Platform integrations</p>
                <div className="mt-2 flex flex-wrap gap-2">
                    {links.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="rounded-full border border-[var(--dos-border)] px-3 py-1 text-xs text-[var(--dos-text-secondary)] hover:border-[var(--dos-brand-primary)]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </Card>

            <div className="flex flex-wrap gap-2">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setTab(t.id)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                            tab === t.id
                                ? "bg-[var(--dos-brand-primary)] text-white"
                                : "bg-[var(--dos-surface-tertiary)] text-[var(--dos-text-secondary)]"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === INTEGRATION_HUB_OS_TABS.gateway ? <GatewayPanel items={snapshot.gateway} /> : null}
            {tab === INTEGRATION_HUB_OS_TABS.apiKeys ? <ApiKeysPanel items={snapshot.apiKeys} /> : null}
            {tab === INTEGRATION_HUB_OS_TABS.webhooks ? <WebhooksPanel items={snapshot.webhooks} /> : null}
            {tab === INTEGRATION_HUB_OS_TABS.oauth ? <OauthPanel items={snapshot.oauth} /> : null}
            {tab === INTEGRATION_HUB_OS_TABS.thirdParty ? <ThirdPartyPanel items={snapshot.thirdParty} /> : null}
            {tab === INTEGRATION_HUB_OS_TABS.marketplace ? <MarketplacePanel items={snapshot.marketplace} /> : null}
            {tab === INTEGRATION_HUB_OS_TABS.triggers ? <TriggersPanel items={snapshot.triggers} /> : null}
            {tab === INTEGRATION_HUB_OS_TABS.analytics ? <AnalyticsPanel analytics={snapshot.analytics} /> : null}
            {tab === INTEGRATION_HUB_OS_TABS.developer ? (
                <DeveloperPortalPanel items={snapshot.developerPortal} auditTrail={snapshot.auditTrail} />
            ) : null}
            {tab === INTEGRATION_HUB_OS_TABS.assistant ? <AiIntegrationAssistantPanel assistant={snapshot.assistant} /> : null}
        </PageTransition>
    );
}
