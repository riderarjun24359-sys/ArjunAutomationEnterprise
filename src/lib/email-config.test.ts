import { describe, it, expect } from "vitest";
import { validateEmailConfig } from "./email-config";

const env = (pairs: Record<string, string>): NodeJS.ProcessEnv => pairs as unknown as NodeJS.ProcessEnv;

describe("validateEmailConfig", () => {
    it("reports unconfigured without secrets", () => {
        const report = validateEmailConfig(env({}));
        expect(report.provider).toBe("none");
        expect(report.ready).toBe(false);
        expect(report.blockers.join(";")).toMatch(/no email provider/);
    });

    it("requires a sender identity even with a provider key", () => {
        const report = validateEmailConfig(env({ RESEND_API_KEY: "re_secret" }));
        expect(report.provider).toBe("resend");
        expect(report.ready).toBe(false);
        expect(JSON.stringify(report)).not.toContain("re_secret");
    });

    it("passes complete SMTP config and rejects bad ports", () => {
        expect(
            validateEmailConfig(env({ SMTP_HOST: "smtp.example.com", SMTP_USER: "u", SMTP_FROM: "n@example.com" })).ready,
        ).toBe(true);
        expect(
            validateEmailConfig(env({ SMTP_HOST: "h", SMTP_USER: "u", SMTP_FROM: "n@x.com", SMTP_PORT: "99999" })).ready,
        ).toBe(false);
    });
});
