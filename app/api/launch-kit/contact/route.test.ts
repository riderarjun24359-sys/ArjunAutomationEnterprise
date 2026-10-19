// @vitest-environment node
import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from "vitest";

// Route-level tests for the public lead-intake pipeline. All external
// effects are mocked — no network, no database, no email, no secrets.
vi.mock("@/src/lib/api-security", () => ({
    secureApiRoute: vi.fn(),
    logApiAudit: vi.fn(async () => undefined),
}));

vi.mock("@/src/modules/security-center/engine/api-security-engine", () => ({
    checkRateLimit: vi.fn(() => ({ allowed: true, remaining: 9, resetAt: new Date().toISOString() })),
}));

vi.mock("@/src/modules/mission-core/sdk/lazy-mission-core-client", () => ({
    lazyMissionCoreClient: vi.fn(() => ({ publishEvent: vi.fn(async () => undefined) })),
}));

vi.mock("@/src/lib/supabase-service-role", () => ({
    getServiceRoleClient: vi.fn(),
}));

vi.mock("@/src/lib/lead-notify", () => ({
    notifyOwnerOfLead: vi.fn(),
}));

import { POST } from "./route";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";
import { notifyOwnerOfLead } from "@/src/lib/lead-notify";
import { logApiAudit } from "@/src/lib/api-security";

type LookupResult = { data: Array<{ id: string; email: string; status?: string }> | null; error: { message: string } | null };
type InsertResult = { data: { id: string; status?: string } | null; error: { message: string } | null };

const ORG = "org_lead_pipeline_test";

/**
 * Stateful stand-in for the service-role client that records what the route
 * attempted to persist, so tests can assert on the storage side effects
 * (lead payload, consent audit row, lookup pattern) without a database.
 */
function makeClient(opts: { lookup?: LookupResult; insert?: InsertResult } = {}) {
    const calls = {
        lookupPatterns: [] as string[],
        leadInserts: [] as Array<Record<string, unknown>>,
        salesAuditInserts: [] as Array<Record<string, unknown>>,
    };
    const client = {
        from(table: string) {
            return {
                select(this: unknown, _cols: string) {
                    void this;
                    return {
                        eq: () => ({
                            ilike: (_col: string, pattern: string) => {
                                calls.lookupPatterns.push(pattern);
                                return Promise.resolve(opts.lookup ?? { data: [], error: null });
                            },
                        }),
                    };
                },
                insert(payload: Record<string, unknown>) {
                    if (table === "sales_leads") calls.leadInserts.push(payload);
                    if (table === "sales_audit_logs") calls.salesAuditInserts.push(payload);
                    const result = table === "sales_leads" ? (opts.insert ?? { data: null, error: null }) : { error: null };
                    return {
                        select: () => ({ maybeSingle: () => Promise.resolve(result) }),
                        then: (onF: (v: unknown) => unknown, onR: (e: unknown) => unknown) => Promise.resolve(result).then(onF, onR),
                    };
                },
            };
        },
    };
    return { client: client as never, calls };
}

const GOOD_BODY = {
    name: "Ravi Kumar",
    email: "Ravi.Kumar@Example.COM",
    company: "Kumar Events",
    phone: "+91 90000 00000",
    message: "Please call me about the enquiry.",
    source: "contact-page",
    consent: true,
};

