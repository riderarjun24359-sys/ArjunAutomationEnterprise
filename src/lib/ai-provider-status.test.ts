import { describe, it, expect } from "vitest";
import { getAiProviderStatus, isGeminiEnabled, describeAiStatus } from "./ai-provider-status";

describe("ai-provider-status (local-first, Gemini optional)", () => {
    it("reports local fallback with zero keys and Gemini disabled", () => {
        const report = getAiProviderStatus({} as unknown as NodeJS.ProcessEnv);
        expect(report.aiAvailable).toBe(true);
        expect(report.externalLlmAvailable).toBe(false);
        expect(report.activeProvider).toBe("local");
        expect(report.disabledReason).toMatch(/no-external-llm-configured/);
        const gemini = report.providers.find((p) => p.id === "gemini");
        expect(gemini?.enabled).toBe(false);
        expect(gemini?.detail).toMatch(/disabled/);
        expect(isGeminiEnabled({} as unknown as NodeJS.ProcessEnv)).toBe(false);
    });

    it("enables Gemini only when its key is explicitly set", () => {
        const report = getAiProviderStatus({ GEMINI_API_KEY: "test-key" } as unknown as NodeJS.ProcessEnv);
        expect(report.externalLlmAvailable).toBe(true);
        expect(report.activeProvider).toBe("gemini");
        expect(report.disabledReason).toBeNull();
        expect(isGeminiEnabled({ GEMINI_API_KEY: "test-key" } as unknown as NodeJS.ProcessEnv)).toBe(true);
    });

    it("never leaks secret values in status output", () => {
        const report = getAiProviderStatus({ GEMINI_API_KEY: "super-secret-123" } as unknown as NodeJS.ProcessEnv);
        expect(JSON.stringify(report)).not.toContain("super-secret-123");
        expect(describeAiStatus({ GEMINI_API_KEY: "super-secret-123" } as unknown as NodeJS.ProcessEnv)).not.toContain(
            "super-secret-123",
        );
    });
});
