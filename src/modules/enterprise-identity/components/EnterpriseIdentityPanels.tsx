"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IDP_THEME, MFA_TYPE_OPTIONS, PROVIDER_TYPE_OPTIONS, SEVERITY_OPTIONS } from "@/src/modules/enterprise-identity/constants";
import type { useEnterpriseIdentity } from "@/src/modules/enterprise-identity/hooks/useEnterpriseIdentity";
import {
    realmFormSchema,
    providerFormSchema,
    samlConfigFormSchema,
    oidcConfigFormSchema,
    mfaPolicyFormSchema,
    mfaEnrollmentFormSchema,
    backupCodeFormSchema,
    trustedDeviceFormSchema,
    sessionPolicyFormSchema,
    activeSessionFormSchema,
    deviceRegistryFormSchema,
    concurrentLoginPolicyFormSchema,
    rbacRoleFormSchema,
    permissionGroupFormSchema,
    abacPolicyFormSchema,
    temporaryAccessGrantFormSchema,
    departmentFormSchema,
    teamFormSchema,
    businessUnitFormSchema,
    reportingStructureFormSchema,
    invitationFormSchema,
    bulkInviteBatchFormSchema,
    invitationRoleFormSchema,
    invitationAuditFormSchema,
    loginHistoryFormSchema,
    securityAlertFormSchema,
    riskEventFormSchema,
    passwordPolicyFormSchema,
    adminMetricFormSchema,
    identityHealthFormSchema,
    compromisedAccountFormSchema,
    type RealmFormValues,
    type ProviderFormValues,
    type SamlConfigFormValues,
    type OidcConfigFormValues,
    type MfaPolicyFormValues,
    type MfaEnrollmentFormValues,
    type BackupCodeFormValues,
    type TrustedDeviceFormValues,
    type SessionPolicyFormValues,
    type ActiveSessionFormValues,
    type DeviceRegistryFormValues,
    type ConcurrentLoginPolicyFormValues,
    type RbacRoleFormValues,
    type PermissionGroupFormValues,
    type AbacPolicyFormValues,
    type TemporaryAccessGrantFormValues,
    type DepartmentFormValues,
    type TeamFormValues,
    type BusinessUnitFormValues,
    type ReportingStructureFormValues,
    type InvitationFormValues,
    type BulkInviteBatchFormValues,
    type InvitationRoleFormValues,
    type InvitationAuditFormValues,
    type LoginHistoryFormValues,
    type SecurityAlertFormValues,
    type RiskEventFormValues,
    type PasswordPolicyFormValues,
    type AdminMetricFormValues,
    type IdentityHealthFormValues,
    type CompromisedAccountFormValues,
} from "@/src/modules/enterprise-identity/schemas";

type EnterpriseIdentityData = ReturnType<typeof useEnterpriseIdentity>;
const inputClass = "w-full rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-tertiary)] px-4 py-3 text-[var(--dos-text-primary)] focus:border-[var(--dos-border-focus)] focus:ring-1 focus:ring-[var(--dos-border-focus)] outline-none transition";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="w-full rounded-[var(--dos-radius-lg)] bg-[var(--dos-text-primary)] px-5 py-3 text-sm font-semibold text-[var(--dos-surface)] transition hover:bg-[var(--dos-brand-primary)] disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return (
        <div className="rounded-[var(--dos-radius-lg)] border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-4 transition hover:border-[var(--dos-brand-primary)]">
            <p className="font-semibold text-[var(--dos-text-primary)]">{title}</p>
            <p className="dos-text-body-sm text-[var(--dos-text-secondary)]">{subtitle}</p>
            {meta ? <p className="mt-1 dos-text-caption text-[var(--dos-ai-accent)]">{meta}</p> : null}
        </div>
    );
}
function PanelWrapper({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
    return (
        <section className="os-panel p-6">
            <header className="mb-6"><h3 className="dos-text-h3">{title}</h3><p className="dos-text-body-sm text-[var(--dos-text-secondary)]">{description}</p></header>
            {children}
        </section>
    );
}

export function EnterpriseIdentityOverviewPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Overview" description="Summary">...</PanelWrapper>; }
export function RealmsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Realms" description="Realms">...</PanelWrapper>; }
export function ProvidersPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Providers" description="Providers">...</PanelWrapper>; }
export function SamlConfigsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="SAML" description="SAML Configs">...</PanelWrapper>; }
export function OidcConfigsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="OIDC" description="OIDC Configs">...</PanelWrapper>; }
export function MfaPolicysPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="MFA" description="Policies">...</PanelWrapper>; }
export function MfaEnrollmentsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="MFA" description="Enrollments">...</PanelWrapper>; }
export function BackupCodesPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Backup" description="Codes">...</PanelWrapper>; }
export function TrustedDevicesPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Devices" description="Trusted">...</PanelWrapper>; }
export function SessionPolicysPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Sessions" description="Policies">...</PanelWrapper>; }
export function ActiveSessionsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Sessions" description="Active">...</PanelWrapper>; }
export function DeviceRegistrysPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Devices" description="Registry">...</PanelWrapper>; }
export function ConcurrentLoginPolicysPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Logins" description="Concurrent">...</PanelWrapper>; }
export function RbacRolesPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="RBAC" description="Roles">...</PanelWrapper>; }
export function PermissionGroupsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Permissions" description="Groups">...</PanelWrapper>; }
export function AbacPolicysPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="ABAC" description="Policies">...</PanelWrapper>; }
export function TemporaryAccessGrantsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Access" description="Temporary">...</PanelWrapper>; }
export function DepartmentsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Departments" description="Departments">...</PanelWrapper>; }
export function TeamsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Teams" description="Teams">...</PanelWrapper>; }
export function BusinessUnitsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Units" description="Business">...</PanelWrapper>; }
export function ReportingStructuresPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Reporting" description="Structures">...</PanelWrapper>; }
export function InvitationsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Invitations" description="Invitations">...</PanelWrapper>; }
export function BulkInviteBatchsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Bulk Invites" description="Batches">...</PanelWrapper>; }
export function InvitationRolesPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Invitation" description="Roles">...</PanelWrapper>; }
export function InvitationAuditsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Invitation" description="Audit">...</PanelWrapper>; }
export function LoginHistorysPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Login" description="History">...</PanelWrapper>; }
export function SecurityAlertsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Security" description="Alerts">...</PanelWrapper>; }
export function RiskEventsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Risk" description="Events">...</PanelWrapper>; }
export function PasswordPolicysPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Password" description="Policies">...</PanelWrapper>; }
export function AdminMetricsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Metrics" description="Admin">...</PanelWrapper>; }
export function IdentityHealthsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Identity" description="Health">...</PanelWrapper>; }
export function CompromisedAccountsPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Compromised" description="Accounts">...</PanelWrapper>; }
export function IdpAuditPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="Audit" description="Logs">...</PanelWrapper>; }
export function EnterpriseIdentitySdkPanel({ data }: { data: EnterpriseIdentityData }) { return <PanelWrapper title="SDK" description="API">...</PanelWrapper>; }
