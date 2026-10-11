/**
 * Support triage helpers (F, pure).
 *
 * Selects tickets needing human action from persisted rows: overdue
 * (past due_at, neither resolved nor closed) and first-response breaches
 * (older than the SLA's first_response_minutes with no recorded response).
 * Response evidence is approximated by ticket notes presence; without notes
 * the ticket counts as unresponded. Nothing is auto-escalated — owners act.
 */

export interface TriageTicket {
    id?: string;
    status?: string | null;
    dueAt?: string | null;
    resolvedAt?: string | null;
    createdAt?: string | null;
}

const CLOSED = ["resolved", "closed"];

export function selectOverdueTickets<T extends TriageTicket>(tickets: T[], now: number = Date.now()): T[] {
    return tickets
        .filter((t) => {
            if (CLOSED.includes((t.status ?? "").toLowerCase())) return false;
            if (t.resolvedAt) return false;
            if (!t.dueAt) return false;
            const due = new Date(t.dueAt).getTime();
            return Number.isFinite(due) && due < now;
        })
        .sort((a, b) => String(a.dueAt).localeCompare(String(b.dueAt)));
}

export function selectResponseBreaches<T extends TriageTicket>(
    tickets: T[],
    respondedTicketIds: ReadonlySet<string>,
    firstResponseMinutes: number,
    now: number = Date.now(),
): T[] {
    if (!Number.isFinite(firstResponseMinutes) || firstResponseMinutes < 0) return [];
    return tickets.filter((t) => {
        if (CLOSED.includes((t.status ?? "").toLowerCase())) return false;
        if (!t.id || respondedTicketIds.has(t.id)) return false;
        if (!t.createdAt) return false;
        const created = new Date(t.createdAt).getTime();
        return Number.isFinite(created) && now - created > firstResponseMinutes * 60_000;
    });
}
