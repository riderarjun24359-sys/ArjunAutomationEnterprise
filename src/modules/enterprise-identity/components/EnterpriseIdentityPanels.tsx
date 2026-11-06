"use client";

import { useState } from "react";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { PROVIDER_TYPE_OPTIONS } from "@/src/modules/enterprise-identity/constants";
import type { useEnterpriseIdentity } from "@/src/modules/enterprise-identity/hooks/useEnterpriseIdentity";

type EnterpriseIdentityData = ReturnType<typeof useEnterpriseIdentity>;
type IdentityRow = Record<string, unknown>;
type IdentityField = {
    name: string;
    label: string;
    type?: "text" | "number" | "email" | "date" | "select";
    required?: boolean;
    options?: Array<{ value: string; label: string }>;
};
type DisplayField = { key: string; label: string };

function rows<T extends object>(items: T[]): IdentityRow[] {
    return items as unknown as IdentityRow[];
}

function displayValue(row: IdentityRow, key: string): string {
    const value = row[key];
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (key === "email" && typeof value === "string") {
        const [name, domain] = value.split("@");
        return domain ? `${name.slice(0, 1)}•••@${domain}` : value;
    }
    return String(value);
}

function IdentityRecordPanel({
    title,
    description,
    records,
    primary,
    secondary = [],
    meta = [],
    emptyMessage,
    data,
    fields = [],
    onCreate,
}: {
    title: string;
    description: string;
    records: IdentityRow[];
    primary: DisplayField;
    secondary?: DisplayField[];
    meta?: DisplayField[];
    emptyMessage: string;
    data: EnterpriseIdentityData;
    fields?: IdentityField[];
    onCreate?: (values: Record<string, string>) => Promise<void>;
}) {
    const [values, setValues] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!onCreate) return;
        setSaving(true);
        setError(null);
        try {
            await onCreate(values);
            setValues({});
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Could not save this record. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={fields.length > 0 && onCreate ? "grid gap-6 xl:grid-cols-[1.35fr_1fr]" : "space-y-6"}>
            <Card hover>
                <SectionHeader title={title} description={description} />
                <div className="mt-5 space-y-3">
                    {records.length === 0 ? (
                        <EmptyState title="No records yet" description={emptyMessage} />
                    ) : records.map((record, index) => {
                        const heading = displayValue(record, primary.key) || `Record ${index + 1}`;
                        const sub = secondary.map((field) => displayValue(record, field.key)).filter(Boolean);
                        const details = meta.map((field) => {
                            const value = displayValue(record, field.key);
                            return value ? `${field.label}: ${value}` : "";
                        }).filter(Boolean);
                        return (
                            <article key={String(record.id ?? index)} className="rounded-xl border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] p-4">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <h4 className="font-semibold text-[var(--dos-text-primary)]">{heading}</h4>
                                    {record.status !== undefined && <span className="rounded-full bg-[var(--dos-surface-tertiary)] px-2.5 py-1 text-xs capitalize text-[var(--dos-text-secondary)]">{displayValue(record, "status").replaceAll("_", " ")}</span>}
                                </div>
                                {sub.length > 0 && <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{sub.join(" · ")}</p>}
                                {details.length > 0 && <p className="mt-2 text-xs text-[var(--dos-text-tertiary)]">{details.join(" · ")}</p>}
                            </article>
                        );
                    })}
                </div>
            </Card>

            {fields.length > 0 && onCreate && (
                <Card hover>
                    <SectionHeader title={`Add ${title.toLowerCase()}`} description="Create a new tenant-scoped record." />
                    <form onSubmit={submit} className="mt-5 space-y-4">
                        {fields.map((field) => (
                            <label key={field.name} className="block text-sm font-medium text-[var(--dos-text-primary)]">
                                <span className="mb-1.5 block">{field.label}</span>
                                {field.name === "realmId" ? (
                                    <select
                                        required={field.required}
                                        value={values[field.name] ?? ""}
                                        onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                                        className="w-full rounded-xl border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] px-3 py-2.5 text-sm"
                                    >
                                        <option value="">Select realm</option>
                                        {data.realmOptions.map((realm) => <option key={realm.id} value={realm.id}>{realm.name}</option>)}
                                    </select>
                                ) : field.type === "select" ? (
                                    <select
                                        required={field.required}
                                        value={values[field.name] ?? ""}
                                        onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                                        className="w-full rounded-xl border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] px-3 py-2.5 text-sm"
                                    >
                                        <option value="">Select {field.label.toLowerCase()}</option>
                                        {(field.options ?? []).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type ?? "text"}
                                        required={field.required}
                                        min={field.type === "number" ? 0 : undefined}
                                        value={values[field.name] ?? ""}
                                        onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                                        className="w-full rounded-xl border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] px-3 py-2.5 text-sm"
                                    />
                                )}
                            </label>
                        ))}
                        {error && <p role="alert" className="text-sm text-[var(--dos-error)]">{error}</p>}
                        <button type="submit" disabled={saving || (fields.some((field) => field.name === "realmId") && data.realmOptions.length === 0)} className="w-full rounded-xl bg-[var(--dos-text-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--dos-surface)] disabled:cursor-not-allowed disabled:opacity-60">
                            {saving ? "Saving…" : "Create record"}
                        </button>
                    </form>
                </Card>
            )}
        </div>
    );
}

