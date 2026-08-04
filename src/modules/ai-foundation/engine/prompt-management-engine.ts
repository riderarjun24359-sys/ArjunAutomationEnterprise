import type { PromptTemplate } from "../types";

const PROMPTS: PromptTemplate[] = [
    { id: "prompt-1", name: "Client Onboarding", version: "2.1", content: "You are an onboarding assistant...", status: "approved", usageCount: 1240, approvedBy: "admin", approvedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    { id: "prompt-2", name: "Requirements Analysis", version: "1.4", content: "Analyze the following requirements...", status: "approved", usageCount: 890, approvedBy: "admin", approvedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    { id: "prompt-3", name: "Code Review", version: "3.0", content: "Review this code for...", status: "testing", usageCount: 45, createdAt: new Date().toISOString() },
];

export function getPrompts(status?: string): PromptTemplate[] {
    if (status) return PROMPTS.filter((p) => p.status === status);
    return PROMPTS;
}

export function getPromptVersions(name: string): PromptTemplate[] {
    return PROMPTS.filter((p) => p.name === name);
}

export function testPrompt(id: string): { passed: boolean; score: number } {
    const prompt = PROMPTS.find((p) => p.id === id);
    if (!prompt) return { passed: false, score: 0 };
    return { passed: true, score: 85 + Math.random() * 10 };
}

export function approvePrompt(id: string, approvedBy: string): PromptTemplate | null {
    const prompt = PROMPTS.find((p) => p.id === id);
    if (!prompt) return null;
    prompt.status = "approved";
    prompt.approvedBy = approvedBy;
    prompt.approvedAt = new Date().toISOString();
    return prompt;
}

export function rollbackPrompt(id: string): PromptTemplate | null {
    const prompt = PROMPTS.find((p) => p.id === id);
    if (!prompt) return null;
    const parts = prompt.version.split(".");
    parts[1] = String(Math.max(0, parseInt(parts[1] ?? "0", 10) - 1));
    prompt.version = parts.join(".");
    prompt.status = "draft";
    return prompt;
}

export function trackPromptUsage(id: string): void {
    const prompt = PROMPTS.find((p) => p.id === id);
    if (prompt) prompt.usageCount += 1;
}
