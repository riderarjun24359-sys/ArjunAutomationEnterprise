import { describe, expect, it } from "vitest";
import { isSuccessfulManualVerifyRedirect } from "./manual-verification-response";

describe("isSuccessfulManualVerifyRedirect", () => {
    it("accepts a trusted callback containing a PKCE code", () => {
        expect(isSuccessfulManualVerifyRedirect({
            status: 302,
            location: "https://www.arjunautomations.com/auth/callback?code=one-time-code",
        })).toBe(true);
    });

    it("accepts a trusted callback containing an access token fragment", () => {
        expect(isSuccessfulManualVerifyRedirect({
            status: 303,
            location: "https://www.arjunautomations.com/auth/callback#access_token=token",
        })).toBe(true);
    });

    it("rejects redirects carrying Supabase verification errors", () => {
        expect(isSuccessfulManualVerifyRedirect({
            status: 302,
            location: "https://www.arjunautomations.com/auth/callback?error=access_denied&error_code=otp_expired",
        })).toBe(false);
    });

    it("rejects redirects to an untrusted origin or path", () => {
        expect(isSuccessfulManualVerifyRedirect({
            status: 302,
            location: "https://attacker.example/auth/callback?code=abc",
        })).toBe(false);
        expect(isSuccessfulManualVerifyRedirect({
            status: 302,
            location: "https://www.arjunautomations.com/other?code=abc",
        })).toBe(false);
    });

    it("rejects empty redirects and non-redirect responses", () => {
        expect(isSuccessfulManualVerifyRedirect({ status: 302, location: null })).toBe(false);
        expect(isSuccessfulManualVerifyRedirect({
            status: 200,
            location: "https://www.arjunautomations.com/auth/callback?code=abc",
        })).toBe(false);
        expect(isSuccessfulManualVerifyRedirect({
            status: 302,
            location: "https://www.arjunautomations.com/auth/callback",
        })).toBe(false);
    });
});
