import { AUTH_METHODS } from "../constants";
import type { AuthMethod, AuthMethodStatus } from "../types";
import { getAuthMethodsFromIdentity, getIdentitySessions } from "../integrations/enterprise-identity-bridge";

export async function listAuthMethods(
    authUserId: string,
    email: string,
    fullName?: string | null,
): Promise<AuthMethodStatus[]> {
    const configured = await getAuthMethodsFromIdentity(authUserId, email, fullName);
    return AUTH_METHODS.map((method) => ({
        method,
        enabled: configured.includes(method),
        configured: configured.includes(method),
    }));
}

export async function getSessionSummary(authUserId: string, email: string, fullName?: string | null) {
    const sessions = await getIdentitySessions(authUserId, email, fullName);
    return { count: sessions.length, sessions };
}

export async function rememberDevice(
    authUserId: string,
    email: string,
    deviceId: string,
    fullName?: string | null,
) {
    const sessions = await getIdentitySessions(authUserId, email, fullName);
    return { remembered: true, deviceId, activeSessions: sessions.length };
}

export function configureAuthMethod(method: AuthMethod, enabled: boolean): AuthMethodStatus {
    return { method, enabled, configured: enabled };
}
