"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Button } from "@/src/design-os/components/Button";
import { Card } from "@/src/design-os/components/Card";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { StaggerReveal, StaggerRevealItem } from "@/src/design-os/motion/components/StaggerReveal";
import { ACC_ENGINES, ACC_THEME } from "../constants";
import { useAiCommandCenter } from "../hooks/useAiCommandCenter";
import { AiCommandCenterDashboard } from "./AiCommandCenterDashboard";

export function AiCommandCenterPage() {
    const data = useAiCommandCenter();
    const dash = data.dashboard;

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <Badge variant="info">{ACC_THEME.badge}</Badge>
                    <h1 className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{ACC_THEME.title}</h1>
                    <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{ACC_THEME.subtitle}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => void data.refresh()}>Refresh</Button>
            </div>

            <StaggerReveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">System health</p><p className="mt-1 text-2xl font-bold">{dash?.systemHealth ?? "—"}%</p></Card></StaggerRevealItem>
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Client health</p><p className="mt-1 text-2xl font-bold">{dash?.clientHealth ?? "—"}%</p></Card></StaggerRevealItem>
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Support SLA</p><p className="mt-1 text-2xl font-bold">{dash?.supportSla.slaCompliance ?? "—"}%</p></Card></StaggerRevealItem>
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Delivery health</p><p className="mt-1 text-2xl font-bold">{dash?.deliveryStatus.deliveryHealth ?? "—"}%</p></Card></StaggerRevealItem>
            </StaggerReveal>

            <Card>
                <h2 className="font-semibold">Command engines</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {ACC_ENGINES.map((engine) => (
                        <div key={engine.key} className="rounded-lg border border-[var(--dos-border)] p-3">
                            <p className="text-sm font-medium">{engine.label}</p>
                            <p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{engine.description}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {data.loading ? (
                <Card><p className="text-sm text-[var(--dos-text-secondary)]">Loading AI Command Center...</p></Card>
            ) : (
                <AiCommandCenterDashboard data={data} />
            )}
        </PageTransition>
    );
}
