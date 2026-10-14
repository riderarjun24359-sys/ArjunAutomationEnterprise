import { describe, it, expect, vi } from "vitest";
import {
    describeLeadNotifyStatus,
    notifyOwnerOfLead,
    resolveLeadOwnerAddress,
    sanitizeReason,
    sanitizeSubjectPart,
} from "./lead-notify";
import { renderEmailTemplate } from "./email-delivery";

type FetchMock = ReturnType<typeof vi.fn<(url: string | URL | Request, init?: RequestInit) => Promise<Response>>>;

function fetchMock(impl: () => Promise<Response>): FetchMock {
    return vi.fn<(url: string | URL | Request, init?: RequestInit) => Promise<Response>>(impl);
}

const LEAD = {
    leadId: "11111111-2222-3333-4444-555555555555",
    leadName: "Test Person",
    leadEmail: "test@example.com",
    company: "Example Co",
    phone: "",
    message: "Please call me back.",
    source: "contact-page",
    consentVersion: "2026-10-01",
    receivedAt: "2026-10-13T12:00:00.000Z",
};

const CONFIGURED = { RESEND_API_KEY: "rk_test_key_abc123", RESEND_FROM: "owner@example.com" };

describe("resolveLeadOwnerAddress", () => {
    it("prefers LEAD_OWNER_EMAIL, falls back to sender, else null", () => {
        expect(resolveLeadOwnerAddress({ ...CONFIGURED, LEAD_OWNER_EMAIL: "sales@example.com" })).toBe("sales@example.com");
        expect(resolveLeadOwnerAddress(CONFIGURED)).toBe("owner@example.com");
        expect(resolveLeadOwnerAddress({})).toBeNull();
    });
});

describe("describeLeadNotifyStatus", () => {
    it("reports unconfigured without a provider and never echoes secrets", () => {
        const status = describeLeadNotifyStatus({});
        expect(status).toMatch(/lead-notify:unconfigured/);
        expect(status).not.toContain("rk_test");
    });

    it("reports ready only with provider + owner, without secret values", () => {
        const status = describeLeadNotifyStatus({ ...CONFIGURED, RESEND_API_KEY: "rk_live_SECRET_xyz" });
        expect(status).toMatch(/lead-notify:ready/);
        expect(status).not.toContain("rk_live_SECRET_xyz");
    });
});

