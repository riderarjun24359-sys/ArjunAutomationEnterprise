import { describe, expect, it } from "vitest";
import { resolveSafeAuthRedirect } from "./safe-auth-redirect";

describe("resolveSafeAuthRedirect", () => {
    const origin = "https://www.arjunautomations.com";

    it("keeps same-origin paths and query strings", () => {
        expect(resolveSafeAuthRedirect({
            next: "/projects?view=active",
            origin,
            fallback: "/dashboard",
        })).toBe("https://www.arjunautomations.com/projects?view=active");
    });

    it("rejects protocol-relative and absolute external destinations", () => {
        for (const next of [
            "//attacker.example/path",
            "/\\\\attacker.example/path",
            "https://attacker.example/path",
            "@attacker.example",
            "https://www.arjunautomations.com@attacker.example/path",
            "javascript:alert(1)",
        ]) {
            expect(resolveSafeAuthRedirect({ next, origin, fallback: "/dashboard" }))
                .toBe("https://www.arjunautomations.com/dashboard");
        }
    });

    it("uses the fallback for missing or malformed destinations", () => {
        expect(resolveSafeAuthRedirect({ next: null, origin, fallback: "/dashboard" }))
            .toBe("https://www.arjunautomations.com/dashboard");
        expect(resolveSafeAuthRedirect({ next: "http://[", origin, fallback: "/dashboard" }))
            .toBe("https://www.arjunautomations.com/dashboard");
    });

    it("rejects an invalid base origin safely", () => {
        expect(resolveSafeAuthRedirect({ next: "/projects", origin: "not-a-url", fallback: "/dashboard" }))
            .toBe("/");
    });
});
