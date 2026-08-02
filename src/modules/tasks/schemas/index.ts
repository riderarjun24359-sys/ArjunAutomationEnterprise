import { z } from "zod";

export const taskSchema = z.object({
    title: z.string().min(2, "Task title is required"),
    description: z.string().min(5, "Description is required"),
    status: z.enum(["todo", "in_progress", "review", "blocked", "done", "cancelled"]),
    priority: z.enum(["low", "medium", "high", "critical", "urgent"]),
    assigneeId: z.string().optional(),
    labelIds: z.array(z.string()).optional(),
    projectName: z.string().optional(),
    dueDate: z.string().min(1, "Due date is required"),
    estimatedHours: z.number().min(0).optional(),
});

export const updateTaskSchema = taskSchema.partial();

export const taskFilterSchema = z.object({
    filter: z.enum(["all", "my_tasks", "overdue", "due_this_week", "high_priority", "unassigned"]),
    status: z.enum(["todo", "in_progress", "review", "blocked", "done", "cancelled"]).optional(),
    priority: z.enum(["low", "medium", "high", "critical", "urgent"]).optional(),
    search: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
export type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>;
export type TaskFilterValues = z.infer<typeof taskFilterSchema>;
