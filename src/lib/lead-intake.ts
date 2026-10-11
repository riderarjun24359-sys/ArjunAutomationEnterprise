import { z } from "zod";

/**
 * Public lead-intake contract (local-first, consent-aware).
 *
 * - `consent` is REQUIRED: anonymous visitors must explicitly accept the
 *   privacy notice before PII is stored. No consent => 400, nothing persisted.
 * - Email is normalized (trim + lowercase) so dedup matching is stable.
 * - Source is normalized but never dropped: unknown sources pass through
 *   trimmed so attribution data is never silently lost.
 */

export const PRIVACY_NOTICE_VERSION = "2026-10-01";

export const LEAD_SOURCES = [
    "inbound-website",
    "referral",
    "partner",
    "event",
    "outbound-consented",
    "returning-customer",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number] | string;

const SOURCE_ALIASES: Record<string, string> = {
    website: "inbound-website",
    inbound: "inbound-website",
    contact: "inbound-website",
    "contact-form": "inbound-website",
};

export function normalizeLeadSource(raw: string): string {
    const trimmed = raw.trim().slice(0, 100);
    const lowered = trimmed.toLowerCase();
    return SOURCE_ALIASES[lowered] ?? trimmed;
}

export function normalizeLeadEmail(raw: string): string {
    return raw.trim().toLowerCase();
}

export const leadIntakeSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(200),
    email: z.string().trim().email("Valid email is required").max(320),
    company: z.string().trim().max(200).optional().default(""),
    phone: z.string().trim().max(50).optional().default(""),
    message: z.string().trim().max(5000).optional().default(""),
    source: z.string().trim().min(1, "Source is required").max(100),
    consent: z.literal(true, {
        message: "Privacy consent is required before we can store your details",
    }),
});

export type LeadIntakeInput = z.infer<typeof leadIntakeSchema>;

export interface NormalizedLeadIntake {
    name: string;
    email: string;
    company: string;
    phone: string;
    message: string;
    source: string;
}

export function normalizeLeadIntake(input: LeadIntakeInput): NormalizedLeadIntake {
    return {
        name: input.name.trim(),
        email: normalizeLeadEmail(input.email),
        company: (input.company ?? "").trim(),
        phone: (input.phone ?? "").trim(),
        message: (input.message ?? "").trim(),
        source: normalizeLeadSource(input.source),
    };
}

/** Duplicate when any persisted lead in the same org shares the normalized email. */
export function findDuplicateLead<T extends { email?: string | null }>(leads: T[], email: string): T | null {
    const target = normalizeLeadEmail(email);
    if (!target) return null;
    return leads.find((lead) => normalizeLeadEmail(lead.email ?? "") === target) ?? null;
}
