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

function persistOrganizationSelection(organizationId: string | null): void {
    if (typeof window === "undefined") return;
    if (organizationId) {
        window.localStorage.setItem("aae:selected-organization", organizationId);
        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = `aae_selected_organization=${encodeURIComponent(organizationId)}; Path=/; SameSite=Lax; Max-Age=31536000${secure}`;
    } else {
        window.localStorage.removeItem("aae:selected-organization");
        document.cookie = "aae_selected_organization=; Path=/; SameSite=Lax; Max-Age=0";
    }
}


export function useOrganization() {
    const user = useAuthStore((s) => s.user);
    const [organizations, setOrganizations] = useState<OrganizationSummary[]>([]);
    const [memberships, setMemberships] = useState<OrganizationMembershipSummary[]>([]);
    const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(null);
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
                    setSelectedOrganizationId(null);
                    persistOrganizationSelection(null);
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
                const savedSelection = window.localStorage.getItem("aae:selected-organization");
                const validSavedSelection = savedSelection && availableMemberships.some(
                    (membership) => membership.organizationId === savedSelection && membership.status === "active",
                ) ? savedSelection : null;
                const nextSelection = validSavedSelection ??
                    (availableMemberships.length === 1 && availableMemberships[0].status === "active"
                        ? availableMemberships[0].organizationId
                        : null);
                persistOrganizationSelection(nextSelection);
                if (!cancelled) {
                    setMemberships(availableMemberships);
                    setSelectedOrganizationId(nextSelection);
                }

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
    }, [user, selectedOrganizationId]);

    const selectOrganization = (organizationId: string) => {\n        const allowed = memberships.some((membership) => membership.organizationId === organizationId && membership.status === "active");\n        if (!allowed) return;\n        window.localStorage.setItem("aae:selected-organization", organizationId);\n        setSelectedOrganizationId(organizationId);\n    };\n\n    const revokeInvitation = async (invitationId: string): Promise<boolean> => {
        setInvitationActionError(null);
        setRevokingInvitationId(invitationId);
        try {
            const response = await fetch("/api/organization/invitations", {
                method: "DELETE",
                headers: {\n                    "Content-Type": "application/json",\n                    ...(selectedOrganizationId ? { "x-organization-id": selectedOrganizationId } : {}),\n                },
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

    return { organizations, memberships, workspaces, members, invitations, loading, selectedOrganizationId, selectOrganization, revokeInvitation, revokingInvitationId, invitationActionError };
}
