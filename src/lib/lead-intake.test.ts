import { describe, it, expect } from "vitest";
import {
    PRIVACY_NOTICE_VERSION,
    findDuplicateLead,
    leadIntakeSchema,
    normalizeLeadEmail,
    normalizeLeadIntake,
    normalizeLeadSource,
} from "./lead-intake";

describe("lead-intake contract", () => {
    it("requires explicit privacy consent", () => {
        const base = { name: "A", email: "a@x.com", source: "website" };
        expect(leadIntakeSchema.safeParse(base).success).toBe(false);
        expect(leadIntakeSchema.safeParse({ ...base, consent: false }).success).toBe(false);
        expect(leadIntakeSchema.safeParse({ ...base, consent: true }).success).toBe(true);
    });

    it("rejects invalid email and blank name/source", () => {
        expect(leadIntakeSchema.safeParse({ name: "", email: "a@x.com", source: "s", consent: true }).success).toBe(false);
        expect(leadIntakeSchema.safeParse({ name: "A", email: "not-an-email", source: "s", consent: true }).success).toBe(false);
        expect(leadIntakeSchema.safeParse({ name: "A", email: "a@x.com", source: "", consent: true }).success).toBe(false);
    });

    it("normalizes email for stable dedup matching", () => {
        expect(normalizeLeadEmail("  Priya@Example.COM ")).toBe("priya@example.com");
    });

    it("maps source aliases without dropping unknown sources", () => {
        expect(normalizeLeadSource("website")).toBe("inbound-website");
        expect(normalizeLeadSource("Hyderabad Tech Meetup")).toBe("Hyderabad Tech Meetup");
    });

    it("finds duplicates case-insensitively", () => {
        const leads = [{ email: "Priya@Example.com" }, { email: "other@x.com" }];
        expect(findDuplicateLead(leads, "priya@example.COM")).toEqual({ email: "Priya@Example.com" });
        expect(findDuplicateLead(leads, "new@x.com")).toBeNull();
    });

    it("normalizes a full intake payload", () => {
        const out = normalizeLeadIntake({
            name: " Arjun ",
            email: "A@X.com",
            company: "",
            phone: "",
            message: "",
            source: "website",
            consent: true,
        });
        expect(out).toEqual({ name: "Arjun", email: "a@x.com", company: "", phone: "", message: "", source: "inbound-website" });
        expect(PRIVACY_NOTICE_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
});
