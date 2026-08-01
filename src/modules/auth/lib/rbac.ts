import { USER_ROLES, type UserRole } from "@/src/constants/roles";

export type RoleScope = "admin" | "manager" | "member" | "viewer";

export const roleHierarchy: Record<UserRole, number> = {
    [USER_ROLES.superAdmin]: 5,
    [USER_ROLES.admin]: 4,
    [USER_ROLES.manager]: 3,
    [USER_ROLES.member]: 2,
    [USER_ROLES.viewer]: 1,
};

export const canAccess = (role: UserRole | null | undefined, minimumRole: UserRole): boolean => {
    if (!role) {
        return false;
    }

    return roleHierarchy[role] >= roleHierarchy[minimumRole];
};
