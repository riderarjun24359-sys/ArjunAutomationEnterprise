import { SECURITY_PERMISSIONS, SECURITY_ROLES } from "../constants";
import type { Permission, SecurityRole } from "../types";
import { getIdentityRbacRoles } from "../integrations/enterprise-identity-bridge";

export function getRoles(): SecurityRole[] {
    return [...SECURITY_ROLES];
}

export function hasPermission(role: SecurityRole, permission: Permission): boolean {
    const permissions = SECURITY_PERMISSIONS[role] ?? [];
    return permissions.includes(permission);
}

export async function listCustomRoles(authUserId: string, email: string, fullName?: string | null) {
    return getIdentityRbacRoles(authUserId, email, fullName);
}

export function assignRole(_userId: string, role: SecurityRole): SecurityRole {
    if (!SECURITY_ROLES.includes(role)) {
        throw new Error(`Invalid security role: ${role}`);
    }
    return role;
}

export function getPermissionsForRole(role: SecurityRole): Permission[] {
    return SECURITY_PERMISSIONS[role] ?? [];
}

export function checkPermission(role: SecurityRole, permission: Permission): boolean {
    return hasPermission(role, permission);
}
