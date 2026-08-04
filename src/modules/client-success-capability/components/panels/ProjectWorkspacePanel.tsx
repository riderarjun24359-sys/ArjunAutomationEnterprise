"use client";

import { Card } from "@/src/design-os/components/Card";
import { Button } from "@/src/design-os/components/Button";
import { Badge } from "@/src/design-os/components/Badge";
import { SimpleTable } from "../shared/SimpleTable";
import { KpiCard } from "@/src/design-os/dashboard/KpiCard";
import { useClientSuccessCapability } from "../../hooks/useClientSuccessCapability";

export function ProjectWorkspacePanel() {
    const { selectedClientId, workspace, provisionProjectWorkspace, actionLoading } = useClientSuccessCapability();

    if (!selectedClientId) {
        return <Card><p className="text-[var(--dos-text-secondary)]">Select a client to manage project workspace.</p></Card>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-[var(--dos-text-primary)]">Project Workspace</h2>
                    <p className="text-sm text-[var(--dos-text-secondary)]">Milestones, tasks, deliverables, team, and documents.</p>
                </div>
                <Button onClick={() => provisionProjectWorkspace(selectedClientId)} disabled={actionLoading}>
                    {workspace ? "Refresh Workspace" : "Provision Workspace"}
                </Button>
            </div>

            {workspace ? (
                <>
                    <div className="grid gap-4 sm:grid-cols-4">
                        <KpiCard title="Milestones" value={workspace.milestones.length} />
                        <KpiCard title="Tasks" value={workspace.tasks.length} />
                        <KpiCard title="Deliverables" value={workspace.deliverables.length} />
                        <KpiCard title="Team" value={workspace.team.length} />
                    </div>

                    <Card>
                        <h3 className="mb-2 font-semibold">{workspace.projectName}</h3>
                        <p className="text-xs text-[var(--dos-text-secondary)]">Project ID: {workspace.projectId}</p>
                    </Card>

                    <Card>
                        <h3 className="mb-3 font-semibold">Milestones</h3>
                        <SimpleTable
                            headers={["Name", "Status", "Due Date"]}
                            rows={workspace.milestones.map((m) => [m.name, m.status, m.dueDate])}
                        />
                    </Card>

                    <Card>
                        <h3 className="mb-3 font-semibold">Tasks</h3>
                        <SimpleTable
                            headers={["Title", "Assignee", "Status"]}
                            rows={workspace.tasks.map((t) => [t.title, t.assignee, t.status])}
                        />
                    </Card>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card>
                            <h3 className="mb-3 font-semibold">Deliverables</h3>
                            {workspace.deliverables.map((d) => (
                                <div key={d.id} className="mb-2 flex justify-between">
                                    <span>{d.name}</span>
                                    <Badge variant="info">{d.status}</Badge>
                                </div>
                            ))}
                        </Card>
                        <Card>
                            <h3 className="mb-3 font-semibold">Team</h3>
                            {workspace.team.map((t) => (
                                <div key={t.id} className="mb-2 flex justify-between">
                                    <span>{t.name}</span>
                                    <span className="text-sm text-[var(--dos-text-secondary)]">{t.role}</span>
                                </div>
                            ))}
                        </Card>
                    </div>
                </>
            ) : (
                <Card><p className="text-[var(--dos-text-secondary)]">No workspace provisioned. Click to create project structure with AI-first delivery milestones.</p></Card>
            )}
        </div>
    );
}