const realmField: IdentityField = { name: "realmId", label: "Realm", required: true };
const keyField = (name: string, label: string): IdentityField => ({ name, label, required: true });

export function EnterpriseIdentityOverviewPanel({ data }: { data: EnterpriseIdentityData }) {
    const stats = data.stats;
    const metrics = [
        ["Realms", stats?.totalRealms ?? 0, `${stats?.activeRealms ?? 0} active`],
        ["MFA enrolments", stats?.mfaEnrollmentCount ?? 0, `${stats?.mfaAdoptionPercent ?? 0}% adoption`],
        ["Active sessions", stats?.activeSessionCount ?? 0, "Currently active"],
        ["Pending invitations", stats?.pendingInvitationCount ?? 0, "Awaiting response"],
        ["Security alerts", stats?.openSecurityAlertCount ?? 0, "Open alerts"],
        ["Compromised accounts", stats?.compromisedAccountCount ?? 0, "Require review"],
    ];
    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {metrics.map(([label, value, detail]) => <Card key={String(label)} hover><p className="text-xs uppercase tracking-wide text-[var(--dos-text-tertiary)]">{label}</p><p className="mt-2 text-3xl font-bold text-[var(--dos-text-primary)]">{value}</p><p className="mt-1 text-xs text-[var(--dos-text-secondary)]">{detail}</p></Card>)}
            </div>
            <Card hover>
                <SectionHeader title="Identity operations pipeline" description="Current processing stages" />
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {(data.pipeline?.stages ?? []).map((stage) => <div key={stage.key} className="rounded-xl border border-[var(--dos-border)] p-4"><p className="font-semibold">{stage.label}</p><p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{stage.key}</p></div>)}
                </div>
            </Card>
        </div>
    );
}

export function RealmsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Realms" description="Tenant identity realms and their lifecycle status." records={rows(data.realms)} primary={{ key: "realmName", label: "Realm" }} secondary={[{ key: "realmKey", label: "Key" }]} meta={[{ key: "updatedAt", label: "Updated" }]} emptyMessage="Create the first identity realm for this organization." data={data} fields={[keyField("realmKey", "Realm key"), keyField("realmName", "Realm name"), { name: "summary", label: "Summary" }]} onCreate={(v) => data.createRealm({ realmKey: v.realmKey, realmName: v.realmName, summary: v.summary })} />;
}

export function ProvidersPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Identity providers" description="Configured authentication providers. Secret values are never displayed here." records={rows(data.providers)} primary={{ key: "displayName", label: "Provider" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "providerType", label: "Type" }]} emptyMessage="Add an identity provider to connect an authentication source." data={data} fields={[realmField, keyField("providerKey", "Provider key"), { name: "providerType", label: "Provider type", type: "select", options: PROVIDER_TYPE_OPTIONS.map((option) => ({ value: option.value, label: option.label })) }, { name: "displayName", label: "Display name", required: true }]} onCreate={(v) => data.createProvider({ realmId: v.realmId, providerKey: v.providerKey, providerType: v.providerType, displayName: v.displayName })} />;
}