function postRequest(body: unknown): Request {
    return new Request("http://localhost/api/launch-kit/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });
}

const PREV_ORG = process.env.PLATFORM_ORGANIZATION_ID;

beforeAll(() => {
    process.env.PLATFORM_ORGANIZATION_ID = ORG;
});

beforeEach(() => {
    vi.clearAllMocks();
    process.env.PLATFORM_ORGANIZATION_ID = ORG;
});

afterAll(() => {
    if (PREV_ORG === undefined) delete process.env.PLATFORM_ORGANIZATION_ID;
    else process.env.PLATFORM_ORGANIZATION_ID = PREV_ORG;
});

describe("launch-kit contact route — lead pipeline", () => {
    it("stores the lead with normalized email + consent proof and notifies the owner", async () => {
        const { client, calls } = makeClient({
            lookup: { data: [], error: null },
            insert: { data: { id: "lead-1", status: "new" }, error: null },
        });
        vi.mocked(getServiceRoleClient).mockReturnValue(client);
        vi.mocked(notifyOwnerOfLead).mockResolvedValue({ attempted: true, ok: true, reason: "sent:abc123" });

        const response = await POST(postRequest(GOOD_BODY));
        const body = (await response.json()) as Record<string, unknown>;

        expect(response.status).toBe(200);
        expect(body).toMatchObject({ success: true, leadId: "lead-1", duplicate: false, status: "new" });

        // Original enquiry preserved (normalized lower), sent to the storage layer only.
        expect(calls.lookupPatterns).toEqual(["ravi.kumar@example.com"]);
        expect(calls.leadInserts).toHaveLength(1);
        expect(calls.leadInserts[0]).toMatchObject({ organization_id: ORG, email: "ravi.kumar@example.com", lead_name: "Ravi Kumar", source: "contact-page" });

        // Consent proof recorded in the sales audit log.
        const consent = calls.salesAuditInserts.find((row) => row.action === "create");
        expect(consent?.metadata).toMatchObject({ consent: true, consentNoticeVersion: "2026-10-01" });
        expect(consent?.entity_id).toBe("lead-1");

        // Owner notification attempted exactly once with the normalized email.
        expect(notifyOwnerOfLead).toHaveBeenCalledTimes(1);
        const notifyInput = vi.mocked(notifyOwnerOfLead).mock.calls[0][0];
        expect(notifyInput).toMatchObject({ leadId: "lead-1", leadEmail: "ravi.kumar@example.com", consentVersion: "2026-10-01", source: "contact-page" });

        // Notification outcome audited as an attempt, without the lead email.
        const attempt = vi.mocked(logApiAudit).mock.calls.find(([input]) => input.action === "lead_notification_attempt");
        expect(attempt?.[0].metadata).toMatchObject({ notificationOk: true });
        expect(JSON.stringify(attempt?.[0].metadata)).not.toContain("@example.com");
    });

    it("keeps the stored lead and reports a no-op when notification is unconfigured", async () => {
        const { client, calls } = makeClient({
            lookup: { data: [], error: null },
            insert: { data: { id: "lead-2", status: "new" }, error: null },
        });
        vi.mocked(getServiceRoleClient).mockReturnValue(client);
        vi.mocked(notifyOwnerOfLead).mockResolvedValue({ attempted: false, ok: false, reason: "not_configured: no email provider: set RESEND_API_KEY or SMTP_HOST+SMTP_USER" });

        const response = await POST(postRequest(GOOD_BODY));
        const body = (await response.json()) as Record<string, unknown>;

        // The lead is stored and the pipeline succeeds even though nobody can be alerted.
        expect(response.status).toBe(200);
        expect(body).toMatchObject({ success: true, leadId: "lead-2", duplicate: false });
        expect(notifyOwnerOfLead).toHaveBeenCalledTimes(1);
        const attempt = vi.mocked(logApiAudit).mock.calls.find(([input]) => input.action === "lead_notification_attempt");
        expect(attempt?.[0].metadata).toMatchObject({ notificationOk: false, notificationReason: expect.stringContaining("not_configured") });
    });

    it("keeps the stored lead when the notification provider fails (fail-open)", async () => {
        const { client } = makeClient({
            lookup: { data: [], error: null },
            insert: { data: { id: "lead-3", status: "new" }, error: null },
        });
        vi.mocked(getServiceRoleClient).mockReturnValue(client);
        vi.mocked(notifyOwnerOfLead).mockResolvedValue({ attempted: true, ok: false, reason: "send_failed: rate limited" });

        const response = await POST(postRequest(GOOD_BODY));
        const body = (await response.json()) as Record<string, unknown>;

        expect(response.status).toBe(200);
        expect(body).toMatchObject({ success: true, duplicate: false });
        const attempt = vi.mocked(logApiAudit).mock.calls.find(([input]) => input.action === "lead_notification_attempt");
        expect(attempt?.[0].metadata).toMatchObject({ notificationOk: false, notificationReason: "send_failed: rate limited" });
    });

    it("returns the existing lead on duplicate enquiry and never notifies or re-inserts", async () => {
        const { client, calls } = makeClient({
            lookup: { data: [{ id: "lead-existing", email: "ravi.kumar@example.com", status: "contacted" }], error: null },
        });
        vi.mocked(getServiceRoleClient).mockReturnValue(client);
        vi.mocked(notifyOwnerOfLead).mockResolvedValue({ attempted: true, ok: true, reason: "sent:x" });

        const response = await POST(postRequest(GOOD_BODY));
        const body = (await response.json()) as Record<string, unknown>;

        expect(response.status).toBe(200);
        expect(body).toMatchObject({ success: true, leadId: "lead-existing", duplicate: true, status: "contacted" });
        expect(calls.leadInserts).toHaveLength(0);
        expect(notifyOwnerOfLead).not.toHaveBeenCalled();
    });

    it("rejects a missing consent with 400 and persists nothing", async () => {
        const { client, calls } = makeClient();
        vi.mocked(getServiceRoleClient).mockReturnValue(client);
        const body = { ...GOOD_BODY } as Record<string, unknown>;
        delete body.consent;

        const response = await POST(postRequest(body));

        expect(response.status).toBe(400);
        const payload = (await response.json()) as { error: string };
        expect(payload.error).toMatch(/consent/i);
        expect(calls.lookupPatterns).toHaveLength(0);
        expect(calls.leadInserts).toHaveLength(0);
        expect(notifyOwnerOfLead).not.toHaveBeenCalled();
    });

    it("responds 503 when the intake organization is not configured and persists nothing", async () => {
        const { client, calls } = makeClient();
        vi.mocked(getServiceRoleClient).mockReturnValue(client);
        delete process.env.PLATFORM_ORGANIZATION_ID;

        const response = await POST(postRequest(GOOD_BODY));
        const body = (await response.json()) as Record<string, unknown>;

        expect(response.status).toBe(503);
        expect(body.success).toBe(false);
        expect(calls.leadInserts).toHaveLength(0);
        expect(notifyOwnerOfLead).not.toHaveBeenCalled();
    });

    it("never echoes submitter-free-text (message/phone) in the response", async () => {
        const { client } = makeClient({
            lookup: { data: [], error: null },
            insert: { data: { id: "lead-4", status: "new" }, error: null },
        });
        vi.mocked(getServiceRoleClient).mockReturnValue(client);
        vi.mocked(notifyOwnerOfLead).mockResolvedValue({ attempted: true, ok: true, reason: "sent" });

        const response = await POST(postRequest(GOOD_BODY));
        const raw = JSON.stringify(await response.json());

        expect(raw).not.toContain("Please call me about the enquiry");
        expect(raw).not.toContain("+91 90000 00000");
    });
});
