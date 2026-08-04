import { MFA_METHODS } from "../constants";
import type { MfaMethod, MfaStatus } from "../types";
import {
    enrollIdentityMfa,
    getIdentityBackupCodes,
    getIdentityMfaStatus,
    getIdentityTrustedDevices,
} from "../integrations/enterprise-identity-bridge";

export async function getMfaStatus(
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<MfaStatus> {
    const { enrollments, policies } = await getIdentityMfaStatus(authUserId, email, fullName);
    const methods = enrollments
        .map((e) => String(e.mfaType ?? "") as MfaMethod)
        .filter((m): m is MfaMethod => MFA_METHODS.includes(m));
    return {
        enrolled: enrollments.length > 0,
        methods: methods.length > 0 ? methods : [],
        policyEnforced: policies.some((p) => p.status === "active"),
    };
}

export async function enrollMfa(
    authUserId: string,
    email: string,
    method: MfaMethod,
    fullName?: string | null,
) {
    return enrollIdentityMfa(authUserId, email, method, fullName);
}

export async function getRecoveryCodes(authUserId: string, email: string, fullName?: string | null) {
    return getIdentityBackupCodes(authUserId, email, fullName);
}

export async function getTrustedDevices(authUserId: string, email: string, fullName?: string | null) {
    return getIdentityTrustedDevices(authUserId, email, fullName);
}

export function listMfaMethods(): MfaMethod[] {
    return [...MFA_METHODS];
}
