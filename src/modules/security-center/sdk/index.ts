import { securityCenterService } from "../services/security-center.service";
import { hasPermission } from "../engine/rbac-engine";
import type { AuditEventType, MfaMethod, Permission, SecurityRole, UserContext } from "../types";

export function createSecurityCenterClient() {
    return {
        getAuthenticationStatus: securityCenterService.getAuthenticationStatus.bind(securityCenterService),
        configureAuthMethod: securityCenterService.configureAuthMethod.bind(securityCenterService),
        getMfaStatus: securityCenterService.getMfaStatus.bind(securityCenterService),
        enrollMfa: securityCenterService.enrollMfa.bind(securityCenterService),
        getRoles: securityCenterService.getRoles.bind(securityCenterService),
        assignRole: securityCenterService.assignRole.bind(securityCenterService),
        checkPermission: securityCenterService.checkPermission.bind(securityCenterService),
        hasPermission,
        verifyOrganizationIsolation: securityCenterService.verifyOrganizationIsolation.bind(securityCenterService),
        createApiKey: securityCenterService.createApiKey.bind(securityCenterService),
        validateToken: securityCenterService.validateToken.bind(securityCenterService),
        checkRateLimit: securityCenterService.checkRateLimit.bind(securityCenterService),
        listSecrets: securityCenterService.listSecrets.bind(securityCenterService),
        validateEnvironment: securityCenterService.validateEnvironment.bind(securityCenterService),
        logAuditEvent: securityCenterService.logAuditEvent.bind(securityCenterService),
        getAuditCenter: securityCenterService.getAuditCenter.bind(securityCenterService),
        runThreatDetection: securityCenterService.runThreatDetection.bind(securityCenterService),
        getThreatAlerts: securityCenterService.getThreatAlerts.bind(securityCenterService),
        getSecurityDashboard: securityCenterService.getSecurityDashboard.bind(securityCenterService),
        enforceViaMissionCore: securityCenterService.enforceViaMissionCore.bind(securityCenterService),
    };
}

export type SecurityCenterClient = ReturnType<typeof createSecurityCenterClient>;

export type { AuditEventType, MfaMethod, Permission, SecurityRole, UserContext };
