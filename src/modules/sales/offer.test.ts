import { describe, it, expect } from "vitest";
import { INITIAL_OFFER_KEY, getInitialServiceOffer } from "./offer";

describe("initial service offer", () => {
    it("resolves against the published catalog with complete commercial terms", () => {
        const offer = getInitialServiceOffer();
        expect(offer.offerKey).toBe(INITIAL_OFFER_KEY);
        expect(offer.title.length).toBeGreaterThan(0);
        expect(offer.scope.length).toBeGreaterThan(0);
        expect(offer.deliverables.length).toBeGreaterThan(0);
        expect(offer.exclusions.length).toBeGreaterThan(0);
        expect(offer.turnaround.length).toBeGreaterThan(0);
        expect(offer.acceptanceCriteria.length).toBeGreaterThan(0);
        expect(offer.acquisitionChannels).toContain("inbound-website");
    });
});
