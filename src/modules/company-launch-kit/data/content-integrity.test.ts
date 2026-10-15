import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

/**
 * Content-integrity guard for the public marketing site.
 *
 * The public site must not publish unverifiable operational claims
 * (round-the-clock monitoring, SLA-backed response, uptime percentages,
 * fabricated client proof) unless the underlying capability is actually
 * verified. These patterns previously appeared in shipped copy; this test
 * fails if any of them is reintroduced.
 */
const ROOT = process.cwd();

const PUBLIC_CONTENT_FILES = [
    "src/modules/company-launch-kit/data/home-content.ts",
    "src/modules/company-launch-kit/data/pricing.ts",
    "src/modules/company-launch-kit/data/services.ts",
    "src/modules/trust-conversion/data/trust-conversion-content.ts",
];

const BANNED_PATTERNS: Array<{ pattern: RegExp; why: string }> = [
    { pattern: /\b24\/7\b/, why: "unverifiable round-the-clock operational claim" },
    { pattern: /SLA-backed/i, why: "unverifiable SLA-backed response claim" },
    { pattern: /99\.9%\s*(uptime|SLA)/i, why: "unverifiable uptime statistic" },
    { pattern: /Live\s+Health\s+Endpoints/i, why: "unverifiable endpoint/uptime metric" },
];

function read(relativePath: string): string {
    return readFileSync(join(ROOT, relativePath), "utf8");
}

describe("public marketing content integrity", () => {
    for (const file of PUBLIC_CONTENT_FILES) {
        it(`${file} contains no unverifiable operational claims`, () => {
            const source = read(file);
            const violations = BANNED_PATTERNS.filter(({ pattern }) => pattern.test(source)).map(
                ({ pattern, why }) => `${why} (${pattern})`,
            );
            expect(violations, `${file} reintroduced: ${violations.join("; ")}`).toEqual([]);
        });
    }

    it("the trust section does not present industries as clients", () => {
        const header = read("src/modules/trust-conversion/data/trust-conversion-content.ts");
        const section = read("src/modules/trust-conversion/components/sections/TrustedBySection.tsx");

        // "Trusted by" implies named clients; the strip actually lists target
        // industries, so it must be labelled as such.
        expect(section).not.toMatch(/Trusted by/);
        expect(section).not.toMatch(/aria-label="Enterprise clients"/);
        expect(section).toMatch(/Industries we build for/);
        expect(header).toContain("clientLogos");
    });
});
