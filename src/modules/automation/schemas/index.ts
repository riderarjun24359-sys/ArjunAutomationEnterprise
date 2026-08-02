import { z } from "zod";

export const aiAgentFormSchema = z.object({
    name: z.string().min(2, "Agent name is required"),
    description: z.string().optional(),
    model: z.string().min(1, "Model is required"),
    systemPrompt: z.string().optional(),
    status: z.enum(["active", "inactive", "draft"]).optional(),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().min(256).max(128000).optional(),
});

export const workflowFormSchema = z.object({
    name: z.string().min(2, "Workflow name is required"),
    description: z.string().optional(),
    status: z.enum(["draft", "active", "paused", "archived"]).optional(),
    templateId: z.string().optional(),
    agentId: z.string().optional(),
    triggerType: z.enum(["event", "schedule", "webhook", "manual"]),
    eventName: z.string().optional(),
    actionType: z.enum(["notify", "email", "webhook", "ai_task", "create_task", "update_record", "delay"]),
    conditionField: z.string().optional(),
    conditionOperator: z.enum(["equals", "not_equals", "greater_than", "less_than", "contains"]).optional(),
    conditionValue: z.string().optional(),
    cronExpression: z.string().optional(),
    timezone: z.string().optional(),
});

export type AiAgentFormValues = z.infer<typeof aiAgentFormSchema>;
export type WorkflowFormValues = z.infer<typeof workflowFormSchema>;
