"use client";

import { LeadForm } from "@/src/modules/company-launch-kit/components/LeadForm";

/**
 * Soft-launch feedback form.
 *
 * Wired to the real lead-intake pipeline (POST /api/launch-kit/contact) so a
 * submission is actually validated, stored, audited with privacy consent, and
 * (when configured) notified to the owner. It previously reported success from
 * client state alone while discarding the input — replaced so the site no
 * longer shows a false success message or a visual-only control.
 */
export function FeedbackForm() {
    return <LeadForm source="feedback-page" submitLabel="Send feedback" />;
}
