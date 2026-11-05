"use client";

import { useEffect, useState } from "react";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { THEME_OPTIONS } from "@/src/modules/settings/constants";
import type { useSettings } from "@/src/modules/settings/hooks/useSettings";

type SettingsData = ReturnType<typeof useSettings>;
type SettingsValues = Record<string, string | boolean>;
type SettingsField = {
    name: string;
    label: string;
    type?: "text" | "email" | "url" | "number" | "textarea" | "checkbox" | "select";
    required?: boolean;
    options?: Array<{ value: string; label: string }>;
    help?: string;
};

const inputClass = "w-full rounded-xl border border-[var(--dos-border)] bg-[var(--dos-surface-elevated)] px-3 py-2.5 text-sm text-[var(--dos-text-primary)] outline-none focus:border-[var(--dos-brand-primary)] focus:ring-2 focus:ring-[var(--dos-brand-primary)]/15";

function SettingsForm({
    title,
    description,
    fields,
    initialValues,
    onSave,
}: {
    title: string;
    description: string;
    fields: SettingsField[];
    initialValues: SettingsValues;
    onSave: (values: SettingsValues) => Promise<void>;
}) {
    const initialKey = JSON.stringify(initialValues);
    const [values, setValues] = useState<SettingsValues>(initialValues);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setValues(JSON.parse(initialKey) as SettingsValues);
    }, [initialKey]);

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await onSave(values);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : "Could not save settings. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card hover>
            <SectionHeader title={title} description={description} />
            <form onSubmit={submit} className="mt-5 space-y-4">
                {fields.map((field) => (
                    <label key={field.name} className="block text-sm font-medium text-[var(--dos-text-primary)]">
                        {field.type === "checkbox" ? (
                            <span className="flex items-center gap-3">
                                <input type="checkbox" checked={Boolean(values[field.name])} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.checked }))} className="h-4 w-4 rounded border-[var(--dos-border)]" />
                                {field.label}
                            </span>
                        ) : (
                            <>
                                <span className="mb-1.5 block">{field.label}</span>
                                {field.type === "textarea" ? (
                                    <textarea required={field.required} rows={3} value={String(values[field.name] ?? "")} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} className={inputClass} />
                                ) : field.type === "select" ? (
                                    <select required={field.required} value={String(values[field.name] ?? "")} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} className={inputClass}>
                                        {(field.options ?? []).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                    </select>
                                ) : (
                                    <input type={field.type ?? "text"} required={field.required} min={field.type === "number" ? 0 : undefined} value={String(values[field.name] ?? "")} onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))} className={inputClass} />
                                )}
                                {field.help && <span className="mt-1 block text-xs font-normal text-[var(--dos-text-tertiary)]">{field.help}</span>}
                            </>
                        )}
                    </label>
                ))}
                {error && <p role="alert" className="text-sm text-[var(--dos-error)]">{error}</p>}
                <button type="submit" disabled={saving} className="rounded-xl bg-[var(--dos-text-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--dos-surface)] disabled:opacity-60">
                    {saving ? "Saving…" : "Save changes"}
                </button>
            </form>
        </Card>
    );
}

