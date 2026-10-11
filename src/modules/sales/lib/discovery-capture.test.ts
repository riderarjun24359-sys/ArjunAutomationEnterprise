import { describe, it, expect } from "vitest";
import { buildDiscoveryInterviewInput } from "./discovery-capture";

describe("buildDiscoveryInterviewInput", () => {
    it("maps answered pairs into interview input, dropping blanks", () => {
        const out = buildDiscoveryInterviewInput({
            engagementId: "eng-1",
            stakeholderName: "Priya",
            answers: [
                { question: "Company name and industry?", answer: "Acme Retail" },
                { question: "Top pain?", answer: "  " },
            ],
        });
        expect(out.engagementId).toBe("eng-1");
        expect(out.questions).toEqual(["Company name and industry?"]);
        expect(out.responses).toEqual(["Acme Retail"]);
        expect(out.status).toMatch(/1 blank dropped/);
    });

    it("rejects missing context and empty responses", () => {
        expect(() => buildDiscoveryInterviewInput({ engagementId: "", stakeholderName: "P", answers: [{ question: "Q", answer: "A" }] })).toThrow(/Engagement id/);
        expect(() => buildDiscoveryInterviewInput({ engagementId: "e", stakeholderName: "", answers: [{ question: "Q", answer: "A" }] })).toThrow(/Stakeholder/);
        expect(() => buildDiscoveryInterviewInput({ engagementId: "e", stakeholderName: "P", answers: [{ question: "Q", answer: " " }] })).toThrow(/at least one/);
    });
});
