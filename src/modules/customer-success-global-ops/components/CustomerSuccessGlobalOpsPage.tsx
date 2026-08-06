"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Button } from "@/src/design-os/components/Button";
import { Card } from "@/src/design-os/components/Card";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { StaggerReveal, StaggerRevealItem } from "@/src/design-os/motion/components/StaggerReveal";
import { CSGO_MODULES, CSGO_THEME } from "../constants";
import { useCustomerSuccessGlobalOps } from "../hooks/useCustomerSuccessGlobalOps";
import { GlobalOperationsPanels } from "./GlobalOperationsPanels";

export function CustomerSuccessGlobalOpsPage() {
    const { loading, dashboard, refresh } = useCustomerSuccessGlobalOps();
    const dash = dashboard;

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <Badge variant="info">{CSGO_THEME.badge}</Badge>
                    <h1 className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{CSGO_THEME.title}</h1>
                    <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{CSGO_THEME.subtitle}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => void refresh()}>Refresh</Button>
            </div>

            <StaggerReveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Active clients</p><p className="mt-1 text-2xl font-bold">{dash?.activeClients ?? "—"}</p></Card></StaggerRevealItem>
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Projects</p><p className="mt-1 text-2xl font-bold">{dash?.activeProjects ?? "—"}</p></Card></StaggerRevealItem>
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Support health</p><p className="mt-1 text-2xl font-bold">{dash?.supportHealth ?? "—"}%</p></Card></StaggerRevealItem>
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Delivery health</p><p className="mt-1 text-2xl font-bold">{dash?.deliveryHealth ?? "—"}%</p></Card></StaggerRevealItem>
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Customer health</p><p className="mt-1 text-2xl font-bold">{dash?.customerHealth ?? "—"}%</p></Card></StaggerRevealItem>
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Open invoices</p><p className="mt-1 text-2xl font-bold">{dash?.revenueOverview.openInvoices ?? "—"}</p></Card></StaggerRevealItem>
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Renewals due</p><p className="mt-1 text-2xl font-bold">{dash?.revenueOverview.renewalsDue ?? "—"}</p></Card></StaggerRevealItem>
            </StaggerReveal>

            <Card>
                <h2 className="font-semibold">Operating modules</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {CSGO_MODULES.map((m) => (
                        <div key={m.key} className="rounded-lg border border-[var(--dos-border)] p-3">
                            <p className="text-sm font-medium">{m.label}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{m.description}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {loading ? (
                <Card><p className="text-sm text-[var(--dos-text-secondary)]">Loading global operations...</p></Card>
            ) : dash ? (
                <GlobalOperationsPanels dash={dash} />
            ) : (
                <Card><p className="text-sm text-[var(--dos-text-secondary)]">Unable to load dashboard.</p></Card>
            )}
        </PageTransition>
    );
}
