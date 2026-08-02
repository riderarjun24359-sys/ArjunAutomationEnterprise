import { z } from "zod";

export const organizationSettingsSchema = z.object({
    timezone: z.string().min(1),
    currency: z.string().min(3).max(3),
    fiscalYearStart: z.string().min(4),
    contactEmail: z.string().email(),
    billingAddress: z.string().min(3),
    supportPhone: z.string().min(3),
});

export const brandingSettingsSchema = z.object({
    logoUrl: z.string().url().or(z.literal("")),
    faviconUrl: z.string().url().or(z.literal("")),
    primaryColor: z.string().min(4),
    secondaryColor: z.string().min(4),
    accentColor: z.string().min(4),
    customDomain: z.string(),
    emailHeaderHtml: z.string(),
});

export const preferencesSchema = z.object({
    defaultLocale: z.string().min(2),
    defaultTimezone: z.string().min(1),
    weekStartsOn: z.enum(["monday", "sunday"]),
    dateFormat: z.string().min(4),
    timeFormat: z.enum(["12h", "24h"]),
});

export const securityPolicySchema = z.object({
    mfaRequired: z.boolean(),
    sessionTimeoutMinutes: z.number().min(15).max(1440),
    passwordMinLength: z.number().min(8).max(128),
    ipAllowlist: z.string(),
    loginAttemptLimit: z.number().min(3).max(20),
});

export const auditConfigSchema = z.object({
    retentionDays: z.number().min(30).max(3650),
    enabledEvents: z.string(),
    exportFormat: z.enum(["json", "csv"]),
    alertThreshold: z.number().min(1).max(10000),
});

export const teamFormSchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().optional(),
});

export const invitationFormSchema = z.object({
    email: z.string().email(),
    roleName: z.string().min(1),
});

export const apiKeyFormSchema = z.object({
    name: z.string().min(2),
    environment: z.enum(["live", "test", "hook"]),
    scopes: z.string().min(1),
});

export const userPreferencesSchema = z.object({
    theme: z.enum(["system", "light", "dark"]),
    locale: z.string().min(2),
    timezone: z.string().min(1),
    dateFormat: z.string().min(4),
    digestFrequency: z.enum(["daily", "weekly", "never"]),
});

export type OrganizationSettingsFormValues = z.infer<typeof organizationSettingsSchema>;
export type BrandingSettingsFormValues = z.infer<typeof brandingSettingsSchema>;
export type PreferencesFormValues = z.infer<typeof preferencesSchema>;
export type SecurityPolicyFormValues = z.infer<typeof securityPolicySchema>;
export type AuditConfigFormValues = z.infer<typeof auditConfigSchema>;
export type TeamFormValues = z.infer<typeof teamFormSchema>;
export type InvitationFormValues = z.infer<typeof invitationFormSchema>;
export type ApiKeyFormValues = z.infer<typeof apiKeyFormSchema>;
export type UserPreferencesFormValues = z.infer<typeof userPreferencesSchema>;
