import fs from "fs";
import path from "path";

const root = path.resolve("src/modules/enterprise-identity");

const entities = [
    { tab: "realms", label: "Realms", plural: "realms", singular: "Realm", state: "realms", get: "getRealms", create: "createRealm", db: "idpRealms", map: "mapRealmSummary", build: "buildRealmPayload", input: "CreateRealmInput", summary: "RealmSummary", audit: "realm", maps: false, orgScoped: true, schema: "realmFormSchema", form: "RealmFormValues", titleKey: "realmName", listSub: "${item.realmKey} • ${item.status}", fields: [{ name: "realmKey", placeholder: "Realm key" }, { name: "realmName", placeholder: "Realm name" }, { name: "summary", placeholder: "Summary", textarea: true, optional: true }] },
    { tab: "providers", label: "Providers", plural: "providers", singular: "Provider", state: "providers", get: "getProviders", create: "createProvider", db: "idpProviders", map: "mapProviderSummary", build: "buildProviderPayload", input: "CreateProviderInput", summary: "ProviderSummary", audit: "provider", maps: true, orgScoped: false, schema: "providerFormSchema", form: "ProviderFormValues", titleKey: "displayName", listSub: "${item.realmName} • ${item.providerKey}", fields: [{ name: "providerKey", placeholder: "Provider key" }, { name: "providerType", placeholder: "Provider type", select: "PROVIDER_TYPE_OPTIONS" }, { name: "displayName", placeholder: "Display name" }] },
    { tab: "samlConfigs", label: "SAML Configs", plural: "samlConfigs", singular: "SamlConfig", state: "samlConfigs", get: "getSamlConfigs", create: "createSamlConfig", db: "idpSamlConfigs", map: "mapSamlConfigSummary", build: "buildSamlConfigPayload", input: "CreateSamlConfigInput", summary: "SamlConfigSummary", audit: "saml_config", maps: true, orgScoped: false, schema: "samlConfigFormSchema", form: "SamlConfigFormValues", titleKey: "configKey", subKeys: ["entityId"], listTitle: (e) => e.configKey, listSub: (e) => `${e.realmName} • ${e.entityId}`, fields: [{ name: "configKey", placeholder: "Config key" }, { name: "entityId", placeholder: "Entity ID" }, { name: "ssoUrl", placeholder: "SSO URL" }] },
    { tab: "oidcConfigs", label: "OIDC Configs", plural: "oidcConfigs", singular: "OidcConfig", state: "oidcConfigs", get: "getOidcConfigs", create: "createOidcConfig", db: "idpOidcConfigs", map: "mapOidcConfigSummary", build: "buildOidcConfigPayload", input: "CreateOidcConfigInput", summary: "OidcConfigSummary", audit: "oidc_config", maps: true, orgScoped: false, schema: "oidcConfigFormSchema", form: "OidcConfigFormValues", titleKey: "configKey", subKeys: ["clientId"], listTitle: (e) => e.configKey, listSub: (e) => `${e.realmName} • ${e.clientId}`, fields: [{ name: "configKey", placeholder: "Config key" }, { name: "clientId", placeholder: "Client ID" }, { name: "issuerUrl", placeholder: "Issuer URL" }] },
    { tab: "mfaPolicies", label: "MFA Policies", plural: "mfaPolicies", singular: "MfaPolicy", state: "mfaPolicies", get: "getMfaPolicies", create: "createMfaPolicy", db: "idpMfaPolicies", map: "mapMfaPolicySummary", build: "buildMfaPolicyPayload", input: "CreateMfaPolicyInput", summary: "MfaPolicySummary", audit: "mfa_policy", maps: true, orgScoped: false, schema: "mfaPolicyFormSchema", form: "MfaPolicyFormValues", titleKey: "name", subKeys: ["policyKey"], listTitle: (e) => e.name, listSub: (e) => `${e.realmName} • ${e.policyKey}`, fields: [{ name: "policyKey", placeholder: "Policy key" }, { name: "name", placeholder: "Name" }, { name: "gracePeriodDays", placeholder: "Grace period days", number: true }] },
    { tab: "mfaEnrollments", label: "MFA Enrollments", plural: "mfaEnrollments", singular: "MfaEnrollment", state: "mfaEnrollments", get: "getMfaEnrollments", create: "createMfaEnrollment", db: "idpMfaEnrollments", map: "mapMfaEnrollmentSummary", build: "buildMfaEnrollmentPayload", input: "CreateMfaEnrollmentInput", summary: "MfaEnrollmentSummary", audit: "mfa_enrollment", maps: true, orgScoped: false, schema: "mfaEnrollmentFormSchema", form: "MfaEnrollmentFormValues", titleKey: "enrollmentKey", subKeys: ["mfaType"], listTitle: (e) => e.enrollmentKey, listSub: (e) => `${e.realmName} • ${e.mfaType}`, fields: [{ name: "enrollmentKey", placeholder: "Enrollment key" }, { name: "mfaType", placeholder: "MFA type", select: "MFA_TYPE_OPTIONS" }] },
    { tab: "backupCodes", label: "Backup Codes", plural: "backupCodes", singular: "BackupCode", state: "backupCodes", get: "getBackupCodes", create: "createBackupCode", db: "idpBackupCodes", map: "mapBackupCodeSummary", build: "buildBackupCodePayload", input: "CreateBackupCodeInput", summary: "BackupCodeSummary", audit: "backup_code", maps: true, orgScoped: false, schema: "backupCodeFormSchema", form: "BackupCodeFormValues", titleKey: "codeKey", subKeys: ["status"], listTitle: (e) => e.codeKey, listSub: (e) => `${e.realmName} • ${e.status}`, fields: [{ name: "codeKey", placeholder: "Code key" }] },
    { tab: "trustedDevices", label: "Trusted Devices", plural: "trustedDevices", singular: "TrustedDevice", state: "trustedDevices", get: "getTrustedDevices", create: "createTrustedDevice", db: "idpTrustedDevices", map: "mapTrustedDeviceSummary", build: "buildTrustedDevicePayload", input: "CreateTrustedDeviceInput", summary: "TrustedDeviceSummary", audit: "trusted_device", maps: true, orgScoped: false, schema: "trustedDeviceFormSchema", form: "TrustedDeviceFormValues", titleKey: "deviceName", subKeys: ["deviceKey"], listTitle: (e) => e.deviceName, listSub: (e) => `${e.realmName} • ${e.deviceKey}`, fields: [{ name: "deviceKey", placeholder: "Device key" }, { name: "deviceName", placeholder: "Device name" }] },
    { tab: "sessionPolicies", label: "Session Policies", plural: "sessionPolicies", singular: "SessionPolicy", state: "sessionPolicies", get: "getSessionPolicies", create: "createSessionPolicy", db: "idpSessionPolicies", map: "mapSessionPolicySummary", build: "buildSessionPolicyPayload", input: "CreateSessionPolicyInput", summary: "SessionPolicySummary", audit: "session_policy", maps: true, orgScoped: false, schema: "sessionPolicyFormSchema", form: "SessionPolicyFormValues", titleKey: "name", subKeys: ["policyKey"], listTitle: (e) => e.name, listSub: (e) => `${e.realmName} • ${e.policyKey}`, fields: [{ name: "policyKey", placeholder: "Policy key" }, { name: "name", placeholder: "Name" }, { name: "idleTimeoutMinutes", placeholder: "Idle timeout minutes", number: true }] },
    { tab: "activeSessions", label: "Active Sessions", plural: "activeSessions", singular: "ActiveSession", state: "activeSessions", get: "getActiveSessions", create: "createActiveSession", db: "idpActiveSessions", map: "mapActiveSessionSummary", build: "buildActiveSessionPayload", input: "CreateActiveSessionInput", summary: "ActiveSessionSummary", audit: "active_session", maps: true, orgScoped: false, schema: "activeSessionFormSchema", form: "ActiveSessionFormValues", titleKey: "sessionKey", subKeys: ["deviceName"], listTitle: (e) => e.sessionKey, listSub: (e) => `${e.realmName} • ${e.deviceName}`, fields: [{ name: "sessionKey", placeholder: "Session key" }, { name: "deviceName", placeholder: "Device name" }] },
    { tab: "deviceRegistry", label: "Device Registry", plural: "deviceRegistry", singular: "DeviceRegistry", state: "deviceRegistry", get: "getDeviceRegistry", create: "createDeviceRegistry", db: "idpDeviceRegistry", map: "mapDeviceRegistrySummary", build: "buildDeviceRegistryPayload", input: "CreateDeviceRegistryInput", summary: "DeviceRegistrySummary", audit: "device_registry", maps: true, orgScoped: false, schema: "deviceRegistryFormSchema", form: "DeviceRegistryFormValues", titleKey: "deviceName", subKeys: ["deviceType"], listTitle: (e) => e.deviceName, listSub: (e) => `${e.realmName} • ${e.deviceType}`, fields: [{ name: "deviceKey", placeholder: "Device key" }, { name: "deviceName", placeholder: "Device name" }, { name: "deviceType", placeholder: "Device type" }] },
    { tab: "concurrentLoginPolicies", label: "Concurrent Login", plural: "concurrentLoginPolicies", singular: "ConcurrentLoginPolicy", state: "concurrentLoginPolicies", get: "getConcurrentLoginPolicies", create: "createConcurrentLoginPolicy", db: "idpConcurrentLoginPolicies", map: "mapConcurrentLoginPolicySummary", build: "buildConcurrentLoginPolicyPayload", input: "CreateConcurrentLoginPolicyInput", summary: "ConcurrentLoginPolicySummary", audit: "concurrent_login_policy", maps: true, orgScoped: false, schema: "concurrentLoginPolicyFormSchema", form: "ConcurrentLoginPolicyFormValues", titleKey: "policyKey", subKeys: ["maxConcurrentSessions"], listTitle: (e) => e.policyKey, listSub: (e) => `${e.realmName} • max ${e.maxConcurrentSessions}`, fields: [{ name: "policyKey", placeholder: "Policy key" }, { name: "maxConcurrentSessions", placeholder: "Max concurrent sessions", number: true }] },
    { tab: "rbacRoles", label: "RBAC Roles", plural: "rbacRoles", singular: "RbacRole", state: "rbacRoles", get: "getRbacRoles", create: "createRbacRole", db: "idpRbacRoles", map: "mapRbacRoleSummary", build: "buildRbacRolePayload", input: "CreateRbacRoleInput", summary: "RbacRoleSummary", audit: "rbac_role", maps: true, orgScoped: false, schema: "rbacRoleFormSchema", form: "RbacRoleFormValues", titleKey: "roleName", subKeys: ["roleKey"], listTitle: (e) => e.roleName, listSub: (e) => `${e.realmName} • ${e.roleKey}`, fields: [{ name: "roleKey", placeholder: "Role key" }, { name: "roleName", placeholder: "Role name" }] },
    { tab: "permissionGroups", label: "Permission Groups", plural: "permissionGroups", singular: "PermissionGroup", state: "permissionGroups", get: "getPermissionGroups", create: "createPermissionGroup", db: "idpPermissionGroups", map: "mapPermissionGroupSummary", build: "buildPermissionGroupPayload", input: "CreatePermissionGroupInput", summary: "PermissionGroupSummary", audit: "permission_group", maps: true, orgScoped: false, schema: "permissionGroupFormSchema", form: "PermissionGroupFormValues", titleKey: "groupName", subKeys: ["groupKey"], listTitle: (e) => e.groupName, listSub: (e) => `${e.realmName} • ${e.groupKey}`, fields: [{ name: "groupKey", placeholder: "Group key" }, { name: "groupName", placeholder: "Group name" }] },
    { tab: "abacPolicies", label: "ABAC Policies", plural: "abacPolicies", singular: "AbacPolicy", state: "abacPolicies", get: "getAbacPolicies", create: "createAbacPolicy", db: "idpAbacPolicies", map: "mapAbacPolicySummary", build: "buildAbacPolicyPayload", input: "CreateAbacPolicyInput", summary: "AbacPolicySummary", audit: "abac_policy", maps: true, orgScoped: false, schema: "abacPolicyFormSchema", form: "AbacPolicyFormValues", titleKey: "name", subKeys: ["effect"], listTitle: (e) => e.name, listSub: (e) => `${e.realmName} • ${e.effect}`, fields: [{ name: "policyKey", placeholder: "Policy key" }, { name: "name", placeholder: "Name" }, { name: "effect", placeholder: "Effect" }] },
    { tab: "temporaryAccessGrants", label: "Temporary Access", plural: "temporaryAccessGrants", singular: "TemporaryAccessGrant", state: "temporaryAccessGrants", get: "getTemporaryAccessGrants", create: "createTemporaryAccessGrant", db: "idpTemporaryAccessGrants", map: "mapTemporaryAccessGrantSummary", build: "buildTemporaryAccessGrantPayload", input: "CreateTemporaryAccessGrantInput", summary: "TemporaryAccessGrantSummary", audit: "temporary_access_grant", maps: true, orgScoped: false, schema: "temporaryAccessGrantFormSchema", form: "TemporaryAccessGrantFormValues", titleKey: "grantKey", subKeys: ["expiresAt"], listTitle: (e) => e.grantKey, listSub: (e) => `${e.realmName} • expires ${e.expiresAt}`, fields: [{ name: "grantKey", placeholder: "Grant key" }, { name: "expiresAt", placeholder: "Expires at (ISO)" }] },
    { tab: "departments", label: "Departments", plural: "departments", singular: "Department", state: "departments", get: "getDepartments", create: "createDepartment", db: "idpDepartments", map: "mapDepartmentSummary", build: "buildDepartmentPayload", input: "CreateDepartmentInput", summary: "DepartmentSummary", audit: "department", maps: true, orgScoped: false, schema: "departmentFormSchema", form: "DepartmentFormValues", titleKey: "name", subKeys: ["departmentKey"], listTitle: (e) => e.name, listSub: (e) => `${e.realmName} • ${e.departmentKey}`, fields: [{ name: "departmentKey", placeholder: "Department key" }, { name: "name", placeholder: "Name" }] },
    { tab: "teams", label: "Teams", plural: "teams", singular: "Team", state: "teams", get: "getTeams", create: "createTeam", db: "idpTeams", map: "mapTeamSummary", build: "buildTeamPayload", input: "CreateTeamInput", summary: "TeamSummary", audit: "team", maps: true, orgScoped: false, schema: "teamFormSchema", form: "TeamFormValues", titleKey: "name", subKeys: ["teamKey"], listTitle: (e) => e.name, listSub: (e) => `${e.realmName} • ${e.teamKey}`, fields: [{ name: "teamKey", placeholder: "Team key" }, { name: "name", placeholder: "Name" }] },
    { tab: "businessUnits", label: "Business Units", plural: "businessUnits", singular: "BusinessUnit", state: "businessUnits", get: "getBusinessUnits", create: "createBusinessUnit", db: "idpBusinessUnits", map: "mapBusinessUnitSummary", build: "buildBusinessUnitPayload", input: "CreateBusinessUnitInput", summary: "BusinessUnitSummary", audit: "business_unit", maps: true, orgScoped: false, schema: "businessUnitFormSchema", form: "BusinessUnitFormValues", titleKey: "name", subKeys: ["code"], listTitle: (e) => e.name, listSub: (e) => `${e.realmName} • ${e.code}`, fields: [{ name: "unitKey", placeholder: "Unit key" }, { name: "name", placeholder: "Name" }, { name: "code", placeholder: "Code" }] },
    { tab: "reportingStructures", label: "Reporting", plural: "reportingStructures", singular: "ReportingStructure", state: "reportingStructures", get: "getReportingStructures", create: "createReportingStructure", db: "idpReportingStructures", map: "mapReportingStructureSummary", build: "buildReportingStructurePayload", input: "CreateReportingStructureInput", summary: "ReportingStructureSummary", audit: "reporting_structure", maps: true, orgScoped: false, schema: "reportingStructureFormSchema", form: "ReportingStructureFormValues", titleKey: "structureKey", subKeys: ["effectiveFrom"], listTitle: (e) => e.structureKey, listSub: (e) => `${e.realmName} • ${e.effectiveFrom}`, fields: [{ name: "structureKey", placeholder: "Structure key" }] },
    { tab: "invitations", label: "Invitations", plural: "invitations", singular: "Invitation", state: "invitations", get: "getInvitations", create: "createInvitation", db: "idpInvitations", map: "mapInvitationSummary", build: "buildInvitationPayload", input: "CreateInvitationInput", summary: "InvitationSummary", audit: "invitation", maps: true, orgScoped: false, schema: "invitationFormSchema", form: "InvitationFormValues", titleKey: "email", subKeys: ["roleName"], listTitle: (e) => e.email, listSub: (e) => `${e.realmName} • ${e.roleName}`, fields: [{ name: "invitationKey", placeholder: "Invitation key" }, { name: "email", placeholder: "Email" }, { name: "roleName", placeholder: "Role name" }] },
    { tab: "bulkInviteBatches", label: "Bulk Invites", plural: "bulkInviteBatches", singular: "BulkInviteBatch", state: "bulkInviteBatches", get: "getBulkInviteBatches", create: "createBulkInviteBatch", db: "idpBulkInviteBatches", map: "mapBulkInviteBatchSummary", build: "buildBulkInviteBatchPayload", input: "CreateBulkInviteBatchInput", summary: "BulkInviteBatchSummary", audit: "bulk_invite_batch", maps: true, orgScoped: false, schema: "bulkInviteBatchFormSchema", form: "BulkInviteBatchFormValues", titleKey: "name", subKeys: ["batchKey"], listTitle: (e) => e.name, listSub: (e) => `${e.realmName} • ${e.totalCount} total`, fields: [{ name: "batchKey", placeholder: "Batch key" }, { name: "name", placeholder: "Name" }, { name: "totalCount", placeholder: "Total count", number: true }] },
    { tab: "invitationRoles", label: "Invitation Roles", plural: "invitationRoles", singular: "InvitationRole", state: "invitationRoles", get: "getInvitationRoles", create: "createInvitationRole", db: "idpInvitationRoles", map: "mapInvitationRoleSummary", build: "buildInvitationRolePayload", input: "CreateInvitationRoleInput", summary: "InvitationRoleSummary", audit: "invitation_role", maps: true, orgScoped: false, schema: "invitationRoleFormSchema", form: "InvitationRoleFormValues", titleKey: "roleAssignmentKey", subKeys: ["status"], listTitle: (e) => e.roleAssignmentKey, listSub: (e) => `${e.realmName} • ${e.status}`, fields: [{ name: "roleAssignmentKey", placeholder: "Role assignment key" }] },
    { tab: "invitationAudit", label: "Invitation Audit", plural: "invitationAudit", singular: "InvitationAudit", state: "invitationAudit", get: "getInvitationAudit", create: "createInvitationAudit", db: "idpInvitationAudit", map: "mapInvitationAuditSummary", build: "buildInvitationAuditPayload", input: "CreateInvitationAuditInput", summary: "InvitationAuditSummary", audit: "invitation_audit", maps: true, orgScoped: false, schema: "invitationAuditFormSchema", form: "InvitationAuditFormValues", titleKey: "auditKey", subKeys: ["action"], listTitle: (e) => e.auditKey, listSub: (e) => `${e.realmName} • ${e.action}`, fields: [{ name: "auditKey", placeholder: "Audit key" }, { name: "action", placeholder: "Action" }] },
    { tab: "loginHistory", label: "Login History", plural: "loginHistory", singular: "LoginHistory", state: "loginHistory", get: "getLoginHistory", create: "createLoginHistory", db: "idpLoginHistory", map: "mapLoginHistorySummary", build: "buildLoginHistoryPayload", input: "CreateLoginHistoryInput", summary: "LoginHistorySummary", audit: "login_history", maps: true, orgScoped: false, schema: "loginHistoryFormSchema", form: "LoginHistoryFormValues", titleKey: "loginKey", subKeys: ["loginMethod"], listTitle: (e) => e.loginKey, listSub: (e) => `${e.realmName} • ${e.loginMethod}`, fields: [{ name: "loginKey", placeholder: "Login key" }, { name: "loginMethod", placeholder: "Login method" }] },
    { tab: "securityAlerts", label: "Security Alerts", plural: "securityAlerts", singular: "SecurityAlert", state: "securityAlerts", get: "getSecurityAlerts", create: "createSecurityAlert", db: "idpSecurityAlerts", map: "mapSecurityAlertSummary", build: "buildSecurityAlertPayload", input: "CreateSecurityAlertInput", summary: "SecurityAlertSummary", audit: "security_alert", maps: true, orgScoped: false, schema: "securityAlertFormSchema", form: "SecurityAlertFormValues", titleKey: "title", subKeys: ["severity"], listTitle: (e) => e.title, listSub: (e) => `${e.realmName} • ${e.severity}`, fields: [{ name: "alertKey", placeholder: "Alert key" }, { name: "alertType", placeholder: "Alert type" }, { name: "severity", placeholder: "Severity", select: "SEVERITY_OPTIONS" }, { name: "title", placeholder: "Title" }] },
    { tab: "riskEvents", label: "Risk Events", plural: "riskEvents", singular: "RiskEvent", state: "riskEvents", get: "getRiskEvents", create: "createRiskEvent", db: "idpRiskEvents", map: "mapRiskEventSummary", build: "buildRiskEventPayload", input: "CreateRiskEventInput", summary: "RiskEventSummary", audit: "risk_event", maps: true, orgScoped: false, schema: "riskEventFormSchema", form: "RiskEventFormValues", titleKey: "eventKey", subKeys: ["riskScore"], listTitle: (e) => e.eventKey, listSub: (e) => `${e.realmName} • score ${e.riskScore}`, fields: [{ name: "eventKey", placeholder: "Event key" }, { name: "riskScore", placeholder: "Risk score", number: true }] },
    { tab: "passwordPolicies", label: "Password Policies", plural: "passwordPolicies", singular: "PasswordPolicy", state: "passwordPolicies", get: "getPasswordPolicies", create: "createPasswordPolicy", db: "idpPasswordPolicies", map: "mapPasswordPolicySummary", build: "buildPasswordPolicyPayload", input: "CreatePasswordPolicyInput", summary: "PasswordPolicySummary", audit: "password_policy", maps: true, orgScoped: false, schema: "passwordPolicyFormSchema", form: "PasswordPolicyFormValues", titleKey: "name", subKeys: ["minLength"], listTitle: (e) => e.name, listSub: (e) => `${e.realmName} • min ${e.minLength}`, fields: [{ name: "policyKey", placeholder: "Policy key" }, { name: "name", placeholder: "Name" }, { name: "minLength", placeholder: "Min length", number: true }] },
    { tab: "adminMetrics", label: "Admin Metrics", plural: "adminMetrics", singular: "AdminMetric", state: "adminMetrics", get: "getAdminMetrics", create: "createAdminMetric", db: "idpAdminMetrics", map: "mapAdminMetricSummary", build: "buildAdminMetricPayload", input: "CreateAdminMetricInput", summary: "AdminMetricSummary", audit: "admin_metric", maps: false, orgScoped: true, schema: "adminMetricFormSchema", form: "AdminMetricFormValues", titleKey: "metricsKey", subKeys: ["metricDate"], listTitle: (e) => e.metricsKey, listSub: (e) => `${e.metricDate} • ${e.totalUsers} users`, fields: [{ name: "metricsKey", placeholder: "Metrics key" }, { name: "totalUsers", placeholder: "Total users", number: true }, { name: "mfaAdoptionPercent", placeholder: "MFA adoption %", number: true }] },
    { tab: "identityHealth", label: "Identity Health", plural: "identityHealth", singular: "IdentityHealth", state: "identityHealth", get: "getIdentityHealth", create: "createIdentityHealth", db: "idpIdentityHealth", map: "mapIdentityHealthSummary", build: "buildIdentityHealthPayload", input: "CreateIdentityHealthInput", summary: "IdentityHealthSummary", audit: "identity_health", maps: false, orgScoped: true, schema: "identityHealthFormSchema", form: "IdentityHealthFormValues", titleKey: "healthKey", subKeys: ["overallScore"], listTitle: (e) => e.healthKey, listSub: (e) => `Score ${e.overallScore} • ${e.status}`, fields: [{ name: "healthKey", placeholder: "Health key" }, { name: "overallScore", placeholder: "Overall score", number: true }] },
    { tab: "compromisedAccounts", label: "Compromised Accounts", plural: "compromisedAccounts", singular: "CompromisedAccount", state: "compromisedAccounts", get: "getCompromisedAccounts", create: "createCompromisedAccount", db: "idpCompromisedAccounts", map: "mapCompromisedAccountSummary", build: "buildCompromisedAccountPayload", input: "CreateCompromisedAccountInput", summary: "CompromisedAccountSummary", audit: "compromised_account", maps: true, orgScoped: false, schema: "compromisedAccountFormSchema", form: "CompromisedAccountFormValues", titleKey: "accountKey", subKeys: ["remediationStatus"], listTitle: (e) => e.accountKey, listSub: (e) => `${e.realmName} • ${e.remediationStatus}`, fields: [{ name: "accountKey", placeholder: "Account key" }] },
];