export function SamlConfigsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="SAML configurations" description="Single sign-on configuration metadata; private keys and secrets are not shown." records={rows(data.samlConfigs)} primary={{ key: "configKey", label: "Configuration" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "entityId", label: "Entity ID" }]} meta={[{ key: "ssoUrl", label: "SSO URL" }]} emptyMessage="No SAML configurations are set up." data={data} fields={[realmField, keyField("configKey", "Configuration key"), keyField("entityId", "Entity ID"), keyField("ssoUrl", "SSO URL")]} onCreate={(v) => data.createSamlConfig({ realmId: v.realmId, configKey: v.configKey, entityId: v.entityId, ssoUrl: v.ssoUrl })} />;
}

export function OidcConfigsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="OIDC configurations" description="OpenID Connect issuer and client metadata. Client secrets are never displayed." records={rows(data.oidcConfigs)} primary={{ key: "configKey", label: "Configuration" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "clientId", label: "Client ID" }]} meta={[{ key: "issuerUrl", label: "Issuer URL" }]} emptyMessage="No OIDC configurations are set up." data={data} fields={[realmField, keyField("configKey", "Configuration key"), keyField("clientId", "Client ID"), keyField("issuerUrl", "Issuer URL")]} onCreate={(v) => data.createOidcConfig({ realmId: v.realmId, configKey: v.configKey, clientId: v.clientId, issuerUrl: v.issuerUrl })} />;
}

export function MfaPolicysPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="MFA policies" description="Multi-factor authentication requirements by realm." records={rows(data.mfaPolicies)} primary={{ key: "name", label: "Policy" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "gracePeriodDays", label: "Grace days" }]} emptyMessage="No MFA policies have been created." data={data} fields={[realmField, keyField("policyKey", "Policy key"), keyField("name", "Policy name"), { name: "gracePeriodDays", label: "Grace period (days)", type: "number" }]} onCreate={(v) => data.createMfaPolicy({ realmId: v.realmId, policyKey: v.policyKey, name: v.name, gracePeriodDays: Number(v.gracePeriodDays || 0) })} />;
}

export function MfaEnrollmentsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="MFA enrollments" description="Enrollment method and status. Enrollment secrets are not shown." records={rows(data.mfaEnrollments)} primary={{ key: "mfaType", label: "MFA method" }} secondary={[{ key: "realmName", label: "Realm" }]} emptyMessage="No MFA enrollment records are available." data={data} />;
}

export function BackupCodesPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Backup codes" description="Backup-code inventory status. Actual recovery codes are intentionally never displayed." records={rows(data.backupCodes)} primary={{ key: "realmName", label: "Realm" }} secondary={[{ key: "status", label: "Status" }]} emptyMessage="No backup-code records are available." data={data} />;
}

export function TrustedDevicesPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Trusted devices" description="Devices recognized by the identity system." records={rows(data.trustedDevices)} primary={{ key: "deviceName", label: "Device" }} secondary={[{ key: "realmName", label: "Realm" }]} emptyMessage="No trusted devices have been registered." data={data} />;
}

export function SessionPolicysPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Session policies" description="Session timeout and lifecycle rules." records={rows(data.sessionPolicies)} primary={{ key: "name", label: "Policy" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "idleTimeoutMinutes", label: "Idle timeout (minutes)" }]} emptyMessage="No session policies have been configured." data={data} fields={[realmField, keyField("policyKey", "Policy key"), keyField("name", "Policy name"), { name: "idleTimeoutMinutes", label: "Idle timeout (minutes)", type: "number" }]} onCreate={(v) => data.createSessionPolicy({ realmId: v.realmId, policyKey: v.policyKey, name: v.name, idleTimeoutMinutes: Number(v.idleTimeoutMinutes || 0) })} />;
}

export function ActiveSessionsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Active sessions" description="Active session device and status overview. Session identifiers and IP addresses are not displayed." records={rows(data.activeSessions)} primary={{ key: "deviceName", label: "Device" }} secondary={[{ key: "realmName", label: "Realm" }]} emptyMessage="No active sessions are currently recorded." data={data} />;
}

