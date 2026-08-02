"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/Card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { API_KEY_ENV_OPTIONS, ROLE_OPTIONS, THEME_OPTIONS } from "@/src/modules/settings/constants";
import {
    apiKeyFormSchema,
    auditConfigSchema,
    brandingSettingsSchema,
    invitationFormSchema,
    organizationSettingsSchema,
    preferencesSchema,
    securityPolicySchema,
    teamFormSchema,
    userPreferencesSchema,
    type ApiKeyFormValues,
    type AuditConfigFormValues,
    type BrandingSettingsFormValues,
    type InvitationFormValues,
    type OrganizationSettingsFormValues,
    type PreferencesFormValues,
    type SecurityPolicyFormValues,
    type TeamFormValues,
    type UserPreferencesFormValues,
} from "@/src/modules/settings/schemas";
import type { useSettings } from "@/src/modules/settings/hooks/useSettings";

type SettingsData = ReturnType<typeof useSettings>;

const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";

function SaveButton({ loading }: { loading?: boolean }) {
    return (
        <button type="submit" disabled={loading} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-60">
            {loading ? "Saving..." : "Save changes"}
        </button>
    );
}

export function OrganizationSettingsPanel({ data }: { data: SettingsData }) {
    const defaults: OrganizationSettingsFormValues = {
        timezone: data.organizationSettings?.timezone ?? "UTC",
        currency: data.organizationSettings?.currency ?? "USD",
        fiscalYearStart: data.organizationSettings?.fiscalYearStart ?? "01-01",
        contactEmail: data.organizationSettings?.contactEmail ?? "",
        billingAddress: data.organizationSettings?.billingAddress ?? "",
        supportPhone: data.organizationSettings?.supportPhone ?? "",
    };
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OrganizationSettingsFormValues>({ resolver: zodResolver(organizationSettingsSchema), defaultValues: defaults });

    return (
        <Card hover>
            <SectionHeader title="Organization settings" description="General organization configuration and contact details" />
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(async (values) => data.updateOrganizationSettings(values))}>
                <label className="space-y-2"><span className="text-sm font-medium">Timezone</span><input {...register("timezone")} className={inputClass} />{errors.timezone ? <span className="text-sm text-red-500">{errors.timezone.message}</span> : null}</label>
                <label className="space-y-2"><span className="text-sm font-medium">Currency</span><input {...register("currency")} className={inputClass} />{errors.currency ? <span className="text-sm text-red-500">{errors.currency.message}</span> : null}</label>
                <label className="space-y-2"><span className="text-sm font-medium">Fiscal year start</span><input {...register("fiscalYearStart")} className={inputClass} /></label>
                <label className="space-y-2"><span className="text-sm font-medium">Contact email</span><input {...register("contactEmail")} className={inputClass} /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-sm font-medium">Billing address</span><input {...register("billingAddress")} className={inputClass} /></label>
                <label className="space-y-2"><span className="text-sm font-medium">Support phone</span><input {...register("supportPhone")} className={inputClass} /></label>
                <div className="md:col-span-2"><SaveButton loading={isSubmitting} /></div>
            </form>
        </Card>
    );
}

