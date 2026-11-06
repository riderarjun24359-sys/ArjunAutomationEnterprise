"use client";

import { useMemo, useState } from "react";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { Badge } from "@/src/design-os/components/Badge";
import { useTasks } from "@/src/modules/tasks/hooks/useTasks";
import { TASK_VIEWS } from "@/src/modules/tasks/constants";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { TaskFilters } from "@/src/modules/tasks/components/TaskFilters";
import { TaskKanban } from "@/src/modules/tasks/components/TaskKanban";
import { TaskStats } from "@/src/modules/tasks/components/TaskStats";
import { TaskTable } from "@/src/modules/tasks/components/TaskTable";
import { TaskCard } from "@/src/modules/tasks/components/TaskCard";

const viewOptions = [
    { id: TASK_VIEWS.kanban, label: "Kanban" },
    { id: TASK_VIEWS.list, label: "List" },
    { id: TASK_VIEWS.calendar, label: "Calendar" },
    { id: TASK_VIEWS.timeline, label: "Timeline" },
] as const;

const dateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export function TasksPage() {
    const {
        tasks,
        statistics,
        loading,
        activeFilter,
        searchQuery,
        statusFilter,
        setActiveFilter,
        setSearchQuery,
        setStatusFilter,
        selectTask,
    } = useTasks();

    const [activeView, setActiveView] = useState<(typeof TASK_VIEWS)[keyof typeof TASK_VIEWS]>(TASK_VIEWS.kanban);
    const [calendarMonth, setCalendarMonth] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });

    const calendarDays = useMemo(() => {
        const firstDay = calendarMonth.getDay();
        const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
        return [
            ...Array.from({ length: firstDay }, () => null),
            ...Array.from({ length: daysInMonth }, (_, index) => new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index + 1)),
        ];
    }, [calendarMonth]);

    const tasksByDate = useMemo(() => {
        const grouped = new Map<string, typeof tasks>();
        for (const task of tasks) {
            const key = task.dueDate.slice(0, 10);
            grouped.set(key, [...(grouped.get(key) ?? []), task]);
        }
        return grouped;
    }, [tasks]);

    const timelineTasks = useMemo(
        () => [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
        [tasks],
    );

    if (loading) return <LoadingState label="Loading task management data" />;

    return (
        <PageTransition className="mx-auto max-w-[85rem] space-y-10">
            <header className="flex flex-col gap-4 border-b border-[var(--dos-border-subtle)] pb-8">
                <Badge variant="info" className="w-fit">Task OS Engine</Badge>
                <div>
                    <h1 className="dos-text-display">Task Management</h1>
                    <p className="mt-4 max-w-3xl dos-text-h3 text-[var(--dos-text-secondary)]">
                        Enterprise task management, execution tracking, and team coordination.
                    </p>
                </div>
            </header>

            <TaskStats statistics={statistics} />
            <TaskFilters
                activeFilter={activeFilter}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                onFilterChange={setActiveFilter}
                onSearchChange={setSearchQuery}
                onStatusChange={setStatusFilter}
            />

            <nav aria-label="Task views" className="flex flex-wrap gap-2 border-b border-[var(--dos-border-subtle)] pb-4">
                {viewOptions.map((view) => (
                    <button
                        key={view.id}
                        type="button"
                        aria-pressed={activeView === view.id}
                        onClick={() => setActiveView(view.id)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeView === view.id ? "bg-[var(--dos-text-primary)] text-[var(--dos-surface)]" : "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] hover:text-[var(--dos-text-primary)]"}`}
                    >
                        {view.label}
                    </button>
                ))}
            </nav>

            <section className="min-h-[60vh] rounded-[var(--dos-radius-2xl)] bg-[var(--dos-surface-secondary)]/50 p-4 sm:p-8">
                {activeView === TASK_VIEWS.kanban && <TaskKanban tasks={tasks} onSelectTask={(id) => void selectTask(id)} />}
                {activeView === TASK_VIEWS.list && <TaskTable tasks={tasks} onSelectTask={(id) => void selectTask(id)} />}

                {activeView === TASK_VIEWS.calendar && (
                    <div className="space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="dos-text-h2">Task calendar</h2>
                                <p className="dos-text-body-sm text-[var(--dos-text-secondary)]">Tasks grouped by their due dates</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button type="button" aria-label="Previous month" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-full border border-[var(--dos-border)] px-3 py-2">‹</button>
                                <span className="min-w-32 text-center font-semibold">{calendarMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</span>
                                <button type="button" aria-label="Next month" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-full border border-[var(--dos-border)] px-3 py-2">›</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-[var(--dos-text-tertiary)]">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day} className="py-2">{day}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((day, index) => {
                                if (!day) return <div key={`blank-${index}`} className="min-h-24 rounded-xl bg-[var(--dos-surface-tertiary)]/40" />;
                                const key = dateKey(day);
                                const dayTasks = tasksByDate.get(key) ?? [];
                                return (
                                    <div key={key} className="min-h-24 rounded-xl border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-2">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-semibold">{day.getDate()}</span>
                                            {dayTasks.length > 0 && <span className="rounded-full bg-[var(--dos-brand-primary)]/10 px-2 py-0.5 text-xs text-[var(--dos-brand-primary)]">{dayTasks.length}</span>}
                                        </div>
                                        <div className="space-y-1">
                                            {dayTasks.slice(0, 2).map((task) => (
                                                <button key={task.id} type="button" onClick={() => void selectTask(task.id)} className="block w-full truncate rounded-md bg-[var(--dos-surface-tertiary)] px-1.5 py-1 text-left text-[10px] hover:bg-[var(--dos-brand-primary)]/10">{task.title}</button>
                                            ))}
                                            {dayTasks.length > 2 && <p className="text-[10px] text-[var(--dos-text-tertiary)]">+{dayTasks.length - 2} more</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {tasks.length === 0 && <p className="rounded-xl border border-dashed border-[var(--dos-border)] p-6 text-center text-sm text-[var(--dos-text-secondary)]">No tasks match your current filters.</p>}
                    </div>
                )}

                {activeView === TASK_VIEWS.timeline && (
                    <div className="space-y-5">
                        <div>
                            <h2 className="dos-text-h2">Task timeline</h2>
                            <p className="dos-text-body-sm text-[var(--dos-text-secondary)]">Chronological view of task deadlines and ownership</p>
                        </div>
                        {timelineTasks.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-[var(--dos-border)] p-8 text-center text-sm text-[var(--dos-text-secondary)]">No tasks match your current filters.</p>
                        ) : (
                            <ol className="relative space-y-4 border-l-2 border-[var(--dos-border)] pl-5 sm:pl-7">
                                {timelineTasks.map((task) => (
                                    <li key={task.id} className="relative">
                                        <span className="absolute -left-[1.62rem] top-5 h-3 w-3 rounded-full border-2 border-[var(--dos-brand-primary)] bg-[var(--dos-surface-elevated)] sm:-left-[2.12rem]" />
                                        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[var(--dos-text-tertiary)]">
                                            <time dateTime={task.dueDate}>{new Date(`${task.dueDate.slice(0, 10)}T00:00:00`).toLocaleDateString()}</time>
                                            <span>•</span><span className="capitalize">{task.status.replace("_", " ")}</span>
                                        </div>
                                        <TaskCard task={task} onSelect={selectTask} compact />
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>
                )}
            </section>
        </PageTransition>
    );
}
