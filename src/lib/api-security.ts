import { NextResponse } from "next/server";
import { authServerService } from "@/src/services/auth.server";
import { hasPermission, type PermissionKey } from "@/src/config/permissions";
import type { UserRole } from "@/src/constants/roles";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { logApiAudit } from "@/src/lib/api-audit";
import { getServiceRoleClient } from "@/src/lib/supabase-service-role";

export interface ApiSecurityContext {
    user: { id: string; email: string; fullName: string | null; role: UserRole };
    organizationId: string | null;
    sessionExpiresAt?: string | null;
    refreshRecommended?: boolean;
}

export interface SecureApiOptions {
    permission?: PermissionKey;
    rateLimitKey?: string;
    rateLimit?: number;
    allowPublic?: boolean;
    publicApiKeyEnv?: string;
    /** When true (default), reject expired/invalid sessions via hardened validation. */
    requireValidSession?: boolean;
}

export { logApiAudit } from "@/src/lib/api-audit";

/**
 * The membership `role_name` check constraint allows `founder`/`owner` as well
 * as the five app `UserRole`s. Provisioning stamps the org creator as `founder`
 * and the platform founder as `founder`, so those must map to an admin-equivalent
 * app role or the creator would be denied every admin/manager gate. `owner` is
 * the highest org role below `super_admin`; both are mapped to `admin` (the app
 * role model has no founder/owner tier, and no permission grants `super_admin`
 * exclusively). Unknown roles collapse to the least-privileged `member`.
 */
const ROLE_ALIASES: Record<string, UserRole> = {
    super_admin: "super_admin",
    owner: "admin",
    founder: "admin",
    admin: "admin",
    manager: "manager",
    member: "member",
    viewer: "viewer",
};

/**
 * Resolve the caller's role and organization from the SERVER session identity.
 *
 * IMPORTANT: `databaseService` (and therefore `resolveOrganizationContext`)
 * reads through `getRepositoryClient()`, which is deliberately browser-only and
 * returns `null` when `window` is undefined. Calling it from a route handler
 * therefore always yielded `role: "member"` and `organizationId: null`, so every
 * authenticated, org-scoped route 403'd ("No organization context") and every
 * role/permission gate denied — a real defect that was invisible because the
 * route tests mock `secureApiRoute` and the vitest environment is jsdom (where
 * `window` exists).
 *
 * We instead resolve against the server-only service-role client, scoped
 * strictly to the authenticated user's own `auth_user_id`. The identity comes
 * from the validated session (`userId`), never from client input, and the read
 * is limited to the caller's own profile + active memberships, so this does not
 * bypass tenant isolation. Fails closed (member / no organization) when Supabase
 * or the service-role key is unavailable.
 */
export async function resolveServerIdentity(
    userId: string,
): Promise<{ role: UserRole; organizationId: string | null }> {
    try {
        const client = getServiceRoleClient();
        if (!client) {
            return { role: "member", organizationId: null };
        }

        const profile = await client
            .from("user_profiles")
            .select("id")
            .eq("auth_user_id", userId)
            .maybeSingle();
        const profileId = (profile.data as { id?: string } | null)?.id;
        if (!profileId) {
            return { role: "member", organizationId: null };
        }

        const memberships = await client
            .from("organization_members")
            .select("organization_id,role_name")
            .eq("user_id", profileId)
            .eq("is_active", true)
            .order("created_at", { ascending: true })
            .limit(1);
        const first = (memberships.data ?? [])[0] as
            | { organization_id?: string; role_name?: string }
            | undefined;

        const role = first?.role_name ? (ROLE_ALIASES[first.role_name] ?? "member") : "member";

        return { role, organizationId: first?.organization_id ?? null };
    } catch {
        return { role: "member", organizationId: null };
    }
}

export function getClientIp(request: Request): string {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        "unknown"
    );
}

/**
 * Extract the origin of the requesting client.
 *
 * Priority: Origin header (modern browsers) > Referer header (fallback).
 * Returns the origin (scheme + host + port) or null if neither is present.
 */
export function getRequestOrigin(request: Request): string | null {
    const origin = request.headers.get("origin");
    if (origin) return origin;

    const referer = request.headers.get("referer");
    if (referer) {
        try {
            return new URL(referer).origin;
        } catch {
            return null;
        }
    }
    return null;
}

/**
 * Determine whether the request's origin matches the server's origin.
 * Returns false when no origin information is available at all.
 */
function isSameOriginRequest(request: Request): boolean {
    const origin = getRequestOrigin(request);
    if (!origin) return false;
    try {
        return origin === new URL(request.url).origin;
    } catch {
        return false;
    }
}

/**
 * State-changing HTTP methods that require CSRF protection.
 */
