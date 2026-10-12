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

const CTX = {
    user: { id: "auth-u1", email: "founder@test.dev", fullName: "Founder", role: "member" },
    organizationId: null as string | null,
};

function authed() {
    authState.current = { context: { ...CTX }, error: null };
}

function post(body: unknown): Request {
    return new Request("http://localhost/api/organization/provision", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });
}

describe("POST /api/organization/provision", () => {
    let db: FakeSupabase;

    beforeEach(() => {
        vi.clearAllMocks();
        db = new FakeSupabase();
        serviceState.client = db;
        authState.current = { context: null, error: new Response("unauth", { status: 401 }) };
    });

    it("rejects unauthenticated callers with 401", async () => {
        const res = await POST(post({ name: "Acme" }));
        expect(res.status).toBe(401);
    });

    it("fails closed with 503 when server storage is unconfigured", async () => {
        authed();
        serviceState.client = null;
        const res = await POST(post({ name: "Acme" }));
        expect(res.status).toBe(503);
    });

    it("rejects invalid input with 400", async () => {
        authed();
        await expect((await POST(post({ name: "" }))).status).toBe(400);
        await expect((await POST(post({ name: "Acme", slug: "BAD SLUG!!" }))).status).toBe(400);
        await expect((await POST(post({}))).status).toBe(400);
    });

    it("provisions an organization + founder membership with 201", async () => {
        authed();
        const res = await POST(post({ name: "Acme Operations" }));
        expect(res.status).toBe(201);
        const body = (await res.json()) as { organization: { slug: string }; membership: { roleName: string }; provisioned: boolean };
        expect(body.provisioned).toBe(true);
        expect(body.organization.slug).toBe("acme-operations");
        expect(body.membership.roleName).toBe("founder");
        expect(db.rows("organizations")).toHaveLength(1);
        expect(db.rows("organization_members")).toHaveLength(1);
        expect(db.rows("user_profiles")).toHaveLength(1);
    });

    it("is idempotent: retrying returns the existing tenant without duplicating", async () => {
        authed();
        const first = await POST(post({ name: "Acme Operations" }));
        expect(first.status).toBe(201);
        const second = await POST(post({ name: "Totally Different" }));
        expect(second.status).toBe(200);
        const body = (await second.json()) as { provisioned: boolean; organization: { slug: string } };
        expect(body.provisioned).toBe(false);
        expect(body.organization.slug).toBe("acme-operations");
        expect(db.rows("organizations")).toHaveLength(1);
        expect(db.rows("organization_members")).toHaveLength(1);
    });

    it("answers 409 when the slug is taken by another tenant", async () => {
        db.seed("organizations", [{ id: "org-taken", name: "Taken", slug: "taken", status: "active" }]);
        db.seed("organization_members", [{ id: "m1", organization_id: "org-taken", user_id: "someone", role_name: "founder", is_active: true }]);
        authed();
        const res = await POST(post({ name: "Taken" }));
        expect(res.status).toBe(409);
        expect(db.rows("organizations")).toHaveLength(1);
    });

    it("cleans up the org row when the membership write fails (no orphan tenant)", async () => {
        authed();
        db.failOn({ table: "organization_members", op: "insert", error: { code: "500", message: "boom" } });
        const res = await POST(post({ name: "Acme" }));
        expect(res.status).toBe(500);
        expect(db.rows("organizations")).toHaveLength(0);
    });

    it("GET status reports real membership state", async () => {
        authed();
        const empty = (await (await GET(new Request("http://localhost/api/organization/provision"))).json()) as {
            organization: null;
            needsProvisioning: boolean;
        };
        expect(empty.organization).toBeNull();
        expect(empty.needsProvisioning).toBe(true);

        await POST(post({ name: "Acme" }));
        const full = (await (await GET(new Request("http://localhost/api/organization/provision"))).json()) as {
            organization: { slug: string };
            membership: { roleName: string };
            needsProvisioning: boolean;
        };
        expect(full.organization.slug).toBe("acme");
        expect(full.membership.roleName).toBe("founder");
        expect(full.needsProvisioning).toBe(false);
    });
});
