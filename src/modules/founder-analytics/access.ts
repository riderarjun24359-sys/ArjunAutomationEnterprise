import { canAccess } from "@/src/modules/auth/lib/rbac";
import { USER_ROLES, type UserRole } from "@/src/constants/roles";
import type { UserRoleName } from "@/src/modules/database/types/core";

const FOUNDER_ADMIN_ROLES: ReadonlySet<string> = new Set([
    USER_ROLES.superAdmin,
    USER_ROLES.admin,
    "founder",
    "owner",
]);

/** Founder / Admin only — uses auth role and optional membership role. */
export function isFounderOrAdminAccess(input: {
    authRole?: UserRole | null;
    membershipRole?: UserRoleName | string | null;
}): boolean {
    if (canAccess(input.authRole, USER_ROLES.admin)) return true;
    if (input.membershipRole && FOUNDER_ADMIN_ROLES.has(String(input.membershipRole).toLowerCase())) return true;
    return false;
}

export function founderAccessDeniedMessage(): string {
    return "Founder Analytics & Growth Command Center is restricted to Founder and Admin roles.";
}