const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * CSRF guard for state-changing requests.
 *
 * Supabase Auth uses cookie-based sessions, so ambient credentials are sent
 * automatically on cross-origin requests. Without CSRF protection, an
 * attacker site could trick a logged-in user's browser into making
 * state-changing requests to this API.
 *
 * We validate the Origin header (modern browsers) or Referer header
 * (fallback) against the server's origin. If neither is present, the
 * request is rejected — we cannot verify it originated from our own site.
 */
export function assertCsrfSafe(request: Request): { ok: true } | { ok: false; error: NextResponse } {
    const method = request.method?.toUpperCase() ?? "";
    if (!STATE_CHANGING_METHODS.has(method)) {
        return { ok: true };
    }

    const origin = getRequestOrigin(request);
    if (!origin) {
        return {
            ok: false,
            error: NextResponse.json({ error: "CSRF: missing origin header" }, { status: 403 }),
        };
    }

    try {
        const requestOrigin = new URL(request.url).origin;
        if (origin !== requestOrigin) {
            return {
                ok: false,
                error: NextResponse.json(
                    { error: "CSRF: origin mismatch" },
                    { status: 403 },
                ),
            };
        }
    } catch {
        return {
            ok: false,
            error: NextResponse.json({ error: "CSRF: invalid request origin" }, { status: 403 }),
        };
    }

    return { ok: true };
}

export async function secureApiRoute(
    request: Request,
    options: SecureApiOptions = {},
): Promise<{ context: ApiSecurityContext | null; error: NextResponse | null }> {
    const ip = getClientIp(request);
    const rateKey = options.rateLimitKey ?? ip;
    const rate = await checkRateLimit(rateKey, options.rateLimit ?? 60, 60_000);
    if (!rate.allowed) {
        return {
            context: null,
            error: NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 }),
        };
    }

    // CSRF protection for state-changing requests.
    const csrf = assertCsrfSafe(request);
    if (!csrf.ok) {
        return { context: null, error: csrf.error };
    }

    if (options.allowPublic && options.publicApiKeyEnv) {
        const expected = process.env[options.publicApiKeyEnv];
        const provided = request.headers.get("x-platform-key");
        if (expected && provided === expected) {
            return {
                context: {
                    user: { id: "platform-lead", email: "leads@platform.local", fullName: "Platform Lead Intake", role: "admin" },
                    organizationId: process.env.PLATFORM_ORGANIZATION_ID ?? null,
                },
                error: null,
            };
        }
    }

    const requireValidSession = options.requireValidSession !== false;
    if (requireValidSession) {
        const validated = await authServerService.validateSession();
        if (!validated.valid || !validated.user) {
            await logApiAudit({
                action: "api_unauthorized",
                metadata: { reason: validated.reason ?? "missing", path: new URL(request.url).pathname },
            });
            return {
                context: null,
                error: NextResponse.json(
                    { error: "Authentication required", reason: validated.reason ?? "missing" },
                    { status: 401 },
                ),
            };
        }

        if (validated.reason === "refresh_required") {
            await authServerService.refreshSessionIfNeeded();
        }

        const user = validated.user;
        const { role, organizationId } = await resolveServerIdentity(user.id);
        const authUser = { ...user, role };

        if (options.permission && !hasPermission(role, options.permission)) {
            await logApiAudit({
                action: "api_forbidden",
                userId: user.id,
                metadata: { permission: options.permission, path: new URL(request.url).pathname },
            });
            return {
                context: null,
                error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
            };
        }

        return {
            context: {
                user: { id: authUser.id, email: authUser.email, fullName: authUser.fullName ?? null, role },
                organizationId,
                sessionExpiresAt: validated.expiresAt ?? validated.session?.expiresAt ?? null,
                refreshRecommended: validated.reason === "refresh_required",
            },
            error: null,
        };
    }

    const user = await authServerService.getUser();
    if (!user) {
        return {
            context: null,
            error: NextResponse.json({ error: "Authentication required" }, { status: 401 }),
        };
    }

    const { role, organizationId } = await resolveServerIdentity(user.id);
    const authUser = { ...user, role };

    if (options.permission && !hasPermission(role, options.permission)) {
        await logApiAudit({ action: "api_forbidden", userId: user.id, metadata: { permission: options.permission, path: new URL(request.url).pathname } });
        return {
            context: null,
            error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
        };
    }

    return {
        context: { user: { id: authUser.id, email: authUser.email, fullName: authUser.fullName ?? null, role }, organizationId },
        error: null,
    };
}

export function apiSuccess<T>(data: T, status = 200) {
    return NextResponse.json(data, { status });
}

export function apiError(message: string, status = 400) {
    return NextResponse.json({ error: message }, { status });
}
