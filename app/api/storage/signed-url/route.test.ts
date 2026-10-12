import { describe, it, expect, vi, beforeEach } from "vitest";

const authState = vi.hoisted(() => ({
    current: { context: null as null | { user: { id: string; email: string; fullName: string | null; role: string }; organizationId: string | null }, error: null as null | Response },
}));

vi.mock("@/src/lib/api-security", async (importOriginal) => {
    const mod = await importOriginal<typeof import("@/src/lib/api-security")>();
    return { ...mod, secureApiRoute: vi.fn(async () => authState.current) };
});

vi.mock("@/src/lib/api-audit", () => ({
    logApiAudit: vi.fn(async () => undefined),
}));

const storageState = vi.hoisted(() => ({
    signedUrl: "https://signed.test/org-a/file",
    error: null as null | { message: string },
}));

vi.mock("@/src/lib/supabase-server", () => ({
    supabaseServer: vi.fn(async () => ({
        storage: {
            from: () => ({
                createSignedUrl: vi.fn(async () => ({ data: { signedUrl: storageState.signedUrl }, error: storageState.error })),
            }),
        },
    })),
}));

import { POST } from "./route";

function memberOf(org: string | null) {
    authState.current = {
        context: { user: { id: "auth-u1", email: "u1@test.dev", fullName: null, role: "member" }, organizationId: org },
        error: null,
    };
}

function req(body: unknown) {
    return new Request("http://localhost/api/storage/signed-url", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    });
}

describe("storage signed-url tenant guard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        storageState.error = null;
        authState.current = { context: null, error: new Response("unauth", { status: 401 }) };
    });

    it("rejects unauthenticated callers and members without an org", async () => {
        expect((await POST(req({ path: "org-a/f.pdf" }))).status).toBe(401);
        memberOf(null);
        expect((await POST(req({ path: "org-a/f.pdf" }))).status).toBe(403);
    });

    it("rejects cross-organization object paths", async () => {
        memberOf("org-a");
        const res = await POST(req({ path: "org-b/secret.pdf" }));
        expect(res.status).toBe(403);
    });

    it("rejects sibling-prefix paths (org-a-evil is not org-a/)", async () => {
        memberOf("org-a");
        const res = await POST(req({ path: "org-a-evil/secret.pdf" }));
        expect(res.status).toBe(403);
    });

    it("rejects traversal and absolute paths", async () => {
        memberOf("org-a");
        expect((await POST(req({ path: "../org-b/x.pdf" }))).status).toBe(400);
        expect((await POST(req({ path: "/org-a/x.pdf" }))).status).toBe(400);
        expect((await POST(req({}))).status).toBe(400);
    });

    it("signs same-organization paths", async () => {
        memberOf("org-a");
        const res = await POST(req({ path: "org-a/u1/stamp-f.pdf" }));
        expect(res.status).toBe(200);
        const body = (await res.json()) as { signedUrl: string; path: string };
        expect(body.signedUrl).toBe("https://signed.test/org-a/file");
        expect(body.path).toBe("org-a/u1/stamp-f.pdf");
    });
});
