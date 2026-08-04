import type {
    ApiKey,
    AuditEvent,
    AuditEventType,
    AuthMethod,
    AuthMethodStatus,
    MfaMethod,
    MfaStatus,
    Permission,
    SecurityDashboardStats,
    SecurityRole,
    ThreatAlert,
    UserContext,
    OrgIsolationCheck,
    SecretEntry,
    SecurityPolicyResult,
    RateLimitResult,
} from "../types";
import * as authenticationEngine from "../engine/authentication-engine";
import * as mfaEngine from "../engine/mfa-engine";
import * as rbacEngine from "../engine/rbac-engine";
import * as orgIsolationEngine from "../engine/org-isolation-engine";
import * as apiSecurityEngine from "../engine/api-security-engine";
import * as secretsEngine from "../engine/secrets-engine";
import * as auditEngine from "../engine/audit-engine";
import * as threatDetectionEngine from "../engine/threat-detection-engine";
import { enforceSecurityPolicy, publishSecurityEvent } from "../integrations/mission-core-bridge";

export class SecurityCenterService {
    async getAuthenticationStatus(authUserId: string, email: string, fullName?: string | null): Promise<AuthMethodStatus[]> {
        return authenticationEngine.listAuthMethods(authUserId, email, fullName);
    }

    configureAuthMethod(method: AuthMethod, enabled: boolean): AuthMethodStatus {
        return authenticationEngine.configureAuthMethod(method, enabled);
    }

    async getMfaStatus(authUserId: string, email: string, fullName?: string | null): Promise<MfaStatus> {
        return mfaEngine.getMfaStatus(authUserId, email, fullName);
    }

    async enrollMfa(authUserId: string, email: string, method: MfaMethod, fullName?: string | null) {
        return mfaEngine.enrollMfa(authUserId, email, method, fullName);
    }

    getRoles(): SecurityRole[] {
        return rbacEngine.getRoles();
    }

    assignRole(userId: string, role: SecurityRole): SecurityRole {
        return rbacEngine.assignRole(userId, role);
    }

    checkPermission(role: SecurityRole, permission: Permission): boolean {
        return rbacEngine.checkPermission(role, permission);
    }

    async verifyOrganizationIsolation(orgId: string): Promise<OrgIsolationCheck[]> {
        return orgIsolationEngine.verifyOrgIsolation(orgId);
    }

    createApiKey(name: string, role: SecurityRole): ApiKey {
        return apiSecurityEngine.createApiKey(name, role);
    }

    validateToken(token: string) {
        return apiSecurityEngine.validateToken(token);
    }

    checkRateLimit(keyId: string): RateLimitResult {
        return apiSecurityEngine.checkRateLimit(keyId);
    }

    listSecrets(): SecretEntry[] {
        return secretsEngine.listSecrets();
    }

    validateEnvironment() {
        return secretsEngine.validateEnvironment();
    }

    async logAuditEvent(input: {
        type: AuditEventType;
        action: string;
        organizationId?: string | null;
        actorId?: string | null;
        metadata?: Record<string, unknown> | null;
    }): Promise<AuditEvent | null> {
        return auditEngine.logAuditEvent(input);
    }

    async getAuditCenter(organizationId?: string): Promise<AuditEvent[]> {
        return auditEngine.getAuditCenter(organizationId);
    }

    async runThreatDetection(authUserId: string, email: string, fullName?: string | null): Promise<ThreatAlert[]> {
        threatDetectionEngine.runThreatDetection();
        return threatDetectionEngine.detectThreats(authUserId, email, fullName);
    }

    getThreatAlerts(): ThreatAlert[] {
        return threatDetectionEngine.getThreatAlerts();
    }

    async getSecurityDashboard(
        authUserId: string,
        email: string,
        orgId: string,
        fullName?: string | null,
    ): Promise<SecurityDashboardStats> {
        const [authMethods, mfaStatus, orgChecks, auditEvents, secrets] = await Promise.all([
            this.getAuthenticationStatus(authUserId, email, fullName),
            this.getMfaStatus(authUserId, email, fullName),
            this.verifyOrganizationIsolation(orgId),
            this.getAuditCenter(orgId),
            Promise.resolve(this.listSecrets()),
        ]);
        const threats = await this.runThreatDetection(authUserId, email, fullName);
        const env = this.validateEnvironment();

        return {
            authMethodsEnabled: authMethods.filter((m) => m.enabled).length,
            mfaEnrollmentRate: mfaStatus.enrolled ? 100 : 0,
            activeThreats: threats.filter((t) => !t.resolved).length,
            auditEventsToday: auditEvents.length,
            apiKeysActive: apiSecurityEngine.listApiKeys().filter((k) => k.status === "active").length,
            secretsValid: env.valid && secrets.every((s) => !s.required || s.present),
            orgIsolationScore: orgIsolationEngine.computeIsolationScore(orgChecks),
            lastCheckedAt: new Date().toISOString(),
        };
    }

    enforceViaMissionCore(action: string, userContext: UserContext): SecurityPolicyResult {
        const result = enforceSecurityPolicy("securityCenter", action, userContext);
        if (result.allowed) {
            publishSecurityEvent("SecurityActionEnforced", { action, userId: userContext.userId });
        }
        return result;
    }
}

export const securityCenterService = new SecurityCenterService();
