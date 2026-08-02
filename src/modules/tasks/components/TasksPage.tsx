"use client";

import { motion } from "framer-motion";
import { CalendarDays, ListTodo, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { Card } from "@/src/components/ui/Card";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { EmptyState } from "@/src/modules/tasks/components/EmptyState";
import { TaskFilters } from "@/src/modules/tasks/components/TaskFilters";
import { TaskForm } from "@/src/modules/tasks/components/TaskForm";
import { TaskKanban } from "@/src/modules/tasks/components/TaskKanban";
import { TaskStats } from "@/src/modules/tasks/components/TaskStats";
import { TaskTable } from "@/src/modules/tasks/components/TaskTable";
import { TASK_VIEWS } from "@/src/modules/tasks/constants";
import { useTasks } from "@/src/modules/tasks/hooks/useTasks";
import type { TaskFormValues } from "@/src/modules/tasks/schemas";

const viewOptions = [
    { id: TASK_VIEWS.kanban, label: "Kanban" },
    { id: TASK_VIEWS.list, label: "List" },
    { id: TASK_VIEWS.calendar, label: "Calendar" },
    { id: TASK_VIEWS.timeline, label: "Timeline" },
] as const;

export function TasksPage() {
    const {
        tasks,
        selectedTask,
        assignees,
        labels,
        statistics,
        loading,
        activeFilter,
        searchQuery,
        statusFilter,
        setActiveFilter,
        setSearchQuery,
        setStatusFilter,
        selectTask,
        createTask,
    } = useTasks();

    const [activeView, setActiveView] = useState<(typeof TASK_VIEWS)[keyof typeof TASK_VIEWS]>(TASK_VIEWS.kanban);
    const [showForm, setShowForm] = useState(false);

    const handleCreateTask = async (values: TaskFormValues) => {
        await createTask(values);
        setShowForm(false);
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl">
                    <LoadingState label="Loading task management data" />
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
                <motion.header
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
                >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-600">Task Operations</p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise task management and execution</h1>
                            <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                                Coordinate work across teams, projects, and priorities from one premium operational workspace.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowForm((current) => !current)}
                            className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950"
                        >
                            <Plus className="h-4 w-4" />
                            {showForm ? "Hide Form" : "New Task"}
                        </button>
                    </div>
                </motion.header>

                <TaskStats statistics={statistics} />

                <TaskFilters
                    activeFilter={activeFilter}
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    onFilterChange={setActiveFilter}
                    onSearchChange={setSearchQuery}
                    onStatusChange={setStatusFilter}
                />

                {showForm ? (
                    <TaskForm assignees={assignees} labels={labels} onSubmit={handleCreateTask} />
                ) : null}

                <div className="flex flex-wrap gap-2">
                    {viewOptions.map((view) => (
                        <button
                            key={view.id}
                            type="button"
                            onClick={() => setActiveView(view.id)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeView === view.id ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                        >
                            {view.label}
                        </button>
                    ))}
                </div>

                {activeView === TASK_VIEWS.kanban ? <TaskKanban tasks={tasks} onSelectTask={(id) => void selectTask(id)} /> : null}

                {activeView === TASK_VIEWS.list ? <TaskTable tasks={tasks} onSelectTask={(id) => void selectTask(id)} /> : null}

                {activeView === TASK_VIEWS.calendar ? (
                    <Card hover>
                        <SectionHeader title="Calendar view" description="Task schedule and due date planning" />
                        {tasks.length === 0 ? (
                            <div className="mt-6">
                                <EmptyState title="No scheduled tasks" description="Tasks with due dates will appear on the calendar view." />
                            </div>
                        ) : (
                            <div className="mt-6 space-y-3">
                                {tasks.map((task) => (
                                    <button
                                        key={task.id}
                                        type="button"
                                        onClick={() => void selectTask(task.id)}
                                        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950/40"
                                    >
                                        <div>
                                            <p className="font-medium">{task.title}</p>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{task.assignee?.name ?? "Unassigned"}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                            <CalendarDays className="h-4 w-4 text-slate-400" />
                                            {task.dueDate}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </Card>
                ) : null}

                {activeView === TASK_VIEWS.timeline ? (
                    <Card hover>
                        <SectionHeader title="Timeline view" description="Chronological task execution roadmap" />
                        {tasks.length === 0 ? (
                            <div className="mt-6">
                                <EmptyState title="No timeline entries" description="Create tasks to visualize execution across the timeline." />
                            </div>
                        ) : (
                            <div className="mt-6 space-y-4">
                                {tasks.map((task, index) => (
                                    <div key={task.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                                                <ListTodo className="h-4 w-4" />
                                            </div>
                                            {index < tasks.length - 1 ? <div className="mt-2 w-px flex-1 bg-slate-200 dark:bg-slate-800" /> : null}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => void selectTask(task.id)}
                                            className="mb-4 flex-1 rounded-2xl border border-slate-200 p-4 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950/40"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold">{task.title}</p>
                                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{task.projectName ?? "No project"}</p>
                                                </div>
                                                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs capitalize dark:border-slate-700">{task.status.replace("_", " ")}</span>
                                            </div>
                                            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Due {task.dueDate}</p>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                ) : null}

                {selectedTask ? (
                    <Card hover>
                        <SectionHeader title="Selected task" description="Task detail and context" />
                        <div className="mt-6 space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Focused execution</p>
                                <p className="mt-2 text-xl font-semibold">{selectedTask.title}</p>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{selectedTask.description}</p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                                    <p className="mt-2 font-medium capitalize">{selectedTask.status.replace("_", " ")}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Priority</p>
                                    <p className="mt-2 font-medium capitalize">{selectedTask.priority}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Assignee</p>
                                    <p className="mt-2 font-medium">{selectedTask.assignee?.name ?? "Unassigned"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Due Date</p>
                                    <p className="mt-2 font-medium">{selectedTask.dueDate}</p>
                                </div>
                            </div>
                            {selectedTask.labels.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {selectedTask.labels.map((label) => (
                                        <span key={label.id} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-sm dark:border-slate-700">
                                            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                                            {label.name}
                                        </span>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </Card>
                ) : null}
        </div>
    );
}