const mapperImports = [...new Set(entities.flatMap((e) => [e.map, e.build]))].sort();
mapperImports.push("buildIdpAuditPayload", "buildIdpDashboardStats", "buildIdpPipelineInfo", "buildRealmLookupMaps", "mapAuditEntry");

const typeImports = [...new Set(entities.flatMap((e) => [e.input, e.summary]))].sort();
typeImports.push("AuditEntry", "IdpDashboardStats", "IdpPipelineInfo", "IdpSdkEnrollMfaInput", "IdpSdkEnrollMfaResult", "IdpSdkInviteUserInput", "IdpSdkInviteUserResult", "IdpSdkProvisionRealmInput", "IdpSdkProvisionRealmResult");

function genService() {
    const entityMethods = entities.map((e) => {
        const mapCall = e.maps ? `(r) => ${e.map}(r, maps)` : "mapRealmSummary";
        const getBody = e.maps
            ? `const maps = await this.getMaps(context.organizationId);
        return (await databaseService.${e.db}.listByOrganization(context.organizationId)).map(${mapCall});`
            : `return (await databaseService.${e.db}.listByOrganization(context.organizationId)).map(${e.map});`;
        const createMaps = e.maps ? `\n        const maps = await this.getMaps(context.organizationId);\n        return ${e.map}(created, maps);` : `\n        return ${e.map}(created);`;
        return `
    async ${e.get}(authUserId: string, email: string, fullName?: string | null): Promise<${e.summary}[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        ${getBody}
    }

    async ${e.create}(authUserId: string, email: string, input: ${e.input}, fullName?: string | null): Promise<${e.summary}> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) throw new Error("Unable to resolve organization context");
        const created = await databaseService.${e.db}.create(${e.build}(context.organizationId, input));
        if (!created) throw new Error("Failed to create ${e.plural}");
        await databaseService.idpAuditLogs.create(buildIdpAuditPayload(context.organizationId, "${e.audit}", "create", \`${e.singular} created\`, created.id));${createMaps}
    }`;
    }).join("\n");

    return `import {
    ${mapperImports.join(",\n    ")},
} from "@/src/modules/database/lib/enterprise-identity-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import type {
    ${typeImports.join(",\n    ")},
} from "@/src/modules/enterprise-identity/types";

export class EnterpriseIdentityService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    private async getMaps(organizationId: string) {
        const realms = await databaseService.idpRealms.listByOrganization(organizationId);
        return buildRealmLookupMaps(realms);
    }

    async getDashboardStats(authUserId: string, email: string, fullName?: string | null): Promise<IdpDashboardStats> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return buildIdpDashboardStats({ realms: [], providers: [], mfaEnrollments: [], activeSessions: [], invitations: [], securityAlerts: [], compromisedAccounts: [], adminMetrics: [], auditLogs: [] });
        const [realms, providers, mfaEnrollments, activeSessions, invitations, securityAlerts, compromisedAccounts, adminMetrics, auditLogs] = await Promise.all([
            this.getRealms(authUserId, email, fullName),
            this.getProviders(authUserId, email, fullName),
            this.getMfaEnrollments(authUserId, email, fullName),
            this.getActiveSessions(authUserId, email, fullName),
            this.getInvitations(authUserId, email, fullName),
            this.getSecurityAlerts(authUserId, email, fullName),
            this.getCompromisedAccounts(authUserId, email, fullName),
            this.getAdminMetrics(authUserId, email, fullName),
            this.getAuditLogs(authUserId, email, fullName),
        ]);
        return buildIdpDashboardStats({ realms, providers, mfaEnrollments, activeSessions, invitations, securityAlerts, compromisedAccounts, adminMetrics, auditLogs });
    }

    getPipelineInfo(): IdpPipelineInfo {
        return buildIdpPipelineInfo();
    }
${entityMethods}

    async getAuditLogs(authUserId: string, email: string, fullName?: string | null): Promise<AuditEntry[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.idpAuditLogs.listByOrganization(context.organizationId)).map(mapAuditEntry);
    }

    async getRealmOptions(authUserId: string, email: string, fullName?: string | null) {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) return [];
        return (await databaseService.idpRealms.listByOrganization(context.organizationId)).map((r) => ({ id: r.id, name: r.realm_name }));
    }

    async sdkProvisionRealm(authUserId: string, email: string, input: IdpSdkProvisionRealmInput, fullName?: string | null): Promise<IdpSdkProvisionRealmResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.realmName, limit: 5 });
        const task = await ai.executeTask({ taskType: "provision_realm", moduleSource: "enterprise_identity", inputPayload: { realmKey: input.realmKey, realmName: input.realmName } });
        const realm = await this.createRealm(authUserId, email, { realmKey: input.realmKey, realmName: input.realmName, summary: input.summary }, fullName);
        const provider = await this.createProvider(authUserId, email, { realmId: realm.id, providerKey: \`\${input.realmKey}-local\`, providerType: input.providerType ?? "local", displayName: \`\${input.realmName} Local\` }, fullName);
        return { realmId: realm.id, realmKey: realm.realmKey, providerId: provider.id, aiTaskId: task?.taskId ?? null };
    }

    async sdkEnrollMfa(authUserId: string, email: string, input: IdpSdkEnrollMfaInput, fullName?: string | null): Promise<IdpSdkEnrollMfaResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.mfaType, limit: 3 });
        await ai.executeTask({ taskType: "enroll_mfa", moduleSource: "enterprise_identity", inputPayload: { realmId: input.realmId, mfaType: input.mfaType } });
        const created = await this.createMfaEnrollment(authUserId, email, { realmId: input.realmId, enrollmentKey: input.enrollmentKey, mfaType: input.mfaType }, fullName);
        return { enrollmentId: created.id, enrollmentKey: created.enrollmentKey, mfaType: created.mfaType, status: created.status };
    }

    async sdkInviteUser(authUserId: string, email: string, input: IdpSdkInviteUserInput, fullName?: string | null): Promise<IdpSdkInviteUserResult> {
        const ai = createAiOrchestrationClient(authUserId, email, fullName);
        const knowledge = createKnowledgeClient(authUserId, email, fullName);
        await knowledge.search({ query: input.email, limit: 3 });
        await ai.executeTask({ taskType: "invite_user", moduleSource: "enterprise_identity", inputPayload: { realmId: input.realmId, email: input.email, roleName: input.roleName } });
        const created = await this.createInvitation(authUserId, email, { realmId: input.realmId, invitationKey: input.invitationKey, email: input.email, roleName: input.roleName }, fullName);
        return { invitationId: created.id, invitationKey: created.invitationKey, email: created.email, status: created.status };
    }
}

export const enterpriseIdentityService = new EnterpriseIdentityService();
`;
}

