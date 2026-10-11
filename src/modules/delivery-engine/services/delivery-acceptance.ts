import type { CreateReviewApprovalInput } from "@/src/modules/business-analyst/types";

/**
 * Customer acceptance sign-off (D, T4).
 *
 * Reuses the generic business-analyst review-approval records (no duplicate
 * subsystem): acceptance of a delivery engagement is a review-approval row
 * with `entityType: "delivery-acceptance"` and `entityId` = engagement id.
 * Rows are created `pending` and ONLY a human moves them to `approved` —
 * nothing in code auto-approves, and the QA gate does not read approvals
 * (approvals never substitute for passing verifications).
 */

export function buildAcceptanceApprovalInput(
    engagementId: string,
    input?: { reviewerId?: string; comments?: string },
): CreateReviewApprovalInput {
    if (!engagementId.trim()) throw new Error("Engagement id is required to record acceptance");
    return {
        engagementId: engagementId.trim(),
        entityType: "delivery-acceptance",
        entityId: engagementId.trim(),
        reviewerId: input?.reviewerId,
        approvalStatus: "pending",
        comments: input?.comments ?? "",
    };
}
