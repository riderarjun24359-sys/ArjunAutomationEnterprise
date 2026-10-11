/**
 * Webhook idempotency helper (provider-agnostic).
 *
 * Design: verified provider events are deduplicated by (provider, event_id).
 * Primary store is the durable `webhook_idempotency` table (unique event_id,
 * deny-all RLS — writable only via the server-only service-role client).
 * When no durable store is reachable, a bounded in-memory fallback applies so
 * a single instance still refuses obvious replays; the route reports which
 * store decided via `dedupe` so operators never mistake memory for durable.
 */

export interface WebhookEventRef {
    provider: string;
    eventId: string;
    eventType: string;
}

export type DedupeStore = "database" | "memory";
export type DedupeDecision = "new" | "duplicate";

export function parseWebhookEvent(payload: string, provider: string): WebhookEventRef | null {
    try {
        const parsed = JSON.parse(payload) as { id?: unknown; type?: unknown };
        const eventId = typeof parsed.id === "string" && parsed.id.trim() ? parsed.id.trim() : null;
        const eventType = typeof parsed.type === "string" && parsed.type.trim() ? parsed.type.trim() : "unknown";
        if (!eventId) return null;
        return { provider, eventId, eventType };
    } catch {
        return null;
    }
}

export interface DurableIdempotencyStore {
    /** Returns true when the event was already seen (duplicate). Throws on infra errors. */
    checkDuplicate(ref: WebhookEventRef): Promise<boolean>;
}

/** Supabase-backed store. Expects an upsert-safe insert; unique violation => duplicate. */
export function createSupabaseIdempotencyStore(
    insert: (row: { event_id: string; provider: string }) => Promise<{ code?: string } | null>,
): DurableIdempotencyStore {
    return {
        async checkDuplicate(ref) {
            const error = await insert({ event_id: ref.eventId, provider: ref.provider });
            if (!error) return false;
            if (error.code === "23505") return true;
            throw new Error(`idempotency store error: ${error.code ?? "unknown"}`);
        },
    };
}

const MEMORY_MAX_ENTRIES = 2000;
const MEMORY_TTL_MS = 24 * 60 * 60 * 1000;

const memorySeen = new Map<string, number>();

function memoryKey(ref: WebhookEventRef): string {
    return `${ref.provider}:${ref.eventId}`;
}

export function checkMemoryDuplicate(ref: WebhookEventRef, now: number = Date.now()): DedupeDecision {
    const key = memoryKey(ref);
    const seenAt = memorySeen.get(key);
    if (seenAt !== undefined && now - seenAt < MEMORY_TTL_MS) return "duplicate";
    memorySeen.set(key, now);
    if (memorySeen.size > MEMORY_MAX_ENTRIES) {
        const oldest = memorySeen.keys().next();
        if (!oldest.done) memorySeen.delete(oldest.value);
    }
    return "new";
}

export function clearMemoryIdempotencyForTests(): void {
    memorySeen.clear();
}

export interface DedupeOutcome {
    decision: DedupeDecision;
    /** Store that actually made the decision. */
    store: DedupeStore;
    /** True when a configured durable store failed and memory was used instead. */
    degraded: boolean;
}

/**
 * Resolve a webhook delivery against the durable store when available, falling
 * back to the bounded in-memory guard on durable-store failure. The returned
 * `store` always names the store that decided, so a degraded fallback is never
 * reported as a durable `database` dedupe.
 */
export async function resolveWebhookDedupe(
    ref: WebhookEventRef,
    store?: DurableIdempotencyStore | null,
): Promise<DedupeOutcome> {
    if (store) {
        try {
            const duplicate = await store.checkDuplicate(ref);
            return { decision: duplicate ? "duplicate" : "new", store: "database", degraded: false };
        } catch {
            return { decision: checkMemoryDuplicate(ref), store: "memory", degraded: true };
        }
    }
    return { decision: checkMemoryDuplicate(ref), store: "memory", degraded: false };
}

export interface SettlementReference {
    reference: string | null;
    amountMinor: number | null;
    currency: string | null;
}

/**
 * Extracts settlement details from a Stripe event payload (pure).
 * Reference convention: metadata.invoice_number / metadata.invoiceNumber,
 * else the object description. Amount prefers amount_received, then amount.
 * Returns nulls (never throws) when the shape is unrecognized — the
 * reconciler reports those as discrepancies, not failures.
 */
export function extractStripeSettlementRef(payload: unknown): SettlementReference {
    const empty: SettlementReference = { reference: null, amountMinor: null, currency: null };
    if (!payload || typeof payload !== "object") return empty;
    const obj = (payload as { data?: { object?: Record<string, unknown> } }).data?.object;
    if (!obj || typeof obj !== "object") return empty;
    const metadata = (obj.metadata as Record<string, unknown> | undefined) ?? {};
    const rawRef = metadata.invoice_number ?? metadata.invoiceNumber ?? metadata.invoice ?? obj.description ?? null;
    const reference = typeof rawRef === "string" && rawRef.trim() ? rawRef.trim() : null;
    const rawAmount = obj.amount_received ?? obj.amount ?? null;
    const amountMinor = typeof rawAmount === "number" && Number.isFinite(rawAmount) ? rawAmount : null;
    const rawCurrency = obj.currency ?? null;
    const currency = typeof rawCurrency === "string" && rawCurrency.trim() ? rawCurrency.trim() : null;
    return { reference, amountMinor, currency };
}
