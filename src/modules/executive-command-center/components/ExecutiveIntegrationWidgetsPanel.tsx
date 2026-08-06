"use client";

import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/design-os/components/EmptyState";
import type { ExecutiveIntegrationWidgets } from "@/src/modules/integration-hub/types/os";

export function ExecutiveIntegrationWidgetsPanel({ widgets }: { widgets: ExecutiveIntegrationWidgets | null }) {
    if (!widgets) {
        return (
            <EmptyState
                title="Integration widgets unavailable"
                description="Widgets load from the Integration Hub & Public API snapshot."
            />
        );
    }

    return (
        <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--dos-text-secondary)]">
                Integration Hub Widgets
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Active Hubs</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.activeHubs}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Connected Services</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.connectedServices}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Active API Keys</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.activeApiKeys}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Webhook Success</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.webhookSuccessRate}%</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Marketplace Installed</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.marketplaceInstalled}</p>
                </Card>
                <Card>
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Open Failures</p>
                    <p className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{widgets.openFailures}</p>
                    <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">Requests {widgets.requestVolume.toLocaleString()}</p>
                </Card>
                <Card className="md:col-span-2 xl:col-span-3">
                    <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Top Providers</p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm text-[var(--dos-text-secondary)]">
                        {widgets.topProviders.length === 0 ? (
                            <li>No connected providers</li>
                        ) : (
                            widgets.topProviders.map((p) => (
                                <li key={`${p.provider}-${p.status}`} className="flex justify-between gap-2">
                                    <span>{p.provider}</span>
                                    <span>{p.status}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </Card>
            </div>
        </section>
    );
}
