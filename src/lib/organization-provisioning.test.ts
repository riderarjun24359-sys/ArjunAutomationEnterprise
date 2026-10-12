import { describe, it, expect } from "vitest";
import {
    canGrantInvite,
    invitationInputSchema,
    provisionInputSchema,
    resolveSlug,
    slugifyOrganizationName,
    teamInputSchema,
    acceptInvitationInputSchema,
} from "./organization-provisioning";

describe("organization provisioning contracts", () => {
    it("slugifies names deterministically", () => {
        expect(slugifyOrganizationName("Acme Operations!")).toBe("acme-operations");
        expect(slugifyOrganizationName("  --Hello__World--  ")).toBe("hello-world");
        expect(slugifyOrganizationName("a")).toBe("a");
    });

    it("resolves explicit slugs or derives them, rejecting garbage", () => {
        expect(resolveSlug("Acme Operations")).toEqual({ slug: "acme-operations" });
        expect(resolveSlug("Acme", "Custom-Slug")).toEqual({ slug: "custom-slug" });
        expect("error" in resolveSlug("A!")).toBe(true);
        expect("error" in resolveSlug("Acme", "has spaces")).toBe(true);
    });

    it("validates provision/team inputs", () => {
        expect(provisionInputSchema.safeParse({ name: "Acme" }).success).toBe(true);
        expect(provisionInputSchema.safeParse({ name: "" }).success).toBe(false);
        expect(provisionInputSchema.safeParse({}).success).toBe(false);
        expect(teamInputSchema.safeParse({ name: "Ops" }).success).toBe(true);
        expect(teamInputSchema.safeParse({ name: "  " }).success).toBe(false);
    });

    it("accepts mailable roles but never super_admin by invite", () => {
        expect(invitationInputSchema.safeParse({ email: "mate@test.dev", roleName: "manager" }).success).toBe(true);
        expect(invitationInputSchema.safeParse({ email: "MATE@test.dev", roleName: "member" }).data?.email).toBe(
            "mate@test.dev",
        );
        expect(invitationInputSchema.safeParse({ email: "not-an-email", roleName: "member" }).success).toBe(false);
        expect(invitationInputSchema.safeParse({ email: "a@test.dev", roleName: "super_admin" }).success).toBe(false);
        expect(invitationInputSchema.safeParse({ email: "a@test.dev", roleName: "owner" }).success).toBe(false);
    });

    it("requires a UUID to accept", () => {
        expect(
            acceptInvitationInputSchema.safeParse({ invitationId: "00000000-0000-0000-0000-000000000000" }).success,
        ).toBe(true);
        expect(acceptInvitationInputSchema.safeParse({ invitationId: "nope" }).success).toBe(false);
    });

    it("prevents invite escalation via role rank", () => {
        // Viewers cannot invite at all.
        expect(canGrantInvite("viewer", "member").ok).toBe(false);
        // A member may invite peers/juniors but never a manager or admin.
        expect(canGrantInvite("member", "member").ok).toBe(true);
        expect(canGrantInvite("member", "viewer").ok).toBe(true);
        expect(canGrantInvite("member", "manager").ok).toBe(false);
        expect(canGrantInvite("member", "admin").ok).toBe(false);
        // Managers cap at manager.
        expect(canGrantInvite("manager", "manager").ok).toBe(true);
        expect(canGrantInvite("manager", "admin").ok).toBe(false);
        // Admins may grant admin, founders/owners may grant any invitable role.
        expect(canGrantInvite("admin", "admin").ok).toBe(true);
        expect(canGrantInvite("founder", "admin").ok).toBe(true);
        expect(canGrantInvite("owner", "admin").ok).toBe(true);
        // Unknown/ungrantable roles fail closed.
        expect(canGrantInvite("member", "super_admin").ok).toBe(false);
        expect(canGrantInvite("ghost", "member").ok).toBe(false);
    });
});
