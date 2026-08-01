import { type UserRole, USER_ROLES } from "@/src/constants/roles";

export const PERMISSIONS = {
    dashboardView: [USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.member],
    projectsManage: [USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.manager],
    clientsManage: [USER_ROLES.superAdmin, USER_ROLES.admin, USER_ROLES.manager],
    financeManage: [USER_ROLES.superAdmin, USER_ROLES.admin],
    automationManage: [USER_ROLES.superAdmin, USER_ROLES.admin],
    settingsManage: [USER_ROLES.superAdmin, USER_ROLES.admin],
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

export const hasPermission = (role: UserRole, permission: PermissionKey): boolean => {
    return (PERMISSIONS[permission] as readonly UserRole[]).includes(role);
};
