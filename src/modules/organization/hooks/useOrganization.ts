"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { organizationService } from "@/src/modules/organization/services/organization.service";
import type {
    OrganizationInvitationSummary,
    OrganizationMemberSummary,
    OrganizationSummary,
    WorkspaceSummary,
} from "@/src/modules/organization/types";

export function useOrganization() {
    const user = useAuthStore((s) => s.user);
    const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);
    const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
    const [members, setMembers] = useState<OrganizationMemberSummary[]>([]);
    const [invitations, setInvitations] = useState<OrganizationInvitationSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (!user) {
                if (!cancelled) {
                    setOrganizations([]);
                    setWorkspaces([]);
                    setMembers([]);
                    setInvitations([]);
                    setLoading(false);
                }
                return;
            }

            if (!cancelled) setLoading(true);

            try {
                const orgs = await organizationService.getOrganizations(user.id, user.email, user.fullName);
                const orgId = orgs[0]?.id;
                const [ws, membersList, invites] = await Promise.all([
                    organizationService.getWorkspaces(user.id, user.email, orgId, user.fullName),
                    organizationService.getMembers(user.id, user.email, user.fullName),
                    organizationService.getInvitations(user.id, user.email, user.fullName),
                ]);

                if (!cancelled) {
                    setOrganizations(orgs);
                    setWorkspaces(ws);
                    setMembers(membersList);
                    setInvitations(invites);
                }
            } catch {
                if (!cancelled) {
                    setOrganizations([]);
                    setWorkspaces([]);
                    setMembers([]);
                    setInvitations([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        const timer = window.setTimeout(() => {
            void load();
        }, 0);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [user]);

    return { organizations, workspaces, members, invitations, loading };
}
