import { describe, it, expect, vi } from "vitest";
import {
    renderEmailTemplate,
    sendTransactionalEmail,
    substituteTemplateVariables,
    type SendEmailDeps,
} from "./email-delivery";

type FetchMock = ReturnType<typeof vi.fn<(url: string | URL | Request, init?: RequestInit) => Promise<Response>>>;

function fetchMock(impl: () => Promise<Response>): FetchMock {
    return vi.fn<(url: string | URL | Request, init?: RequestInit) => Promise<Response>>(impl);
}

function deps(env: SendEmailDeps["env"], fetchImpl: FetchMock): SendEmailDeps {
    return { env, fetchImpl };
}

describe("substituteTemplateVariables", () => {
    it("replaces known placeholders and preserves unknown ones", () => {
        expect(substituteTemplateVariables("Hi {{name}} at {{appUrl}}/x {{missing}}", { name: "Pat", appUrl: "https://a.dev" })).toBe(
            "Hi Pat at https://a.dev/x {{missing}}",
        );
    });
});

describe("renderEmailTemplate", () => {
    it("extracts the subject and strips the H1 from the body", () => {
        const rendered = renderEmailTemplate("welcome", { name: "Pat", appUrl: "https://a.dev" });
        expect(rendered.subject).toBe("Welcome to Arjun Automation soft launch");
        expect(rendered.text).not.toContain("# Soft Launch Welcome");
        expect(rendered.text).toContain("Hi Pat,");
        expect(rendered.text).toContain("https://a.dev/onboarding");
    });

    it("handles bold Subject markers (password-reset)", () => {
        const rendered = renderEmailTemplate("password-reset", { name: "Pat", reset_url: "https://a.dev/r" });
        expect(rendered.subject).toBe("Reset your Arjun Automation password");
        expect(rendered.text).toContain("https://a.dev/r");
    });

    it("throws for an unknown template", () => {
        expect(() => renderEmailTemplate("does-not-exist")).toThrow(/Unknown email template/);
    });
});

describe("sendTransactionalEmail", () => {
    it("fails closed when no provider is configured (no network call)", async () => {
        const impl = fetchMock(async () => new Response("{}", { status: 200 }));
        const result = await sendTransactionalEmail(
            { to: "a@b.dev", templateId: "welcome", variables: { name: "A", appUrl: "https://a.dev" } },
            deps({}, impl),
        );
        expect(result).toEqual({ ok: false, reason: "not_configured" });
        expect(impl).not.toHaveBeenCalled();
    });

    it("reports unsupported_provider for SMTP-only config (never falsely attempts)", async () => {
        const impl = fetchMock(async () => new Response("{}", { status: 200 }));
        const result = await sendTransactionalEmail(
            { to: "a@b.dev", templateId: "welcome" },
            deps({ SMTP_HOST: "smtp.x", SMTP_USER: "u" }, impl),
        );
        expect(result).toEqual({ ok: false, reason: "unsupported_provider" });
        expect(impl).not.toHaveBeenCalled();
    });

    it("requires a from address when the key is present", async () => {
        const impl = fetchMock(async () => new Response("{}", { status: 200 }));
        const result = await sendTransactionalEmail(
            { to: "a@b.dev", templateId: "welcome" },
            deps({ RESEND_API_KEY: "rk_test" }, impl),
        );
        expect(result).toEqual({ ok: false, reason: "from_address_missing" });
        expect(impl).not.toHaveBeenCalled();
    });

    it("sends via Resend and returns the provider id", async () => {
        const impl = fetchMock(async () => new Response(JSON.stringify({ id: "msg_1" }), { status: 200 }));
        const result = await sendTransactionalEmail(
            {
                to: "invitee@test.dev",
                templateId: "invite-teammate",
                variables: { inviterName: "Pat", organizationName: "Acme", inviteUrl: "https://a.dev/i/1" },
            },
            deps({ RESEND_API_KEY: "rk_test", RESEND_FROM: "no-reply@a.dev" }, impl),
        );
        expect(result).toEqual({ ok: true, provider: "resend", id: "msg_1" });
        expect(impl).toHaveBeenCalledTimes(1);
        const [url, init] = impl.mock.calls[0];
        expect(url).toBe("https://api.resend.com/emails");
        const body = JSON.parse(String(init?.body)) as { to: string[]; from: string; subject: string; text: string };
        expect(body.to).toEqual(["invitee@test.dev"]);
        expect(body.from).toBe("no-reply@a.dev");
        expect(body.subject).toContain("Acme");
        expect(body.text).toContain("https://a.dev/i/1");
    });

    it("surfaces provider errors without claiming success", async () => {
        const impl = fetchMock(async () => new Response("rate limited", { status: 429 }));
        const result = await sendTransactionalEmail(
            { to: "a@b.dev", templateId: "welcome" },
            deps({ RESEND_API_KEY: "rk_test", RESEND_FROM: "no-reply@a.dev" }, impl),
        );
        expect(result.ok).toBe(false);
        expect(result).toMatchObject({ reason: "send_failed" });
    });
});
