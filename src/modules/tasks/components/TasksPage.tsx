"use client";

import { useState } from "react";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { Badge } from "@/src/design-os/components/Badge";
import { useTasks } from "@/src/modules/tasks/hooks/useTasks";
import { TASK_VIEWS } from "@/src/modules/tasks/constants";
import { LoadingState } from "@/src/components/ui/LoadingState";
import { TaskFilters } from "@/src/modules/tasks/components/TaskFilters";
import { TaskKanban } from "@/src/modules/tasks/components/TaskKanban";
import { TaskStats } from "@/src/modules/tasks/components/TaskStats";
import { TaskTable } from "@/src/modules/tasks/components/TaskTable";

const viewOptions = [
    { id: TASK_VIEWS.kanban, label: "Kanban" },
    { id: TASK_VIEWS.list, label: "List" },
    { id: TASK_VIEWS.calendar, label: "Calendar" },
    { id: TASK_VIEWS.timeline, label: "Timeline" },
] as const;

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

    if (loading) {
        return <LoadingState label="Loading task management data" />;
    }

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

            <nav className="flex flex-wrap gap-2 border-b border-[var(--dos-border-subtle)] pb-4">
                {viewOptions.map((view) => (
                    <button
                        key={view.id}
                        type="button"
                        onClick={() => setActiveView(view.id)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeView === view.id ? "bg-[var(--dos-text-primary)] text-[var(--dos-surface)]" : "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] hover:text-[var(--dos-text-primary)]"}`}
                    >
                        {view.label}
                    </button>
                ))}
            </nav>

            <section className="min-h-[60vh] rounded-[var(--dos-radius-2xl)] bg-[var(--dos-surface-secondary)]/50 p-8">
                {activeView === TASK_VIEWS.kanban ? <TaskKanban tasks={tasks} onSelectTask={(id) => void selectTask(id)} /> : null}
                {activeView === TASK_VIEWS.list ? <TaskTable tasks={tasks} onSelectTask={(id) => void selectTask(id)} /> : null}
                
                {/* Visual placeholders for remaining views styled for OS consistency */}
                {activeView !== TASK_VIEWS.kanban && activeView !== TASK_VIEWS.list && (
                    <div className="dos-text-secondary text-center p-12">
                        <p>Module section: {viewOptions.find(v => v.id === activeView)?.label} (Redesigned for OS consistency)</p>
                    </div>
                )}
            </section>
        </PageTransition>
    );
}
