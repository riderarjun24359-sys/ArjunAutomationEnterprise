import { describe, it, expect } from "vitest";
import { isBlockedByOptOut } from "./consent-gate";

describe("isBlockedByOptOut", () => {
    it("blocks active same-channel opt-outs case-insensitively", () => {
        const optOuts = [{ optOutKey: "Priya@Example.com", channelType: "email", status: "active" }];
        expect(isBlockedByOptOut(optOuts, "priya@example.com", "email")).toBe(true);
    });

    it("honors the all-channel wildcard", () => {
        const optOuts = [{ optOutKey: "a@x.com", channelType: "all", status: "active" }];
        expect(isBlockedByOptOut(optOuts, "a@x.com", "sms")).toBe(true);
    });

    it("ignores revoked records, other channels, and other recipients", () => {
        expect(isBlockedByOptOut([{ optOutKey: "a@x.com", channelType: "email", status: "revoked" }], "a@x.com", "email")).toBe(false);
        expect(isBlockedByOptOut([{ optOutKey: "a@x.com", channelType: "sms", status: "active" }], "a@x.com", "email")).toBe(false);
        expect(isBlockedByOptOut([{ optOutKey: "b@x.com", channelType: "email", status: "active" }], "a@x.com", "email")).toBe(false);
        expect(isBlockedByOptOut([], "a@x.com", "email")).toBe(false);
        expect(isBlockedByOptOut([{ optOutKey: "a@x.com", channelType: "email", status: "active" }], "", "email")).toBe(false);
    });
});
