import { describe, it, expect } from 'vitest';
import { enforcePolicy, getApprovedModels } from './ai-governance-engine';

describe("AI Governance Engine - Gemini", () => {
    it("should approve gemini-pro", () => {
        const approvedModels = getApprovedModels();
        expect(approvedModels).toContain("gemini-pro");
    });

    it("should allow policy enforcement for approved models", () => {
        const result = enforcePolicy("gemini-pro", "some valid output");
        expect(result.allowed).toBe(true);
    });

    it("should reject unapproved models", () => {
        const result = enforcePolicy("gemini-ultra-unapproved", "some valid output");
        expect(result.allowed).toBe(false);
    });
});
