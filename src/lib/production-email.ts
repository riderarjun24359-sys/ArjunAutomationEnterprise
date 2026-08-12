/**
 * Production email cutover — provider contract + transactional template inventory.
 *
 * Filesystem access is deliberately scoped to the static email-template directory
 * so Next.js/Turbopack does not trace the entire repository.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

export const CUTOVER_EMAIL_TEMPLATES = [
    { id: "welcome", file: "welcome.md", path: "src/modules/soft-launch/content/emails/welcome.md", purpose: "onboarding" },
    { id: "verify-email", file: "verify-email.md", path: "src/modules/soft-launch/content/emails/verify-email.md", purpose: "transactional" },
    { id: "invite-teammate", file: "invite-teammate.md", path: "src/modules/soft-launch/content/emails/invite-teammate.md", purpose: "onboarding" },
    { id: "password-reset", file: "password-reset.md", path: "src/modules/soft-launch/content/emails/password-reset.md", purpose: "password_reset" },
] as const;

const EMAIL_TEMPLATE_DIRECTORY = "src/modules/soft-launch/content/emails";

export function isEmailProviderConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
    if (env.RESEND_API_KEY?.trim()) return true;
    return Boolean(env.SMTP_HOST?.trim() && env.SMTP_USER?.trim());
}

export function getEmailProviderLabel(env: NodeJS.ProcessEnv = process.env): string {
    if (env.RESEND_API_KEY?.trim()) return "resend";
    if (env.SMTP_HOST?.trim() && env.SMTP_USER?.trim()) return "smtp";
    return "unset";
}

export function listEmailTemplateStatus(
    cwd = process.cwd(),
): Array<{ id: string; present: boolean; purpose: string; path: string }> {
    const templateDirectory = join(cwd, EMAIL_TEMPLATE_DIRECTORY);

    return CUTOVER_EMAIL_TEMPLATES.map((template) => ({
        id: template.id,
        purpose: template.purpose,
        path: template.path,
        present: existsSync(join(templateDirectory, template.file)),
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

export function buildEmailCutoverStatus(
    env: NodeJS.ProcessEnv = process.env,
    cwd = process.cwd(),
): EmailCutoverStatus {
    const templates = listEmailTemplateStatus(cwd);
    const providerConfigured = isEmailProviderConfigured(env);

    return {
        providerConfigured,
        provider: getEmailProviderLabel(env),
        fromAddressConfigured: Boolean(
            env.SMTP_FROM?.trim() ||
            env.EMAIL_FROM?.trim() ||
            env.RESEND_FROM?.trim(),
        ),
        templates,
        transactionalReady: templates.some(
            (template) => template.id === "verify-email" && template.present,
        ),
        passwordResetReady: templates.some(
            (template) => template.id === "password-reset" && template.present,
        ),
        onboardingReady: templates
            .filter((template) =>
                ["welcome", "verify-email", "invite-teammate"].includes(template.id),
            )
            .every((template) => template.present),
    };
}
