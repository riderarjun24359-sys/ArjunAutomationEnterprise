import { describe, it, expect } from "vitest";
import { qualifyLead } from "./lead-qualification";

describe("qualifyLead (mirrors policy-gates evaluateLeadQualify)", () => {
    it("qualifies complete leads from known sources", () => {
        expect(
            qualifyLead({ name: "Test Person", email: "t@example.com", company: "Example Co", source: "contact-page" }),
        ).toEqual({ verdict: "qualified", score: 3 });
    });

    it("leaves thin leads unqualified without rejecting them", () => {
        expect(qualifyLead({ name: "X", email: "x@example.com", company: "", source: "unknown-fair" })).toEqual({
            verdict: "unqualified",
            score: 0,
        });
    });

    it("treats placeholder company as absent", () => {
        expect(
            qualifyLead({ name: "Test Person", email: "t@example.com", company: "Unknown", source: "contact-page" }).score,
        ).toBe(2);
    });

    it("is deterministic across repeated evaluations", () => {
        const lead = { name: "Test Person", email: "t@example.com", company: "Example Co", source: "research-service" };
        expect(qualifyLead(lead)).toEqual(qualifyLead(lead));
    });
});