export function TeamManagementPanel({ data }: { data: SettingsData }) {
    const teamForm = useForm<TeamFormValues>({ resolver: zodResolver(teamFormSchema), defaultValues: { name: "", slug: "", description: "" } });
    const inviteForm = useForm<InvitationFormValues>({ resolver: zodResolver(invitationFormSchema), defaultValues: { email: "", roleName: "member" } });

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Teams" description="Organization teams and delivery groups" />
                <div className="mt-6 space-y-3">
                    {data.teams.length === 0 ? <EmptyState title="No teams" description="Create a team to organize members." /> : data.teams.map((team) => (
                        <div key={team.id} className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{team.name}</p><p className="text-sm text-slate-500">{team.description} • {team.memberCount} members</p></div>
                    ))}
                </div>
                <form className="mt-6 space-y-3" onSubmit={teamForm.handleSubmit(async (values) => { await data.createTeam(values); teamForm.reset(); })}>
                    <input {...teamForm.register("name")} placeholder="Team name" className={inputClass} />
                    <input {...teamForm.register("slug")} placeholder="team-slug" className={inputClass} />
                    <input {...teamForm.register("description")} placeholder="Description" className={inputClass} />
                    <SaveButton loading={teamForm.formState.isSubmitting} />
                </form>
            </Card>
            <Card hover>
                <SectionHeader title="Members & invitations" description="Active members and pending invitations" />
                <div className="mt-6 space-y-3">
                    {data.members.map((member) => (
                        <div key={member.id} className="flex justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><div><p className="font-medium">{member.fullName}</p><p className="text-sm text-slate-500">{member.email}</p></div><span className="text-sm capitalize">{member.roleName}</span></div>
                    ))}
                    {data.invitations.map((invite) => (
                        <div key={invite.id} className="flex justify-between rounded-2xl border border-dashed border-slate-200 px-4 py-3 dark:border-slate-800"><div><p className="font-medium">{invite.email}</p><p className="text-sm capitalize text-slate-500">{invite.status}</p></div><span className="text-sm">{invite.roleName}</span></div>
                    ))}
                </div>
                <form className="mt-6 space-y-3" onSubmit={inviteForm.handleSubmit(async (values) => { await data.createInvitation(values); inviteForm.reset({ email: "", roleName: "member" }); })}>
                    <input {...inviteForm.register("email")} placeholder="Invite email" className={inputClass} />
                    <select {...inviteForm.register("roleName")} className={inputClass}>{ROLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                    <SaveButton loading={inviteForm.formState.isSubmitting} />
                </form>
            </Card>
        </div>
    );
}