export function DeviceRegistrysPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Device registry" description="Registered device inventory." records={rows(data.deviceRegistry)} primary={{ key: "deviceName", label: "Device" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "deviceType", label: "Type" }]} emptyMessage="No devices have been registered." data={data} fields={[realmField, keyField("deviceKey", "Device key"), keyField("deviceName", "Device name"), { name: "deviceType", label: "Device type" }]} onCreate={(v) => data.createDeviceRegistry({ realmId: v.realmId, deviceKey: v.deviceKey, deviceName: v.deviceName, deviceType: v.deviceType })} />;
}

export function ConcurrentLoginPolicysPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Concurrent login policies" description="Limits on simultaneous sessions per identity." records={rows(data.concurrentLoginPolicies)} primary={{ key: "policyKey", label: "Policy" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "maxConcurrentSessions", label: "Maximum sessions" }]} emptyMessage="No concurrent-login policies have been configured." data={data} fields={[realmField, keyField("policyKey", "Policy key"), { name: "maxConcurrentSessions", label: "Maximum concurrent sessions", type: "number", required: true }]} onCreate={(v) => data.createConcurrentLoginPolicy({ realmId: v.realmId, policyKey: v.policyKey, maxConcurrentSessions: Number(v.maxConcurrentSessions || 1) })} />;
}

export function RbacRolesPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="RBAC roles" description="Role definitions for role-based access control." records={rows(data.rbacRoles)} primary={{ key: "roleName", label: "Role" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "roleKey", label: "Key" }]} emptyMessage="No RBAC roles have been created." data={data} fields={[realmField, keyField("roleKey", "Role key"), keyField("roleName", "Role name")]} onCreate={(v) => data.createRbacRole({ realmId: v.realmId, roleKey: v.roleKey, roleName: v.roleName })} />;
}

export function PermissionGroupsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Permission groups" description="Reusable groups of access permissions." records={rows(data.permissionGroups)} primary={{ key: "groupName", label: "Group" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "groupKey", label: "Key" }]} emptyMessage="No permission groups have been created." data={data} fields={[realmField, keyField("groupKey", "Group key"), keyField("groupName", "Group name")]} onCreate={(v) => data.createPermissionGroup({ realmId: v.realmId, groupKey: v.groupKey, groupName: v.groupName })} />;
}

export function AbacPolicysPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="ABAC policies" description="Attribute-based access control policy definitions." records={rows(data.abacPolicies)} primary={{ key: "name", label: "Policy" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "effect", label: "Effect" }]} emptyMessage="No ABAC policies have been created." data={data} fields={[realmField, keyField("policyKey", "Policy key"), keyField("name", "Policy name"), { name: "effect", label: "Effect", type: "select", options: [{ value: "allow", label: "Allow" }, { value: "deny", label: "Deny" }] }]} onCreate={(v) => data.createAbacPolicy({ realmId: v.realmId, policyKey: v.policyKey, name: v.name, effect: v.effect })} />;
}

export function TemporaryAccessGrantsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Temporary access grants" description="Time-limited access grants. Internal grant identifiers are not displayed." records={rows(data.temporaryAccessGrants)} primary={{ key: "expiresAt", label: "Expires" }} secondary={[{ key: "realmName", label: "Realm" }]} emptyMessage="No temporary access grants are active." data={data} fields={[realmField, keyField("grantKey", "Grant label"), { name: "userId", label: "User ID", required: true }, { name: "expiresAt", label: "Expiry", type: "date", required: true }]} onCreate={(v) => data.createTemporaryAccessGrant({ realmId: v.realmId, grantKey: v.grantKey, userId: v.userId, expiresAt: v.expiresAt })} />;
}

export function DepartmentsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Departments" description="Organizational departments within the selected realm." records={rows(data.departments)} primary={{ key: "name", label: "Department" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "departmentKey", label: "Key" }]} emptyMessage="No departments have been added." data={data} fields={[realmField, keyField("departmentKey", "Department key"), keyField("name", "Department name")]} onCreate={(v) => data.createDepartment({ realmId: v.realmId, departmentKey: v.departmentKey, name: v.name })} />;
}

