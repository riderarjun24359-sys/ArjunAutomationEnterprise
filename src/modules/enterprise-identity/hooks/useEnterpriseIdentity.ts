"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/src/store/auth.store";
import { enterpriseIdentityService } from "@/src/modules/enterprise-identity/services/enterprise-identity.service";
import type {
    AuditEntry,
    IdpDashboardStats,
    IdpPipelineInfo,
    AbacPolicySummary,
    ActiveSessionSummary,
    AdminMetricSummary,
    BackupCodeSummary,
    BulkInviteBatchSummary,
    BusinessUnitSummary,
    CompromisedAccountSummary,
    ConcurrentLoginPolicySummary,
    CreateAbacPolicyInput,
    CreateActiveSessionInput,
    CreateAdminMetricInput,
    CreateBackupCodeInput,
    CreateBulkInviteBatchInput,
    CreateBusinessUnitInput,
    CreateCompromisedAccountInput,
    CreateConcurrentLoginPolicyInput,
    CreateDepartmentInput,
    CreateDeviceRegistryInput,
    CreateIdentityHealthInput,
    CreateInvitationAuditInput,
    CreateInvitationInput,
    CreateInvitationRoleInput,
    CreateLoginHistoryInput,
    CreateMfaEnrollmentInput,
    CreateMfaPolicyInput,
    CreateOidcConfigInput,
    CreatePasswordPolicyInput,
    CreatePermissionGroupInput,
    CreateProviderInput,
    CreateRbacRoleInput,
    CreateRealmInput,
    CreateReportingStructureInput,
    CreateRiskEventInput,
    CreateSamlConfigInput,
    CreateSecurityAlertInput,
    CreateSessionPolicyInput,
    CreateTeamInput,
    CreateTemporaryAccessGrantInput,
    CreateTrustedDeviceInput,
    DepartmentSummary,
    DeviceRegistrySummary,
    IdentityHealthSummary,
    InvitationAuditSummary,
    InvitationRoleSummary,
    InvitationSummary,
    LoginHistorySummary,
    MfaEnrollmentSummary,
    MfaPolicySummary,
    OidcConfigSummary,
    PasswordPolicySummary,
    PermissionGroupSummary,
    ProviderSummary,
    RbacRoleSummary,
    RealmSummary,
    ReportingStructureSummary,
    RiskEventSummary,
    SamlConfigSummary,
    SecurityAlertSummary,
    SessionPolicySummary,
    TeamSummary,
    TemporaryAccessGrantSummary,
    TrustedDeviceSummary,
} from "@/src/modules/enterprise-identity/types";