function genSchemas() {
    const schemas = entities.map((e) => {
        const fieldLine = (f) => {
            if (f.optional || f.textarea) return `    ${f.name}: z.string().optional(),`;
            if (f.number) return `    ${f.name}: z.number().optional(),`;
            if (f.name === "email") return `    ${f.name}: z.string().min(2),`;
            if (f.name.includes("Key") || f.name === "realmName") return `    ${f.name}: z.string().min(2),`;
            return `    ${f.name}: z.string().min(2).optional(),`;
        };
        const fields = e.orgScoped
            ? e.fields.map(fieldLine).join("\n")
            : [`    realmId: z.string().min(1),`, ...e.fields.map(fieldLine)].join("\n");
        return `export const ${e.schema} = z.object({\n${fields}\n});`;
    });
    const types = entities.map((e) => `export type ${e.form} = z.infer<typeof ${e.schema}>;`).join("\n");
    return `import { z } from "zod";\n\n${schemas.join("\n\n")}\n\n${types}\n`;
}

function genConstants() {
    const tabs = ["overview", ...entities.map((e) => e.tab), "audit", "api"];
    const tabObj = tabs.map((t) => `    ${t}: "${t}",`).join("\n");
    return `export const IDP_TABS = {\n${tabObj}\n} as const;

export const PROVIDER_TYPE_OPTIONS = [
    { value: "local", label: "Local" },
    { value: "saml", label: "SAML" },
    { value: "oidc", label: "OIDC" },
    { value: "ldap", label: "LDAP" },
    { value: "social", label: "Social" },
] as const;

export const MFA_TYPE_OPTIONS = [
    { value: "authenticator", label: "Authenticator App" },
    { value: "sms", label: "SMS" },
    { value: "email", label: "Email" },
    { value: "hardware_key", label: "Hardware Key" },
    { value: "push", label: "Push Notification" },
] as const;

export const SEVERITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
] as const;

export const IDP_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "inactive", label: "Inactive" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
] as const;

export const IDP_PERMISSIONS = ["idp.view", "idp.manage", "idp.approve", "idp.admin"] as const;

export const IDP_THEME = {
    primary: "violet-600",
    primaryHover: "violet-500",
    ring: "violet-500/20",
    text: "text-violet-600",
    textDark: "dark:text-violet-400",
    bg: "bg-violet-600",
    bgHover: "hover:bg-violet-500",
} as const;
`;
}

