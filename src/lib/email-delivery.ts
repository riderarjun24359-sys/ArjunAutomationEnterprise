/**
 * Transactional email delivery.
 *
 * Honest contract: nothing is sent unless a provider is genuinely configured,
 * and a failure is always reported — never silently swallowed, never reported
 * as success. Sending is best-effort and non-fatal for callers (an invitation
 * is still created even if the notification email cannot be delivered).
 *
 * Provider: Resend (https://resend.com) over HTTPS using the runtime `fetch`,
 * so no additional dependency is required. The provider contract matches the
 * existing readiness detection in `production-email.ts` (`RESEND_API_KEY`,
 * `RESEND_FROM` / `EMAIL_FROM`). SMTP host/user is recognised by the readiness
 * gate but has no in-code sender here: it is reported as `unsupported_provider`
 * rather than falsely attempted.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { CUTOVER_EMAIL_TEMPLATES } from "@/src/lib/production-email";

const EMAIL_TEMPLATE_DIRECTORY = "src/modules/soft-launch/content/emails";
const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type SendEmailResult =
    | { ok: true; provider: "resend"; id: string | null }
    | {
          ok: false;
          reason: "not_configured" | "unsupported_provider" | "from_address_missing" | "unknown_template" | "send_failed";
          detail?: string;
      };

interface TemplateMeta {
    file: string;
}

function templateById(templateId: string): TemplateMeta | null {
    const found = CUTOVER_EMAIL_TEMPLATES.find((t) => t.id === templateId);
    return found ? { file: found.file } : null;
}

/** Replaces `{{key}}` placeholders with provided values; unknown keys are left intact. */
export function substituteTemplateVariables(text: string, variables: Record<string, string>): string {
    return text.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (match, key: string) =>
        Object.prototype.hasOwnProperty.call(variables, key) ? variables[key] : match,
    );
}

export interface RenderedEmail {
    subject: string;
    text: string;
}

/**
 * Renders a markdown template into a plain-text email. The leading H1 and the
 * `Subject:` line are removed from the body (they are email metadata, not
 * content). Throws when the template file is missing so callers can distinguish
 * a hard configuration error from a delivery failure.
 */
export function renderEmailTemplate(
    templateId: string,
    variables: Record<string, string> = {},
    cwd = process.cwd(),
): RenderedEmail {
    const meta = templateById(templateId);
    if (!meta) throw new Error(`Unknown email template: ${templateId}`);
    const path = join(cwd, EMAIL_TEMPLATE_DIRECTORY, meta.file);
    if (!existsSync(path)) throw new Error(`Email template file missing: ${meta.file}`);

    const raw = readFileSync(path, "utf8");
    const subjectMatch = raw.match(/^\s*\*{0,2}Subject:\*{0,2}\s*(.+?)\s*$/m);
    const subject = substituteTemplateVariables(subjectMatch?.[1] ?? "Notification", variables);

    const body = raw
        .split("\n")
        .filter((line) => !/^\s*\*{0,2}Subject:\*{0,2}\s/.test(line))
        .join("\n")
        .replace(/^\s*#\s+.*\n/, "")
        .trim();

    return { subject, text: substituteTemplateVariables(body, variables) };
}

export interface SendEmailInput {
    to: string;
    templateId: string;
    variables?: Record<string, string>;
    /** Overrides the template-derived subject when provided. */
    subject?: string;
}

export interface EmailEnv {
    RESEND_API_KEY?: string;
    RESEND_FROM?: string;
    EMAIL_FROM?: string;
    SMTP_FROM?: string;
    SMTP_HOST?: string;
    SMTP_USER?: string;
}

export interface SendEmailDeps {
    env?: EmailEnv;
    cwd?: string;
    fetchImpl?: typeof fetch;
}

function resolveFromAddress(env: EmailEnv): string | null {
    return env.RESEND_FROM?.trim() || env.EMAIL_FROM?.trim() || env.SMTP_FROM?.trim() || null;
}

export async function sendTransactionalEmail(
    input: SendEmailInput,
    deps: SendEmailDeps = {},
): Promise<SendEmailResult> {
    const env: EmailEnv = deps.env ?? (process.env as EmailEnv);
    const fetchImpl = deps.fetchImpl ?? fetch;
    const resendKey = env.RESEND_API_KEY?.trim();

    if (!resendKey) {
        const smtpConfigured = Boolean(env.SMTP_HOST?.trim() && env.SMTP_USER?.trim());
        return { ok: false, reason: smtpConfigured ? "unsupported_provider" : "not_configured" };
    }

    const from = resolveFromAddress(env);
    if (!from) {
        return { ok: false, reason: "from_address_missing" };
    }

    let rendered: RenderedEmail;
    try {
        rendered = renderEmailTemplate(input.templateId, input.variables ?? {}, deps.cwd ?? process.cwd());
    } catch (error) {
        return {
            ok: false,
            reason: error instanceof Error && /Unknown email template/.test(error.message) ? "unknown_template" : "send_failed",
            detail: error instanceof Error ? error.message : String(error),
        };
    }

    try {
        const response = await fetchImpl(RESEND_ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${resendKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from,
                to: [input.to],
                subject: input.subject ?? rendered.subject,
                text: rendered.text,
            }),
        });

        if (!response.ok) {
            const detail = await response.text().catch(() => "");
            return { ok: false, reason: "send_failed", detail: detail.slice(0, 300) };
        }

        const data = (await response.json().catch(() => null)) as { id?: string } | null;
        return { ok: true, provider: "resend", id: data?.id ?? null };
    } catch (error) {
        return { ok: false, reason: "send_failed", detail: error instanceof Error ? error.message : String(error) };
    }
}
