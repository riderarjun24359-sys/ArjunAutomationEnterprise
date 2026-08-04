import { enterpriseIdentityService } from "@/src/modules/enterprise-identity/services/enterprise-identity.service";
import type { AuthMethod, MfaMethod, SecurityRole } from "../types";

export async function getIdentityMfaStatus(authUserId: string, email: string, fullName?: string | null) {
    const enrollments = await enterpriseIdentityService.getMfaEnrollments(authUserId, email, fullName);
    const policies = await enterpriseIdentityService.getMfaPolicies(authUserId, email, fullName);
    return { enrollments, policies };
}

export async function enrollIdentityMfa(
    authUserId: string,
    email: string,
    method: MfaMethod,
    fullName?: string | null,
) {
    const realms = await enterpriseIdentityService.getRealms(authUserId, email, fullName);
    const realmId = realms[0]?.id ?? "";
    return enterpriseIdentityService.createMfaEnrollment(authUserId, email, {
        realmId,
        mfaType: method,
    }, fullName);
}

export async function getIdentitySessions(authUserId: string, email: string, fullName?: string | null) {
    return enterpriseIdentityService.getActiveSessions(authUserId, email, fullName);
}

export async function getIdentityRbacRoles(authUserId: string, email: string, fullName?: string | null) {
    return enterpriseIdentityService.getRbacRoles(authUserId, email, fullName);
}

export async function getIdentityOidcConfigs(authUserId: string, email: string, fullName?: string | null) {
    return enterpriseIdentityService.getOidcConfigs(authUserId, email, fullName);
}

export async function getIdentitySamlConfigs(authUserId: string, email: string, fullName?: string | null) {
    return enterpriseIdentityService.getSamlConfigs(authUserId, email, fullName);
}

export async function getIdentitySecurityAlerts(authUserId: string, email: string, fullName?: string | null) {
    return enterpriseIdentityService.getSecurityAlerts(authUserId, email, fullName);
}

export async function getIdentityTrustedDevices(authUserId: string, email: string, fullName?: string | null) {
    return enterpriseIdentityService.getDeviceRegistry(authUserId, email, fullName);
}

export async function getIdentityBackupCodes(authUserId: string, email: string, fullName?: string | null) {
    return enterpriseIdentityService.getBackupCodes(authUserId, email, fullName);
}

export async function assignIdentityRole(
    authUserId: string,
    email: string,
    role: SecurityRole,
    fullName?: string | null,
) {
    const realms = await enterpriseIdentityService.getRealms(authUserId, email, fullName);
    const realmId = realms[0]?.id ?? "";
    return enterpriseIdentityService.createRbacRole(authUserId, email, {
        realmId,
        roleKey: role,
        roleName: `Security Center role: ${role}`,
    }, fullName);
}

export async function getAuthMethodsFromIdentity(
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<AuthMethod[]> {
    const providers = await enterpriseIdentityService.getProviders(authUserId, email, fullName);
    const methods: AuthMethod[] = ["email_password"];
    for (const p of providers) {
        const type = String(p.providerType ?? "").toLowerCase();
        if (type.includes("google")) methods.push("google_oauth");
        if (type.includes("microsoft")) methods.push("microsoft_oauth");
        if (type.includes("github")) methods.push("github_oauth");
        if (type.includes("magic")) methods.push("magic_link");
    }
    return [...new Set(methods)];
}

export { enterpriseIdentityService };
