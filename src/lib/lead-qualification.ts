/**
 * Lead qualification rules (pure, deterministic, no I/O).
 *
 * This mirrors the scoring in the Mythos policy engine
 * (`vayrix/modules/research/policy-gates.ts` → `evaluateLeadQualify`) so the
 * Enterprise route enforces the same rules at runtime instead of leaving
 * them as a standalone helper. The two copies are intentionally kept in sync
 * by test (same fixtures, same verdicts); they cannot share code across
 * repositories.
 *
 * Scoring (mirrors policy engine exactly):
 * - company present and not "Unknown": +1
 * - source in the known set: +1
 * - full name (2+ tokens): +1
 * Verdict: qualified at score >= 2, else unqualified.
 *
 * Qualification NEVER authorizes research, outreach, or marketing use — it
 * only routes human follow-up priority. Consent gates storage, never research.
 */

const QUALIFYING_SOURCES = new Set([
    "contact-page",
    "solutions-page",
    "launch-automation",
    "launch-crm",
    "research-service",
]);

export interface QualifyingLead {
    name: string;
    email: string;
    company: string;
    source: string;
}

export interface Qualification {
    verdict: "qualified" | "unqualified";
    score: number;
}

export function qualifyLead(lead: QualifyingLead): Qualification {
    const company = lead.company.trim();
    const source = lead.source.trim();
    const nameTokens = lead.name.trim().split(/\s+/).filter(Boolean).length;
    let score = 0;
    if (company && company.toLowerCase() !== "unknown") score += 1;
    if (QUALIFYING_SOURCES.has(source)) score += 1;
    if (nameTokens >= 2) score += 1;
    return { verdict: score >= 2 ? "qualified" : "unqualified", score };
}
