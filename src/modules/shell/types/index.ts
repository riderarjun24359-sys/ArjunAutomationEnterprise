import type { AuditLog, Organization, OrganizationMember, UserProfile } from "@/src/modules/database/types/core";

export interface ShellContext {
    profile: UserProfile | null;
    organization: Organization | null;
    memberships: OrganizationMember[];
    recentActivity: AuditLog[];
}

export interface ShellHeaderMeta {
    title: string;
    description?: string;
}
