import type { CreateInterviewInput } from "@/src/modules/business-analyst/types";

/**
 * Discovery questionnaire → BA interview records (B, reuse).
 *
 * The published questionnaire lives at
 * brand-os/content/sales-kit/discovery-questionnaire.md and stays the single
 * source of question wording (no copy here — avoids drift). This adapter
 * validates collected { question, answer } pairs and shapes them into a
 * `CreateInterviewInput` for `businessAnalystService.createInterview`, so
 * discovery responses persist as requirements records instead of template
 * text. Empty answers are dropped but reported; a response with zero usable
 * answers is rejected.
 */

export interface DiscoveryAnswer {
    question: string;
    answer: string;
}

export interface DiscoveryInterviewInput {
    engagementId: string;
    stakeholderName: string;
    interviewKey?: string;
    answers: DiscoveryAnswer[];
}

export function buildDiscoveryInterviewInput(input: DiscoveryInterviewInput): CreateInterviewInput {
    if (!input.engagementId.trim()) throw new Error("Engagement id is required for discovery capture");
    if (!input.stakeholderName.trim()) throw new Error("Stakeholder name is required for discovery capture");
    const usable = input.answers.filter((a) => a.question.trim() && a.answer.trim());
    const dropped = input.answers.length - usable.length;
    if (usable.length === 0) throw new Error("Discovery capture needs at least one answered question");
    return {
        engagementId: input.engagementId.trim(),
        interviewKey: input.interviewKey?.trim() || `discovery-${Date.now()}`,
        stakeholderName: input.stakeholderName.trim(),
        questions: usable.map((a) => a.question.trim()),
        responses: usable.map((a) => a.answer.trim()),
        status: dropped > 0 ? `completed (${dropped} blank dropped)` : "completed",
    };
}
