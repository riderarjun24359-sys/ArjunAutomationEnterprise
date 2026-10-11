import { getInitialServiceOffer } from "@/src/modules/sales/offer";

/**
 * Proposal drafting from published catalog data (B, T3).
 *
 * Composes a `CreateProposalInput`-shaped draft (minus `engagementId`, which
 * the caller supplies) from the initial service offer, the prospect's details,
 * and the quoted commercial terms. Fully deterministic — no model call, no
 * invented scope: every section traces to the catalog offer or caller input.
 *
 * Approval stays explicitly human: persisting uses
 * `businessAnalystService.createProposal`, and customer sign-off is a
 * `createReviewApproval` row (`approval_status: "pending"` → `"approved"` by
 * a human). E-signature is NOT claimed — see the external signing handoff
 * note in docs/LOCAL_FIRST_RUNBOOK.md.
 */

export interface ProposalDraftInput {
    clientName: string;
    opportunityName?: string;
    amount: number;
    currency?: string;
    validDays?: number;
    preparedBy?: string;
}

export interface ProposalDraft {
    title: string;
    executiveSummary: string;
    deliverables: string;
    content: string;
}

export function buildProposalDraft(input: ProposalDraftInput): ProposalDraft {
    const offer = getInitialServiceOffer();
    if (!input.clientName.trim()) throw new Error("Client name is required for a proposal draft");
    if (!Number.isFinite(input.amount) || input.amount <= 0) throw new Error("Proposal amount must be greater than zero");

    const currency = (input.currency ?? "INR").trim() || "INR";
    const validDays = input.validDays ?? 15;
    const title = `${offer.title} — ${input.clientName.trim()}${input.opportunityName?.trim() ? ` (${input.opportunityName.trim()})` : ""}`;
    const executiveSummary =
        `Proposal for ${input.clientName.trim()} under the ${offer.title} offer (${offer.offerKey}). ` +
        `Quoted total ${currency} ${input.amount.toLocaleString("en-IN")} valid for ${validDays} days. ` +
        `Turnaround: ${offer.turnaround}. Customer approval via explicit review sign-off is required before onboarding.`;

    const section = (heading: string, items: string[]): string =>
        `## ${heading}\n${items.map((item) => `- ${item}`).join("\n")}`;

    const lines = [
        `# ${title}`,
        ``,
        executiveSummary,
        ``,
        section("Scope", offer.scope),
        ``,
        section("Deliverables", offer.deliverables),
        ``,
        section("Exclusions", offer.exclusions),
        ``,
        section("Acceptance criteria", offer.acceptanceCriteria),
        ``,
        `Quoted total: ${currency} ${input.amount.toLocaleString("en-IN")} (valid ${validDays} days).`,
    ];
    if (input.preparedBy?.trim()) lines.push(`Prepared by: ${input.preparedBy.trim()}.`);
    const content = lines.join("\n");

    return {
        title,
        executiveSummary,
        deliverables: offer.deliverables.join("\n"),
        content,
    };
}
