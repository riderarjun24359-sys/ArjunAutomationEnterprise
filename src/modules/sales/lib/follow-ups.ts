/**
 * Follow-up selection over persisted sales activities (E.6).
 *
 * No external messages are ever sent from here: this only selects which
 * follow-ups are due so a human owner can act from the pipeline. Pure
 * function over already-fetched rows — works in any runtime context.
 */

export interface FollowUpCandidate {
    id?: string;
    activity_type?: string;
    subject?: string;
    description?: string | null;
    due_at?: string | null;
    completed_at?: string | null;
    lead_id?: string | null;
    opportunity_id?: string | null;
    assigned_to?: string | null;
}

export function selectDueFollowUps<T extends FollowUpCandidate>(
    activities: T[],
    now: number = Date.now(),
    horizonDays = 7,
): T[] {
    const horizonMs = horizonDays * 24 * 60 * 60 * 1000;
    return activities
        .filter((a) => {
            if (a.completed_at) return false;
            if (!a.due_at) return false;
            const due = new Date(a.due_at).getTime();
            if (!Number.isFinite(due)) return false;
            return due <= now + horizonMs;
        })
        .sort((a, b) => String(a.due_at).localeCompare(String(b.due_at)));
}
