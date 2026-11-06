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
] as const;

const panelClass = "rounded-2xl border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-5";
const emptyClass = "rounded-xl border border-dashed border-[var(--dos-border)] p-8 text-center text-sm text-[var(--dos-text-secondary)]";

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
                        Enterprise project coordination, milestones, tasks, capacity, time tracking, files, and collaboration.
                    </p>
                </div>
            </header>

            <div className="grid gap-6 xl:grid-cols-[0.85fr_2.15fr]">
                <aside className={panelClass}>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="dos-text-h3">Project portfolio</h2>
                        <span className="text-xs text-[var(--dos-text-tertiary)]">{projects.length} projects</span>
                    </div>
                    {projects.length === 0 ? <p className={emptyClass}>No projects found for this workspace.</p> : (
                        <div className="space-y-2">
                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    type="button"
                                    aria-pressed={selectedProject?.id === project.id}
                                    onClick={() => void selectProject(project.id)}
                                    className={`w-full rounded-xl border p-4 text-left transition ${selectedProject?.id === project.id ? "border-[var(--dos-brand-primary)] bg-[var(--dos-brand-primary)]/5" : "border-[var(--dos-border)] hover:bg-[var(--dos-surface-secondary)]"}`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="font-semibold text-[var(--dos-text-primary)]">{project.name}</span>
                                        <span className="text-xs capitalize text-[var(--dos-text-tertiary)]">{project.status.replace("_", " ")}</span>
                                    </div>
                                    <div className="mt-2 flex justify-between text-xs text-[var(--dos-text-secondary)]">
                                        <span>{project.progress}% complete</span><span>{project.budget}</span>
                                    </div>
                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--dos-surface-tertiary)]">
                                        <div className="h-full rounded-full bg-[var(--dos-brand-primary)]" style={{ width: `${Math.min(100, Math.max(0, project.progress))}%` }} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </aside>

                <div className="min-w-0 space-y-5">
                    <div className="rounded-2xl bg-[var(--dos-surface-secondary)]/50 p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className="dos-text-caption">Selected project</p>
                                <h2 className="mt-1 text-xl font-semibold text-[var(--dos-text-primary)]">{selectedProject?.name ?? "Select a project"}</h2>
                                <p className="mt-2 max-w-2xl text-sm text-[var(--dos-text-secondary)]">{selectedProject?.description ?? "Choose a project from the portfolio to inspect its delivery workspace."}</p>
                            </div>
                            {selectedProject && <Badge variant="success">{selectedProject.status.replace("_", " ")}</Badge>}
                        </div>
                    </div>

                    <nav aria-label="Project sections" className="flex flex-wrap gap-2 border-b border-[var(--dos-border-subtle)] pb-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                aria-pressed={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.id ? "bg-[var(--dos-text-primary)] text-[var(--dos-surface)]" : "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)]"}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <section className="min-h-[28rem] space-y-4">
                        {activeTab === PROJECT_TABS.overview && (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    {[
                                        { title: "Health", value: stats?.health ?? "—" },
                                        { title: "Progress", value: stats?.progress ?? "—" },
                                        { title: "Budget", value: stats?.budget ?? "—" },
                                        { title: "Timeline", value: stats?.timeline ?? "—" },
                                    ].map((stat) => <div key={stat.title} className={panelClass}><p className="dos-text-caption">{stat.title}</p><p className="mt-2 dos-text-h2">{stat.value}</p></div>)}
                                </div>
                                <div className="grid gap-4 xl:grid-cols-2">
                                    <div className={panelClass}>
                                        <h3 className="dos-text-h3">Upcoming deadlines</h3>
                                        {stats?.upcomingDeadlines.length ? <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--dos-text-secondary)]">{stats.upcomingDeadlines.map((item, index) => <li key={index}>{item}</li>)}</ul> : <p className="mt-3 text-sm text-[var(--dos-text-secondary)]">No upcoming deadlines recorded.</p>}
                                    </div>
                                    <div className={panelClass}>
                                        <h3 className="dos-text-h3">Recent activity</h3>
                                        {stats?.recentActivity.length ? <ul className="mt-3 space-y-2 text-sm text-[var(--dos-text-secondary)]">{stats.recentActivity.map((item, index) => <li key={index} className="border-b border-[var(--dos-border-subtle)] pb-2 last:border-0">{item}</li>)}</ul> : <p className="mt-3 text-sm text-[var(--dos-text-secondary)]">No recent activity recorded.</p>}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === PROJECT_TABS.milestones && (
                            <div className={panelClass}>
                                <h3 className="dos-text-h3">Milestones <span className="text-sm font-normal text-[var(--dos-text-tertiary)]">({milestones.length})</span></h3>
                                {milestones.length === 0 ? <p className={emptyClass}>No milestones are linked to this project yet.</p> : <div className="mt-4 space-y-3">{milestones.map((item) => <div key={item.id} className="rounded-xl border border-[var(--dos-border)] p-4"><div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">{item.title}</p><span className="text-xs capitalize text-[var(--dos-text-secondary)]">{item.status.replace("_", " ")}</span></div><div className="mt-2 flex justify-between text-xs text-[var(--dos-text-tertiary)]"><span>Due {item.dueDate}</span><span>{item.progress}%</span></div><div className="mt-2 h-1.5 rounded-full bg-[var(--dos-surface-tertiary)]"><div className="h-1.5 rounded-full bg-[var(--dos-brand-primary)]" style={{ width: `${Math.min(100, Math.max(0, item.progress))}%` }} /></div></div>)}</div>}
                            </div>
                        )}

                        {activeTab === PROJECT_TABS.tasks && (
                            <div className={panelClass}>
                                <h3 className="dos-text-h3">Project tasks <span className="text-sm font-normal text-[var(--dos-text-tertiary)]">({tasks.length})</span></h3>
                                {tasks.length === 0 ? <p className={emptyClass}>No tasks are linked to this project yet.</p> : <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[36rem] text-left text-sm"><thead className="text-xs uppercase text-[var(--dos-text-tertiary)]"><tr><th className="py-3">Task</th><th>Status</th><th>Priority</th><th>Assignee</th><th>Due</th></tr></thead><tbody>{tasks.map((task) => <tr key={task.id} className="border-t border-[var(--dos-border-subtle)]"><td className="py-3 font-medium">{task.title}</td><td className="capitalize text-[var(--dos-text-secondary)]">{task.status.replace("_", " ")}</td><td className="capitalize text-[var(--dos-text-secondary)]">{task.priority}</td><td className="text-[var(--dos-text-secondary)]">{task.assignee}</td><td className="text-[var(--dos-text-secondary)]">{task.dueDate}</td></tr>)}</tbody></table></div>}
                            </div>
                        )}

                        {activeTab === PROJECT_TABS.team && (
                            <div className={panelClass}>
                                <h3 className="dos-text-h3">Project team <span className="text-sm font-normal text-[var(--dos-text-tertiary)]">({team.length})</span></h3>
                                {team.length === 0 ? <p className={emptyClass}>No team members are assigned to this project.</p> : <div className="mt-4 grid gap-3 sm:grid-cols-2">{team.map((member) => <div key={member.id} className="rounded-xl border border-[var(--dos-border)] p-4"><p className="font-semibold">{member.name}</p><div className="mt-1 flex justify-between text-sm text-[var(--dos-text-secondary)]"><span className="capitalize">{member.role}</span><span>{member.capacity} capacity</span></div><p className="mt-2 text-xs capitalize text-[var(--dos-text-tertiary)]">{member.status}</p></div>)}</div>}
                            </div>
                        )}

                        {activeTab === PROJECT_TABS.time && (
                            <div className={panelClass}>
                                <h3 className="dos-text-h3">Time entries <span className="text-sm font-normal text-[var(--dos-text-tertiary)]">({timeEntries.length})</span></h3>
                                {timeEntries.length === 0 ? <p className={emptyClass}>No time entries have been recorded.</p> : <div className="mt-4 space-y-3">{timeEntries.map((entry) => <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--dos-border)] p-4"><div><p className="font-semibold">{entry.projectName}</p><p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">Started {new Date(entry.startedAt).toLocaleString()}</p></div><div className="text-right"><p className="font-semibold">{entry.duration}</p><p className="text-xs capitalize text-[var(--dos-text-tertiary)]">{entry.status}</p></div></div>)}</div>}
                            </div>
                        )}

                        {activeTab === PROJECT_TABS.files && (
                            <div className={panelClass}>
                                <h3 className="dos-text-h3">Project files <span className="text-sm font-normal text-[var(--dos-text-tertiary)]">({files.length})</span></h3>
                                {files.length === 0 ? <p className={emptyClass}>No files have been added to this project.</p> : <div className="mt-4 space-y-2">{files.map((file) => <div key={file.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--dos-border)] p-4"><div><p className="font-semibold">{file.name}</p><p className="text-xs text-[var(--dos-text-tertiary)]">{file.folder} · Version {file.version}</p></div><p className="text-xs text-[var(--dos-text-secondary)]">Updated {file.updatedAt}</p></div>)}</div>}
                            </div>
                        )}

                        {activeTab === PROJECT_TABS.comments && (
                            <div className={panelClass}>
                                <h3 className="dos-text-h3">Project discussion <span className="text-sm font-normal text-[var(--dos-text-tertiary)]">({comments.length})</span></h3>
                                {comments.length === 0 ? <p className={emptyClass}>No comments have been posted on this project.</p> : <div className="mt-4 space-y-3">{comments.map((comment) => <article key={comment.id} className="rounded-xl border border-[var(--dos-border)] p-4"><div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">{comment.author}</p><time className="text-xs text-[var(--dos-text-tertiary)]">{new Date(comment.createdAt).toLocaleString()}</time></div><p className="mt-2 whitespace-pre-wrap text-sm text-[var(--dos-text-secondary)]">{comment.body}</p>{comment.mentions.length > 0 && <p className="mt-2 text-xs text-[var(--dos-brand-primary)]">Mentions: {comment.mentions.join(", ")}</p>}</article>)}</div>}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </PageTransition>
    );
}