function InfoList({ title, description, items, emptyMessage }: { title: string; description: string; items: Array<{ id: string; title: string; detail: string; meta?: string }>; emptyMessage: string }) {
    return (
        <Card hover>
            <SectionHeader title={title} description={description} />
            <div className="mt-5 space-y-3">
                {items.length === 0 ? <EmptyState title="No records" description={emptyMessage} /> : items.map((item) => (
                    <div key={item.id} className="rounded-xl border border-[var(--dos-border)] p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <p className="font-semibold text-[var(--dos-text-primary)]">{item.title}</p>
                            {item.meta && <span className="text-xs text-[var(--dos-text-tertiary)]">{item.meta}</span>}
                        </div>
                        <p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{item.detail}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
}

const value = (input: string | number | boolean | null | undefined) => input === null || input === undefined ? "" : String(input);

export function SettingsOverviewPanel({ data }: { data: SettingsData }) {
    const stats = data.stats;
    const cards = [
        ["Teams", stats?.teamCount ?? "0"],
        ["Members", stats?.memberCount ?? "0"],
        ["Pending invitations", stats?.pendingInvitations ?? "0"],
        ["Active API keys", stats?.activeApiKeys ?? "0"],
        ["Backup configurations", stats?.backupConfigs ?? "0"],
        ["Roles", stats?.roleCount ?? "0"],
    ];
    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map(([label, count]) => <Card key={label} hover><p className="text-xs uppercase tracking-wide text-[var(--dos-text-tertiary)]">{label}</p><p className="mt-2 text-3xl font-bold text-[var(--dos-text-primary)]">{count}</p></Card>)}
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
                <InfoList title="Organization profile" description="Current workspace configuration" items={data.organizationSettings ? [{ id: data.organizationSettings.id, title: data.organizationSettings.contactEmail || "Organization settings", detail: `${data.organizationSettings.timezone} · ${data.organizationSettings.currency} · Fiscal year starts ${data.organizationSettings.fiscalYearStart}`, meta: data.organizationSettings.updatedAt }] : []} emptyMessage="Organization settings have not been configured." />
                <InfoList title="Security posture" description="Current organization security policy" items={data.securityPolicy ? [{ id: "security", title: data.securityPolicy.mfaRequired ? "MFA required" : "MFA optional", detail: `Session timeout ${data.securityPolicy.sessionTimeoutMinutes} minutes · Minimum password length ${data.securityPolicy.passwordMinLength} · ${data.securityPolicy.loginAttemptLimit} login attempts`, meta: data.securityPolicy.updatedAt }] : []} emptyMessage="No security policy is configured." />
            </div>
        </div>
    );
}

export function OrganizationSettingsPanel({ data }: { data: SettingsData }) {
    const settings = data.organizationSettings;
    return <SettingsForm title="Organization settings" description="Workspace timezone, currency, fiscal year, and contact details." initialValues={{ timezone: settings?.timezone ?? "Asia/Kolkata", currency: settings?.currency ?? "INR", fiscalYearStart: settings?.fiscalYearStart ?? "04-01", contactEmail: settings?.contactEmail ?? "", billingAddress: settings?.billingAddress ?? "", supportPhone: settings?.supportPhone ?? "" }} fields={[{ name: "timezone", label: "Timezone", required: true }, { name: "currency", label: "Organization currency", required: true, help: "Use the currency your organization records its financial data in." }, { name: "fiscalYearStart", label: "Fiscal year start (MM-DD)", required: true }, { name: "contactEmail", label: "Contact email", type: "email" }, { name: "billingAddress", label: "Billing address", type: "textarea" }, { name: "supportPhone", label: "Support phone" }]} onSave={(v) => data.updateOrganizationSettings({ timezone: String(v.timezone), currency: String(v.currency).toUpperCase(), fiscalYearStart: String(v.fiscalYearStart), contactEmail: String(v.contactEmail), billingAddress: String(v.billingAddress), supportPhone: String(v.supportPhone) })} />;
}

export function TeamManagementPanel({ data }: { data: SettingsData }) {
    const [teamError, setTeamError] = useState<string | null>(null);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [savingTeam, setSavingTeam] = useState(false);
    const [savingInvite, setSavingInvite] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [teamSlug, setTeamSlug] = useState("");
    const [teamDescription, setTeamDescription] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("member");

    const createTeam = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); setSavingTeam(true); setTeamError(null);
        try { await data.createTeam({ name: teamName, slug: teamSlug, description: teamDescription }); setTeamName(""); setTeamSlug(""); setTeamDescription(""); }
        catch (cause) { setTeamError(cause instanceof Error ? cause.message : "Could not create team."); }
        finally { setSavingTeam(false); }
    };
    const inviteMember = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); setSavingInvite(true); setInviteError(null);
        try { await data.createInvitation({ email: inviteEmail, roleName: inviteRole }); setInviteEmail(""); }
        catch (cause) { setInviteError(cause instanceof Error ? cause.message : "Could not create invitation."); }
        finally { setSavingInvite(false); }
    };

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <div className="space-y-6">
                <InfoList title="Teams" description="Organization teams and membership counts." items={data.teams.map((team) => ({ id: team.id, title: team.name, detail: team.description || team.slug, meta: `${team.memberCount} members` }))} emptyMessage="Create the first team for this organization." />
                <InfoList title="Team members" description="Active organization membership." items={data.members.map((member) => ({ id: member.id, title: member.fullName || member.email, detail: member.email, meta: `${member.roleName} · ${member.isActive ? "Active" : "Inactive"}` }))} emptyMessage="No team members were returned for this organization." />
                <InfoList title="Invitations" description="Invitations and their current status." items={data.invitations.map((invite) => ({ id: invite.id, title: invite.email, detail: `Role: ${invite.roleName}`, meta: `${invite.status} · Expires ${invite.expiresAt}` }))} emptyMessage="No invitations have been sent." />
            </div>
            <div className="space-y-6">
                <Card hover>
                    <SectionHeader title="Create team" description="Add a team to your organization." />
                    <form onSubmit={createTeam} className="mt-5 space-y-3">
                        <input required minLength={2} value={teamName} onChange={(event) => { setTeamName(event.target.value); setTeamSlug(event.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }} placeholder="Team name" className={inputClass} />
                        <input required minLength={2} value={teamSlug} onChange={(event) => setTeamSlug(event.target.value)} placeholder="team-slug" className={inputClass} />
                        <textarea value={teamDescription} onChange={(event) => setTeamDescription(event.target.value)} placeholder="Description (optional)" rows={3} className={inputClass} />
                        {teamError && <p role="alert" className="text-sm text-[var(--dos-error)]">{teamError}</p>}
                        <button type="submit" disabled={savingTeam} className="rounded-xl bg-[var(--dos-text-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--dos-surface)] disabled:opacity-60">{savingTeam ? "Creating…" : "Create team"}</button>
                    </form>
                </Card>
                <Card hover>
                    <SectionHeader title="Invite member" description="Send an organization invitation. Role escalation is checked by the server." />
                    <form onSubmit={inviteMember} className="mt-5 space-y-3">
                        <input required type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="name@example.com" className={inputClass} />
                        <select value={inviteRole} onChange={(event) => setInviteRole(event.target.value)} className={inputClass}>
                            <option value="member">Member</option><option value="viewer">Viewer</option><option value="manager">Manager</option>
                        </select>
                        {inviteError && <p role="alert" className="text-sm text-[var(--dos-error)]">{inviteError}</p>}
                        <button type="submit" disabled={savingInvite} className="rounded-xl bg-[var(--dos-text-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--dos-surface)] disabled:opacity-60">{savingInvite ? "Sending…" : "Create invitation"}</button>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export function RolesPermissionsPanel({ data }: { data: SettingsData }) {
    return <InfoList title="Roles and permissions" description="Available organization roles and their assigned permission scopes." items={data.roles.map((role) => ({ id: role.id, title: role.name, detail: role.description || (role.isSystem ? "System role" : "Custom role"), meta: role.permissions.length ? role.permissions.join(" · ") : "No permissions listed" }))} emptyMessage="No roles were returned for this organization." />;
}

export function BrandingPanel({ data }: { data: SettingsData }) {
    const branding = data.branding;
    return <SettingsForm title="Branding" description="Organization logo, favicon, brand colors, domain, and email header." initialValues={{ logoUrl: branding?.logoUrl ?? "", faviconUrl: branding?.faviconUrl ?? "", primaryColor: branding?.primaryColor ?? "#2563EB", secondaryColor: branding?.secondaryColor ?? "#8B5CF6", accentColor: branding?.accentColor ?? "#06B6D4", customDomain: branding?.customDomain ?? "", emailHeaderHtml: branding?.emailHeaderHtml ?? "" }} fields={[{ name: "logoUrl", label: "Logo URL", type: "url" }, { name: "faviconUrl", label: "Favicon URL", type: "url" }, { name: "primaryColor", label: "Primary color", required: true }, { name: "secondaryColor", label: "Secondary color", required: true }, { name: "accentColor", label: "Accent color", required: true }, { name: "customDomain", label: "Custom domain" }, { name: "emailHeaderHtml", label: "Email header HTML", type: "textarea", help: "Stored as email template content; it is not rendered in this settings page." }]} onSave={(v) => data.updateBranding({ logoUrl: String(v.logoUrl), faviconUrl: String(v.faviconUrl), primaryColor: String(v.primaryColor), secondaryColor: String(v.secondaryColor), accentColor: String(v.accentColor), customDomain: String(v.customDomain), emailHeaderHtml: String(v.emailHeaderHtml) })} />;
}

export function PreferencesPanel({ data }: { data: SettingsData }) {
    const org = data.preferences;
    const personal = data.userPreferences;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <SettingsForm title="Organization preferences" description="Default locale, timezone, week start, and date/time formats." initialValues={{ defaultLocale: org?.defaultLocale ?? "en-IN", defaultTimezone: org?.defaultTimezone ?? "Asia/Kolkata", weekStartsOn: org?.weekStartsOn ?? "monday", dateFormat: org?.dateFormat ?? "DD/MM/YYYY", timeFormat: org?.timeFormat ?? "24h" }} fields={[{ name: "defaultLocale", label: "Default locale" }, { name: "defaultTimezone", label: "Default timezone" }, { name: "weekStartsOn", label: "Week starts on", type: "select", options: [{ value: "monday", label: "Monday" }, { value: "sunday", label: "Sunday" }] }, { name: "dateFormat", label: "Date format" }, { name: "timeFormat", label: "Time format", type: "select", options: [{ value: "24h", label: "24-hour" }, { value: "12h", label: "12-hour" }] }]} onSave={(v) => data.updatePreferences({ defaultLocale: String(v.defaultLocale), defaultTimezone: String(v.defaultTimezone), weekStartsOn: String(v.weekStartsOn), dateFormat: String(v.dateFormat), timeFormat: String(v.timeFormat) })} />
            <SettingsForm title="My preferences" description="Personal appearance and notification digest settings." initialValues={{ theme: personal?.theme ?? "system", locale: personal?.locale ?? "en-IN", timezone: personal?.timezone ?? "Asia/Kolkata", dateFormat: personal?.dateFormat ?? "DD/MM/YYYY", digestFrequency: personal?.digestFrequency ?? "weekly" }} fields={[{ name: "theme", label: "Theme", type: "select", options: THEME_OPTIONS.map((option) => ({ value: option.value, label: option.label })) }, { name: "locale", label: "Locale" }, { name: "timezone", label: "Timezone" }, { name: "dateFormat", label: "Date format" }, { name: "digestFrequency", label: "Email digest", type: "select", options: [{ value: "never", label: "Never" }, { value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" }] }]} onSave={(v) => data.updateUserPreferences({ theme: String(v.theme), locale: String(v.locale), timezone: String(v.timezone), dateFormat: String(v.dateFormat), digestFrequency: String(v.digestFrequency) })} />
        </div>
    );
}

export function SecurityPanel({ data }: { data: SettingsData }) {
    const policy = data.securityPolicy;
    return (
        <div className="space-y-4">
            <Card hover>
                <SectionHeader title="Organization security policy" description="Current policy values. Changes are intentionally not exposed here until server-side role authorization is verified." />
                {policy ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{[
                    ["MFA required", policy.mfaRequired ? "Yes" : "No"],
                    ["Session timeout", `${policy.sessionTimeoutMinutes} minutes`],
                    ["Minimum password length", String(policy.passwordMinLength)],
                    ["Login attempt limit", String(policy.loginAttemptLimit)],
                    ["IP allowlist", policy.ipAllowlist.length ? policy.ipAllowlist.join(", ") : "Not configured"],
                    ["Last updated", policy.updatedAt],
                ].map(([label, detail]) => <div key={label} className="rounded-xl border border-[var(--dos-border)] p-4"><p className="text-xs text-[var(--dos-text-tertiary)]">{label}</p><p className="mt-1 font-semibold">{detail}</p></div>)}</div> : <EmptyState title="No security policy" description="No organization security policy has been configured." />}
            </Card>
        </div>
    );
}

export function AuditPanel({ data }: { data: SettingsData }) {
    const audit = data.auditConfig;
    return <SettingsForm title="Audit configuration" description="Configure audit retention, recorded event types, export format, and alert threshold." initialValues={{ retentionDays: value(audit?.retentionDays ?? 365), enabledEvents: audit?.enabledEvents.join(", ") ?? "", exportFormat: audit?.exportFormat ?? "json", alertThreshold: value(audit?.alertThreshold ?? 10) }} fields={[{ name: "retentionDays", label: "Retention (days)", type: "number", required: true }, { name: "enabledEvents", label: "Enabled events (comma separated)", type: "textarea", help: "Use event keys already supported by your application." }, { name: "exportFormat", label: "Export format", type: "select", options: [{ value: "json", label: "JSON" }, { value: "csv", label: "CSV" }] }, { name: "alertThreshold", label: "Alert threshold", type: "number", required: true }]} onSave={(v) => data.updateAuditConfig({ retentionDays: Number(v.retentionDays), enabledEvents: String(v.enabledEvents).split(",").map((item) => item.trim()).filter(Boolean), exportFormat: String(v.exportFormat), alertThreshold: Number(v.alertThreshold) })} />;
}

export function IntegrationsPanel({ data }: { data: SettingsData }) {
    const [revoking, setRevoking] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const revoke = async (id: string) => {
        setRevoking(id); setError(null);
        try { await data.revokeApiKey(id); }
        catch (cause) { setError(cause instanceof Error ? cause.message : "Could not revoke API key."); }
        finally { setRevoking(null); }
    };
    return (
        <Card hover>
            <SectionHeader title="API integrations" description="Organization API keys and their status. Only safe key prefixes are displayed." />
            {error && <p role="alert" className="mt-3 text-sm text-[var(--dos-error)]">{error}</p>}
            <div className="mt-5 space-y-3">
                {data.apiKeys.length === 0 ? <EmptyState title="No API keys" description="No API keys are currently registered for this organization." /> : data.apiKeys.map((key) => (
                    <div key={key.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--dos-border)] p-4">
                        <div className="min-w-0"><p className="font-semibold">{key.name}</p><p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">{key.keyPrefix}•••• · {key.scopes.join(", ") || "No scopes"}</p><p className="mt-1 text-xs capitalize text-[var(--dos-text-secondary)]">{key.status}{key.expiresAt ? ` · Expires ${key.expiresAt}` : ""}{key.lastUsedAt ? ` · Last used ${key.lastUsedAt}` : ""}</p></div>
                        {key.status === "active" && <button type="button" onClick={() => void revoke(key.id)} disabled={revoking === key.id} className="rounded-lg border border-[var(--dos-tint-critical)]/40 px-3 py-2 text-xs font-semibold text-[var(--dos-tint-critical)] disabled:opacity-50">{revoking === key.id ? "Revoking…" : "Revoke key"}</button>}
                    </div>
                ))}
            </div>
            <p className="mt-4 text-xs text-[var(--dos-text-tertiary)]">For security, raw API key secrets are never shown in this list. Create-key flow is not exposed here because the current service only returns the stored key prefix.</p>
        </Card>
    );
}

export function NotificationsPanel({ data }: { data: SettingsData }) {
    const [savingId, setSavingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const update = async (id: string, enabled: boolean) => {
        setSavingId(id); setError(null);
        try { await data.updateNotificationPreference(id, { enabled }); }
        catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update notification preference."); }
        finally { setSavingId(null); }
    };
    return (
        <Card hover>
            <SectionHeader title="Notification preferences" description="Enable or disable organization notification channels by event." />
            {error && <p role="alert" className="mt-3 text-sm text-[var(--dos-error)]">{error}</p>}
            <div className="mt-5 space-y-2">
                {data.notificationPreferences.length === 0 ? <EmptyState title="No notification preferences" description="No notification preference records are configured." /> : data.notificationPreferences.map((item) => (
                    <label key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--dos-border)] p-4">
                        <span><span className="block font-semibold">{item.eventType}</span><span className="text-xs text-[var(--dos-text-tertiary)]">{item.channel.replace("_", " ")} · {item.isOrgWide ? "Organization-wide" : "Personal"}</span></span>
                        <span className="flex items-center gap-2 text-sm"><input type="checkbox" checked={item.enabled} disabled={savingId === item.id} onChange={(event) => void update(item.id, event.target.checked)} />{savingId === item.id ? "Saving…" : item.enabled ? "Enabled" : "Disabled"}</span>
                    </label>
                ))}
            </div>
        </Card>
    );
}

export function BackupPanel({ data }: { data: SettingsData }) {
    const [runningId, setRunningId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const run = async (id: string) => {
        setRunningId(id); setError(null);
        try { await data.runBackup(id); }
        catch (cause) { setError(cause instanceof Error ? cause.message : "Could not start backup."); }
        finally { setRunningId(null); }
    };
    return (
        <div className="space-y-4">
            {error && <p role="alert" className="text-sm text-[var(--dos-error)]">{error}</p>}
            {data.backupConfigs.length === 0 ? <Card><EmptyState title="No backup configurations" description="No backup destinations or schedules have been configured." /></Card> : data.backupConfigs.map((config) => (
                <Card key={config.id} hover>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div><h3 className="font-semibold">{config.name}</h3><p className="mt-1 text-sm text-[var(--dos-text-secondary)]">{config.destination} · {config.scheduleCron}</p><p className="mt-1 text-xs text-[var(--dos-text-tertiary)]">Retain {config.retentionCount} backups · {config.includeTables.length} tables · {config.isEnabled ? "Enabled" : "Disabled"}</p></div>
                        <button type="button" onClick={() => void run(config.id)} disabled={!config.isEnabled || runningId === config.id} className="rounded-xl bg-[var(--dos-text-primary)] px-4 py-2 text-sm font-semibold text-[var(--dos-surface)] disabled:opacity-50">{runningId === config.id ? "Starting…" : "Run backup"}</button>
                    </div>
                    <div className="mt-4 space-y-2">
                        {config.runs.slice(0, 5).map((backup) => <div key={backup.id} className="flex flex-wrap justify-between gap-2 border-t border-[var(--dos-border-subtle)] pt-2 text-xs"><span className="capitalize">{backup.status} · {backup.startedAt}</span><span className="text-[var(--dos-text-tertiary)]">{backup.errorMessage || (backup.sizeBytes ? `${(backup.sizeBytes / 1024 / 1024).toFixed(1)} MB` : "—")}</span></div>)}
                    </div>
                </Card>
            ))}
        </div>
    );
}