export function useEnterpriseIdentity() {
    const user = useAuthStore((state) => state.user);
    const authUserId = user?.id;
    const email = user?.email ?? "";
    const fullName = user?.fullName;
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<IdpDashboardStats | null>(null);
    const [pipeline, setPipeline] = useState<IdpPipelineInfo | null>(null);
    const [realms, setRealms] = useState<RealmSummary[]>([]);
    const [providers, setProviders] = useState<ProviderSummary[]>([]);
    const [samlConfigs, setSamlConfigs] = useState<SamlConfigSummary[]>([]);
    const [oidcConfigs, setOidcConfigs] = useState<OidcConfigSummary[]>([]);
    const [mfaPolicies, setMfaPolicys] = useState<MfaPolicySummary[]>([]);
    const [mfaEnrollments, setMfaEnrollments] = useState<MfaEnrollmentSummary[]>([]);
    const [backupCodes, setBackupCodes] = useState<BackupCodeSummary[]>([]);
    const [trustedDevices, setTrustedDevices] = useState<TrustedDeviceSummary[]>([]);
    const [sessionPolicies, setSessionPolicys] = useState<SessionPolicySummary[]>([]);
    const [activeSessions, setActiveSessions] = useState<ActiveSessionSummary[]>([]);
    const [deviceRegistry, setDeviceRegistrys] = useState<DeviceRegistrySummary[]>([]);
    const [concurrentLoginPolicies, setConcurrentLoginPolicys] = useState<ConcurrentLoginPolicySummary[]>([]);
    const [rbacRoles, setRbacRoles] = useState<RbacRoleSummary[]>([]);
    const [permissionGroups, setPermissionGroups] = useState<PermissionGroupSummary[]>([]);
    const [abacPolicies, setAbacPolicys] = useState<AbacPolicySummary[]>([]);
    const [temporaryAccessGrants, setTemporaryAccessGrants] = useState<TemporaryAccessGrantSummary[]>([]);
    const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
    const [teams, setTeams] = useState<TeamSummary[]>([]);
    const [businessUnits, setBusinessUnits] = useState<BusinessUnitSummary[]>([]);
    const [reportingStructures, setReportingStructures] = useState<ReportingStructureSummary[]>([]);
    const [invitations, setInvitations] = useState<InvitationSummary[]>([]);
    const [bulkInviteBatches, setBulkInviteBatchs] = useState<BulkInviteBatchSummary[]>([]);
    const [invitationRoles, setInvitationRoles] = useState<InvitationRoleSummary[]>([]);
    const [invitationAudit, setInvitationAudits] = useState<InvitationAuditSummary[]>([]);
    const [loginHistory, setLoginHistorys] = useState<LoginHistorySummary[]>([]);
    const [securityAlerts, setSecurityAlerts] = useState<SecurityAlertSummary[]>([]);
    const [riskEvents, setRiskEvents] = useState<RiskEventSummary[]>([]);
    const [passwordPolicies, setPasswordPolicys] = useState<PasswordPolicySummary[]>([]);
    const [adminMetrics, setAdminMetrics] = useState<AdminMetricSummary[]>([]);
    const [identityHealth, setIdentityHealths] = useState<IdentityHealthSummary[]>([]);
    const [compromisedAccounts, setCompromisedAccounts] = useState<CompromisedAccountSummary[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
    const [realmOptions, setRealmOptions] = useState<Array<{ id: string; name: string }>>([]);

    const fetchData = useCallback(async () => {
        if (!authUserId || !email) return { empty: true as const };
        const [
            statsData,
            pipelineInfo,
            realmsList,
            providersList,
            samlConfigsList,
            oidcConfigsList,
            mfaPoliciesList,
            mfaEnrollmentsList,
            backupCodesList,
            trustedDevicesList,
            sessionPoliciesList,
            activeSessionsList,
            deviceRegistryList,
            concurrentLoginPoliciesList,
            rbacRolesList,
            permissionGroupsList,
            abacPoliciesList,
            temporaryAccessGrantsList,
            departmentsList,
            teamsList,
            businessUnitsList,
            reportingStructuresList,
            invitationsList,
            bulkInviteBatchesList,
            invitationRolesList,
            invitationAuditList,
            loginHistoryList,
            securityAlertsList,
            riskEventsList,
            passwordPoliciesList,
            adminMetricsList,
            identityHealthList,
            compromisedAccountsList,
            auditList,
            realmOpts,
        ] = await Promise.all([
            enterpriseIdentityService.getDashboardStats(authUserId, email, fullName),
            Promise.resolve(enterpriseIdentityService.getPipelineInfo()),
            enterpriseIdentityService.getRealms(authUserId, email, fullName),
            enterpriseIdentityService.getProviders(authUserId, email, fullName),
            enterpriseIdentityService.getSamlConfigs(authUserId, email, fullName),
            enterpriseIdentityService.getOidcConfigs(authUserId, email, fullName),
            enterpriseIdentityService.getMfaPolicies(authUserId, email, fullName),
            enterpriseIdentityService.getMfaEnrollments(authUserId, email, fullName),
            enterpriseIdentityService.getBackupCodes(authUserId, email, fullName),
            enterpriseIdentityService.getTrustedDevices(authUserId, email, fullName),
            enterpriseIdentityService.getSessionPolicies(authUserId, email, fullName),
            enterpriseIdentityService.getActiveSessions(authUserId, email, fullName),
            enterpriseIdentityService.getDeviceRegistry(authUserId, email, fullName),
            enterpriseIdentityService.getConcurrentLoginPolicies(authUserId, email, fullName),
            enterpriseIdentityService.getRbacRoles(authUserId, email, fullName),
            enterpriseIdentityService.getPermissionGroups(authUserId, email, fullName),
            enterpriseIdentityService.getAbacPolicies(authUserId, email, fullName),
            enterpriseIdentityService.getTemporaryAccessGrants(authUserId, email, fullName),
            enterpriseIdentityService.getDepartments(authUserId, email, fullName),
            enterpriseIdentityService.getTeams(authUserId, email, fullName),
            enterpriseIdentityService.getBusinessUnits(authUserId, email, fullName),
            enterpriseIdentityService.getReportingStructures(authUserId, email, fullName),
            enterpriseIdentityService.getInvitations(authUserId, email, fullName),
            enterpriseIdentityService.getBulkInviteBatches(authUserId, email, fullName),
            enterpriseIdentityService.getInvitationRoles(authUserId, email, fullName),
            enterpriseIdentityService.getInvitationAudit(authUserId, email, fullName),
            enterpriseIdentityService.getLoginHistory(authUserId, email, fullName),
            enterpriseIdentityService.getSecurityAlerts(authUserId, email, fullName),
            enterpriseIdentityService.getRiskEvents(authUserId, email, fullName),
            enterpriseIdentityService.getPasswordPolicies(authUserId, email, fullName),
            enterpriseIdentityService.getAdminMetrics(authUserId, email, fullName),
            enterpriseIdentityService.getIdentityHealth(authUserId, email, fullName),
            enterpriseIdentityService.getCompromisedAccounts(authUserId, email, fullName),
            enterpriseIdentityService.getAuditLogs(authUserId, email, fullName),
            enterpriseIdentityService.getRealmOptions(authUserId, email, fullName),
        ]);
        return {
            statsData,
            pipelineInfo,
            realmsList,
            providersList,
            samlConfigsList,
            oidcConfigsList,
            mfaPoliciesList,
            mfaEnrollmentsList,
            backupCodesList,
            trustedDevicesList,
            sessionPoliciesList,
            activeSessionsList,
            deviceRegistryList,
            concurrentLoginPoliciesList,
            rbacRolesList,
            permissionGroupsList,
            abacPoliciesList,
            temporaryAccessGrantsList,
            departmentsList,
            teamsList,
            businessUnitsList,
            reportingStructuresList,
            invitationsList,
            bulkInviteBatchesList,
            invitationRolesList,
            invitationAuditList,
            loginHistoryList,
            securityAlertsList,
            riskEventsList,
            passwordPoliciesList,
            adminMetricsList,
            identityHealthList,
            compromisedAccountsList,
            auditList,
            realmOpts,
        };
    }, [authUserId, email, fullName]);

    const applyData = useCallback((result: Awaited<ReturnType<typeof fetchData>>) => {
        if ("empty" in result) { setLoading(false); return; }
        setStats(result.statsData);
        setPipeline(result.pipelineInfo);
        setRealms(result.realmsList);
        setProviders(result.providersList);
        setSamlConfigs(result.samlConfigsList);
        setOidcConfigs(result.oidcConfigsList);
        setMfaPolicys(result.mfaPoliciesList);
        setMfaEnrollments(result.mfaEnrollmentsList);
        setBackupCodes(result.backupCodesList);
        setTrustedDevices(result.trustedDevicesList);
        setSessionPolicys(result.sessionPoliciesList);
        setActiveSessions(result.activeSessionsList);
        setDeviceRegistrys(result.deviceRegistryList);
        setConcurrentLoginPolicys(result.concurrentLoginPoliciesList);
        setRbacRoles(result.rbacRolesList);
        setPermissionGroups(result.permissionGroupsList);
        setAbacPolicys(result.abacPoliciesList);
        setTemporaryAccessGrants(result.temporaryAccessGrantsList);
        setDepartments(result.departmentsList);
        setTeams(result.teamsList);
        setBusinessUnits(result.businessUnitsList);
        setReportingStructures(result.reportingStructuresList);
        setInvitations(result.invitationsList);
        setBulkInviteBatchs(result.bulkInviteBatchesList);
        setInvitationRoles(result.invitationRolesList);
        setInvitationAudits(result.invitationAuditList);
        setLoginHistorys(result.loginHistoryList);
        setSecurityAlerts(result.securityAlertsList);
        setRiskEvents(result.riskEventsList);
        setPasswordPolicys(result.passwordPoliciesList);
        setAdminMetrics(result.adminMetricsList);
        setIdentityHealths(result.identityHealthList);
        setCompromisedAccounts(result.compromisedAccountsList);
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

    const createRealm = useCallback(async (input: CreateRealmInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createRealm(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createProvider = useCallback(async (input: CreateProviderInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createProvider(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSamlConfig = useCallback(async (input: CreateSamlConfigInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createSamlConfig(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createOidcConfig = useCallback(async (input: CreateOidcConfigInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createOidcConfig(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMfaPolicy = useCallback(async (input: CreateMfaPolicyInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createMfaPolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createMfaEnrollment = useCallback(async (input: CreateMfaEnrollmentInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createMfaEnrollment(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBackupCode = useCallback(async (input: CreateBackupCodeInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createBackupCode(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTrustedDevice = useCallback(async (input: CreateTrustedDeviceInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createTrustedDevice(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSessionPolicy = useCallback(async (input: CreateSessionPolicyInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createSessionPolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createActiveSession = useCallback(async (input: CreateActiveSessionInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createActiveSession(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDeviceRegistry = useCallback(async (input: CreateDeviceRegistryInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createDeviceRegistry(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createConcurrentLoginPolicy = useCallback(async (input: CreateConcurrentLoginPolicyInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createConcurrentLoginPolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRbacRole = useCallback(async (input: CreateRbacRoleInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createRbacRole(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPermissionGroup = useCallback(async (input: CreatePermissionGroupInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createPermissionGroup(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAbacPolicy = useCallback(async (input: CreateAbacPolicyInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createAbacPolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTemporaryAccessGrant = useCallback(async (input: CreateTemporaryAccessGrantInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createTemporaryAccessGrant(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createDepartment = useCallback(async (input: CreateDepartmentInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createDepartment(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createTeam = useCallback(async (input: CreateTeamInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createTeam(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBusinessUnit = useCallback(async (input: CreateBusinessUnitInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createBusinessUnit(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createReportingStructure = useCallback(async (input: CreateReportingStructureInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createReportingStructure(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createInvitation = useCallback(async (input: CreateInvitationInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createInvitation(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createBulkInviteBatch = useCallback(async (input: CreateBulkInviteBatchInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createBulkInviteBatch(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createInvitationRole = useCallback(async (input: CreateInvitationRoleInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createInvitationRole(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createInvitationAudit = useCallback(async (input: CreateInvitationAuditInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createInvitationAudit(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createLoginHistory = useCallback(async (input: CreateLoginHistoryInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createLoginHistory(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createSecurityAlert = useCallback(async (input: CreateSecurityAlertInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createSecurityAlert(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createRiskEvent = useCallback(async (input: CreateRiskEventInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createRiskEvent(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createPasswordPolicy = useCallback(async (input: CreatePasswordPolicyInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createPasswordPolicy(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createAdminMetric = useCallback(async (input: CreateAdminMetricInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createAdminMetric(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createIdentityHealth = useCallback(async (input: CreateIdentityHealthInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createIdentityHealth(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);
    const createCompromisedAccount = useCallback(async (input: CreateCompromisedAccountInput) => { if (!user) throw new Error("Authentication required"); await enterpriseIdentityService.createCompromisedAccount(user.id, user.email, input, user.fullName); await refresh(); }, [user, refresh]);

    return {
        loading,
        stats,
        pipeline,
        realms,
        providers,
        samlConfigs,
        oidcConfigs,
        mfaPolicies,
        mfaEnrollments,
        backupCodes,
        trustedDevices,
        sessionPolicies,
        activeSessions,
        deviceRegistry,
        concurrentLoginPolicies,
        rbacRoles,
        permissionGroups,
        abacPolicies,
        temporaryAccessGrants,
        departments,
        teams,
        businessUnits,
        reportingStructures,
        invitations,
        bulkInviteBatches,
        invitationRoles,
        invitationAudit,
        loginHistory,
        securityAlerts,
        riskEvents,
        passwordPolicies,
        adminMetrics,
        identityHealth,
        compromisedAccounts,
        auditLogs,
        realmOptions,
        refresh,
        createRealm,
        createProvider,
        createSamlConfig,
        createOidcConfig,
        createMfaPolicy,
        createMfaEnrollment,
        createBackupCode,
        createTrustedDevice,
        createSessionPolicy,
        createActiveSession,
        createDeviceRegistry,
        createConcurrentLoginPolicy,
        createRbacRole,
        createPermissionGroup,
        createAbacPolicy,
        createTemporaryAccessGrant,
        createDepartment,
        createTeam,
        createBusinessUnit,
        createReportingStructure,
        createInvitation,
        createBulkInviteBatch,
        createInvitationRole,
        createInvitationAudit,
        createLoginHistory,
        createSecurityAlert,
        createRiskEvent,
        createPasswordPolicy,
        createAdminMetric,
        createIdentityHealth,
        createCompromisedAccount,
    };
}