function genHook() {
    const states = entities.map((e) => `    const [${e.state}, set${e.singular}s] = useState<${e.summary}[]>([]);`).join("\n");
    const setters = entities.map((e) => `        set${e.singular}s(result.${e.state}List),`).join("\n");
    const fetchItems = entities.map((e) => `            ${e.state}List,`).join("\n");
    const fetchCalls = entities.map((e) => `            enterpriseIdentityService.${e.get}(authUserId, email, fullName),`).join("\n");
    const returnStates = entities.map((e) => `        ${e.state},`).join("\n");
    const creates = entities.map((e) => `    const ${e.create} = useCallback(async (input: ${e.input}) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.${e.create}(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);`).join("\n");
    const returnCreates = entities.map((e) => `        ${e.create},`).join("\n");
    const typeImports = [...new Set(entities.flatMap((e) => [e.input, e.summary]))].sort();
    typeImports.unshift("AuditEntry", "IdpDashboardStats", "IdpPipelineInfo");

    return `"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { enterpriseIdentityService } from "@/src/modules/enterprise-identity/services/enterprise-identity.service";
import type {
    ${typeImports.join(",\n    ")},
} from "@/src/modules/enterprise-identity/types";

export function useEnterpriseIdentity() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<IdpDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<IdpPipelineInfo | null>(null);
${states}
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [realmOptions, setRealmOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
${fetchItems}
            auditList,
            realmOpts,
        ] = await Promise.all([
            enterpriseIdentityService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(enterpriseIdentityService.getPipelineInfo()),
${fetchCalls}
            enterpriseIdentityService.getAuditLogs(authUserId, email, fullName),
            enterpriseIdentityService.getRealmOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
${entities.map((e) => `            ${e.state}List,`).join("\n")}
            auditList,
            realmOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
${setters}
        setAuditLogs(result.auditList);
        setRealmOptions(result.realmOpts);
        setLoading(false);
    }, []);

    const refresh = useCallback(async () => { applyData(await fetchData()); }, [fetchData, applyData]);

    useEffect(() => {
        let cancelled = false;
        void fetchData().then((data) => { if (!cancelled) applyData(data); }).catch(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [fetchData, applyData]);

${creates}

    return {
        loading,
        stats,
        pipeline,
${returnStates}
        auditLogs,
        realmOptions,
        refresh,
${returnCreates}
    };
}
`;
}

