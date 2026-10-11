/**
 * Consent gate for outbound notifications (F, T6).
 *
 * Opt-out records (`cnh_opt_out_records`) carry an `opt_out_key` (recipient
 * address or profile key), a channel, and a status. A notification is blocked
 * when an ACTIVE record matches the recipient for the same channel (or the
 * `all` channel wildcard). Matching is case-insensitive on.trimmed values.
 * Revoked/expired records never block. Pure function — no side effects.
 */

export interface OptOutSignal {
    optOutKey?: string | null;
    channelType?: string | null;
    status?: string | null;
}

const normalize = (value: string | null | undefined): string => (value ?? "").trim().toLowerCase();

export function isBlockedByOptOut(
    optOuts: OptOutSignal[],
    recipient: string,
    channelType = "email",
): boolean {
    const target = normalize(recipient);
    if (!target) return false;
    const channel = normalize(channelType) || "email";
    return optOuts.some((record) => {
        if (normalize(record.status) !== "active") return false;
        if (normalize(record.optOutKey) !== target) return false;
        const recordChannel = normalize(record.channelType);
        return recordChannel === channel || recordChannel === "all" || recordChannel === "";
    });
}
