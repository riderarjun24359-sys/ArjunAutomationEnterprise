import { NextResponse } from "next/server";
import { authServerService } from "@/src/services/auth.server";
import { hasPermission, type PermissionKey } from "@/src/config/permissions";
import type { UserRole } from "@/src/constants/roles";
import { checkRateLimit } from "@/src/modules/security-center/engine/api-security-engine";
import { logApiAudit } from "@/src/lib/api-audit";

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

async function resolveUserRole(userId: string, email: string): Promise<UserRole> {
    void email;
    try {
        const { databaseService } = await import("@/src/modules/database/services/database-service");
        const profile = await databaseService.profiles.getByAuthUser(userId);
        if (profile) {
            const memberships = await databaseService.memberships.getByUser(profile.id);
            const roleName = memberships[0]?.role_name;
            if (roleName && ["super_admin", "admin", "manager", "member", "viewer"].includes(roleName)) {
                return roleName as UserRole;
            }
        }
    } catch {
        /* fall through */
    }
    return "member";
}

async function resolveOrganizationId(userId: string, email: string): Promise<string | null> {
    try {
        const { resolveOrganizationContext } = await import("@/src/modules/database/lib/organization-context");
        const ctx = await resolveOrganizationContext(userId, email);
        return ctx?.organizationId ?? null;
    } catch {
        return null;
    }
}

export function getClientIp(request: Request): string {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        "unknown"
    );
}

export async function secureApiRoute(
    request: Request,
    options: SecureApiOptions = {},
): Promise<{ context: ApiSecurityContext | null; error: NextResponse | null }> {
    const ip = getClientIp(request);
    const rateKey = options.rateLimitKey ?? ip;
    const rate = checkRateLimit(rateKey, options.rateLimit ?? 60, 60_000);
    if (!rate.allowed) {
        return {
            context: null,
            error: NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 }),
        };
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
        const role = await resolveUserRole(user.id, user.email);
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

        const organizationId = await resolveOrganizationId(user.id, user.email);
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

    const role = await resolveUserRole(user.id, user.email);
    const authUser = { ...user, role };

    if (options.permission && !hasPermission(role, options.permission)) {
        await logApiAudit({ action: "api_forbidden", userId: user.id, metadata: { permission: options.permission, path: new URL(request.url).pathname } });
        return {
            context: null,
            error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
        };
    }

    const organizationId = await resolveOrganizationId(user.id, user.email);

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
