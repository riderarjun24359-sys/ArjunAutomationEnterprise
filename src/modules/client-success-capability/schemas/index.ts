import { z } from "zod";

export const changeRequestSchema = z.object({
    clientId: z.string().min(1, "Client is required"),
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    requestedBy: z.string().min(1, "Requester is required"),
    priority: z.enum(["low", "medium", "high", "critical"]),
});

export const clientLocaleSchema = z.object({
    clientId: z.string().min(1),
    locale: z.enum(["en", "hi", "es", "fr", "de", "ar", "ja", "pt"]),
});

export const onboardingTriggerSchema = z.object({
    clientId: z.string().min(1, "Client is required"),
});

export type ChangeRequestFormData = z.infer<typeof changeRequestSchema>;
export type ClientLocaleFormData = z.infer<typeof clientLocaleSchema>;
