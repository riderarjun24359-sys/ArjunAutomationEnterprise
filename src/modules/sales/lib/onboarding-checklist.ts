import { getInitialServiceOffer } from "@/src/modules/sales/offer";

/**
 * Customer onboarding checklist (C, deterministic).
 *
 * Derives the onboarding task list from the initial service offer's
 * acceptance criteria plus the fixed operational prerequisites (access,
 * data, training, hypercare). Pure data — execution state lives in the
 * onboarding wizard records, never here. Item ids are stable slugs so UI
 * and tests can track completion without inventing records.
 */

export interface OnboardingChecklistItem {
    id: string;
    title: string;
    detail: string;
    owner: "provider" | "customer" | "joint";
    required: boolean;
}

export function buildOnboardingChecklist(clientName: string): OnboardingChecklistItem[] {
    if (!clientName.trim()) throw new Error("Client name is required for the onboarding checklist");
    const offer = getInitialServiceOffer();
    const items: OnboardingChecklistItem[] = [
        { id: "access-admin", title: "Provision tenant admin access", detail: `Create admin sign-in for ${clientName.trim()} with role separation`, owner: "provider", required: true },
        { id: "scope-confirm", title: "Confirm signed scope checklist", detail: "Match provisioned modules against the approved proposal", owner: "joint", required: true },
        { id: "data-import", title: "Import opening data", detail: "Clients, contacts, open invoices, and users from customer exports", owner: "joint", required: true },
        { id: "integrations", title: "Connect approved integrations", detail: "Only integrations listed in the signed scope", owner: "provider", required: false },
        { id: "training", title: "Deliver role-based training", detail: "Admin and end-user sessions per the offer", owner: "provider", required: true },
    ];
    for (const criterion of offer.acceptanceCriteria) {
        const id = `accept-${criterion.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48)}`;
        items.push({ id, title: `Acceptance: ${criterion}`, detail: "Record evidence and explicit customer sign-off", owner: "customer", required: true });
    }
    items.push({ id: "hypercare", title: "Enter 30-day hypercare", detail: "Monitor health endpoints and support queue after go-live", owner: "provider", required: true });
    return items;
}
