import { canAccess } from "@/src/modules/auth/lib/rbac";
import { USER_ROLES, type UserRole } from "@/src/constants/roles";
import type { SecurityRole } from "../types";

const SECURITY_TO_USER_ROLE: Record<SecurityRole, UserRole> = {
    founder: USER_ROLES.superAdmin,
    admin: USER_ROLES.admin,
    sales: USER_ROLES.manager,
    delivery: USER_ROLES.manager,
    support: USER_ROLES.member,
    finance: USER_ROLES.manager,
    customer: USER_ROLES.viewer,
    custom: USER_ROLES.member,
};

export function guardMinimumRole(securityRole: SecurityRole, minimum: SecurityRole): boolean {
    const userRole = SECURITY_TO_USER_ROLE[securityRole];
    const minRole = SECURITY_TO_USER_ROLE[minimum];
    return canAccess(userRole, minRole);
}

export function guardAuthAccess(role: UserRole | null | undefined, minimumRole: UserRole = USER_ROLES.viewer): boolean {
    return canAccess(role, minimumRole);
}

export function mapSecurityRoleToUserRole(role: SecurityRole): UserRole {
    return SECURITY_TO_USER_ROLE[role];
}

export { canAccess, USER_ROLES };
