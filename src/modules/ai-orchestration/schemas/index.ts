import { z } from "zod";

export const providerFormSchema = z.object({ name: z.string().min(2), providerKey: z.string().min(2), apiBaseUrl: z.string().url().or(z.literal("")), isDefault: z.boolean().optional() });
export const modelRouteFormSchema = z.object({ name: z.string().min(2), providerId: z.string().min(1), modelId: z.string().min(1), priority: z.number().min(0), routingStrategy: z.string().min(1), fallbackProviderId: z.string().optional() });
export const agentFormSchema = z.object({ name: z.string().min(2), agentType: z.string().min(1), providerId: z.string().optional(), modelRouteId: z.string().optional(), workflowAgentId: z.string().optional() });
export const promptTemplateFormSchema = z.object({ name: z.string().min(2), templateKey: z.string().min(2), category: z.string().min(1), content: z.string().min(10) });
export const sessionFormSchema = z.object({ sessionKey: z.string().min(4), agentId: z.string().optional(), moduleSource: z.string().min(1), entityType: z.string(), entityId: z.string().optional(), expiresAt: z.string().optional() });
export const taskFormSchema = z.object({ taskType: z.string().min(1), agentId: z.string().optional(), sessionId: z.string().optional(), providerId: z.string().optional() });
export const rateLimitFormSchema = z.object({ scopeType: z.string().min(1), scopeId: z.string().optional(), requestsPerMinute: z.number().min(1), tokensPerDay: z.number().min(1) });
export const permissionGrantFormSchema = z.object({ granteeType: z.string().min(1), granteeId: z.string().optional(), permissionKey: z.string().min(1), resourceType: z.string().min(1), resourceId: z.string().optional() });
export const retryPolicyFormSchema = z.object({ name: z.string().min(2), maxRetries: z.number().min(0), backoffStrategy: z.string().min(1), fallbackRouteId: z.string().optional() });

export type ProviderFormValues = z.infer<typeof providerFormSchema>;
export type ModelRouteFormValues = z.infer<typeof modelRouteFormSchema>;
export type AgentFormValues = z.infer<typeof agentFormSchema>;
export type PromptTemplateFormValues = z.infer<typeof promptTemplateFormSchema>;
export type SessionFormValues = z.infer<typeof sessionFormSchema>;
export type TaskFormValues = z.infer<typeof taskFormSchema>;
export type RateLimitFormValues = z.infer<typeof rateLimitFormSchema>;
export type PermissionGrantFormValues = z.infer<typeof permissionGrantFormSchema>;
export type RetryPolicyFormValues = z.infer<typeof retryPolicyFormSchema>;
