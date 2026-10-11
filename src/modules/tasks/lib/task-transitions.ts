/**
 * Task status transitions (F, project/task execution).
 *
 * Pure lifecycle rules: todo → in_progress/blocked/cancelled;
 * in_progress → review/blocked/cancelled; review → done/in_progress/blocked;
 * blocked → todo/in_progress/cancelled; done/cancelled are terminal.
 * Unknown statuses fail closed.
 */

export const TASK_STATUSES = ["todo", "in_progress", "review", "blocked", "done", "cancelled"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

const TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
    todo: ["in_progress", "blocked", "cancelled"],
    in_progress: ["review", "blocked", "cancelled"],
    review: ["done", "in_progress", "blocked"],
    blocked: ["todo", "in_progress", "cancelled"],
    done: [],
    cancelled: [],
};

export function isTaskTransitionAllowed(from: string, to: string): boolean {
    if (from === to) return true;
    if (!(TASK_STATUSES as readonly string[]).includes(from)) return false;
    if (!(TASK_STATUSES as readonly string[]).includes(to)) return false;
    return TRANSITIONS[from as TaskStatus].includes(to as TaskStatus);
}
