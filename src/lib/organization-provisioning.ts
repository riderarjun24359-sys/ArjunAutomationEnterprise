/**
 * Organization provisioning contracts — pure input validation + normalization.
 * Server routes in app/api/organization/* enforce these before any database
 * write. Identity always comes from the authenticated session, never from
 * these inputs (they carry only the new-tenant details).
 */
import { z } from "zod";

/** Roles that may be granted through an invitation (never super_admin). */
export const INVITABLE_ROLES = ["viewer", "member", "manager", "admin"] as const;
export type InvitableRole = (typeof INVITABLE_ROLES)[number];

/** Relative privilege ordering used to prevent invite escalation. */
export const ROLE_RANK: Record<string, number> = {
    viewer: 0,
    member: 1,
    manager: 2,
    admin: 3,
    founder: 4,
    owner: 5,
    super_admin: 6,
};

/**
 * Invite gate: the inviter must hold at least a `member` role and may only
 * grant a role at or below their own. This is the server-side guard against a
 * low-privilege member inviting an admin (escalation). Founder/owner may grant
 * any invitable role (admin included); viewers cannot invite at all.
 */
export function canGrantInvite(
    inviterRole: string,
    invitedRole: string,
): { ok: true } | { ok: false; reason: string } {
    const inviterRank = ROLE_RANK[inviterRole];
    const invitedRank = ROLE_RANK[invitedRole];
    if (inviterRank === undefined) {
        return { ok: false, reason: "Unknown inviter role" };
    }
    if (invitedRank === undefined) {
        return { ok: false, reason: `Role ${invitedRole} cannot be granted by invitation` };
    }
    if (inviterRank < 1) {
        return { ok: false, reason: "Requires at least a member role to invite" };
    }
    if (invitedRank > inviterRank) {
        return {
            ok: false,
            reason: `Cannot invite the ${invitedRole} role with your ${inviterRole} role`,
        };
    }
    return { ok: true };
}

/** Normalize a free-text name into a URL-safe slug (`Acme Ops!` -> `acme-ops`). */
export function slugifyOrganizationName(name: string): string {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");
}

export const slugRule = z
    .string()
    .trim()
    .min(3, "slug must be at least 3 characters")
    .max(60, "slug must be at most 60 characters")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug may only contain lowercase letters, numbers, and hyphens");

const orgNameRule = z.string().trim().min(1, "organization name is required").max(120);

export const provisionInputSchema = z.object({
    name: orgNameRule,
    slug: z.string().trim().max(60).optional(),
});

export type ProvisionInput = z.infer<typeof provisionInputSchema>;

export const teamInputSchema = z.object({
    name: orgNameRule,
    slug: z.string().trim().max(60).optional(),
});

export type TeamInput = z.infer<typeof teamInputSchema>;

export const invitationInputSchema = z.object({
    email: z.string().trim().toLowerCase().email("valid email is required").max(254),
    roleName: z.enum(INVITABLE_ROLES),
});

export type InvitationInput = z.infer<typeof invitationInputSchema>;

export const acceptInvitationInputSchema = z.object({
    invitationId: z.string().trim().uuid("invitationId must be a UUID"),
});

export type AcceptInvitationInput = z.infer<typeof acceptInvitationInputSchema>;

/**
 * Resolve the effective slug: explicit value (normalized) or derived from the
 * name. Returns an error message instead of throwing so routes can answer 400.
 */
export function resolveSlug(name: string, explicitSlug?: string): { slug: string } | { error: string } {
    const raw = explicitSlug?.trim() ? explicitSlug : slugifyOrganizationName(name);
    const checked = slugRule.safeParse(raw.toLowerCase());
    if (!checked.success) {
        return { error: checked.error.issues[0]?.message ?? "invalid slug" };
    }
    return { slug: checked.data };
}
