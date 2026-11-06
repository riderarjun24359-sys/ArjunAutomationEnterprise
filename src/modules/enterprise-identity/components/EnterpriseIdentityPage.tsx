"use client";

import { useState } from "react";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { Badge } from "@/src/design-os/components/Badge";
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
        return <LoadingState label="Loading Enterprise Identity" />;
    }

    return (
        <PageTransition className="mx-auto max-w-[85rem] space-y-10">
            <header className="flex flex-col gap-4 border-b border-[var(--dos-border-subtle)] pb-8">
                <Badge variant="info" className="w-fit">Identity OS Engine</Badge>
                <div>
                    <h1 className="dos-text-display">Enterprise Identity</h1>
                    <p className="mt-4 max-w-3xl dos-text-h3 text-[var(--dos-text-secondary)]">
                        Enterprise identity management platform: providers, MFA, security, and access control.
                    </p>
                </div>
            </header>
            
            <EnterpriseIdentityStats stats={enterpriseIdentity.stats} />

            <nav className="flex flex-wrap gap-2 border-b border-[var(--dos-border-subtle)] pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTab === tab.id ? "bg-[var(--dos-text-primary)] text-[var(--dos-surface)]" : "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] hover:text-[var(--dos-text-primary)]"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <section className="min-h-[60vh] rounded-[var(--dos-radius-2xl)] bg-[var(--dos-surface-secondary)]/50 p-8">
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
            </section>
        </PageTransition>
    );
}
