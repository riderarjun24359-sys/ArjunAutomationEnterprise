/**
 * Platform founder accounts are elevated to organization_members.role_name = "founder".
 * Access checks (isFounderOrAdminAccess) read that membership role — they are not bypassed.
 */
const DEFAULT_PLATFORM_FOUNDER_EMAILS = ["chittemprashantharjun@gmail.com"] as const;

const FOUNDER_ADMIN_MEMBERSHIP_ROLES = new Set(["super_admin", "admin", "founder", "owner"]);

export function getPlatformFounderEmails(): ReadonlySet<string> {
    const fromEnv = (process.env.NEXT_PUBLIC_PLATFORM_FOUNDER_EMAILS ?? "")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);

    return new Set([...DEFAULT_PLATFORM_FOUNDER_EMAILS.map((e) => e.toLowerCase()), ...fromEnv]);
}

export function isPlatformFounderEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    return getPlatformFounderEmails().has(email.trim().toLowerCase());
}

export function hasFounderAdminMembershipRole(roleName: string | null | undefined): boolean {
    if (!roleName) return false;
    return FOUNDER_ADMIN_MEMBERSHIP_ROLES.has(String(roleName).toLowerCase());
}
