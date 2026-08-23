import { z } from "zod";

export type IntentAction = "VIEW" | "CREATE" | "EDIT" | "DELETE" | "QUERY";
export type IntentSource = "AI_FALLBACK";

export interface Intent {
    action: IntentAction;
    moduleHref: string;
    entityId?: string;
    context?: Record<string, unknown>;
    source: IntentSource;
    rawInput: string;
}

export interface IntentCandidate {
    action: IntentAction;
    moduleHref: string;
    confidence: number;
    reason: string;
}

export interface IntentResponse {
    primaryIntent?: Intent;
    candidates: IntentCandidate[];
}

export const IntentSchema = z.object({
    action: z.enum(["VIEW", "CREATE", "EDIT", "DELETE", "QUERY"]),
    moduleHref: z.string(),
    entityId: z.string().optional(),
    context: z.record(z.string(), z.unknown()).optional(),
    source: z.literal("AI_FALLBACK"),
    rawInput: z.string(),
});

export const IntentCandidateSchema = z.object({
    action: z.enum(["VIEW", "CREATE", "EDIT", "DELETE", "QUERY"]),
    moduleHref: z.string(),
    confidence: z.number().min(0).max(1),
    reason: z.string(),
});

export const IntentResponseSchema = z.object({
    primaryIntent: IntentSchema.optional(),
    candidates: z.array(IntentCandidateSchema).max(3),
});
