import { describe, it, expect } from "vitest";
import { executeCapabilityAction } from "./capability-executor";

describe("capability-executor honesty", () => {
    it("refuses to fabricate agreement signatures", async () => {
        const result = await executeCapabilityAction("businessAssets", "sign-agreement", {
            authUserId: "u",
            email: "e@x.com",
            payload: { clientId: "c1", agreementId: "a1" },
        });
        expect(result.processed).toBe(false);
        expect(String(result.error)).toMatch(/human authorization/);
        expect(result).not.toHaveProperty("signed");
    });

    it("drafts proposals from catalog data without claiming approval", async () => {
        const result = await executeCapabilityAction("businessAssets", "generate-proposal", {
            authUserId: "u",
            email: "e@x.com",
            payload: { clientName: "Acme", amount: 100000 },
        });
        expect(result.processed).toBe(true);
        expect(result.persisted).toBe(false);
        expect(result.approvalRequired).toBe(true);
        expect(result).not.toHaveProperty("proposalRef");
    });

    it("rejects proposal drafts without client and amount", async () => {
        const result = await executeCapabilityAction("businessAssets", "generate-proposal", {
            authUserId: "u",
            email: "e@x.com",
            payload: {},
        });
        expect(result.processed).toBe(false);
    });

    it("refuses mock onboarding instead of reporting success", async () => {
        const result = await executeCapabilityAction("clientSuccess", "run-onboarding", {
            authUserId: "u",
            email: "e@x.com",
            payload: { clientId: "c1" },
        });
        expect(result.processed).toBe(false);
        expect(String(result.error)).toMatch(/real onboarding wizard/);
    });
});
