import { describe, it, expect } from "vitest";
import { buildDefaultAnalytics, canAdvanceToStage, generateAiRecommendations, runAutomationPipeline, runQualityVerification } from "./delivery-engine.helpers";
import type { EngagementRecord } from "../types";
import { buildAcceptanceApprovalInput } from "./delivery-acceptance";

describe("delivery honesty slice", () => {
    it("queues pipelines as pending instead of claiming success", () => {
        const run = runAutomationPipeline("quality", "eng-1");
        expect(run.status).toBe("pending");
        expect(run.durationMs).toBe(0);
        expect(run.summary).toMatch(/no local executor/i);
    });

    it("reports quality dimensions as manual-verification-required, never fabricated", () => {
        const report = runQualityVerification("eng-1");
        expect(report.passed).toBe(false);
        expect(report.dimensions.length).toBeGreaterThan(0);
        for (const dim of report.dimensions) {
            expect(dim.passed).toBe(false);
            expect(dim.findings).toMatch(/manual verification required/i);
        }
    });

    it("derives suggestions only from engagement state, never invents data", () => {
        expect(generateAiRecommendations([])).toEqual([]);
        const recs = generateAiRecommendations([
            { id: "e1", title: "Website build", status: "active", playbookStage: "build", blueprintKey: "" } as unknown as EngagementRecord,
        ]);
        expect(JSON.stringify(recs)).not.toMatch(/3 similar|~30%|AI recommends/);
        expect(buildDefaultAnalytics(0, 0).clientSatisfactionScore).toBe(0);
    });

    it("blocks deployment/support until every recorded verification passes", () => {
        expect(canAdvanceToStage("build", [])).toEqual({ allowed: true });
        expect(canAdvanceToStage("deployment", []).allowed).toBe(false);
        expect(canAdvanceToStage("deployment", [{ passed: true }, { passed: false }]).allowed).toBe(false);
        expect(canAdvanceToStage("deployment", [{ passed: true }, { passed: true }])).toEqual({ allowed: true });
        expect(canAdvanceToStage("support", [{ passed: true }])).toEqual({ allowed: true });
    });

    it("builds pending acceptance approvals that never auto-approve", () => {
        const input = buildAcceptanceApprovalInput("eng-1", { reviewerId: "rev-1", comments: "UAT complete" });
        expect(input).toEqual({
            engagementId: "eng-1",
            entityType: "delivery-acceptance",
            entityId: "eng-1",
            reviewerId: "rev-1",
            approvalStatus: "pending",
            comments: "UAT complete",
        });
        expect(() => buildAcceptanceApprovalInput("  ")).toThrow(/Engagement id/);
    });
});
