export type OrganizationStatus = "active" | "inactive" | "suspended";
export type UserRoleName = "super_admin" | "admin" | "manager" | "member" | "viewer";
export type PermissionAction = "read" | "write" | "delete" | "manage";
export type AuditAction = "create" | "update" | "delete" | "login" | "logout" | "view";

export interface Organization {
    id: string;
    name: string;
    slug: string;
    status: OrganizationStatus;
    metadata?: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}

export interface OrganizationMember {
    id: string;
    organization_id: string;
    user_id: string;
    role_name: UserRoleName;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface UserProfile {
    id: string;
    auth_user_id: string;
    email: string;
    full_name?: string | null;
    avatar_url?: string | null;
    locale?: string | null;
    metadata?: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}

export interface PermissionDefinition {
    id: string;
    key: string;
    description?: string | null;
    created_at: string;
    updated_at: string;
}

export interface RolePermission {
    id: string;
    role_name: UserRoleName;
    permission_key: string;
    action: PermissionAction;
    created_at: string;
}

export interface AuditLog {
    id: string;
    organization_id?: string | null;
    user_id?: string | null;
    entity_type?: string | null;
    entity_id?: string | null;
    action: AuditAction;
    metadata?: Record<string, unknown> | null;
    created_at: string;
}

export interface StorageObject {
    id: string;
    organization_id: string;
    bucket: string;
    path: string;
    mime_type?: string | null;
    size_bytes?: number | null;
    created_at: string;
    updated_at: string;
}
