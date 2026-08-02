"use client";

import { useEffect, useState } from "react";
import { organizationService } from "@/src/modules/organization/services/organization.service";
import type { OrganizationInvitationSummary, OrganizationMemberSummary, OrganizationSummary, WorkspaceSummary } from "@/src/modules/organization/types";

export function useOrganization() {
    const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);
    const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
    const [members, setMembers] = useState<OrganizationMemberSummary[]>([]);
    const [invitations, setInvitations] = useState<OrganizationInvitationSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const [orgs, ws, membersList, invites] = await Promise.all([
                organizationService.getOrganizations(),
                organizationService.getWorkspaces("org-1"),
                organizationService.getMembers(),
                organizationService.getInvitations(),
            ]);

            setOrganizations(orgs);
            setWorkspaces(ws);
            setMembers(membersList);
            setInvitations(invites);
            setLoading(false);
        };

        void load();
    }, []);

    return { organizations, workspaces, members, invitations, loading };
}