export function RolesPermissionsPanel({ data }: { data: SettingsData }) {
    return (
        <Card hover>
            <SectionHeader title="Roles & permissions" description="Organization roles and granted permissions" />
            <div className="mt-6 space-y-4">
                {data.roles.length === 0 ? <EmptyState title="No roles" description="Roles will appear once configured for your organization." /> : data.roles.map((role) => (
                    <div key={role.id} className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
                        <div className="flex items-center justify-between"><p className="font-medium">{role.name}</p>{role.isSystem ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">System</span> : null}</div>
                        <p className="mt-1 text-sm text-slate-500">{role.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">{role.permissions.map((permission) => <span key={permission} className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800">{permission}</span>)}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export function BrandingPanel({ data }: { data: SettingsData }) {
    const defaults: BrandingSettingsFormValues = {
        logoUrl: data.branding?.logoUrl ?? "",
        faviconUrl: data.branding?.faviconUrl ?? "",
        primaryColor: data.branding?.primaryColor ?? "#10b981",
        secondaryColor: data.branding?.secondaryColor ?? "#0f172a",
        accentColor: data.branding?.accentColor ?? "#3b82f6",
        customDomain: data.branding?.customDomain ?? "",
        emailHeaderHtml: data.branding?.emailHeaderHtml ?? "",
    };
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<BrandingSettingsFormValues>({ resolver: zodResolver(brandingSettingsSchema), defaultValues: defaults });

    return (
        <Card hover>
            <SectionHeader title="Branding" description="Logo, colors, and customer-facing identity" />
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(async (values) => data.updateBranding(values))}>
                <label className="space-y-2 md:col-span-2"><span className="text-sm font-medium">Logo URL</span><input {...register("logoUrl")} className={inputClass} /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-sm font-medium">Favicon URL</span><input {...register("faviconUrl")} className={inputClass} /></label>
                <label className="space-y-2"><span className="text-sm font-medium">Primary color</span><input {...register("primaryColor")} className={inputClass} /></label>
                <label className="space-y-2"><span className="text-sm font-medium">Secondary color</span><input {...register("secondaryColor")} className={inputClass} /></label>
                <label className="space-y-2"><span className="text-sm font-medium">Accent color</span><input {...register("accentColor")} className={inputClass} /></label>
                <label className="space-y-2"><span className="text-sm font-medium">Custom domain</span><input {...register("customDomain")} className={inputClass} /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-sm font-medium">Email header HTML</span><textarea {...register("emailHeaderHtml")} className={`${inputClass} min-h-24`} /></label>
                <div className="md:col-span-2"><SaveButton loading={isSubmitting} /></div>
            </form>
        </Card>
    );
}

export function PreferencesPanel({ data }: { data: SettingsData }) {
    const orgDefaults: PreferencesFormValues = {
        defaultLocale: data.preferences?.defaultLocale ?? "en",
        defaultTimezone: data.preferences?.defaultTimezone ?? "UTC",
        weekStartsOn: (data.preferences?.weekStartsOn as "monday" | "sunday") ?? "monday",
        dateFormat: data.preferences?.dateFormat ?? "YYYY-MM-DD",
        timeFormat: (data.preferences?.timeFormat as "12h" | "24h") ?? "24h",
    };
    const userDefaults: UserPreferencesFormValues = {
        theme: (data.userPreferences?.theme as "system" | "light" | "dark") ?? "system",
        locale: data.userPreferences?.locale ?? "en",
        timezone: data.userPreferences?.timezone ?? "UTC",
        dateFormat: data.userPreferences?.dateFormat ?? "YYYY-MM-DD",
        digestFrequency: (data.userPreferences?.digestFrequency as "daily" | "weekly" | "never") ?? "daily",
    };
    const orgForm = useForm<PreferencesFormValues>({ resolver: zodResolver(preferencesSchema), defaultValues: orgDefaults });
    const userForm = useForm<UserPreferencesFormValues>({ resolver: zodResolver(userPreferencesSchema), defaultValues: userDefaults });

    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Organization preferences" description="Default locale, timezone, and formatting" />
                <form className="mt-6 space-y-4" onSubmit={orgForm.handleSubmit(async (values) => data.updatePreferences(values))}>
                    <input {...orgForm.register("defaultLocale")} placeholder="Default locale" className={inputClass} />
                    <input {...orgForm.register("defaultTimezone")} placeholder="Default timezone" className={inputClass} />
                    <select {...orgForm.register("weekStartsOn")} className={inputClass}><option value="monday">Monday</option><option value="sunday">Sunday</option></select>
                    <input {...orgForm.register("dateFormat")} placeholder="Date format" className={inputClass} />
                    <select {...orgForm.register("timeFormat")} className={inputClass}><option value="24h">24h</option><option value="12h">12h</option></select>
                    <SaveButton loading={orgForm.formState.isSubmitting} />
                </form>
            </Card>
            <Card hover>
                <SectionHeader title="Personal preferences" description="Your theme and notification digest settings" />
                <form className="mt-6 space-y-4" onSubmit={userForm.handleSubmit(async (values) => data.updateUserPreferences(values))}>
                    <select {...userForm.register("theme")} className={inputClass}>{THEME_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                    <input {...userForm.register("locale")} placeholder="Locale" className={inputClass} />
                    <input {...userForm.register("timezone")} placeholder="Timezone" className={inputClass} />
                    <input {...userForm.register("dateFormat")} placeholder="Date format" className={inputClass} />
                    <select {...userForm.register("digestFrequency")} className={inputClass}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="never">Never</option></select>
                    <SaveButton loading={userForm.formState.isSubmitting} />
                </form>
            </Card>
        </div>
    );
}

export function SecurityPanel({ data }: { data: SettingsData }) {
    const defaults: SecurityPolicyFormValues = {
        mfaRequired: data.securityPolicy?.mfaRequired ?? false,
        sessionTimeoutMinutes: data.securityPolicy?.sessionTimeoutMinutes ?? 480,
        passwordMinLength: data.securityPolicy?.passwordMinLength ?? 12,
        ipAllowlist: (data.securityPolicy?.ipAllowlist ?? []).join(", "),
        loginAttemptLimit: data.securityPolicy?.loginAttemptLimit ?? 5,
    };
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<SecurityPolicyFormValues>({ resolver: zodResolver(securityPolicySchema), defaultValues: defaults });

    return (
        <Card hover>
            <SectionHeader title="Security settings" description="MFA, session, password, and network access policies" />
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(async (values) => data.updateSecurityPolicy({ ...values, ipAllowlist: values.ipAllowlist.split(",").map((item) => item.trim()).filter(Boolean) }))}>
                <label className="flex items-center gap-3 md:col-span-2"><input type="checkbox" {...register("mfaRequired")} /><span className="text-sm font-medium">Require MFA for all members</span></label>
                <label className="space-y-2"><span className="text-sm font-medium">Session timeout (minutes)</span><input type="number" {...register("sessionTimeoutMinutes", { valueAsNumber: true })} className={inputClass} /></label>
                <label className="space-y-2"><span className="text-sm font-medium">Minimum password length</span><input type="number" {...register("passwordMinLength", { valueAsNumber: true })} className={inputClass} /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-sm font-medium">IP allowlist (comma separated)</span><input {...register("ipAllowlist")} className={inputClass} /></label>
                <label className="space-y-2"><span className="text-sm font-medium">Login attempt limit</span><input type="number" {...register("loginAttemptLimit", { valueAsNumber: true })} className={inputClass} /></label>
                <div className="md:col-span-2"><SaveButton loading={isSubmitting} /></div>
            </form>
        </Card>
    );
}

export function AuditPanel({ data }: { data: SettingsData }) {
    const defaults: AuditConfigFormValues = {
        retentionDays: data.auditConfig?.retentionDays ?? 365,
        enabledEvents: (data.auditConfig?.enabledEvents ?? []).join(", "),
        exportFormat: (data.auditConfig?.exportFormat as "json" | "csv") ?? "json",
        alertThreshold: data.auditConfig?.alertThreshold ?? 100,
    };
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<AuditConfigFormValues>({ resolver: zodResolver(auditConfigSchema), defaultValues: defaults });

    return (
        <Card hover>
            <SectionHeader title="Audit configuration" description="Retention, export format, and alert thresholds" />
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(async (values) => data.updateAuditConfig({ ...values, enabledEvents: values.enabledEvents.split(",").map((item) => item.trim()).filter(Boolean) }))}>
                <label className="space-y-2"><span className="text-sm font-medium">Retention days</span><input type="number" {...register("retentionDays", { valueAsNumber: true })} className={inputClass} /></label>
                <label className="space-y-2"><span className="text-sm font-medium">Alert threshold</span><input type="number" {...register("alertThreshold", { valueAsNumber: true })} className={inputClass} /></label>
                <label className="space-y-2 md:col-span-2"><span className="text-sm font-medium">Enabled events (comma separated)</span><input {...register("enabledEvents")} className={inputClass} /></label>
                <label className="space-y-2"><span className="text-sm font-medium">Export format</span><select {...register("exportFormat")} className={inputClass}><option value="json">JSON</option><option value="csv">CSV</option></select></label>
                <div className="md:col-span-2"><SaveButton loading={isSubmitting} /></div>
            </form>
        </Card>
    );
}

export function IntegrationsPanel({ data }: { data: SettingsData }) {
    const form = useForm<ApiKeyFormValues>({ resolver: zodResolver(apiKeyFormSchema), defaultValues: { name: "", environment: "live", scopes: "clients.read,projects.read" } });

    return (
        <div className="grid gap-6">
            <Card hover>
                <SectionHeader title="API keys & integrations" description="Manage programmatic access to the platform" />
                <div className="mt-6 space-y-3">
                    {data.apiKeys.length === 0 ? <EmptyState title="No API keys" description="Create an API key to integrate external systems." /> : data.apiKeys.map((key) => (
                        <div key={key.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                            <div><p className="font-medium">{key.name}</p><p className="text-sm text-slate-500">{key.keyPrefix}•••••• • {key.scopes.join(", ")}</p></div>
                            <div className="flex items-center gap-3"><span className="capitalize text-sm">{key.status}</span>{key.status === "active" ? <button type="button" onClick={() => void data.revokeApiKey(key.id)} className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600">Revoke</button> : null}</div>
                        </div>
                    ))}
                </div>
                <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(async (values) => { await data.createApiKey({ name: values.name, environment: values.environment, scopes: values.scopes.split(",").map((item) => item.trim()).filter(Boolean) }); form.reset(); })}>
                    <input {...form.register("name")} placeholder="Key name" className={inputClass} />
                    <select {...form.register("environment")} className={inputClass}>{API_KEY_ENV_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                    <input {...form.register("scopes")} placeholder="Scopes (comma separated)" className={`${inputClass} md:col-span-2`} />
                    <div className="md:col-span-2"><SaveButton loading={form.formState.isSubmitting} /></div>
                </form>
            </Card>
        </div>
    );
}

export function NotificationsPanel({ data }: { data: SettingsData }) {
    return (
        <Card hover>
            <SectionHeader title="Notification preferences" description="Organization-wide notification channels and events" />
            <div className="mt-6 space-y-3">
                {data.notificationPreferences.length === 0 ? <EmptyState title="No notification preferences" description="Notification preferences will appear once configured." /> : data.notificationPreferences.map((preference) => (
                    <div key={preference.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                        <div><p className="font-medium">{preference.eventType}</p><p className="text-sm capitalize text-slate-500">{preference.channel} • {preference.isOrgWide ? "Organization" : "Personal"}</p></div>
                        <button type="button" onClick={() => void data.updateNotificationPreference(preference.id, { enabled: !preference.enabled })} className={`rounded-full px-4 py-2 text-sm font-medium ${preference.enabled ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600 dark:border-slate-800"}`}>
                            {preference.enabled ? "Enabled" : "Disabled"}
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export function BackupPanel({ data }: { data: SettingsData }) {
    return (
        <Card hover>
            <SectionHeader title="Backup & maintenance" description="Scheduled backups and recent run history" />
            <div className="mt-6 space-y-4">
                {data.backupConfigs.length === 0 ? <EmptyState title="No backup configs" description="Backup configurations will appear once configured." /> : data.backupConfigs.map((config) => (
                    <div key={config.id} className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div><p className="font-medium">{config.name}</p><p className="text-sm text-slate-500">{config.scheduleCron} • {config.destination} • retain {config.retentionCount}</p></div>
                            <button type="button" onClick={() => void data.runBackup(config.id)} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white">Run backup</button>
                        </div>
                        <div className="mt-4 space-y-2">
                            {config.runs.map((run) => (
                                <div key={run.id} className="flex justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-slate-950/40">
                                    <span className="capitalize">{run.status}</span>
                                    <span>{new Date(run.startedAt).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export function SettingsOverviewPanel({ data }: { data: SettingsData }) {
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover>
                <SectionHeader title="Administration summary" description="Current settings coverage across the workspace" />
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                        ["Organization", data.organizationSettings ? "Configured" : "Not configured"],
                        ["Branding", data.branding ? "Configured" : "Not configured"],
                        ["Security", data.securityPolicy ? "Configured" : "Not configured"],
                        ["Audit", data.auditConfig ? "Configured" : "Not configured"],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-slate-800"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 font-medium">{value}</p></div>
                    ))}
                </div>
            </Card>
            <RolesPermissionsPanel data={data} />
        </div>
    );
}
