import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  status: z.enum(["planning", "active", "on_hold", "completed", "archived"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  budget: z.string().min(1, "Budget is required"),
  timeline: z.string().min(1, "Timeline is required"),
  owner: z.string().min(2, "Owner is required"),
  description: z.string().min(10, "Description is required"),
  template: z.string().min(2, "Template is required"),
  client: z.string().min(2, "Client is required"),
});

export const milestoneSchema = z.object({
  title: z.string().min(2, "Milestone title is required"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["pending", "in_progress", "completed"]),
  progress: z.number().min(0).max(100),
});

export const taskSchema = z.object({
  title: z.string().min(2, "Task title is required"),
  status: z.enum(["todo", "in_progress", "review", "done"]),
  assignee: z.string().min(2, "Assignee is required"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["low", "medium", "high", "critical"]),
});
