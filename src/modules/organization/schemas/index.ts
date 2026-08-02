import { z } from "zod";

export const organizationSettingsSchema = z.object({
    name: z.string().min(2, "Organization name is required"),
    slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes"),
    status: z.enum(["active", "inactive", "suspended"]),
});

export const workspaceSchema = z.object({
    name: z.string().min(2, "Workspace name is required"),
    slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes"),
    status: z.enum(["active", "inactive"]),
});
