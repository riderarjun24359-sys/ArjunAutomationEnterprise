import { z } from "zod";

export const clientSchema = z.object({
    name: z.string().min(2, "Client name is required"),
    status: z.enum(["lead", "active", "inactive", "at_risk"]),
    industry: z.enum(["saas", "manufacturing", "healthcare", "retail", "finance", "education"]),
    contactEmail: z.string().email("Enter a valid email"),
    manager: z.string().min(2, "Manager is required"),
    phone: z.string().min(4, "Phone is required"),
    website: z.string().url("Enter a valid URL").or(z.literal("")),
    address: z.string().min(2, "Address is required"),
    description: z.string().min(10, "Add a short description"),
});

export const leadSchema = z.object({
    company: z.string().min(2, "Company is required"),
    contact: z.string().min(2, "Contact is required"),
    stage: z.enum(["new", "qualified", "proposal", "negotiation", "won", "lost"]),
    score: z.number().min(0).max(100),
    value: z.string().min(1, "Value is required"),
    assignedTo: z.string().min(2, "Assigned to is required"),
});

export const taskSchema = z.object({
    title: z.string().min(2, "Task title is required"),
    assignee: z.string().min(2, "Assignee is required"),
    dueDate: z.string().min(1, "Due date is required"),
    priority: z.enum(["low", "medium", "high"]),
    status: z.enum(["pending", "in_progress", "completed"]),
});
