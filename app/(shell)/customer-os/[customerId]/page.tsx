"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/src/design-os/components/primitives/Card";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { EntityRow } from "@/src/design-os/components/primitives/EntityRow";
import { Button } from "@/src/design-os/components/primitives/Button";
import { crmService } from "@/src/modules/crm/services/crm.service";
import { ROUTES } from "@/src/constants/routes";
import type { ClientProfileBundle } from "@/src/modules/crm/types/enterprise";
import Link from "next/link";

export default function CustomerWorkspacePage() {
    const params = useParams();
    const customerId = params.customerId as string;
    const [bundle, setBundle] = useState<ClientProfileBundle | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!customerId) return;
        crmService.getClientProfile("system", "system@arjun.dev", customerId)
            .then(setBundle)
            .finally(() => setLoading(false));
    }, [customerId]);

    const intelligence = useMemo(() => {
        if (!bundle) return null;
        const { client, tasks, projects } = bundle;
        
        const overdueTasks = tasks.filter(t => t.status !== "completed" && new Date(t.dueDate) < new Date());
        const pendingTasks = tasks.filter(t => t.status === "pending");
        
        let state: "HEALTHY" | "ACTIVE" | "ATTENTION" | "AT_RISK" | "INACTIVE" = "HEALTHY";
        const attentionReasons: string[] = [];

        if (client.status === "inactive") {
            state = "INACTIVE";
        } else if (client.status === "at_risk") {
            state = "AT_RISK";
            attentionReasons.push("Relationship marked as at-risk in CRM");
        } else if (overdueTasks.length > 0) {
            state = "ATTENTION";
            attentionReasons.push(`${overdueTasks.length} task(s) overdue`);
        } else if (pendingTasks.length > 3) {
            state = "ACTIVE";
        }

        return { state, attentionReasons };
    }, [bundle]);

    if (loading) return <div className="p-6 text-[var(--dos-text-secondary)]">Loading workspace...</div>;
    if (!bundle || !intelligence) return <div className="p-6 text-[var(--dos-text-secondary)]">Customer not found or unavailable.</div>;

    const { client, timeline, projects, tasks, revenue } = bundle;
    const { state, attentionReasons } = intelligence;

    return (
        <PageTransition className="mx-auto max-w-7xl space-y-8 p-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--dos-text-primary)]">{client.name}</h1>
                    <p className="text-[var(--dos-text-secondary)]">
                        {client.lifecycleStage} • {client.industry} • {client.contactEmail}
                    </p>
                </div>
                
                {/* Action Surface */}
                <div className="flex gap-2">
                    <Link href={ROUTES.crm} passHref>
                        <Button variant="secondary">View CRM</Button>
                    </Link>
                    <Link href={ROUTES.tasks} passHref>
                        <Button variant="secondary">View Tasks</Button>
                    </Link>
                    <Link href={ROUTES.projects} passHref>
                        <Button variant="secondary">View Projects</Button>
                    </Link>
                </div>
            </header>

            {/* Relationship Intelligence */}
            <section aria-labelledby="intelligence-heading">
                <h2 id="intelligence-heading" className="mb-4 text-lg font-semibold text-[var(--dos-text-primary)]">Relationship Intelligence</h2>
                <div className="grid gap-4 sm:grid-cols-4">
                    <Card variant={state === "HEALTHY" ? "base" : state === "AT_RISK" ? "active" : "base"}>
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Relationship State</p>
                        <p className={`mt-1 text-2xl font-bold ${state === "AT_RISK" ? "text-[var(--dos-tint-critical)]" : ""}`}>{state}</p>
                    </Card>
                    <Card variant="base">
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Total Revenue</p>
                        <p className="mt-1 text-2xl font-bold">{revenue.label}</p>
                    </Card>
                    <Card variant="base">
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Projects</p>
                        <p className="mt-1 text-2xl font-bold">{projects.length}</p>
                    </Card>
                    <Card variant={attentionReasons.length > 0 ? "active" : "base"}>
                        <p className="text-xs uppercase tracking-wider text-[var(--dos-text-tertiary)]">Attention Required</p>
                        <p className="mt-1 text-2xl font-bold">{attentionReasons.length}</p>
                    </Card>
                </div>
            </section>
...

            {/* Why Attention */}
            {attentionReasons.length > 0 && (
                <section aria-labelledby="why-attention-heading">
                    <h2 id="why-attention-heading" className="mb-4 text-lg font-semibold text-[var(--dos-text-primary)]">Why Attention?</h2>
                    <div className="bg-[var(--dos-bg-active)] p-4 rounded-md">
                        <ul className="list-disc list-inside text-[var(--dos-text-secondary)]">
                            {attentionReasons.map((reason, i) => <li key={i}>{reason}</li>)}
                        </ul>
                    </div>
                </section>
            )}

            {/* Operational Surfaces */}
            <div className="grid gap-8 lg:grid-cols-2">
                <section aria-labelledby="projects-heading">
                    <h2 id="projects-heading" className="mb-4 text-lg font-semibold text-[var(--dos-text-primary)]">Projects</h2>
                    <div className="space-y-3">
                        {projects.length > 0 ? projects.map(project => (
                            <EntityRow key={project.id}>
                                <div className="flex flex-col">
                                    <p className="font-semibold text-[var(--dos-text-primary)]">{project.name}</p>
                                    <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Status: {project.status} • Progress: {project.progress}%</p>
                                </div>
                            </EntityRow>
                        )) : <p className="text-[var(--dos-text-secondary)]">No active projects.</p>}
                    </div>
                </section>

                <section aria-labelledby="timeline-heading">
                    <h2 id="timeline-heading" className="mb-4 text-lg font-semibold text-[var(--dos-text-primary)]">What Changed (Timeline)</h2>
                    <div className="space-y-3">
                        {timeline.length > 0 ? timeline.slice(0, 5).map(event => (
                            <EntityRow key={event.id}>
                                <div className="flex flex-col">
                                    <p className="font-semibold text-[var(--dos-text-primary)]">{event.title}</p>
                                    <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{event.time} • {event.detail}</p>
                                </div>
                            </EntityRow>
                        )) : <p className="text-[var(--dos-text-secondary)]">No recent activity.</p>}
                    </div>
                </section>
            </div>
        </PageTransition>
    );
}
