import { redirect } from "next/navigation";
import { ROUTES } from "@/src/constants/routes";
import { hasPermission, type PermissionKey } from "@/src/config/permissions";
import type { UserRole } from "@/src/constants/roles";

export const requireAuth = (user: unknown) => {
    if (!user) {
        redirect(ROUTES.auth.signIn);
    }
};

export const requireRole = (user: { role?: UserRole } | null, allowedRoles: UserRole[]) => {
    if (!user?.role || !allowedRoles.includes(user.role)) {
        redirect(ROUTES.dashboard);
    }
};

export const requirePermission = (user: { role?: UserRole } | null, permission: PermissionKey) => {
    if (!user?.role || !hasPermission(user.role, permission)) {
        redirect(ROUTES.dashboard);
    }
};
