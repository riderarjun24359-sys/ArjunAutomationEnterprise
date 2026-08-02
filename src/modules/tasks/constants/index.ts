export const TASK_STATUS = {
    todo: "todo",
    in_progress: "in_progress",
    review: "review",
    blocked: "blocked",
    done: "done",
    cancelled: "cancelled",
} as const;

export const TASK_PRIORITY = {
    low: "low",
    medium: "medium",
    high: "high",
    critical: "critical",
    urgent: "urgent",
} as const;

export const TASK_VIEWS = {
    kanban: "kanban",
    list: "list",
    calendar: "calendar",
    timeline: "timeline",
} as const;

export const TASK_FILTERS = {
    all: "all",
    myTasks: "my_tasks",
    overdue: "overdue",
    dueThisWeek: "due_this_week",
    highPriority: "high_priority",
    unassigned: "unassigned",
} as const;

export const TASK_STATUS_OPTIONS = [
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "blocked", label: "Blocked" },
    { value: "done", label: "Done" },
    { value: "cancelled", label: "Cancelled" },
] as const;

export const TASK_PRIORITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
    { value: "urgent", label: "Urgent" },
] as const;

export const KANBAN_COLUMNS: { status: (typeof TASK_STATUS)[keyof typeof TASK_STATUS]; label: string }[] = [
    { status: TASK_STATUS.todo, label: "To Do" },
    { status: TASK_STATUS.in_progress, label: "In Progress" },
    { status: TASK_STATUS.review, label: "Review" },
    { status: TASK_STATUS.blocked, label: "Blocked" },
    { status: TASK_STATUS.done, label: "Done" },
];
