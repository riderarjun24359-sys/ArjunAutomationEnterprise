import type { CreateTaskInput, Task, TaskAssignee, TaskLabel, TaskStatistics, UpdateTaskInput } from "@/src/modules/tasks/types";
import type { DbProject, DbTask, DbTaskLabel } from "@/src/modules/database/types/platform";
import type { UserProfile } from "@/src/modules/database/types/core";

export const mapTaskLabel = (label: DbTaskLabel): TaskLabel => ({
    id: label.id,
    name: label.name,
    color: label.color,
});

export const mapTaskAssignee = (profile: UserProfile, fallbackName?: string | null): TaskAssignee => ({
    id: profile.id,
    name: profile.full_name ?? fallbackName ?? profile.email,
    email: profile.email,
    role: "Team Member",
    capacity: "80%",
});

export const mapTaskRecord = (task: DbTask, labels: TaskLabel[], project?: DbProject | null, assignee?: TaskAssignee | null): Task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as Task["status"],
    priority: task.priority as Task["priority"],
    assignee: assignee ?? (task.assignee_name ? { id: task.assignee_id ?? task.id, name: task.assignee_name, email: "", role: "Team Member", capacity: "80%" } : null),
    labels,
    projectId: task.project_id ?? undefined,
    projectName: project?.name,
    dueDate: task.due_date ?? new Date().toISOString().slice(0, 10),
    createdAt: task.created_at,
    updatedAt: task.updated_at,
    estimatedHours: task.estimated_hours ?? undefined,
    completedHours: task.completed_hours ?? undefined,
    tags: task.tags ?? undefined,
});

export const computeTaskStatistics = (tasks: Task[]): TaskStatistics => {
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const activeTasks = tasks.filter((task) => task.status !== "cancelled");
    const overdue = activeTasks.filter((task) => task.status !== "done" && new Date(task.dueDate) < now).length;
    const dueThisWeek = activeTasks.filter((task) => {
        const due = new Date(task.dueDate);
        return task.status !== "done" && due >= now && due <= weekEnd;
    }).length;
    const done = activeTasks.filter((task) => task.status === "done").length;

    return {
        total: tasks.length,
        todo: tasks.filter((task) => task.status === "todo").length,
        inProgress: tasks.filter((task) => task.status === "in_progress").length,
        review: tasks.filter((task) => task.status === "review").length,
        blocked: tasks.filter((task) => task.status === "blocked").length,
        done,
        overdue,
        dueThisWeek,
        completionRate: activeTasks.length > 0 ? `${Math.round((done / activeTasks.length) * 100)}%` : "0%",
        avgCycleTime: "3.2 days",
    };
};

export const buildCreateTaskPayload = (organizationId: string, input: CreateTaskInput) => ({
    organization_id: organizationId,
    title: input.title,
    description: input.description,
    status: input.status,
    priority: input.priority,
    assignee_id: input.assigneeId ?? null,
    due_date: input.dueDate,
    estimated_hours: input.estimatedHours ?? null,
    completed_hours: 0,
});

export const buildUpdateTaskPayload = (input: UpdateTaskInput) => {
    const payload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
    };

    if (input.title !== undefined) payload.title = input.title;
    if (input.description !== undefined) payload.description = input.description;
    if (input.status !== undefined) payload.status = input.status;
    if (input.priority !== undefined) payload.priority = input.priority;
    if (input.assigneeId !== undefined) payload.assignee_id = input.assigneeId;
    if (input.dueDate !== undefined) payload.due_date = input.dueDate;
    if (input.estimatedHours !== undefined) payload.estimated_hours = input.estimatedHours;
    if (input.completedHours !== undefined) payload.completed_hours = input.completedHours;

    return payload;
};
