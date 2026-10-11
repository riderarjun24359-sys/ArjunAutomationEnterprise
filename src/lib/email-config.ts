/**
 * Outbound-email configuration validation (H, local slice).
 *
 * Presence/shape checks only — this module never connects, authenticates, or
 * sends. A "ready" result means configuration is complete, NOT that delivery
 * works; sender verification and deliverability remain owner actions with the
 * provider. No secret values appear in any output.
 */

export interface EmailConfigReport {
    provider: "resend" | "smtp" | "none";
    resendConfigured: boolean;
    smtpConfigured: boolean;
    fromConfigured: boolean;
    smtpPortValid: boolean;
    ready: boolean;
    blockers: string[];
}

const present = (env: NodeJS.ProcessEnv, key: string): boolean => Boolean(env[key]?.trim());

export function validateEmailConfig(env: NodeJS.ProcessEnv = process.env): EmailConfigReport {
    const resendConfigured = present(env, "RESEND_API_KEY");
    const smtpConfigured = present(env, "SMTP_HOST") && present(env, "SMTP_USER");
    const fromConfigured = present(env, "RESEND_FROM") || present(env, "SMTP_FROM") || present(env, "EMAIL_FROM");
    const portRaw = (env.SMTP_PORT ?? "587").trim();
    const port = Number(portRaw);
    const smtpPortValid = !env.SMTP_PORT?.trim() || (Number.isInteger(port) && port > 0 && port <= 65535);
    const provider = resendConfigured ? "resend" : smtpConfigured ? "smtp" : "none";
    const blockers: string[] = [];
    if (provider === "none") blockers.push("no email provider: set RESEND_API_KEY or SMTP_HOST+SMTP_USER");
    if (provider !== "none" && !fromConfigured) blockers.push("no sender identity: set RESEND_FROM, SMTP_FROM, or EMAIL_FROM (must be verified at the provider)");
    if (provider === "smtp" && !smtpPortValid) blockers.push(`invalid SMTP_PORT: ${portRaw}`);
    return { provider, resendConfigured, smtpConfigured, fromConfigured, smtpPortValid, ready: blockers.length === 0, blockers };
}