function genPanels() {
    const schemaImports = entities.map((e) => e.schema).join(",\n    ");
    const formImports = entities.map((e) => `type ${e.form}`).join(",\n    ");
    const panels = entities.map((e) => {
        const listSub = typeof e.listSub === "string"
            ? e.listSub
            : typeof e.listSub === "function"
              ? (e.listSub.toString().match(/`= \`(.+)\`/)?.[1]?.replace(/e\./g, "item.") ?? `\${item.${e.titleKey}} • \${item.status}`)
              : `\${item.${e.titleKey}} • \${item.status}`;
        const defaults = e.orgScoped
            ? e.fields.map((f) => `${f.name}: ${f.number ? "0" : '""'}`).join(", ")
            : [`realmId: ""`, ...e.fields.map((f) => `${f.name}: ${f.number ? "0" : '""'}`)].join(", ");
        const formFields = e.orgScoped
            ? e.fields.map((f) => genField(f)).join("\n                ")
            : `<RealmSelect data={data} {...form.register("realmId")} />\n                ${e.fields.map((f) => genField(f)).join("\n                ")}`;
        const createLabel = e.tab === "realms" ? "Register the first identity realm." : `Create ${e.label.toLowerCase()} for a realm.`;
        const createTitle = e.tab === "realms" ? "Create realm" : `Create ${e.label.toLowerCase().replace(/s$/, "")}`;
        const createDesc = e.orgScoped ? `Add a new ${e.label.toLowerCase()} record` : "Add a new record for the selected realm";
        return `
export function ${e.singular}sPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<${e.form}>({ resolver: zodResolver(${e.schema}), defaultValues: { ${defaults} } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="${e.label}" description="Enterprise identity ${e.label.toLowerCase()}" /><div className="mt-6 space-y-3">
                {data.${e.state}.length === 0 ? <EmptyState title="No ${e.label.toLowerCase()}" description="${createLabel}" /> : data.${e.state}.map((item) => (
                    <ListCard key={item.id} title={String(item.${e.titleKey})} subtitle={\`${listSub}\`} meta={\`\${item.status}\`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="${createTitle}" description="${createDesc}" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.${e.create}(v))}>
                ${formFields}
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}`;
    }).join("\n");

    function genField(f) {
        if (f.textarea) return `<textarea {...form.register("${f.name}")} placeholder="${f.placeholder}" rows={3} className={inputClass} />`;
        if (f.select) return `<select {...form.register("${f.name}")} className={inputClass}>{${f.select}.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>`;
        if (f.number) return `<input type="number" step="any" {...form.register("${f.name}", { valueAsNumber: true })} placeholder="${f.placeholder}" className={inputClass} />`;
        return `<input {...form.register("${f.name}")} placeholder="${f.placeholder}" className={inputClass} />`;
    }

    return `"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { IDP_THEME, MFA_TYPE_OPTIONS, PROVIDER_TYPE_OPTIONS, SEVERITY_OPTIONS } from "@/src/modules/enterprise-identity/constants";
import type { useEnterpriseIdentity } from "@/src/modules/enterprise-identity/hooks/useEnterpriseIdentity";
import {
    ${schemaImports},
    ${formImports},
} from "@/src/modules/enterprise-identity/schemas";

type EnterpriseIdentityData = ReturnType<typeof useEnterpriseIdentity>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-violet-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-violet-600">{meta}</p> : null}</div>;
}
function RealmSelect({ data, ...props }: { data: EnterpriseIdentityData } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={inputClass}><option value="">Select realm</option>{data.realmOptions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select>;
}

export function EnterpriseIdentityOverviewPanel({ data }: { data: EnterpriseIdentityData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="Enterprise Identity summary" description="Realms, providers, MFA, sessions, access control, and security metrics" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Realms" subtitle={\`\${data.stats?.totalRealms ?? 0} total\`} meta={\`\${data.stats?.activeRealms ?? 0} active • \${data.stats?.providerCount ?? 0} providers\`} />
                <ListCard title="MFA & Sessions" subtitle={\`\${data.stats?.mfaEnrollmentCount ?? 0} enrollments\`} meta={\`\${(data.stats?.mfaAdoptionPercent ?? 0).toFixed(0)}% adoption • \${data.stats?.activeSessionCount ?? 0} sessions\`} />
                <ListCard title="Security" subtitle={\`\${data.stats?.openSecurityAlertCount ?? 0} open alerts\`} meta={\`\${data.stats?.compromisedAccountCount ?? 0} compromised • \${data.stats?.failedLogins24h ?? 0} failed logins/24h\`} />
                <ListCard title="Invitations & Audit" subtitle={\`\${data.stats?.pendingInvitationCount ?? 0} pending invites\`} meta={\`\${data.stats?.auditCount ?? 0} audit entries\`} />
            </div></Card>
            <Card hover><SectionHeader title="Identity pipeline" description={\`\${pipeline?.previousStage ?? "realm_setup"} → \${pipeline?.currentStage ?? "provider_config"} → \${pipeline?.nextStage ?? "mfa_policy"}\`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Identity pipeline stages will appear as realms progress through setup." />}
            </div></Card>
        </div>
    );
}
${panels}

export function IdpAuditPanel({ data }: { data: EnterpriseIdentityData }) {
    return (
        <Card hover><SectionHeader title="Enterprise Identity audit history" description="Security-first audit trail with security_level classification for all identity operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for realm, provider, MFA, and access control operations." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={\`\${entry.entityType} • \${entry.action}\`} meta={\`\${entry.securityLevel} • \${new Date(entry.createdAt).toLocaleString()}\`} />
            ))}
        </div></Card>
    );
}

export function EnterpriseIdentitySdkPanel({ data }: { data: EnterpriseIdentityData }) {
    return (
        <Card hover><SectionHeader title="Shared Enterprise Identity SDK" description="Import from @/src/modules/enterprise-identity/sdk for realm provisioning, MFA enrollment, and user invitations" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createEnterpriseIdentityClient()" subtitle="Factory for module-scoped Enterprise Identity client with auth context" meta="Primary SDK for identity platform operations" />
            <ListCard title="sdkProvisionRealm()" subtitle="Provision realm with provider and AI orchestration context" meta="moduleSource: enterprise_identity" />
            <ListCard title="sdkEnrollMfa()" subtitle="Enroll MFA with audit trail and knowledge context" meta="Authenticator, SMS, email, hardware key, push" />
            <ListCard title="sdkInviteUser()" subtitle="Invite users with role assignment and audit trail" meta="Supports bulk invitation workflows" />
            <p className="text-xs text-slate-500">Theme: {IDP_THEME.primary} • Realms loaded: {data.realms.length}</p>
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{\`import { createEnterpriseIdentityClient } from "@/src/modules/enterprise-identity/sdk";

const idp = createEnterpriseIdentityClient(userId, email, fullName);
await idp.provisionRealm({ realmKey: "acme", realmName: "Acme Corp" });
await idp.enrollMfa({ realmId, enrollmentKey: "mfa-001", mfaType: "authenticator" });
await idp.inviteUser({ realmId, invitationKey: "inv-001", email: "user@acme.com", roleName: "member" });\`}</pre>
        </div></Card>
    );
}
`;
}

function genPage() {
    const tabEntries = [
        `{ id: IDP_TABS.overview, label: "Overview" },`,
        ...entities.map((e) => `{ id: IDP_TABS.${e.tab}, label: "${e.label}" },`),
        `{ id: IDP_TABS.audit, label: "Audit" },`,
        `{ id: IDP_TABS.api, label: "SDK" },`,
    ];
    const panelImports = [
        "EnterpriseIdentityOverviewPanel",
        ...entities.map((e) => `${e.singular}sPanel`),
        "IdpAuditPanel",
        "EnterpriseIdentitySdkPanel",
    ];
    const conditionals = [
        `{activeTab === IDP_TABS.overview ? <EnterpriseIdentityOverviewPanel data={enterpriseIdentity} /> : null}`,
        ...entities.map((e) => `{activeTab === IDP_TABS.${e.tab} ? <${e.singular}sPanel data={enterpriseIdentity} /> : null}`),
        `{activeTab === IDP_TABS.audit ? <IdpAuditPanel data={enterpriseIdentity} /> : null}`,
        `{activeTab === IDP_TABS.api ? <EnterpriseIdentitySdkPanel data={enterpriseIdentity} /> : null}`,
    ];
    return `"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    ${panelImports.join(",\n    ")},
} from "@/src/modules/enterprise-identity/components/EnterpriseIdentityPanels";
import { EnterpriseIdentityStats } from "@/src/modules/enterprise-identity/components/EnterpriseIdentityStats";
import { IDP_TABS } from "@/src/modules/enterprise-identity/constants";
import { useEnterpriseIdentity } from "@/src/modules/enterprise-identity/hooks/useEnterpriseIdentity";

const tabs = [
    ${tabEntries.join("\n    ")}
] as const;

export function EnterpriseIdentityPage() {
    const enterpriseIdentity = useEnterpriseIdentity();
    const [activeTab, setActiveTab] = useState<(typeof IDP_TABS)[keyof typeof IDP_TABS]>(IDP_TABS.overview);

    if (enterpriseIdentity.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading Enterprise Identity" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-600">V2 Program A Sprint 2</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Enterprise Identity Platform</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    Enterprise identity platform: identity providers, MFA, session management, access control, org directory, invitations, security center, admin dashboard, security-first audit, and the shared Enterprise Identity SDK. Pipeline: Realm Setup → Provider Configuration → MFA Policy → RBAC Setup → User Invitation → Active Identity.
                </p>
            </motion.header>
            <EnterpriseIdentityStats stats={enterpriseIdentity.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={\`rounded-full px-4 py-2 text-sm font-medium transition \${activeTab === tab.id ? "bg-violet-600 text-white" : "border border-slate-200 text-slate-600 hover:border-violet-300 dark:border-slate-800 dark:text-slate-300"}\`}>{tab.label}</button>
                ))}
            </div>
            ${conditionals.join("\n            ")}
        </div>
    );
}
`;
}

fs.mkdirSync(path.join(root, "constants"), { recursive: true });
fs.mkdirSync(path.join(root, "schemas"), { recursive: true });
fs.mkdirSync(path.join(root, "services"), { recursive: true });
fs.mkdirSync(path.join(root, "hooks"), { recursive: true });
fs.mkdirSync(path.join(root, "components"), { recursive: true });
fs.mkdirSync(path.join(root, "sdk"), { recursive: true });

fs.writeFileSync(path.join(root, "constants/index.ts"), genConstants());
fs.writeFileSync(path.join(root, "schemas/index.ts"), genSchemas());
fs.writeFileSync(path.join(root, "services/enterprise-identity.service.ts"), genService());
fs.writeFileSync(path.join(root, "hooks/useEnterpriseIdentity.ts"), genHook());
fs.writeFileSync(path.join(root, "components/EnterpriseIdentityPanels.tsx"), genPanels());
fs.writeFileSync(path.join(root, "components/EnterpriseIdentityPage.tsx"), genPage());

console.log("Generated enterprise-identity UI module");
console.log("Entity tabs:", entities.length);
console.log("Total tabs:", entities.length + 3);
