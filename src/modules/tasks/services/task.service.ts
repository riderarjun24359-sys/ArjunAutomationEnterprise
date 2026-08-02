import type { CreateTaskInput, Task, TaskAssignee, TaskLabel, TaskStatistics, UpdateTaskInput } from "@/src/modules/tasks/types";

const assignees: TaskAssignee[] = [
    { id: "assignee-1", name: "Mina Park", email: "mina.park@acme.io", role: "Engineering Lead", capacity: "92%" },
    { id: "assignee-2", name: "Lina Ortiz", email: "lina.ortiz@acme.io", role: "Product Manager", capacity: "78%" },
    { id: "assignee-3", name: "Jordan Lee", email: "jordan.lee@acme.io", role: "Senior Developer", capacity: "85%" },
    { id: "assignee-4", name: "Drew Hsu", email: "drew.hsu@acme.io", role: "Operations Manager", capacity: "64%" },
    { id: "assignee-5", name: "Sara Chen", email: "sara.chen@acme.io", role: "QA Engineer", capacity: "71%" },
];

const labels: TaskLabel[] = [
    { id: "label-1", name: "Infrastructure", color: "emerald" },
    { id: "label-2", name: "Client Delivery", color: "blue" },
    { id: "label-3", name: "Compliance", color: "amber" },
    { id: "label-4", name: "Automation", color: "violet" },
    { id: "label-5", name: "Security", color: "rose" },
];

let tasks: Task[] = [
    {
        id: "task-1",
        title: "Finalize enterprise rollout plan",
        description: "Complete the phased rollout strategy for Northstar Labs across all business units.",
        status: "in_progress",
        priority: "critical",
        assignee: assignees[0],
        labels: [labels[0], labels[1]],
        projectId: "project-1",
        projectName: "Northstar Expansion",
        dueDate: "2026-08-06",
        createdAt: "2026-07-28T09:00:00Z",
        updatedAt: "2026-08-01T14:30:00Z",
        estimatedHours: 16,
        completedHours: 10,
        tags: ["rollout", "enterprise"],
    },
    {
        id: "task-2",
        title: "Review integration requirements",
        description: "Audit third-party API integration requirements and document compatibility matrix.",
        status: "todo",
        priority: "high",
        assignee: assignees[2],
        labels: [labels[0], labels[4]],
        projectId: "project-1",
        projectName: "Northstar Expansion",
        dueDate: "2026-08-08",
        createdAt: "2026-07-29T11:00:00Z",
        updatedAt: "2026-07-29T11:00:00Z",
        estimatedHours: 8,
        completedHours: 0,
        tags: ["integration", "api"],
    },
    {
        id: "task-3",
        title: "Prepare SOC 2 evidence package",
        description: "Compile audit evidence for access controls, change management, and incident response.",
        status: "review",
        priority: "critical",
        assignee: assignees[3],
        labels: [labels[2], labels[4]],
        projectName: "Compliance Program",
        dueDate: "2026-08-05",
        createdAt: "2026-07-20T08:00:00Z",
        updatedAt: "2026-08-01T16:00:00Z",
        estimatedHours: 24,
        completedHours: 22,
        tags: ["compliance", "audit"],
    },
    {
        id: "task-4",
        title: "Automate client onboarding workflow",
        description: "Build end-to-end automation for client provisioning, document collection, and kickoff scheduling.",
        status: "in_progress",
        priority: "high",
        assignee: assignees[1],
        labels: [labels[3], labels[1]],
        projectName: "Client Onboarding",
        dueDate: "2026-08-12",
        createdAt: "2026-07-25T10:00:00Z",
        updatedAt: "2026-08-02T09:15:00Z",
        estimatedHours: 32,
        completedHours: 18,
        tags: ["automation", "onboarding"],
    },
    {
        id: "task-5",
        title: "Resolve production deployment blocker",
        description: "Investigate and fix the CI/CD pipeline failure blocking the FinOps Refresh release.",
        status: "blocked",
        priority: "urgent",
        assignee: assignees[2],
        labels: [labels[0], labels[4]],
        projectId: "project-2",
        projectName: "FinOps Refresh",
        dueDate: "2026-08-03",
        createdAt: "2026-08-01T07:00:00Z",
        updatedAt: "2026-08-02T08:00:00Z",
        estimatedHours: 6,
        completedHours: 2,
        tags: ["deployment", "blocker"],
    },
    {
        id: "task-6",
        title: "Complete regression test suite",
        description: "Execute full regression suite for the Q3 release candidate and document results.",
        status: "done",
        priority: "medium",
        assignee: assignees[4],
        labels: [labels[1]],
        projectName: "Northstar Expansion",
        dueDate: "2026-07-30",
        createdAt: "2026-07-15T09:00:00Z",
        updatedAt: "2026-07-30T17:00:00Z",
        estimatedHours: 12,
        completedHours: 12,
        tags: ["qa", "release"],
    },
    {
        id: "task-7",
        title: "Update executive dashboard metrics",
        description: "Refresh KPI definitions and wire new data sources into the executive dashboard.",
        status: "todo",
        priority: "medium",
        assignee: null,
        labels: [labels[3]],
        projectName: "Analytics Platform",
        dueDate: "2026-08-15",
        createdAt: "2026-08-01T12:00:00Z",
        updatedAt: "2026-08-01T12:00:00Z",
        estimatedHours: 10,
        completedHours: 0,
        tags: ["analytics", "dashboard"],
    },
    {
        id: "task-8",
        title: "Draft vendor security assessment",
        description: "Evaluate third-party vendor security posture and produce risk assessment report.",
        status: "todo",
        priority: "high",
        assignee: assignees[3],
        labels: [labels[4], labels[2]],
        projectName: "Vendor Management",
        dueDate: "2026-08-01",
        createdAt: "2026-07-22T14:00:00Z",
        updatedAt: "2026-07-22T14:00:00Z",
        estimatedHours: 14,
        completedHours: 0,
        tags: ["security", "vendor"],
    },
];

