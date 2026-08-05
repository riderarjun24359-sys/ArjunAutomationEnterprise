"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Button } from "@/src/design-os/components/Button";
import { Card } from "@/src/design-os/components/Card";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { StaggerReveal, StaggerRevealItem } from "@/src/design-os/motion/components/StaggerReveal";
import { EXECUTIVE_AI_THEME, SHARED_KNOWLEDGE_SOURCES } from "../constants";
import { useExecutiveAiEcosystem } from "../hooks/useExecutiveAiEcosystem";
import { ExecutiveAiDashboard } from "./ExecutiveAiDashboard";

export function ExecutiveAiEcosystemPage() {
    const data = useExecutiveAiEcosystem();
    const dash = data.dashboard;

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8">
            <div>
                <Badge variant="info">{EXECUTIVE_AI_THEME.badge}</Badge>
                <h1 className="mt-3 text-3xl font-bold text-[var(--dos-text-primary)]">{EXECUTIVE_AI_THEME.title}</h1>
                <p className="mt-2 max-w-3xl text-sm text-[var(--dos-text-secondary)]">{EXECUTIVE_AI_THEME.subtitle}</p>
            </div>

            <StaggerReveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Executive agents</p><p className="mt-1 text-2xl font-bold">9</p></Card></StaggerRevealItem>
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Recommendations</p><p className="mt-1 text-2xl font-bold">{dash?.recommendations.length ?? 0}</p></Card></StaggerRevealItem>
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Pending approvals</p><p className="mt-1 text-2xl font-bold">{dash?.pendingApprovals.length ?? 0}</p></Card></StaggerRevealItem>
                <StaggerRevealItem><Card hover><p className="text-sm text-[var(--dos-text-secondary)]">Orchestrator</p><p className="mt-1 text-2xl font-bold capitalize">{dash?.orchestratorStatus ?? "—"}</p></Card></StaggerRevealItem>
            </StaggerReveal>

            <Card>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="font-semibold">AI Orchestrator</h2>
                        <p className="text-sm text-[var(--dos-text-secondary)]">Routes tasks, coordinates agents, resolves conflicts, merges recommendations.</p>
                        <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">Shared knowledge: {SHARED_KNOWLEDGE_SOURCES.join(" · ")}</p>
                    </div>
                    <Button size="sm" onClick={() => data.runOrchestration("executive_daily_brief")}>Generate unified brief</Button>
                </div>
                {dash?.sharedKnowledge && (
                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-[var(--dos-text-secondary)]">
                        <span>{dash.sharedKnowledge.organizationName}</span>
                        <span>·</span>
                        <span>Intelligence {dash.sharedKnowledge.executiveIntelligence.unifiedScore}%</span>
                        <span>·</span>
                        <span>{dash.sharedKnowledge.businessPlatform.clients} clients</span>
                        <span>·</span>
                        <span>{dash.sharedKnowledge.knowledgeEntries} knowledge entries</span>
                    </div>
                )}
            </Card>

            {data.loading ? (
                <Card><p className="text-sm text-[var(--dos-text-secondary)]">Loading executive AI ecosystem...</p></Card>
            ) : (
                <ExecutiveAiDashboard data={data} />
            )}
        </PageTransition>
    );
}
