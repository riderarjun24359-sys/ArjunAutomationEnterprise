"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    EnterpriseIdentityOverviewPanel,
    RealmsPanel,
    ProvidersPanel,
    SamlConfigsPanel,
    OidcConfigsPanel,
    MfaPolicysPanel,
    MfaEnrollmentsPanel,
    BackupCodesPanel,
    TrustedDevicesPanel,
    SessionPolicysPanel,
    ActiveSessionsPanel,
    DeviceRegistrysPanel,
    ConcurrentLoginPolicysPanel,
    RbacRolesPanel,
    PermissionGroupsPanel,
    AbacPolicysPanel,
    TemporaryAccessGrantsPanel,
    DepartmentsPanel,
    TeamsPanel,
    BusinessUnitsPanel,
    ReportingStructuresPanel,
    InvitationsPanel,
    BulkInviteBatchsPanel,
    InvitationRolesPanel,
    InvitationAuditsPanel,
    LoginHistorysPanel,
    SecurityAlertsPanel,
    RiskEventsPanel,
    PasswordPolicysPanel,
    AdminMetricsPanel,
    IdentityHealthsPanel,
    CompromisedAccountsPanel,
    IdpAuditPanel,
    EnterpriseIdentitySdkPanel,
} from "@/src/modules/enterprise-identity/components/EnterpriseIdentityPanels";
import { EnterpriseIdentityStats } from "@/src/modules/enterprise-identity/components/EnterpriseIdentityStats";
import { IDP_TABS } from "@/src/modules/enterprise-identity/constants";
import { useEnterpriseIdentity } from "@/src/modules/enterprise-identity/hooks/useEnterpriseIdentity";

const tabs = [
    { id: IDP_TABS.overview, label: "Overview" },
    { id: IDP_TABS.realms, label: "Realms" },
    { id: IDP_TABS.providers, label: "Providers" },
    { id: IDP_TABS.samlConfigs, label: "SAML Configs" },
    { id: IDP_TABS.oidcConfigs, label: "OIDC Configs" },
    { id: IDP_TABS.mfaPolicies, label: "MFA Policies" },
    { id: IDP_TABS.mfaEnrollments, label: "MFA Enrollments" },
    { id: IDP_TABS.backupCodes, label: "Backup Codes" },
    { id: IDP_TABS.trustedDevices, label: "Trusted Devices" },
    { id: IDP_TABS.sessionPolicies, label: "Session Policies" },
    { id: IDP_TABS.activeSessions, label: "Active Sessions" },
    { id: IDP_TABS.deviceRegistry, label: "Device Registry" },
    { id: IDP_TABS.concurrentLoginPolicies, label: "Concurrent Login" },
    { id: IDP_TABS.rbacRoles, label: "RBAC Roles" },
    { id: IDP_TABS.permissionGroups, label: "Permission Groups" },
    { id: IDP_TABS.abacPolicies, label: "ABAC Policies" },
    { id: IDP_TABS.temporaryAccessGrants, label: "Temporary Access" },
    { id: IDP_TABS.departments, label: "Departments" },
    { id: IDP_TABS.teams, label: "Teams" },
    { id: IDP_TABS.businessUnits, label: "Business Units" },
    { id: IDP_TABS.reportingStructures, label: "Reporting" },
    { id: IDP_TABS.invitations, label: "Invitations" },
    { id: IDP_TABS.bulkInviteBatches, label: "Bulk Invites" },
    { id: IDP_TABS.invitationRoles, label: "Invitation Roles" },
    { id: IDP_TABS.invitationAudit, label: "Invitation Audit" },
    { id: IDP_TABS.loginHistory, label: "Login History" },
    { id: IDP_TABS.securityAlerts, label: "Security Alerts" },
    { id: IDP_TABS.riskEvents, label: "Risk Events" },
    { id: IDP_TABS.passwordPolicies, label: "Password Policies" },
    { id: IDP_TABS.adminMetrics, label: "Admin Metrics" },
    { id: IDP_TABS.identityHealth, label: "Identity Health" },
    { id: IDP_TABS.compromisedAccounts, label: "Compromised Accounts" },
    { id: IDP_TABS.audit, label: "Audit" },
    { id: IDP_TABS.api, label: "SDK" },
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
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-violet-600 text-white" : "border border-slate-200 text-slate-600 hover:border-violet-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === IDP_TABS.overview ? <EnterpriseIdentityOverviewPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.realms ? <RealmsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.providers ? <ProvidersPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.samlConfigs ? <SamlConfigsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.oidcConfigs ? <OidcConfigsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.mfaPolicies ? <MfaPolicysPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.mfaEnrollments ? <MfaEnrollmentsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.backupCodes ? <BackupCodesPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.trustedDevices ? <TrustedDevicesPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.sessionPolicies ? <SessionPolicysPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.activeSessions ? <ActiveSessionsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.deviceRegistry ? <DeviceRegistrysPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.concurrentLoginPolicies ? <ConcurrentLoginPolicysPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.rbacRoles ? <RbacRolesPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.permissionGroups ? <PermissionGroupsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.abacPolicies ? <AbacPolicysPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.temporaryAccessGrants ? <TemporaryAccessGrantsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.departments ? <DepartmentsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.teams ? <TeamsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.businessUnits ? <BusinessUnitsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.reportingStructures ? <ReportingStructuresPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.invitations ? <InvitationsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.bulkInviteBatches ? <BulkInviteBatchsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.invitationRoles ? <InvitationRolesPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.invitationAudit ? <InvitationAuditsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.loginHistory ? <LoginHistorysPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.securityAlerts ? <SecurityAlertsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.riskEvents ? <RiskEventsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.passwordPolicies ? <PasswordPolicysPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.adminMetrics ? <AdminMetricsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.identityHealth ? <IdentityHealthsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.compromisedAccounts ? <CompromisedAccountsPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.audit ? <IdpAuditPanel data={enterpriseIdentity} /> : null}
            {activeTab === IDP_TABS.api ? <EnterpriseIdentitySdkPanel data={enterpriseIdentity} /> : null}
        </div>
    );
}