const resolveAssignee = (assigneeId?: string): TaskAssignee | null => {
    if (!assigneeId) {
        return null;
    }

    return assignees.find((assignee) => assignee.id === assigneeId) ?? null;
};

const resolveLabels = (labelIds?: string[]): TaskLabel[] => {
    if (!labelIds?.length) {
        return [];
    }

    return labels.filter((label) => labelIds.includes(label.id));
};

const computeStatistics = (taskList: Task[]): TaskStatistics => {
    const now = new Date("2026-08-02");
    const weekEnd = new Date("2026-08-09");

    const overdue = taskList.filter((task) => task.status !== "done" && task.status !== "cancelled" && new Date(task.dueDate) < now).length;
    const dueThisWeek = taskList.filter((task) => {
        const due = new Date(task.dueDate);
        return due >= now && due <= weekEnd && task.status !== "done" && task.status !== "cancelled";
    }).length;

    const done = taskList.filter((task) => task.status === "done").length;
    const total = taskList.filter((task) => task.status !== "cancelled").length;

    return {
        total: taskList.length,
        todo: taskList.filter((task) => task.status === "todo").length,
        inProgress: taskList.filter((task) => task.status === "in_progress").length,
        review: taskList.filter((task) => task.status === "review").length,
        blocked: taskList.filter((task) => task.status === "blocked").length,
        done,
        overdue,
        dueThisWeek,
        completionRate: total > 0 ? `${Math.round((done / total) * 100)}%` : "0%",
        avgCycleTime: "3.2 days",
    };
};

export class TaskService {
    async getTasks(): Promise<Task[]> {
        return [...tasks];
    }

    async getTask(id: string): Promise<Task | undefined> {
        return tasks.find((task) => task.id === id);
    }

    async createTask(input: CreateTaskInput): Promise<Task> {
        const task: Task = {
            id: `task-${Date.now()}`,
            title: input.title,
            description: input.description,
            status: input.status,
            priority: input.priority,
            assignee: resolveAssignee(input.assigneeId),
            labels: resolveLabels(input.labelIds),
            projectName: input.projectName,
            dueDate: input.dueDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            estimatedHours: input.estimatedHours,
            completedHours: 0,
        };

        tasks = [task, ...tasks];
        return task;
    }

    async updateTask(id: string, input: UpdateTaskInput): Promise<Task | undefined> {
        const index = tasks.findIndex((task) => task.id === id);
        if (index === -1) {
            return undefined;
        }

        const current = tasks[index];
        const updated: Task = {
            ...current,
            ...input,
            assignee: input.assigneeId !== undefined ? resolveAssignee(input.assigneeId ?? undefined) : current.assignee,
            labels: input.labelIds !== undefined ? resolveLabels(input.labelIds) : current.labels,
            updatedAt: new Date().toISOString(),
        };

        tasks[index] = updated;
        return updated;
    }

    async deleteTask(id: string): Promise<boolean> {
        const initialLength = tasks.length;
        tasks = tasks.filter((task) => task.id !== id);
        return tasks.length < initialLength;
    }

    async getStatistics(): Promise<TaskStatistics> {
        return computeStatistics(tasks);
    }

    async getAssignees(): Promise<TaskAssignee[]> {
        return [...assignees];
    }

    async getLabels(): Promise<TaskLabel[]> {
        return [...labels];
    }
}

export const taskService = new TaskService();
