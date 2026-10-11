import { describe, it, expect } from "vitest";
import { buildProposalDraft } from "./proposal-draft";

describe("buildProposalDraft", () => {
    it("composes a draft that traces to the catalog offer and caller input", () => {
        const draft = buildProposalDraft({ clientName: "Acme Retail", opportunityName: "Flagship rollout", amount: 450000 });
        expect(draft.title).toContain("Acme Retail");
        expect(draft.title).toContain("Flagship rollout");
        expect(draft.executiveSummary).toContain("4,50,000");
        expect(draft.content).toContain("## Scope");
        expect(draft.content).toContain("## Deliverables");
        expect(draft.content).toContain("## Exclusions");
        expect(draft.content).toContain("## Acceptance criteria");
        expect(draft.content).toContain("review sign-off");
        expect(draft.deliverables.length).toBeGreaterThan(0);
    });

    it("rejects missing client and non-positive amounts", () => {
        expect(() => buildProposalDraft({ clientName: "  ", amount: 100 })).toThrow(/Client name/);
        expect(() => buildProposalDraft({ clientName: "Acme", amount: 0 })).toThrow(/greater than zero/);
        expect(() => buildProposalDraft({ clientName: "Acme", amount: Number.NaN })).toThrow(/greater than zero/);
    });
});
