/**
 * Production email cutover — provider contract + transactional template inventory.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

export const CUTOVER_EMAIL_TEMPLATES = [
    { id: "welcome", file: "src/modules/soft-launch/content/emails/welcome.md", purpose: "onboarding" },
    { id: "verify-email", file: "src/modules/soft-launch/content/emails/verify-email.md", purpose: "transactional" },
    { id: "invite-teammate", file: "src/modules/soft-launch/content/emails/invite-teammate.md", purpose: "onboarding" },
    { id: "password-reset", file: "src/modules/soft-launch/content/emails/password-reset.md", purpose: "password_reset" },
] as const;

export function isEmailProviderConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
    if (env.RESEND_API_KEY?.trim()) return true;
    return Boolean(env.SMTP_HOST?.trim() && env.SMTP_USER?.trim());
}

export function getEmailProviderLabel(env: NodeJS.ProcessEnv = process.env): string {
    if (env.RESEND_API_KEY?.trim()) return "resend";
    if (env.SMTP_HOST?.trim() && env.SMTP_USER?.trim()) return "smtp";
    return "unset";
}

export function listEmailTemplateStatus(cwd = process.cwd()): Array<{ id: string; present: boolean; purpose: string; path: string }> {
    return CUTOVER_EMAIL_TEMPLATES.map((t) => ({
        id: t.id,
        purpose: t.purpose,
        path: t.file,
        present: existsSync(join(cwd, t.file)),
    }));
}

export interface EmailCutoverStatus {
    providerConfigured: boolean;
    provider: string;
    fromAddressConfigured: boolean;
    templates: ReturnType<typeof listEmailTemplateStatus>;
    transactionalReady: boolean;
    passwordResetReady: boolean;
    onboardingReady: boolean;
}

export function buildEmailCutoverStatus(env: NodeJS.ProcessEnv = process.env, cwd = process.cwd()): EmailCutoverStatus {
    const templates = listEmailTemplateStatus(cwd);
    const providerConfigured = isEmailProviderConfigured(env);
    return {
        providerConfigured,
        provider: getEmailProviderLabel(env),
        fromAddressConfigured: Boolean(env.SMTP_FROM?.trim() || env.EMAIL_FROM?.trim() || env.RESEND_FROM?.trim()),
        templates,
        transactionalReady: templates.some((t) => t.id === "verify-email" && t.present),
        passwordResetReady: templates.some((t) => t.id === "password-reset" && t.present),
        onboardingReady: templates.filter((t) => ["welcome", "verify-email", "invite-teammate"].includes(t.id)).every((t) => t.present),
    };
}
