export const USER_ROLES = {
    superAdmin: "super_admin",
    admin: "admin",
    manager: "manager",
    member: "member",
    viewer: "viewer",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const ROLE_LEVELS: Record<UserRole, number> = {
    super_admin: 100,
    admin: 80,
    manager: 60,
    member: 40,
    viewer: 20,
};

export const ROLE_LABELS: Record<UserRole, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    manager: "Manager",
    member: "Member",
    viewer: "Viewer",
};