export function TeamsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Teams" description="Teams and their identity realm associations." records={rows(data.teams)} primary={{ key: "name", label: "Team" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "teamKey", label: "Key" }]} emptyMessage="No teams have been created." data={data} fields={[realmField, keyField("teamKey", "Team key"), keyField("name", "Team name")]} onCreate={(v) => data.createTeam({ realmId: v.realmId, teamKey: v.teamKey, name: v.name })} />;
}

export function BusinessUnitsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Business units" description="Business-unit structure and codes." records={rows(data.businessUnits)} primary={{ key: "name", label: "Business unit" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "code", label: "Code" }]} emptyMessage="No business units have been created." data={data} fields={[realmField, keyField("unitKey", "Unit key"), keyField("name", "Unit name"), { name: "code", label: "Unit code" }]} onCreate={(v) => data.createBusinessUnit({ realmId: v.realmId, unitKey: v.unitKey, name: v.name, code: v.code })} />;
}

export function ReportingStructuresPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Reporting structures" description="Reporting relationship records. User identifiers are not exposed in this summary." records={rows(data.reportingStructures)} primary={{ key: "structureKey", label: "Structure" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "effectiveFrom", label: "Effective from" }]} emptyMessage="No reporting structures have been configured." data={data} fields={[realmField, keyField("structureKey", "Structure key"), { name: "employeeUserId", label: "Employee user ID", required: true }, { name: "managerUserId", label: "Manager user ID", required: true }]} onCreate={(v) => data.createReportingStructure({ realmId: v.realmId, structureKey: v.structureKey, employeeUserId: v.employeeUserId, managerUserId: v.managerUserId })} />;
}

export function InvitationsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Invitations" description="Invitation status and assigned role. Email addresses are partially masked." records={rows(data.invitations)} primary={{ key: "email", label: "Invitee" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "roleName", label: "Role" }]} emptyMessage="No invitations have been issued." data={data} fields={[realmField, keyField("invitationKey", "Invitation reference"), { name: "email", label: "Email", type: "email", required: true }, { name: "roleName", label: "Role name" }, { name: "expiresAt", label: "Expiry", type: "date" }]} onCreate={(v) => data.createInvitation({ realmId: v.realmId, invitationKey: v.invitationKey, email: v.email, roleName: v.roleName, expiresAt: v.expiresAt })} />;
}

export function BulkInviteBatchsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Bulk invite batches" description="Bulk invitation batch progress and delivery counts." records={rows(data.bulkInviteBatches)} primary={{ key: "name", label: "Batch" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "totalCount", label: "Total" }, { key: "sentCount", label: "Sent" }]} emptyMessage="No bulk invitation batches have been created." data={data} fields={[realmField, keyField("batchKey", "Batch key"), keyField("name", "Batch name"), { name: "totalCount", label: "Total invitations", type: "number", required: true }]} onCreate={(v) => data.createBulkInviteBatch({ realmId: v.realmId, batchKey: v.batchKey, name: v.name, totalCount: Number(v.totalCount || 0) })} />;
}

export function InvitationRolesPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Invitation roles" description="Role assignments associated with invitations." records={rows(data.invitationRoles)} primary={{ key: "roleAssignmentKey", label: "Role assignment" }} secondary={[{ key: "realmName", label: "Realm" }]} emptyMessage="No invitation role assignments are available." data={data} />;
}

export function InvitationAuditsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Invitation audit" description="Invitation audit events and their outcomes." records={rows(data.invitationAudit)} primary={{ key: "action", label: "Action" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "auditKey", label: "Event" }]} emptyMessage="No invitation audit events are available." data={data} />;
}

export function LoginHistorysPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Login history" description="Authentication method and outcome history. IP addresses and raw identifiers are not displayed." records={rows(data.loginHistory)} primary={{ key: "loginMethod", label: "Login method" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "success", label: "Successful" }]} meta={[{ key: "loggedAt", label: "Logged at" }]} emptyMessage="No login history records are available." data={data} />;
}

export function SecurityAlertsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Security alerts" description="Security events requiring review." records={rows(data.securityAlerts)} primary={{ key: "title", label: "Alert" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "alertType", label: "Type" }]} meta={[{ key: "severity", label: "Severity" }]} emptyMessage="No security alerts are currently recorded." data={data} />;
}

