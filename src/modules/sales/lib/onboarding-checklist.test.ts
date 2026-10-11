import { describe, it, expect } from "vitest";
import { buildOnboardingChecklist } from "./onboarding-checklist";

describe("buildOnboardingChecklist", () => {
    it("covers prerequisites plus every offer acceptance criterion", () => {
        const items = buildOnboardingChecklist("Acme");
        const ids = items.map((i) => i.id);
        expect(ids).toContain("access-admin");
        expect(ids).toContain("scope-confirm");
        expect(ids).toContain("training");
        expect(ids).toContain("hypercare");
        expect(items.filter((i) => i.id.startsWith("accept-")).length).toBeGreaterThan(0);
        expect(items.every((i) => i.title && i.owner)).toBe(true);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("rejects blank client names", () => {
        expect(() => buildOnboardingChecklist("  ")).toThrow(/Client name/);
    });
});
