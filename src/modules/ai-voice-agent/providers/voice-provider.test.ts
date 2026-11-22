import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { isValidIndianE164 } from "./voice-provider";

describe("isValidIndianE164", () => {
    it("accepts valid Indian mobile numbers in E.164 format", () => {
        expect(isValidIndianE164("+919876543210")).toBe(true);
        expect(isValidIndianE164("+916123456789")).toBe(true);
    });

    it("rejects numbers without the +91 country prefix", () => {
        expect(isValidIndianE164("9876543210")).toBe(false);
        expect(isValidIndianE164("0919876543210")).toBe(false);
    });

    it("rejects invalid Indian mobile prefixes and lengths", () => {
        expect(isValidIndianE164("+915123456789")).toBe(false);
        expect(isValidIndianE164("+91987654321")).toBe(false);
        expect(isValidIndianE164("+9198765432100")).toBe(false);
    });

    it("rejects formatting characters and whitespace", () => {
        expect(isValidIndianE164("+91 9876543210")).toBe(false);
        expect(isValidIndianE164("+91-9876543210")).toBe(false);
    });
});