export function RiskEventsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Risk events" description="Risk-scored identity events and resulting actions." records={rows(data.riskEvents)} primary={{ key: "riskScore", label: "Risk score" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "actionTaken", label: "Action taken" }]} emptyMessage="No risk events are currently recorded." data={data} />;
}

export function PasswordPolicysPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Password policies" description="Password strength and lifecycle requirements." records={rows(data.passwordPolicies)} primary={{ key: "name", label: "Policy" }} secondary={[{ key: "realmName", label: "Realm" }, { key: "minLength", label: "Minimum length" }]} emptyMessage="No password policies have been configured." data={data} fields={[realmField, keyField("policyKey", "Policy key"), keyField("name", "Policy name"), { name: "minLength", label: "Minimum password length", type: "number", required: true }]} onCreate={(v) => data.createPasswordPolicy({ realmId: v.realmId, policyKey: v.policyKey, name: v.name, minLength: Number(v.minLength || 8) })} />;
}

export function AdminMetricsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Admin metrics" description="Periodic identity operations and security metrics." records={rows(data.adminMetrics)} primary={{ key: "metricsKey", label: "Metrics snapshot" }} secondary={[{ key: "metricDate", label: "Date" }, { key: "totalUsers", label: "Users" }, { key: "activeSessions", label: "Active sessions" }]} meta={[{ key: "mfaAdoptionPercent", label: "MFA adoption %" }, { key: "failedLogins24h", label: "Failed logins (24h)" }]} emptyMessage="No admin metrics have been captured." data={data} />;
}

export function IdentityHealthsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Identity health" description="Identity platform health scores and status." records={rows(data.identityHealth)} primary={{ key: "healthKey", label: "Health check" }} secondary={[{ key: "overallScore", label: "Overall score" }]} emptyMessage="No identity health snapshots are available." data={data} />;
}

export function CompromisedAccountsPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Compromised accounts" description="Account remediation status. Account identifiers are intentionally hidden." records={rows(data.compromisedAccounts)} primary={{ key: "remediationStatus", label: "Remediation" }} secondary={[{ key: "realmName", label: "Realm" }]} emptyMessage="No compromised accounts are currently recorded." data={data} />;
}

export function IdpAuditPanel({ data }: { data: EnterpriseIdentityData }) {
    return <IdentityRecordPanel title="Identity audit" description="Tenant-scoped audit history. Only action summaries are shown; raw metadata is not exposed." records={rows(data.auditLogs)} primary={{ key: "summary", label: "Event" }} secondary={[{ key: "entityType", label: "Entity" }, { key: "action", label: "Action" }]} meta={[{ key: "securityLevel", label: "Security level" }, { key: "createdAt", label: "Created" }]} emptyMessage="No identity audit events are available." data={data} />;
}

export function EnterpriseIdentitySdkPanel({ data }: { data: EnterpriseIdentityData }) {
    return (
        <Card hover>
            <SectionHeader title="Identity SDK" description="Available identity operations exposed by the platform service." />
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[
                    ["Realms", data.realms.length, "Create and manage identity realms"],
                    ["Providers", data.providers.length, "Configure authentication providers"],
                    ["MFA", data.mfaPolicies.length + data.mfaEnrollments.length, "Manage policies and enrollment records"],
                    ["Access control", data.rbacRoles.length + data.permissionGroups.length + data.abacPolicies.length, "Roles, permission groups, and ABAC policies"],
                    ["Organization", data.departments.length + data.teams.length + data.businessUnits.length, "Departments, teams, and business units"],
                    ["Security", data.securityAlerts.length + data.riskEvents.length + data.compromisedAccounts.length, "Alerts, risk events, and remediation"],
                ].map(([label, count, detail]) => <div key={String(label)} className="rounded-xl border border-[var(--dos-border)] p-4"><p className="font-semibold">{label}</p><p className="mt-1 text-2xl font-bold">{count}</p><p className="mt-1 text-xs text-[var(--dos-text-secondary)]">{detail}</p></div>)}
            </div>
            <p className="mt-4 text-xs text-[var(--dos-text-tertiary)]">No API secrets or raw session credentials are displayed in this workspace.</p>
        </Card>
    );
}
