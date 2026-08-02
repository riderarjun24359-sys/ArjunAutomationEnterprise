export interface OrganizationSummary {
    id: string;
    name: string;
    slug: string;
    status: "active" | "inactive" | "suspended";
    memberCount: number;
    workspaceCount: number;
    updatedAt: string;
}

export interface WorkspaceSummary {
    id: string;
    organizationId: string;
    name: string;
    slug: string;
    status: "active" | "inactive";
    memberCount: number;
    updatedAt: string;
}

export interface OrganizationMemberSummary {
    id: string;
    userId: string;
    fullName?: string | null;
    email: string;
    roleName: "super_admin" | "admin" | "manager" | "member" | "viewer";
    isActive: boolean;
    joinedAt: string;
}

export interface OrganizationInvitationSummary {
    id: string;
    email: string;
    roleName: "super_admin" | "admin" | "manager" | "member" | "viewer";
    status: "pending" | "accepted" | "expired" | "revoked";
    expiresAt: string;
}

export interface OrganizationSettingsFormValues {
    name: string;
    slug: string;
    status: "active" | "inactive" | "suspended";
}

export interface WorkspaceFormValues {
    name: string;
    slug: string;
    status: "active" | "inactive";
}
