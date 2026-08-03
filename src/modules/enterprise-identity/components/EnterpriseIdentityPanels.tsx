"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
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
                <ListCard title="Realms" subtitle={`${data.stats?.totalRealms ?? 0} total`} meta={`${data.stats?.activeRealms ?? 0} active • ${data.stats?.providerCount ?? 0} providers`} />
                <ListCard title="MFA & Sessions" subtitle={`${data.stats?.mfaEnrollmentCount ?? 0} enrollments`} meta={`${(data.stats?.mfaAdoptionPercent ?? 0).toFixed(0)}% adoption • ${data.stats?.activeSessionCount ?? 0} sessions`} />
                <ListCard title="Security" subtitle={`${data.stats?.openSecurityAlertCount ?? 0} open alerts`} meta={`${data.stats?.compromisedAccountCount ?? 0} compromised • ${data.stats?.failedLogins24h ?? 0} failed logins/24h`} />
                <ListCard title="Invitations & Audit" subtitle={`${data.stats?.pendingInvitationCount ?? 0} pending invites`} meta={`${data.stats?.auditCount ?? 0} audit entries`} />
            </div></Card>
            <Card hover><SectionHeader title="Identity pipeline" description={`${pipeline?.previousStage ?? "realm_setup"} → ${pipeline?.currentStage ?? "provider_config"} → ${pipeline?.nextStage ?? "mfa_policy"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={stage.label} />
                )) : <EmptyState title="No pipeline data" description="Identity pipeline stages will appear as realms progress through setup." />}
            </div></Card>
        </div>
    );
}

export function RealmsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<RealmFormValues>({ resolver: zodResolver(realmFormSchema), defaultValues: { realmKey: "", realmName: "", summary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Realms" description="Enterprise identity realms" /><div className="mt-6 space-y-3">
                {data.realms.length === 0 ? <EmptyState title="No realms" description="Register the first identity realm." /> : data.realms.map((item) => (
                    <ListCard key={item.id} title={String(item.realmName)} subtitle={`${item.realmKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create realm" description="Add a new realms record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRealm(v))}>
                <input {...form.register("realmKey")} placeholder="Realm key" className={inputClass} />
                <input {...form.register("realmName")} placeholder="Realm name" className={inputClass} />
                <textarea {...form.register("summary")} placeholder="Summary" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ProvidersPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<ProviderFormValues>({ resolver: zodResolver(providerFormSchema), defaultValues: { realmId: "", providerKey: "", providerType: "", displayName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Providers" description="Enterprise identity providers" /><div className="mt-6 space-y-3">
                {data.providers.length === 0 ? <EmptyState title="No providers" description="Create providers for a realm." /> : data.providers.map((item) => (
                    <ListCard key={item.id} title={String(item.displayName)} subtitle={`${item.realmName} • ${item.providerKey}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create provider" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createProvider(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("providerKey")} placeholder="Provider key" className={inputClass} />
                <select {...form.register("providerType")} className={inputClass}>{PROVIDER_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input {...form.register("displayName")} placeholder="Display name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SamlConfigsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<SamlConfigFormValues>({ resolver: zodResolver(samlConfigFormSchema), defaultValues: { realmId: "", configKey: "", entityId: "", ssoUrl: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="SAML Configs" description="Enterprise identity saml configs" /><div className="mt-6 space-y-3">
                {data.samlConfigs.length === 0 ? <EmptyState title="No saml configs" description="Create saml configs for a realm." /> : data.samlConfigs.map((item) => (
                    <ListCard key={item.id} title={String(item.configKey)} subtitle={`${item.configKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create saml config" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSamlConfig(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("configKey")} placeholder="Config key" className={inputClass} />
                <input {...form.register("entityId")} placeholder="Entity ID" className={inputClass} />
                <input {...form.register("ssoUrl")} placeholder="SSO URL" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function OidcConfigsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<OidcConfigFormValues>({ resolver: zodResolver(oidcConfigFormSchema), defaultValues: { realmId: "", configKey: "", clientId: "", issuerUrl: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="OIDC Configs" description="Enterprise identity oidc configs" /><div className="mt-6 space-y-3">
                {data.oidcConfigs.length === 0 ? <EmptyState title="No oidc configs" description="Create oidc configs for a realm." /> : data.oidcConfigs.map((item) => (
                    <ListCard key={item.id} title={String(item.configKey)} subtitle={`${item.configKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create oidc config" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createOidcConfig(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("configKey")} placeholder="Config key" className={inputClass} />
                <input {...form.register("clientId")} placeholder="Client ID" className={inputClass} />
                <input {...form.register("issuerUrl")} placeholder="Issuer URL" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MfaPolicysPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<MfaPolicyFormValues>({ resolver: zodResolver(mfaPolicyFormSchema), defaultValues: { realmId: "", policyKey: "", name: "", gracePeriodDays: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="MFA Policies" description="Enterprise identity mfa policies" /><div className="mt-6 space-y-3">
                {data.mfaPolicies.length === 0 ? <EmptyState title="No mfa policies" description="Create mfa policies for a realm." /> : data.mfaPolicies.map((item) => (
                    <ListCard key={item.id} title={String(item.name)} subtitle={`${item.name} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create mfa policie" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMfaPolicy(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("policyKey")} placeholder="Policy key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" step="any" {...form.register("gracePeriodDays", { valueAsNumber: true })} placeholder="Grace period days" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function MfaEnrollmentsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<MfaEnrollmentFormValues>({ resolver: zodResolver(mfaEnrollmentFormSchema), defaultValues: { realmId: "", enrollmentKey: "", mfaType: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="MFA Enrollments" description="Enterprise identity mfa enrollments" /><div className="mt-6 space-y-3">
                {data.mfaEnrollments.length === 0 ? <EmptyState title="No mfa enrollments" description="Create mfa enrollments for a realm." /> : data.mfaEnrollments.map((item) => (
                    <ListCard key={item.id} title={String(item.enrollmentKey)} subtitle={`${item.enrollmentKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create mfa enrollment" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createMfaEnrollment(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("enrollmentKey")} placeholder="Enrollment key" className={inputClass} />
                <select {...form.register("mfaType")} className={inputClass}>{MFA_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BackupCodesPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<BackupCodeFormValues>({ resolver: zodResolver(backupCodeFormSchema), defaultValues: { realmId: "", codeKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Backup Codes" description="Enterprise identity backup codes" /><div className="mt-6 space-y-3">
                {data.backupCodes.length === 0 ? <EmptyState title="No backup codes" description="Create backup codes for a realm." /> : data.backupCodes.map((item) => (
                    <ListCard key={item.id} title={String(item.codeKey)} subtitle={`${item.codeKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create backup code" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBackupCode(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("codeKey")} placeholder="Code key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TrustedDevicesPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<TrustedDeviceFormValues>({ resolver: zodResolver(trustedDeviceFormSchema), defaultValues: { realmId: "", deviceKey: "", deviceName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Trusted Devices" description="Enterprise identity trusted devices" /><div className="mt-6 space-y-3">
                {data.trustedDevices.length === 0 ? <EmptyState title="No trusted devices" description="Create trusted devices for a realm." /> : data.trustedDevices.map((item) => (
                    <ListCard key={item.id} title={String(item.deviceName)} subtitle={`${item.deviceName} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create trusted device" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTrustedDevice(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("deviceKey")} placeholder="Device key" className={inputClass} />
                <input {...form.register("deviceName")} placeholder="Device name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SessionPolicysPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<SessionPolicyFormValues>({ resolver: zodResolver(sessionPolicyFormSchema), defaultValues: { realmId: "", policyKey: "", name: "", idleTimeoutMinutes: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Session Policies" description="Enterprise identity session policies" /><div className="mt-6 space-y-3">
                {data.sessionPolicies.length === 0 ? <EmptyState title="No session policies" description="Create session policies for a realm." /> : data.sessionPolicies.map((item) => (
                    <ListCard key={item.id} title={String(item.name)} subtitle={`${item.name} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create session policie" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSessionPolicy(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("policyKey")} placeholder="Policy key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" step="any" {...form.register("idleTimeoutMinutes", { valueAsNumber: true })} placeholder="Idle timeout minutes" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ActiveSessionsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<ActiveSessionFormValues>({ resolver: zodResolver(activeSessionFormSchema), defaultValues: { realmId: "", sessionKey: "", deviceName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Active Sessions" description="Enterprise identity active sessions" /><div className="mt-6 space-y-3">
                {data.activeSessions.length === 0 ? <EmptyState title="No active sessions" description="Create active sessions for a realm." /> : data.activeSessions.map((item) => (
                    <ListCard key={item.id} title={String(item.sessionKey)} subtitle={`${item.sessionKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create active session" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createActiveSession(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("sessionKey")} placeholder="Session key" className={inputClass} />
                <input {...form.register("deviceName")} placeholder="Device name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DeviceRegistrysPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<DeviceRegistryFormValues>({ resolver: zodResolver(deviceRegistryFormSchema), defaultValues: { realmId: "", deviceKey: "", deviceName: "", deviceType: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Device Registry" description="Enterprise identity device registry" /><div className="mt-6 space-y-3">
                {data.deviceRegistry.length === 0 ? <EmptyState title="No device registry" description="Create device registry for a realm." /> : data.deviceRegistry.map((item) => (
                    <ListCard key={item.id} title={String(item.deviceName)} subtitle={`${item.deviceName} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create device registry" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDeviceRegistry(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("deviceKey")} placeholder="Device key" className={inputClass} />
                <input {...form.register("deviceName")} placeholder="Device name" className={inputClass} />
                <input {...form.register("deviceType")} placeholder="Device type" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ConcurrentLoginPolicysPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<ConcurrentLoginPolicyFormValues>({ resolver: zodResolver(concurrentLoginPolicyFormSchema), defaultValues: { realmId: "", policyKey: "", maxConcurrentSessions: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Concurrent Login" description="Enterprise identity concurrent login" /><div className="mt-6 space-y-3">
                {data.concurrentLoginPolicies.length === 0 ? <EmptyState title="No concurrent login" description="Create concurrent login for a realm." /> : data.concurrentLoginPolicies.map((item) => (
                    <ListCard key={item.id} title={String(item.policyKey)} subtitle={`${item.policyKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create concurrent login" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createConcurrentLoginPolicy(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("policyKey")} placeholder="Policy key" className={inputClass} />
                <input type="number" step="any" {...form.register("maxConcurrentSessions", { valueAsNumber: true })} placeholder="Max concurrent sessions" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RbacRolesPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<RbacRoleFormValues>({ resolver: zodResolver(rbacRoleFormSchema), defaultValues: { realmId: "", roleKey: "", roleName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="RBAC Roles" description="Enterprise identity rbac roles" /><div className="mt-6 space-y-3">
                {data.rbacRoles.length === 0 ? <EmptyState title="No rbac roles" description="Create rbac roles for a realm." /> : data.rbacRoles.map((item) => (
                    <ListCard key={item.id} title={String(item.roleName)} subtitle={`${item.roleName} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create rbac role" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRbacRole(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("roleKey")} placeholder="Role key" className={inputClass} />
                <input {...form.register("roleName")} placeholder="Role name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PermissionGroupsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<PermissionGroupFormValues>({ resolver: zodResolver(permissionGroupFormSchema), defaultValues: { realmId: "", groupKey: "", groupName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Permission Groups" description="Enterprise identity permission groups" /><div className="mt-6 space-y-3">
                {data.permissionGroups.length === 0 ? <EmptyState title="No permission groups" description="Create permission groups for a realm." /> : data.permissionGroups.map((item) => (
                    <ListCard key={item.id} title={String(item.groupName)} subtitle={`${item.groupName} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create permission group" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPermissionGroup(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("groupKey")} placeholder="Group key" className={inputClass} />
                <input {...form.register("groupName")} placeholder="Group name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AbacPolicysPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<AbacPolicyFormValues>({ resolver: zodResolver(abacPolicyFormSchema), defaultValues: { realmId: "", policyKey: "", name: "", effect: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="ABAC Policies" description="Enterprise identity abac policies" /><div className="mt-6 space-y-3">
                {data.abacPolicies.length === 0 ? <EmptyState title="No abac policies" description="Create abac policies for a realm." /> : data.abacPolicies.map((item) => (
                    <ListCard key={item.id} title={String(item.name)} subtitle={`${item.name} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create abac policie" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAbacPolicy(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("policyKey")} placeholder="Policy key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("effect")} placeholder="Effect" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TemporaryAccessGrantsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<TemporaryAccessGrantFormValues>({ resolver: zodResolver(temporaryAccessGrantFormSchema), defaultValues: { realmId: "", grantKey: "", expiresAt: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Temporary Access" description="Enterprise identity temporary access" /><div className="mt-6 space-y-3">
                {data.temporaryAccessGrants.length === 0 ? <EmptyState title="No temporary access" description="Create temporary access for a realm." /> : data.temporaryAccessGrants.map((item) => (
                    <ListCard key={item.id} title={String(item.grantKey)} subtitle={`${item.grantKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create temporary acces" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTemporaryAccessGrant(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("grantKey")} placeholder="Grant key" className={inputClass} />
                <input {...form.register("expiresAt")} placeholder="Expires at (ISO)" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function DepartmentsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<DepartmentFormValues>({ resolver: zodResolver(departmentFormSchema), defaultValues: { realmId: "", departmentKey: "", name: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Departments" description="Enterprise identity departments" /><div className="mt-6 space-y-3">
                {data.departments.length === 0 ? <EmptyState title="No departments" description="Create departments for a realm." /> : data.departments.map((item) => (
                    <ListCard key={item.id} title={String(item.name)} subtitle={`${item.name} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create department" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDepartment(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("departmentKey")} placeholder="Department key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function TeamsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<TeamFormValues>({ resolver: zodResolver(teamFormSchema), defaultValues: { realmId: "", teamKey: "", name: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Teams" description="Enterprise identity teams" /><div className="mt-6 space-y-3">
                {data.teams.length === 0 ? <EmptyState title="No teams" description="Create teams for a realm." /> : data.teams.map((item) => (
                    <ListCard key={item.id} title={String(item.name)} subtitle={`${item.name} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create team" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTeam(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("teamKey")} placeholder="Team key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BusinessUnitsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<BusinessUnitFormValues>({ resolver: zodResolver(businessUnitFormSchema), defaultValues: { realmId: "", unitKey: "", name: "", code: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Business Units" description="Enterprise identity business units" /><div className="mt-6 space-y-3">
                {data.businessUnits.length === 0 ? <EmptyState title="No business units" description="Create business units for a realm." /> : data.businessUnits.map((item) => (
                    <ListCard key={item.id} title={String(item.name)} subtitle={`${item.name} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create business unit" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBusinessUnit(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("unitKey")} placeholder="Unit key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("code")} placeholder="Code" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function ReportingStructuresPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<ReportingStructureFormValues>({ resolver: zodResolver(reportingStructureFormSchema), defaultValues: { realmId: "", structureKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Reporting" description="Enterprise identity reporting" /><div className="mt-6 space-y-3">
                {data.reportingStructures.length === 0 ? <EmptyState title="No reporting" description="Create reporting for a realm." /> : data.reportingStructures.map((item) => (
                    <ListCard key={item.id} title={String(item.structureKey)} subtitle={`${item.structureKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create reporting" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReportingStructure(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("structureKey")} placeholder="Structure key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function InvitationsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<InvitationFormValues>({ resolver: zodResolver(invitationFormSchema), defaultValues: { realmId: "", invitationKey: "", email: "", roleName: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Invitations" description="Enterprise identity invitations" /><div className="mt-6 space-y-3">
                {data.invitations.length === 0 ? <EmptyState title="No invitations" description="Create invitations for a realm." /> : data.invitations.map((item) => (
                    <ListCard key={item.id} title={String(item.email)} subtitle={`${item.email} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create invitation" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createInvitation(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("invitationKey")} placeholder="Invitation key" className={inputClass} />
                <input {...form.register("email")} placeholder="Email" className={inputClass} />
                <input {...form.register("roleName")} placeholder="Role name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function BulkInviteBatchsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<BulkInviteBatchFormValues>({ resolver: zodResolver(bulkInviteBatchFormSchema), defaultValues: { realmId: "", batchKey: "", name: "", totalCount: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Bulk Invites" description="Enterprise identity bulk invites" /><div className="mt-6 space-y-3">
                {data.bulkInviteBatches.length === 0 ? <EmptyState title="No bulk invites" description="Create bulk invites for a realm." /> : data.bulkInviteBatches.map((item) => (
                    <ListCard key={item.id} title={String(item.name)} subtitle={`${item.name} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create bulk invite" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBulkInviteBatch(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("batchKey")} placeholder="Batch key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" step="any" {...form.register("totalCount", { valueAsNumber: true })} placeholder="Total count" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function InvitationRolesPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<InvitationRoleFormValues>({ resolver: zodResolver(invitationRoleFormSchema), defaultValues: { realmId: "", roleAssignmentKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Invitation Roles" description="Enterprise identity invitation roles" /><div className="mt-6 space-y-3">
                {data.invitationRoles.length === 0 ? <EmptyState title="No invitation roles" description="Create invitation roles for a realm." /> : data.invitationRoles.map((item) => (
                    <ListCard key={item.id} title={String(item.roleAssignmentKey)} subtitle={`${item.roleAssignmentKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create invitation role" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createInvitationRole(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("roleAssignmentKey")} placeholder="Role assignment key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function InvitationAuditsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<InvitationAuditFormValues>({ resolver: zodResolver(invitationAuditFormSchema), defaultValues: { realmId: "", auditKey: "", action: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Invitation Audit" description="Enterprise identity invitation audit" /><div className="mt-6 space-y-3">
                {data.invitationAudit.length === 0 ? <EmptyState title="No invitation audit" description="Create invitation audit for a realm." /> : data.invitationAudit.map((item) => (
                    <ListCard key={item.id} title={String(item.auditKey)} subtitle={`${item.auditKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create invitation audit" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createInvitationAudit(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("auditKey")} placeholder="Audit key" className={inputClass} />
                <input {...form.register("action")} placeholder="Action" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function LoginHistorysPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<LoginHistoryFormValues>({ resolver: zodResolver(loginHistoryFormSchema), defaultValues: { realmId: "", loginKey: "", loginMethod: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Login History" description="Enterprise identity login history" /><div className="mt-6 space-y-3">
                {data.loginHistory.length === 0 ? <EmptyState title="No login history" description="Create login history for a realm." /> : data.loginHistory.map((item) => (
                    <ListCard key={item.id} title={String(item.loginKey)} subtitle={`${item.realmName} • ${item.loginMethod}`} meta={`${item.success ? "success" : "failed"} • ${item.loggedAt}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create login history" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createLoginHistory(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("loginKey")} placeholder="Login key" className={inputClass} />
                <input {...form.register("loginMethod")} placeholder="Login method" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function SecurityAlertsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<SecurityAlertFormValues>({ resolver: zodResolver(securityAlertFormSchema), defaultValues: { realmId: "", alertKey: "", alertType: "", severity: "", title: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Security Alerts" description="Enterprise identity security alerts" /><div className="mt-6 space-y-3">
                {data.securityAlerts.length === 0 ? <EmptyState title="No security alerts" description="Create security alerts for a realm." /> : data.securityAlerts.map((item) => (
                    <ListCard key={item.id} title={String(item.title)} subtitle={`${item.title} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create security alert" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSecurityAlert(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("alertKey")} placeholder="Alert key" className={inputClass} />
                <input {...form.register("alertType")} placeholder="Alert type" className={inputClass} />
                <select {...form.register("severity")} className={inputClass}>{SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function RiskEventsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<RiskEventFormValues>({ resolver: zodResolver(riskEventFormSchema), defaultValues: { realmId: "", eventKey: "", riskScore: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Risk Events" description="Enterprise identity risk events" /><div className="mt-6 space-y-3">
                {data.riskEvents.length === 0 ? <EmptyState title="No risk events" description="Create risk events for a realm." /> : data.riskEvents.map((item) => (
                    <ListCard key={item.id} title={String(item.eventKey)} subtitle={`${item.eventKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create risk event" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRiskEvent(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("eventKey")} placeholder="Event key" className={inputClass} />
                <input type="number" step="any" {...form.register("riskScore", { valueAsNumber: true })} placeholder="Risk score" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function PasswordPolicysPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<PasswordPolicyFormValues>({ resolver: zodResolver(passwordPolicyFormSchema), defaultValues: { realmId: "", policyKey: "", name: "", minLength: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Password Policies" description="Enterprise identity password policies" /><div className="mt-6 space-y-3">
                {data.passwordPolicies.length === 0 ? <EmptyState title="No password policies" description="Create password policies for a realm." /> : data.passwordPolicies.map((item) => (
                    <ListCard key={item.id} title={String(item.name)} subtitle={`${item.name} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create password policie" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPasswordPolicy(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("policyKey")} placeholder="Policy key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" step="any" {...form.register("minLength", { valueAsNumber: true })} placeholder="Min length" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function AdminMetricsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<AdminMetricFormValues>({ resolver: zodResolver(adminMetricFormSchema), defaultValues: { metricsKey: "", totalUsers: 0, mfaAdoptionPercent: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Admin Metrics" description="Enterprise identity admin metrics" /><div className="mt-6 space-y-3">
                {data.adminMetrics.length === 0 ? <EmptyState title="No admin metrics" description="Create admin metrics for a realm." /> : data.adminMetrics.map((item) => (
                    <ListCard key={item.id} title={String(item.metricsKey)} subtitle={`${item.metricsKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create admin metric" description="Add a new admin metrics record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAdminMetric(v))}>
                <input {...form.register("metricsKey")} placeholder="Metrics key" className={inputClass} />
                <input type="number" step="any" {...form.register("totalUsers", { valueAsNumber: true })} placeholder="Total users" className={inputClass} />
                <input type="number" step="any" {...form.register("mfaAdoptionPercent", { valueAsNumber: true })} placeholder="MFA adoption %" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IdentityHealthsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<IdentityHealthFormValues>({ resolver: zodResolver(identityHealthFormSchema), defaultValues: { healthKey: "", overallScore: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Identity Health" description="Enterprise identity identity health" /><div className="mt-6 space-y-3">
                {data.identityHealth.length === 0 ? <EmptyState title="No identity health" description="Create identity health for a realm." /> : data.identityHealth.map((item) => (
                    <ListCard key={item.id} title={String(item.healthKey)} subtitle={`${item.healthKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create identity health" description="Add a new identity health record" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIdentityHealth(v))}>
                <input {...form.register("healthKey")} placeholder="Health key" className={inputClass} />
                <input type="number" step="any" {...form.register("overallScore", { valueAsNumber: true })} placeholder="Overall score" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function CompromisedAccountsPanel({ data }: { data: EnterpriseIdentityData }) {
    const form = useForm<CompromisedAccountFormValues>({ resolver: zodResolver(compromisedAccountFormSchema), defaultValues: { realmId: "", accountKey: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Compromised Accounts" description="Enterprise identity compromised accounts" /><div className="mt-6 space-y-3">
                {data.compromisedAccounts.length === 0 ? <EmptyState title="No compromised accounts" description="Create compromised accounts for a realm." /> : data.compromisedAccounts.map((item) => (
                    <ListCard key={item.id} title={String(item.accountKey)} subtitle={`${item.accountKey} • ${item.status}`} meta={`${item.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create compromised account" description="Add a new record for the selected realm" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCompromisedAccount(v))}>
                <RealmSelect data={data} {...form.register("realmId")} />
                <input {...form.register("accountKey")} placeholder="Account key" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create" />
            </form></Card>
        </div>
    );
}

export function IdpAuditPanel({ data }: { data: EnterpriseIdentityData }) {
    return (
        <Card hover><SectionHeader title="Enterprise Identity audit history" description="Security-first audit trail with security_level classification for all identity operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs are created automatically for realm, provider, MFA, and access control operations." /> : data.auditLogs.map((entry) => (
                <ListCard key={entry.id} title={entry.summary} subtitle={`${entry.entityType} • ${entry.action}`} meta={`${entry.securityLevel} • ${new Date(entry.createdAt).toLocaleString()}`} />
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
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createEnterpriseIdentityClient } from "@/src/modules/enterprise-identity/sdk";

const idp = createEnterpriseIdentityClient(userId, email, fullName);
await idp.provisionRealm({ realmKey: "acme", realmName: "Acme Corp" });
await idp.enrollMfa({ realmId, enrollmentKey: "mfa-001", mfaType: "authenticator" });
await idp.inviteUser({ realmId, invitationKey: "inv-001", email: "user@acme.com", roleName: "member" });`}</pre>
        </div></Card>
    );
}
