"use client";

import { Badge } from "@/src/design-os/components/Badge";
import { Card } from "@/src/design-os/components/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import type { BusinessPlatformData } from "../../hooks/useBusinessPlatform";

export function ProjectManagementPanel({ data }: { data: BusinessPlatformData }) {
    return (
        <Card>
            <h2 className="text-lg font-semibold">Project management</h2>
            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">Tasks, milestones, deadlines, resources, risks, progress, activity timeline</p>
            <div className="mt-6 space-y-3">
                {data.projects.length === 0 ? (
                    <EmptyState title="No projects" description="Projects are created when clients sign agreements." />
                ) : (
                    data.projects.map((project) => (
                        <div key={project.id} className="rounded-xl border border-[var(--dos-border)] p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="font-medium">{project.name}</p>
                                <Badge variant="info">{project.status}</Badge>
                            </div>
                            <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{project.clientName ?? "No client"} · {project.progress}% complete</p>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
