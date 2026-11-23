"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { organizationService } from "@/src/modules/organization/services/organization.service";
import type {
    OrganizationInvitationSummary,
    OrganizationMembershipSummary,
    OrganizationMemberSummary,
    OrganizationSummary,
    WorkspaceSummary,
} from "@/src/modules/organization/types";

export function useOrganization() {
    const user = useAuthStore((s) => s.user);
    const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);
    const [memberships, setMemberships] = useState<OrganizationMembershipSummary[]>([]);
    const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
    const [members, setMembers] = useState<OrganizationMemberSummary[]>([]);
    const [invitations, setInvitations] = useState<OrganizationInvitationSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [revokingInvitationId, setRevokingInvitationId] = useState<string | null>(null);
    const [invitationActionError, setInvitationActionError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (!user) {
                if (!cancelled) {
                    setOrganizations([]);
                    setMemberships([]);
                    setWorkspaces([]);
                    setMembers([]);
                    setInvitations([]);
                    setLoading(false);
                }
                return;
            }

            if (!cancelled) setLoading(true);

            try {
                // This identity-only endpoint deliberately works even when the
                // caller has multiple memberships and no tenant is selected.
                const membershipResponse = await fetch("/api/organization/memberships", { cache: "no-store" });
                if (!membershipResponse.ok) {
                    throw new Error("Unable to load organization memberships");
                }
                const membershipPayload = await membershipResponse.json() as {
                    memberships?: OrganizationMembershipSummary[];
                };
                const availableMemberships = membershipPayload.memberships ?? [];
                if (!cancelled) setMemberships(availableMemberships);

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
                    setMemberships([]);
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

    const revokeInvitation = async (invitationId: string): Promise<boolean> => {
        setInvitationActionError(null);
        setRevokingInvitationId(invitationId);
        try {
            const response = await fetch("/api/organization/invitations", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ invitationId }),
                cache: "no-store",
            });
            const payload = await response.json().catch(() => ({})) as { error?: string };
            if (!response.ok) {
                setInvitationActionError(payload.error ?? "Invitation could not be revoked.");
                return false;
            }
            setInvitations((current) => current.map((invite) => invite.id === invitationId ? { ...invite, status: "revoked" } : invite));
            return true;
        } catch {
            setInvitationActionError("Network error. Invitation status was not changed.");
            return false;
        } finally {
            setRevokingInvitationId(null);
        }
    };

    return { organizations, memberships, workspaces, members, invitations, loading, revokeInvitation, revokingInvitationId, invitationActionError };
}
