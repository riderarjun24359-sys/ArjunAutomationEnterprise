import { z } from "zod";

export const categoryFormSchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string(),
});

export const priorityFormSchema = z.object({
    name: z.string().min(2),
    level: z.number().min(1).max(10),
    color: z.string().min(4),
    responseHours: z.number().min(1),
});

export const slaFormSchema = z.object({
    name: z.string().min(2),
    priorityId: z.string().optional(),
    firstResponseMinutes: z.number().min(1),
    resolutionMinutes: z.number().min(1),
});

export const queueFormSchema = z.object({
    name: z.string().min(2),
    code: z.string().min(2),
    description: z.string(),
    defaultAssigneeId: z.string().optional(),
});

export const ticketFormSchema = z.object({
    ticketNumber: z.string().min(2),
    subject: z.string().min(2),
    description: z.string(),
    categoryId: z.string().optional(),
    priorityId: z.string().optional(),
    queueId: z.string().optional(),
    clientId: z.string().optional(),
    assignedAgentId: z.string().optional(),
});

export const noteFormSchema = z.object({
    ticketId: z.string().min(1),
    body: z.string().min(1),
    isInternal: z.boolean(),
});

export const attachmentFormSchema = z.object({
    ticketId: z.string().min(1),
    fileName: z.string().min(1),
    fileUrl: z.string().min(1),
    fileSize: z.number().min(0),
    mimeType: z.string().min(1),
});

export const knowledgeArticleFormSchema = z.object({
    title: z.string().min(2),
    slug: z.string().min(2),
    content: z.string(),
    categoryId: z.string().optional(),
});

export const cannedResponseFormSchema = z.object({
    title: z.string().min(2),
    shortcut: z.string().min(2),
    body: z.string().min(1),
});

export const escalationRuleFormSchema = z.object({
    name: z.string().min(2),
    triggerCondition: z.string().min(1),
    escalationLevel: z.number().min(1),
    targetQueueId: z.string().optional(),
});

export const portalSettingsFormSchema = z.object({
    portalEnabled: z.boolean(),
    welcomeMessage: z.string(),
    allowTicketCreation: z.boolean(),
    showKnowledgeBase: z.boolean(),
    customDomain: z.string(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type PriorityFormValues = z.infer<typeof priorityFormSchema>;
export type SlaFormValues = z.infer<typeof slaFormSchema>;
export type QueueFormValues = z.infer<typeof queueFormSchema>;
export type TicketFormValues = z.infer<typeof ticketFormSchema>;
export type NoteFormValues = z.infer<typeof noteFormSchema>;
export type AttachmentFormValues = z.infer<typeof attachmentFormSchema>;
export type KnowledgeArticleFormValues = z.infer<typeof knowledgeArticleFormSchema>;
export type CannedResponseFormValues = z.infer<typeof cannedResponseFormSchema>;
export type EscalationRuleFormValues = z.infer<typeof escalationRuleFormSchema>;
export type PortalSettingsFormValues = z.infer<typeof portalSettingsFormSchema>;