describe("notifyOwnerOfLead", () => {
    it("does not attempt delivery when unconfigured (manual fallback path)", async () => {
        const impl = fetchMock(async () => new Response("{}", { status: 200 }));
        const result = await notifyOwnerOfLead(LEAD, { env: {}, fetchImpl: impl });
        expect(result).toMatchObject({ attempted: false, ok: false });
        expect(result.reason).toMatch(/not_configured/);
        expect(impl).not.toHaveBeenCalled();
    });

    it("does not attempt delivery when sender/owner identity is missing", async () => {
        const impl = fetchMock(async () => new Response("{}", { status: 200 }));
        const result = await notifyOwnerOfLead(LEAD, {
            env: { RESEND_API_KEY: "rk_test" },
            fetchImpl: impl,
        });
        // No sender/owner identity => not configured => no network call.
        // (Owner falls back to the sender address, so a missing owner is
        // always reported at the config gate, never attempted.)
        expect(result).toMatchObject({ attempted: false, ok: false });
        expect(result.reason).toMatch(/not_configured/);
        expect(impl).not.toHaveBeenCalled();
    });

    it("sends via Resend with PII-free subject and redacted result", async () => {
        const impl = fetchMock(async () => new Response(JSON.stringify({ id: "msg_1" }), { status: 200 }));
        const result = await notifyOwnerOfLead(LEAD, { env: { ...CONFIGURED }, fetchImpl: impl });
        expect(result).toEqual({ attempted: true, ok: true, reason: "sent" });
        expect(impl).toHaveBeenCalledTimes(1);
        const [, init] = impl.mock.calls[0];
        const body = JSON.parse(String(init?.body)) as { to: string[]; subject: string; text: string };
        expect(body.to).toEqual(["owner@example.com"]);
        // Subject must not carry PII (no lead email or name).
        expect(body.subject).not.toContain("test@example.com");
        expect(body.subject).not.toContain("Test Person");
        expect(body.subject).toContain("contact-page");
        // Body carries the follow-up essentials + consent version.
        expect(body.text).toContain("test@example.com");
        expect(body.text).toContain("2026-10-01");
        // Result never echoes the secret.
        expect(JSON.stringify(result)).not.toContain("rk_test_key_abc123");
    });

    it("returns failure (never throws) when the provider rejects", async () => {
        const impl = fetchMock(async () => new Response("rate limited", { status: 429 }));
        const result = await notifyOwnerOfLead(LEAD, { env: { ...CONFIGURED }, fetchImpl: impl });
        expect(result.attempted).toBe(true);
        expect(result.ok).toBe(false);
        expect(result.reason).toMatch(/send_failed/);
    });

    it("returns failure (never throws) when fetch itself throws", async () => {
        const impl = fetchMock(async () => {
            throw new Error("network down");
        });
        const result = await notifyOwnerOfLead(LEAD, { env: { ...CONFIGURED }, fetchImpl: impl });
        expect(result).toMatchObject({ attempted: true, ok: false });
        expect(result.reason).toMatch(/send_failed/);
    });

    it("redacts secret-like tokens from provider error detail", async () => {
        const leaked = "re_ABCDEFGHIJKLMNOP123456";
        const impl = fetchMock(async () => new Response(`invalid key ${leaked}`, { status: 401 }));
        const result = await notifyOwnerOfLead(LEAD, {
            env: { RESEND_API_KEY: leaked, RESEND_FROM: "owner@example.com" },
            fetchImpl: impl,
        });
        expect(result.ok).toBe(false);
        expect(JSON.stringify(result)).not.toContain(leaked);
        expect(result.reason).toContain("[redacted]");
    });

    it("flattens line breaks from submitter-controlled subject parts", async () => {
        const impl = fetchMock(async () => new Response(JSON.stringify({ id: "msg_1" }), { status: 200 }));
        const nasty = { ...LEAD, source: "contact-page\r\nBcc: victim@example.com" };
        const result = await notifyOwnerOfLead(nasty, { env: { ...CONFIGURED }, fetchImpl: impl });
        expect(result.ok).toBe(true);
        const [, init] = impl.mock.calls[0];
        const body = JSON.parse(String(init?.body)) as { subject: string };
        expect(body.subject).not.toMatch(/[\r\n]/);
        expect(body.subject).toContain("contact-page");
    });

    it("sanitizeReason strips control chars and caps length", () => {
        expect(sanitizeReason("a\tb\nc")).toBe("a b c");
        expect(sanitizeReason("x".repeat(500)).length).toBeLessThanOrEqual(200);
        expect(sanitizeSubjectPart("  a\r\nb  ")).toBe("a b");
    });

    it("renders the lead-owner-alert template with no leftover placeholders", () => {
        const rendered = renderEmailTemplate("lead-owner-alert", {
            leadId: "abc123",
            leadIdShort: "abc123",
            leadName: "Test Person",
            leadEmail: "test@example.com",
            company: "Example Co",
            phone: "—",
            message: "Hello",
            source: "contact-page",
            consentVersion: "2026-10-01",
            receivedAt: "2026-10-13T12:00:00.000Z",
        });
        expect(rendered.subject).toBe("New website lead from contact-page (abc123)");
        expect(rendered.text).toContain("test@example.com");
        expect(rendered.text).toContain("2026-10-01");
        expect(rendered.text).not.toMatch(/\{\{\s*[\w.-]+\s*\}\}/);
    });
});
