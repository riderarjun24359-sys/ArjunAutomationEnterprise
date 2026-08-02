export type TaskStatus = "todo" | "in_progress" | "review" | "blocked" | "done" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "critical" | "urgent";
export type TaskView = "kanban" | "list" | "calendar" | "timeline";
export type TaskFilter = "all" | "my_tasks" | "overdue" | "due_this_week" | "high_priority" | "unassigned";

export interface TaskAssignee {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: string;
    capacity: string;
}

export interface TaskLabel {
    id: string;
    name: string;
    color: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignee: TaskAssignee | null;
    labels: TaskLabel[];
    projectId?: string;
    projectName?: string;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    estimatedHours?: number;
    completedHours?: number;
    tags?: string[];
}

export interface TaskStatistics {
    total: number;
    todo: number;
    inProgress: number;
    review: number;
    blocked: number;
    done: number;
    overdue: number;
    dueThisWeek: number;
    completionRate: string;
    avgCycleTime: string;
}

export interface CreateTaskInput {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId?: string;
    labelIds?: string[];
    projectName?: string;
    dueDate: string;
    estimatedHours?: number;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    assigneeId?: string | null;
    labelIds?: string[];
    projectName?: string;
    dueDate?: string;
    estimatedHours?: number;
    completedHours?: number;
}
