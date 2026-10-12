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

function memberOf(org: string) {
    authState.current = {
        context: { user: { id: "auth-u1", email: "u1@test.dev", fullName: null, role: "member" }, organizationId: org },
        error: null,
    };
}

describe("teams routes", () => {
    let db: FakeSupabase;

    beforeEach(() => {
        vi.clearAllMocks();
        db = new FakeSupabase();
        serviceState.client = db;
        authState.current = { context: null, error: new Response("unauth", { status: 401 }) };
    });

    it("rejects unauthenticated callers and members without an org", async () => {
        const unauth = await POST(
            new Request("http://localhost/api/organization/teams", { method: "POST", body: JSON.stringify({ name: "T" }) }),
        );
        expect(unauth.status).toBe(401);

        authState.current = {
            context: { user: { id: "auth-u9", email: "u9@test.dev", fullName: null, role: "member" }, organizationId: null },
            error: null,
        };
        const noOrg = await POST(
            new Request("http://localhost/api/organization/teams", { method: "POST", body: JSON.stringify({ name: "T" }) }),
        );
        expect(noOrg.status).toBe(403);
    });

    it("creates a team scoped to the caller's organization", async () => {
        memberOf("org-a");
        const res = await POST(
            new Request("http://localhost/api/organization/teams", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name: "Ops Team" }),
            }),
        );
        expect(res.status).toBe(201);
        const body = (await res.json()) as { team: { slug: string } };
        expect(body.team.slug).toBe("ops-team");
        expect(db.rows("teams")).toHaveLength(1);
        expect(db.rows("teams")[0].organization_id).toBe("org-a");
    });

    it("rejects duplicate slugs in the same org but allows them across orgs", async () => {
        const payload = (name: string) =>
            new Request("http://localhost/api/organization/teams", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name }),
            });
        memberOf("org-a");
        expect((await POST(payload("Ops"))).status).toBe(201);
        expect((await POST(payload("Ops"))).status).toBe(409);
        expect(db.rows("teams")).toHaveLength(1);

        memberOf("org-b");
        expect((await POST(payload("Ops"))).status).toBe(201);
        expect(db.rows("teams")).toHaveLength(2);
    });

    it("lists only the caller's organization teams", async () => {
        db.seed("teams", [
            { id: "t-a", organization_id: "org-a", name: "A", slug: "a" },
            { id: "t-b", organization_id: "org-b", name: "B", slug: "b" },
        ]);
        memberOf("org-a");
        const res = await GET(new Request("http://localhost/api/organization/teams"));
        const body = (await res.json()) as { teams: Array<{ slug: string }> };
        expect(body.teams.map((t) => t.slug)).toEqual(["a"]);
    });
});
