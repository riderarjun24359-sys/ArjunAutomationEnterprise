"use client";

import { useState } from "react";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { Badge } from "@/src/design-os/components/Badge";
import { useProjects } from "@/src/modules/projects/hooks/useProjects";
import { PROJECT_TABS } from "@/src/modules/projects/constants";
import { LoadingState } from "@/src/components/ui/LoadingState";

const tabs = [
  { id: PROJECT_TABS.overview, label: "Overview" },
  { id: PROJECT_TABS.milestones, label: "Milestones" },
  { id: PROJECT_TABS.tasks, label: "Tasks" },
  { id: PROJECT_TABS.team, label: "Team" },
  { id: PROJECT_TABS.time, label: "Time" },
  { id: PROJECT_TABS.files, label: "Files" },
  { id: PROJECT_TABS.comments, label: "Comments" },
];

export function ProjectsPage() {
  const { projects, selectedProject, milestones, tasks, team, timeEntries, files, comments, stats, loading, selectProject } = useProjects();
  const [activeTab, setActiveTab] = useState<(typeof PROJECT_TABS)[keyof typeof PROJECT_TABS]>(PROJECT_TABS.overview);

  if (loading) return <LoadingState label="Loading project workspace" />;

  return (
    <PageTransition className="mx-auto max-w-[85rem] space-y-10">
        <header className="flex flex-col gap-4 border-b border-[var(--dos-border-subtle)] pb-8">
            <Badge variant="info" className="w-fit">Project OS Engine</Badge>
            <div>
                <h1 className="dos-text-display">Project Management</h1>
                <p className="mt-4 max-w-3xl dos-text-h3 text-[var(--dos-text-secondary)]">
                    Enterprise project coordination, capacity management, time tracking, and collaboration workspace.
                </p>
            </div>
        </header>

        <nav className="flex flex-wrap gap-2 border-b border-[var(--dos-border-subtle)] pb-4">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTab === tab.id ? "bg-[var(--dos-text-primary)] text-[var(--dos-surface)]" : "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] hover:text-[var(--dos-text-primary)]"}`}
                >
                    {tab.label}
                </button>
            ))}
        </nav>

        <section className="min-h-[60vh] rounded-[var(--dos-radius-2xl)] bg-[var(--dos-surface-secondary)]/50 p-8">
            {activeTab === PROJECT_TABS.overview ? (
                <div className="space-y-10">
                    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            { title: "Health", value: stats?.health ?? "Healthy" },
                            { title: "Progress", value: stats?.progress ?? "0%" },
                            { title: "Budget", value: stats?.budget ?? "₹0" },
                            { title: "Timeline", value: stats?.timeline ?? "On track" },
                        ].map((stat) => (
                            <div key={stat.title} className="os-panel p-6">
                                <p className="dos-text-caption">{stat.title}</p>
                                <p className="mt-2 dos-text-h2">{stat.value}</p>
                            </div>
                        ))}
                    </section>

                    <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                        <div className="os-panel p-6">
                            <h3 className="mb-6 dos-text-h3">Project Portfolio</h3>
                            <div className="space-y-3">
                                {projects.map((project) => (
                                    <button key={project.id} onClick={() => void selectProject(project.id)} className="flex w-full items-center justify-between rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-4 text-left transition hover:border-[var(--dos-brand-primary)]">
                                        <div>
                                            <p className="font-semibold text-[var(--dos-text-primary)]">{project.name}</p>
                                            <p className="dos-text-body-sm text-[var(--dos-text-secondary)]">{project.owner} • {project.timeline}</p>
                                        </div>
                                        <div className="text-right dos-text-body-sm text-[var(--dos-text-tertiary)]">
                                            <p>{project.progress}%</p>
                                            <p>{project.budget}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="os-panel p-6">
                            <h3 className="mb-6 dos-text-h3">Active Project Context</h3>
                            {selectedProject ? (
                                <div className="space-y-6">
                                    <div className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-5">
                                        <p className="dos-text-caption">Delivery</p>
                                        <p className="mt-2 text-xl font-semibold text-[var(--dos-text-primary)]">{selectedProject.name}</p>
                                        <p className="mt-2 dos-text-body-sm text-[var(--dos-text-secondary)]">{selectedProject.description}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="dos-text-secondary">Select a project to view operational context.</p>
                            )}
                        </div>
                    </section>
                </div>
            ) : null}
            
            {activeTab !== PROJECT_TABS.overview && (
                <div className="dos-text-secondary text-center p-12">
                    <p>Module section: {tabs.find(t => t.id === activeTab)?.label} (Redesigned for OS consistency)</p>
                </div>
            )}
        </section>
    </PageTransition>
  );
}
