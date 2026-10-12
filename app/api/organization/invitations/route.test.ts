import { describe, it, expect, vi, beforeEach } from "vitest";
import { FakeSupabase } from "../__tests__/fake-service-role";

const authState = vi.hoisted(() => ({
    current: { context: null as null | { user: { id: string; email: string; fullName: string | null; role: string }; organizationId: string | null }, error: null as null | Response },
}));

vi.mock("@/src/lib/api-security", async (importOriginal) => {
    const mod = await importOriginal<typeof import("@/src/lib/api-security")>();
    return { ...mod, secureApiRoute: vi.fn(async () => authState.current) };
});

const serviceState = vi.hoisted(() => ({ client: null as null | FakeSupabase }));

vi.mock("@/src/lib/supabase-service-role", () => ({
    getServiceRoleClient: () => serviceState.client,
}));

import { GET, POST } from "./route";

function memberOf(org: string, email = "owner@test.dev", id = "auth-owner") {
    authState.current = {
        context: { user: { id, email, fullName: null, role: "member" }, organizationId: org },
        error: null,
    };
}

function postInvite(body: unknown): Request {
    return new Request("http://localhost/api/organization/invitations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });
}

describe("invitations routes", () => {
    let db: FakeSupabase;

    beforeEach(() => {
        vi.clearAllMocks();
        db = new FakeSupabase();
        serviceState.client = db;
        authState.current = { context: null, error: new Response("unauth", { status: 401 }) };
        db.seed("user_profiles", [{ id: "prof-owner", auth_user_id: "auth-owner", email: "owner@test.dev" }]);
    });

    // Seeds the caller's own active membership in the org and sets org context.
    function asRole(role: string, org = "org-a") {
        db.seed("organization_members", [
            { id: "m-owner", organization_id: org, user_id: "prof-owner", role_name: role, is_active: true },
        ]);
        memberOf(org);
    }

    it("rejects unauthenticated callers", async () => {
        const res = await POST(postInvite({ email: "a@test.dev", roleName: "member" }));
        expect(res.status).toBe(401);
    });

    it("validates invite input (email shape, no super_admin)", async () => {
        asRole("founder");
        expect((await POST(postInvite({ email: "not-an-email", roleName: "member" }))).status).toBe(400);
        expect((await POST(postInvite({ email: "a@test.dev", roleName: "super_admin" }))).status).toBe(400);
        expect((await POST(postInvite({ email: "a@test.dev" }))).status).toBe(400);
    });

    it("creates an invitation and dedupes retries instead of duplicating", async () => {
        asRole("founder");
        const first = await POST(postInvite({ email: "Mate@Test.dev", roleName: "manager" }));
        expect(first.status).toBe(201);
        const created = (await first.json()) as { invitation: { email: string; roleName: string; status: string }; duplicate: boolean };
        expect(created.invitation.email).toBe("mate@test.dev");
        expect(created.invitation.roleName).toBe("manager");
        expect(created.invitation.status).toBe("pending");
        expect(created.duplicate).toBe(false);

        const retry = await POST(postInvite({ email: "mate@test.dev", roleName: "manager" }));
        expect(retry.status).toBe(200);
        expect(((await retry.json()) as { duplicate: boolean }).duplicate).toBe(true);
        expect(db.rows("organization_invitations")).toHaveLength(1);
        expect(db.rows("organization_invitations")[0].invited_by).toBe("prof-owner");
    });

    it("blocks role escalation: a member cannot invite an admin", async () => {
        asRole("member");
        const escalated = await POST(postInvite({ email: "target@test.dev", roleName: "admin" }));
        expect(escalated.status).toBe(403);
        expect(db.rows("organization_invitations")).toHaveLength(0);

        const peer = await POST(postInvite({ email: "peer@test.dev", roleName: "member" }));
        expect(peer.status).toBe(201);
    });

    it("blocks viewers from inviting at all and requires an active membership", async () => {
        asRole("viewer");
        expect((await POST(postInvite({ email: "x@test.dev", roleName: "viewer" }))).status).toBe(403);

        // Org context present but the caller has no membership row in it.
        db.seed("organization_members", []);
        memberOf("org-a");
        expect((await POST(postInvite({ email: "y@test.dev", roleName: "member" }))).status).toBe(403);
    });

    it("lets a founder invite an admin", async () => {
        asRole("founder");
        const res = await POST(postInvite({ email: "admin@test.dev", roleName: "admin" }));
        expect(res.status).toBe(201);
        expect(db.rows("organization_invitations")).toHaveLength(1);
    });

    it("sends the invitation email when a provider is configured (best-effort)", async () => {
        asRole("founder");
        db.seed("organizations", [{ id: "org-a", name: "Acme" }]);
        const previous = { key: process.env.RESEND_API_KEY, from: process.env.RESEND_FROM };
        process.env.RESEND_API_KEY = "rk_test";
        process.env.RESEND_FROM = "no-reply@a.dev";
        const fetchSpy = vi.fn<(url: string | URL | Request, init?: RequestInit) => Promise<Response>>(
            async () => new Response(JSON.stringify({ id: "msg_1" }), { status: 200 }),
        );
        const originalFetch = globalThis.fetch;
        globalThis.fetch = fetchSpy as unknown as typeof fetch;
        try {
            const res = await POST(postInvite({ email: "invitee@test.dev", roleName: "member" }));
            expect(res.status).toBe(201);
            expect(fetchSpy).toHaveBeenCalledTimes(1);
            expect(String(fetchSpy.mock.calls[0][0])).toBe("https://api.resend.com/emails");
        } finally {
            globalThis.fetch = originalFetch;
            if (previous.key === undefined) delete process.env.RESEND_API_KEY;
            else process.env.RESEND_API_KEY = previous.key;
            if (previous.from === undefined) delete process.env.RESEND_FROM;
            else process.env.RESEND_FROM = previous.from;
        }
    });

    it("scopes invitation reads to the caller's organization", async () => {
        db.seed("organization_invitations", [
            { id: "i-a", organization_id: "org-a", email: "a@test.dev", role_name: "member", status: "pending", expires_at: new Date(Date.now() + 86400000).toISOString() },
            { id: "i-b", organization_id: "org-b", email: "b@test.dev", role_name: "member", status: "pending", expires_at: new Date(Date.now() + 86400000).toISOString() },
        ]);
        memberOf("org-a");
        const res = await GET(new Request("http://localhost/api/organization/invitations"));
        const body = (await res.json()) as { invitations: Array<{ id: string }> };
        expect(body.invitations.map((i) => i.id)).toEqual(["i-a"]);
    });
});
