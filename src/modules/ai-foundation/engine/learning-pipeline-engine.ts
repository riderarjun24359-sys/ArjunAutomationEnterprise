import type { LearningFeedback } from "../types";

const FEEDBACK: LearningFeedback[] = [
    { id: "fb-1", source: "agent-ba", feedback: "Requirements analysis was accurate but missed edge case", rating: 4, status: "reviewed", createdAt: new Date().toISOString() },
    { id: "fb-2", source: "agent-dev", feedback: "Generated code needed minor refactoring", rating: 3, status: "pending", createdAt: new Date().toISOString() },
    { id: "fb-3", source: "human-reviewer", feedback: "Architecture design approved with suggestions", rating: 5, status: "applied", createdAt: new Date().toISOString() },
];

export function getFeedbackQueue(status?: string): LearningFeedback[] {
    if (status) return FEEDBACK.filter((f) => f.status === status);
    return FEEDBACK;
}

export function captureFeedback(input: { source: string; feedback: string; rating: number }): LearningFeedback {
    return { id: `fb-${Date.now()}`, ...input, status: "pending", createdAt: new Date().toISOString() };
}

export function getHumanReviewQueue(): LearningFeedback[] {
    return FEEDBACK.filter((f) => f.status === "pending");
}

export function applyKnowledgeUpdate(id: string): LearningFeedback | null {
    const fb = FEEDBACK.find((f) => f.id === id);
    if (!fb) return null;
    fb.status = "applied";
    return fb;
}
