import { describe, it, expect, vi, beforeEach } from "vitest";
import { FakeSupabase } from "../../__tests__/fake-service-role";

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

import { GET as GET_MINE } from "../mine/route";
import { POST as POST_ACCEPT } from "./route";

function signedInAs(email: string, id: string, org: string | null = null) {
    authState.current = {
        context: { user: { id, email, fullName: null, role: "member" }, organizationId: org },
        error: null,
    };
}

const future = () => new Date(Date.now() + 7 * 86400000).toISOString();
const past = () => new Date(Date.now() - 86400000).toISOString();

function seedInvite(db: FakeSupabase, over: Record<string, unknown> = {}) {
    db.seed("organization_invitations", [
        {
            id: "11111111-1111-4111-8111-111111111111",
            organization_id: "org-a",
            email: "mate@test.dev",
            role_name: "member",
            status: "pending",
            invited_by: "prof-owner",
            expires_at: future(),
            ...over,
        },
    ]);
}

describe("invitation accept flow", () => {
    let db: FakeSupabase;

    beforeEach(() => {
        vi.clearAllMocks();
        db = new FakeSupabase();
        serviceState.client = db;
        authState.current = { context: null, error: new Response("unauth", { status: 401 }) };
        db.seed("organizations", [{ id: "org-a", name: "Org A", slug: "org-a", status: "active" }]);
    });

    it("rejects unauthenticated callers on mine + accept", async () => {
        expect((await GET_MINE(new Request("http://localhost/mine"))).status).toBe(401);
        expect(
            (
                await POST_ACCEPT(
                    new Request("http://localhost/accept", { method: "POST", body: JSON.stringify({ invitationId: "00000000-0000-0000-0000-000000000000" }) }),
                )
            ).status,
        ).toBe(401);
    });

    it("lists only the caller's own live pending invites", async () => {
        db.seed("organization_invitations", [
            { id: "33333333-3333-4333-8333-333333333333", organization_id: "org-a", email: "mate@test.dev", role_name: "member", status: "pending", expires_at: future() },
            { id: "44444444-4444-4444-8444-444444444444", organization_id: "org-a", email: "stranger@test.dev", role_name: "member", status: "pending", expires_at: future() },
            { id: "55555555-5555-4555-8555-555555555555", organization_id: "org-a", email: "mate@test.dev", role_name: "member", status: "pending", expires_at: past() },
            { id: "66666666-6666-4666-8666-666666666666", organization_id: "org-a", email: "mate@test.dev", role_name: "member", status: "accepted", expires_at: future() },
        ]);
        signedInAs("mate@test.dev", "auth-mate");
        const res = await GET_MINE(new Request("http://localhost/mine"));
        const body = (await res.json()) as { invitations: Array<{ id: string }> };
        expect(body.invitations.map((i) => i.id)).toEqual(["33333333-3333-4333-8333-333333333333"]);
    });

    it("accepts a valid invite: membership + marked accepted", async () => {
        seedInvite(db);
        db.seed("user_profiles", [{ id: "prof-mate", auth_user_id: "auth-mate", email: "mate@test.dev" }]);
        signedInAs("mate@test.dev", "auth-mate");
        const res = await POST_ACCEPT(
            new Request("http://localhost/accept", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ invitationId: "11111111-1111-4111-8111-111111111111" }),
            }),
        );
        expect(res.status).toBe(200);
        const body = (await res.json()) as {
            organization: { slug: string };
            membership: { roleName: string };
            inviteMarkedAccepted: boolean;
        };
        expect(body.organization.slug).toBe("org-a");
        expect(body.membership.roleName).toBe("member");
        expect(body.inviteMarkedAccepted).toBe(true);
        expect(db.rows("organization_members")).toHaveLength(1);
        expect(db.rows("organization_invitations")[0].status).toBe("accepted");
    });

    it("rejects wrong-email, expired, non-pending, and missing invites", async () => {
        seedInvite(db);
        signedInAs("intruder@test.dev", "auth-intruder");
        const wrong = await POST_ACCEPT(
            new Request("http://localhost/accept", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ invitationId: "11111111-1111-4111-8111-111111111111" }),
            }),
        );
        expect(wrong.status).toBe(400);
        expect(db.rows("organization_members")).toHaveLength(0);

        signedInAs("mate@test.dev", "auth-mate");
        db.seed("organization_invitations", [
            { id: "11111111-1111-4111-8111-111111111111", organization_id: "org-a", email: "mate@test.dev", role_name: "member", status: "pending", expires_at: past() },
        ]);
        const expired = await POST_ACCEPT(
            new Request("http://localhost/accept", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ invitationId: "11111111-1111-4111-8111-111111111111" }),
            }),
        );
        expect(expired.status).toBe(400);

        db.seed("organization_invitations", [
            { id: "11111111-1111-4111-8111-111111111111", organization_id: "org-a", email: "mate@test.dev", role_name: "member", status: "revoked", expires_at: future() },
        ]);
        const revoked = await POST_ACCEPT(
            new Request("http://localhost/accept", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ invitationId: "11111111-1111-4111-8111-111111111111" }),
            }),
        );
        expect(revoked.status).toBe(400);

        const missing = await POST_ACCEPT(
            new Request("http://localhost/accept", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ invitationId: "00000000-0000-0000-0000-000000000000" }),
            }),
        );
        expect(missing.status).toBe(404);
        expect(db.rows("organization_members")).toHaveLength(0);
    });

    it("replayed accept creates nothing and partial marking is reported", async () => {
        seedInvite(db);
        db.seed("user_profiles", [{ id: "prof-mate", auth_user_id: "auth-mate", email: "mate@test.dev" }]);
        signedInAs("mate@test.dev", "auth-mate");
        expect(
            (
                await POST_ACCEPT(
                    new Request("http://localhost/accept", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ invitationId: "11111111-1111-4111-8111-111111111111" }),
                    }),
                )
            ).status,
        ).toBe(200);

        // Second accept: invite is no longer pending -> 400, no duplicate row.
        const again = await POST_ACCEPT(
            new Request("http://localhost/accept", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ invitationId: "11111111-1111-4111-8111-111111111111" }),
            }),
        );
        expect(again.status).toBe(400);
        expect(db.rows("organization_members")).toHaveLength(1);

        // Marking failure still keeps the membership (the real effect stands).
        db.seed("organization_invitations", [
            { id: "22222222-2222-4222-8222-222222222222", organization_id: "org-a", email: "mate@test.dev", role_name: "member", status: "pending", expires_at: future() },
        ]);
        db.failOn({ table: "organization_invitations", op: "update", error: { code: "500", message: "boom" } });
        const partial = await POST_ACCEPT(
            new Request("http://localhost/accept", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ invitationId: "22222222-2222-4222-8222-222222222222" }),
            }),
        );
        expect(partial.status).toBe(200);
        expect(((await partial.json()) as { inviteMarkedAccepted: boolean }).inviteMarkedAccepted).toBe(false);
    });
});
