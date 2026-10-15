/**
 * Owner notification for new website leads — fail-open by contract.
 *
 * - Never throws: every failure mode returns `{ ok: false }` so callers
 *   (the lead-intake route) can never lose or misreport a stored lead
 *   because notification failed.
 * - Never connects when unconfigured: without `RESEND_API_KEY` (+ a from
 *   address) it returns `not_configured` and performs no network call.
 * - Never exposes secrets: results and status strings contain reason codes
 *   and truncated non-secret detail only. No env value is ever echoed.
 * - PII minimization: the email subject carries only source + a short lead
 *   id. Name/email/company/message travel in the body to the owner address
 *   only, which must be a mailbox the owner controls.
 */

import { validateEmailConfig } from "@/src/lib/email-config";
import { sendTransactionalEmail, type EmailEnv } from "@/src/lib/email-delivery";

export interface LeadNotifyEnv extends EmailEnv {
    LEAD_OWNER_EMAIL?: string;
}

export interface LeadNotifyInput {
    leadId: string;
    leadName: string;
    leadEmail: string;
    company?: string;
    phone?: string;
    message?: string;
    source: string;
    consentVersion: string;
    receivedAt: string;
}

export interface LeadNotifyDeps {
    env?: LeadNotifyEnv;
    cwd?: string;
    fetchImpl?: typeof fetch;
}

export interface LeadNotifyResult {
    /** False when unconfigured — caller should use the manual fallback. */
    attempted: boolean;
    ok: boolean;
    reason: string;
}

/** Owner mailbox: explicit override first, else the configured sender. Safe to call with real env — returns address or null, never logs. */
export function resolveLeadOwnerAddress(env: LeadNotifyEnv = process.env as LeadNotifyEnv): string | null {
    return (
        env.LEAD_OWNER_EMAIL?.trim() ||
        env.RESEND_FROM?.trim() ||
        env.EMAIL_FROM?.trim() ||
        env.SMTP_FROM?.trim() ||
        null
    );
}

/** Key-free status string. Safe to log and expose in health responses. */
export function describeLeadNotifyStatus(env: LeadNotifyEnv = process.env as LeadNotifyEnv): string {
    const config = validateEmailConfig(env as unknown as NodeJS.ProcessEnv);
    const owner = resolveLeadOwnerAddress(env) ? "owner-set" : "owner-missing";
    if (!config.ready) return `lead-notify:unconfigured (${owner}; ${config.blockers.join("; ") || "no provider"})`;
    if (!resolveLeadOwnerAddress(env)) return "lead-notify:unconfigured (owner-missing)";
    return `lead-notify:ready (${config.provider}; ${owner})`;
}

/**
 * Defense-in-depth: strip anything resembling a secret token and all control
 * characters from a reason string before it is returned or audit-logged.
 * Provider error bodies should never contain credentials, but the audit log
 * is org-readable, so we redact rather than assume.
 */
export function sanitizeReason(raw: string): string {
    return raw
        .replace(/re_[A-Za-z0-9_-]{8,}/g, "[redacted]")
        .replace(/sk_(live|test)_[A-Za-z0-9_-]{4,}/g, "[redacted]")
        .replace(/Bearer\s+[A-Za-z0-9._~+/-]+/gi, "Bearer [redacted]")
        .replace(/[\u0000-\u001F\u007F]+/g, " ")
        .slice(0, 200);
}

/** Subject parts come from submitter-controlled fields — flatten line breaks. */
export function sanitizeSubjectPart(raw: string): string {
    return raw.replace(/[\u0000-\u001F\u007F]+/g, " ").trim().slice(0, 60) || "unknown";
}

export async function notifyOwnerOfLead(
    input: LeadNotifyInput,
    deps: LeadNotifyDeps = {},
): Promise<LeadNotifyResult> {
    const env: LeadNotifyEnv = deps.env ?? (process.env as LeadNotifyEnv);
    try {
        const config = validateEmailConfig(env as unknown as NodeJS.ProcessEnv);
        if (!config.ready) {
            return { attempted: false, ok: false, reason: `not_configured: ${config.blockers.join("; ")}`.slice(0, 200) };
        }
        const owner = resolveLeadOwnerAddress(env);
        if (!owner) {
            return { attempted: false, ok: false, reason: "owner_address_missing" };
        }
        const result = await sendTransactionalEmail(
            {
                to: owner,
                templateId: "lead-owner-alert",
                subject: `New website lead from ${sanitizeSubjectPart(input.source)} (${sanitizeSubjectPart(input.leadId.slice(0, 8))})`,
                variables: {
                    leadId: input.leadId,
                    leadIdShort: input.leadId.slice(0, 8),
                    leadName: input.leadName,
                    leadEmail: input.leadEmail,
                    company: input.company?.trim() ? input.company : "—",
                    phone: input.phone?.trim() ? input.phone : "—",
                    message: input.message?.trim() ? input.message.slice(0, 2000) : "—",
                    source: input.source,
                    consentVersion: input.consentVersion,
                    receivedAt: input.receivedAt,
                },
            },
            { env, cwd: deps.cwd, fetchImpl: deps.fetchImpl },
        );
        if (result.ok) {
            // Preserve the provider message id (non-secret): it is the only
            // key that correlates this audit row with the Resend dashboard
            // message and its Deliverability Insights.
            const sentReason = result.id ? `sent:${result.id}` : "sent";
            return { attempted: true, ok: true, reason: sanitizeReason(sentReason) };
        }
        return { attempted: true, ok: false, reason: sanitizeReason(result.detail ? `${result.reason}: ${result.detail}` : result.reason) };
    } catch (error) {
        return {
            attempted: true,
            ok: false,
            reason: sanitizeReason(`send_failed: ${error instanceof Error ? error.message : String(error)}`),
        };
    }
}
