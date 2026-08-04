import { GOVERNANCE_POLICY_TYPES } from "../constants";
import type { GovernancePolicy } from "../types";

import { computeRiskScore, isApprovedModel, validateOutput } from "../lib/ai-governance-policies";

const POLICIES: GovernancePolicy[] = GOVERNANCE_POLICY_TYPES.map((type, i) => ({
    id: `policy-${type}`,
    type,
    name: type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    enforced: true,
    riskScore: 10 + i * 5,
    approvedModels: ["gpt-4", "claude-3", "gemini-pro"],
    lastReviewedAt: new Date().toISOString(),
}));

export function getGovernancePolicies(): GovernancePolicy[] {
    return POLICIES;
}

export function enforcePolicy(model: string, output: string): { allowed: boolean; riskScore: number; issues: string[] } {
    const policy = POLICIES.find((p) => p.type === "model");
    const approved = policy ? isApprovedModel(model, policy.approvedModels) : false;
    const validation = validateOutput(output);
    const riskScore = computeRiskScore({ modelUnapproved: !approved, outputInvalid: !validation.valid });
    return { allowed: approved && validation.valid, riskScore, issues: validation.issues };
}

export function getApprovedModels(): string[] {
    return POLICIES.find((p) => p.type === "model")?.approvedModels ?? [];
}

export function checkPiiProtection(content: string): boolean {
    return !/\b\d{3}-\d{2}-\d{4}\b/.test(content);
}

export function checkPromptSafety(prompt: string): boolean {
    return !prompt.toLowerCase().includes("ignore previous instructions");
}

