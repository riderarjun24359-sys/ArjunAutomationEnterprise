"use client";

import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock3, FolderOpen, MessageSquareText, Sparkles, Users, FileText, ArrowUpRight } from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { StatCard } from "@/src/components/ui/StatCard";
import { useProjects } from "@/src/modules/projects/hooks/useProjects";
import { PROJECT_TABS, TASK_VIEWS } from "@/src/modules/projects/constants";
import { useMemo, useState } from "react";

const tabs = [
  { id: PROJECT_TABS.overview, label: "Overview" },
  { id: PROJECT_TABS.milestones, label: "Milestones" },
  { id: PROJECT_TABS.tasks, label: "Tasks" },
  { id: PROJECT_TABS.team, label: "Team" },
  { id: PROJECT_TABS.time, label: "Time" },
  { id: PROJECT_TABS.files, label: "Files" },
  { id: PROJECT_TABS.comments, label: "Comments" },
];

const taskViews = [
  { id: TASK_VIEWS.kanban, label: "Kanban" },
  { id: TASK_VIEWS.list, label: "List" },
  { id: TASK_VIEWS.calendar, label: "Calendar" },
  { id: TASK_VIEWS.timeline, label: "Timeline" },
];

export function ProjectsPage() {
  const { projects, selectedProject, milestones, tasks, team, timeEntries, files, comments, stats, loading, selectProject } = useProjects();
  const [activeTab, setActiveTab] = useState<(typeof PROJECT_TABS)[keyof typeof PROJECT_TABS]>(PROJECT_TABS.overview);
  const [activeView, setActiveView] = useState<(typeof TASK_VIEWS)[keyof typeof TASK_VIEWS]>(TASK_VIEWS.kanban);

  const statCards = useMemo(
    () => [
      { title: "Project Health", value: stats?.health ?? "Healthy", detail: "Execution status", trend: "up" as const, tone: "accent" as const },
      { title: "Progress", value: stats?.progress ?? "0%", detail: "Overall completion", trend: "up" as const },
      { title: "Budget", value: stats?.budget ?? "$0", detail: "Spend versus plan", trend: "up" as const },
      { title: "Timeline", value: stats?.timeline ?? "On track", detail: "Delivery signal", trend: "up" as const },
    ],
    [stats],
  );

  if (loading) {
    return <LoadingState />;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">Project Operations</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise project management and delivery</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">Coordinate delivery, capacity, time, artifacts, and collaboration from one premium workspace.</p>
            </div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">Multi-tenant ready</div>
          </div>
        </motion.header>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === PROJECT_TABS.overview ? (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <StatCard key={card.title} {...card} />
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Card hover>
                <SectionHeader title="Project portfolio" description="Delivery and budget posture" />
                <div className="mt-6 space-y-3">
                  {projects.map((project) => (
                    <button key={project.id} onClick={() => void selectProject(project.id)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950/40">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{project.owner} • {project.timeline}</p>
                      </div>
                      <div className="text-right text-sm text-slate-600 dark:text-slate-300">
                        <p>{project.progress}%</p>
                        <p>{project.budget}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              <Card hover>
                <SectionHeader title="Selected project" description="Operational context" />
                {selectedProject ? (
                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Focused delivery</p>
                      <p className="mt-2 text-xl font-semibold">{selectedProject.name}</p>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{selectedProject.description}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Template</p>
                        <p className="mt-2 font-medium">{selectedProject.template}</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Client</p>
                        <p className="mt-2 font-medium">{selectedProject.client}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/40">Select a project to inspect the delivery context.</div>
                )}
              </Card>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Card hover>
                <SectionHeader title="Upcoming deadlines" description="Immediate delivery checkpoints" />
                <div className="mt-6 space-y-3">
                  {stats?.upcomingDeadlines.map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                      <span>{item}</span>
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card hover>
                <SectionHeader title="Recent activity" description="Latest project signals" />
                <div className="mt-6 space-y-3">
                  {stats?.recentActivity.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          </>
        ) : null}

        {activeTab === PROJECT_TABS.milestones ? (
          <Card hover>
            <SectionHeader title="Milestones" description="Track project delivery phases" />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{milestone.title}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Due {milestone.dueDate}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-700">{milestone.status}</span>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${milestone.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {activeTab === PROJECT_TABS.tasks ? (
          <Card hover>
            <SectionHeader title="Task workspace" description="Kanban, list, calendar, and timeline views" />
            <div className="mt-4 flex flex-wrap gap-2">
              {taskViews.map((view) => (
                <button key={view.id} onClick={() => setActiveView(view.id)} className={`rounded-full px-3 py-2 text-sm font-medium transition ${activeView === view.id ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"}`}>
                  {view.label}
                </button>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {tasks.map((task) => (
                <div key={task.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{task.title}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{task.assignee}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-700">{task.priority}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>Due {task.dueDate}</span>
                    <span>{activeView === TASK_VIEWS.kanban ? "Kanban" : activeView}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {activeTab === PROJECT_TABS.team ? (
          <Card hover>
            <SectionHeader title="Team" description="Assign, remove, and manage capacity" />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {team.map((member) => (
                <div key={member.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{member.role}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-700">{member.status}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>Capacity {member.capacity}</span>
                    <button className="rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-700">Assign</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {activeTab === PROJECT_TABS.time ? (
          <Card hover>
            <SectionHeader title="Time tracking" description="Start, pause, stop, and review timesheets" />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {timeEntries.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{entry.projectName}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Started {entry.startedAt}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-700">{entry.status}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>{entry.duration}</span>
                    <button className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"><Clock3 className="h-4 w-4" /> Control</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {activeTab === PROJECT_TABS.files ? (
          <Card hover>
            <SectionHeader title="Files" description="Folders, versions, and previews" />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {files.map((file) => (
                <div key={file.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{file.name}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{file.folder}</p>
                    </div>
                    <FolderOpen className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>v{file.version}</span>
                    <span>{file.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {activeTab === PROJECT_TABS.comments ? (
          <Card hover>
            <SectionHeader title="Comments" description="Mentions, attachments, and threads" />
            <div className="mt-6 space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{comment.author}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{comment.body}</p>
                    </div>
                    <MessageSquareText className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {comment.mentions.map((mention) => (
                      <span key={mention} className="rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-700">@{mention}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>{comment.createdAt}</span>
                    <span>{comment.attachments.length} attachments</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    </main>
  );
}
