/**
 * Governed outbound webhook delivery for the automation engine
 * (Zapier/n8n "HTTP request" analog, dependency-free).
 *
 * Security model (defense in depth — see also `OWNER_ACTIONS.md` §6c for the
 * storage equivalent and the `integration_webhooks` table for named targets):
 *   - HTTPS only; no credentials embedded in the URL.
 *   - The target host must appear on the caller-supplied per-organization
 *     allowlist (exact host or parent domain). An empty allowlist denies.
 *   - Literal loopback / private / link-local / multicast / reserved IPs,
 *     `localhost` names, and well-known cloud metadata endpoints are rejected
 *     even when allowlisted (SSRF guard). Hostnames that are not allowlisted
 *     are rejected before any DNS-dependent step, so rebinding cannot widen
 *     access beyond the allowlist — though operators should still prefer
 *     stable, non-DNS-rebinding endpoints for sensitive targets.
 *   - Every delivery carries an `Idempotency-Key` (`executionId:stepOrder`) and
 *     an HMAC-SHA256 `t=…,v1=…` signature over `timestamp.body` (same wire
 *     shape as the inbound Stripe webhook path, so receivers reuse one
 *     verifier). The digest comes from a caller-injected `sign` callback
 *     (this module composes the `t=…,v1=…` header value), so secrets never
 *     transit through action configs and the module stays isomorphic.
 *   - Bounded: caller-supplied timeout (AbortController) and retry schedule;
 *     4xx (except 408/429) is terminal, network errors / timeouts / 5xx /
 *     408 / 429 retry. Every attempt is reported for the audit log.
 *
 * Pure: no imports, no network except via the injected `fetchFn`, no clock
 * except via the injected `now`/`sleep`. Fully unit-testable offline.
 */

export interface WebhookTargetValidation {
    ok: boolean;
    error?: string;
    host?: string;
}

export interface WebhookDispatch {
    url: string;
    event: string;
    payload: Record<string, unknown>;
    idempotencyKey: string;
    allowedHosts: string[];
    timeoutMs: number;
}

export interface WebhookAttempt {
    attempt: number;
    ok: boolean;
    statusCode: number | null;
    durationMs: number;
    error?: string;
}

export interface WebhookDeliveryResult {
    ok: boolean;
    attempts: WebhookAttempt[];
    responseStatus: number | null;
    error?: string;
}

type FetchFn = (url: string, init: { method: string; headers: Record<string, string>; body: string; signal: AbortSignal }) => Promise<{
    status: number;
    text?: () => Promise<string>;
}>;

const MAX_URL_LENGTH = 2048;
const METADATA_HOSTS = new Set([
    "metadata.google.internal",
    "metadata.goog",
    "instance-data",
    "instance-data-compute",
]);

function ipv4Octets(host: string): number[] | null {
    const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
    if (!m) return null;
    const octets = m.slice(1).map(Number);
    if (octets.some((o) => o > 255)) return null;
    return octets;
}

function isBlockedIpLiteral(host: string): boolean {
    const v4 = ipv4Octets(host);
    if (v4) {
        const [a, b] = v4;
        if (a === 10) return true;
        if (a === 172 && b >= 16 && b <= 31) return true;
        if (a === 192 && b === 168) return true;
        if (a === 127) return true;
        if (a === 169 && b === 254) return true;
        if (a === 0) return true;
        if (a >= 224) return true;
        if (a === 100 && b >= 64 && b <= 127) return true;
        if (a === 192 && (b === 0 || b === 18 || b === 19)) return true;
        if (a === 203 && b === 0) return true;
        if (a === 198 && (b === 51 || b === 18 || b === 19)) return true;
        return false;
    }
    const v6 = host.toLowerCase().replace(/^\[(.*)\]$/, "$1");
    if (v6.includes(":")) {
        if (v6 === "::1" || v6 === "::ffff:127.0.0.1") return true;
        if (v6.startsWith("fe80:") || v6.startsWith("fec0:") || v6.startsWith("fc00:") || v6.startsWith("fd00:")) return true;
        if (v6.startsWith("ff00:")) return true;
        if (v6 === "::" || v6.startsWith("::ffff:0:") || v6 === "100::") return true;
    }
    return false;
}

function isBlockedName(host: string): boolean {
    const h = host.toLowerCase().replace(/\.$/, "");
    if (h === "localhost" || h.endsWith(".localhost")) return true;
    if (h.endsWith(".local") || h.endsWith(".internal") || h.endsWith(".lan") || h.endsWith(".home.arpa")) return true;
    if (METADATA_HOSTS.has(h) || h.endsWith(".instance-data")) return true;
    return false;
}

export function validateWebhookTarget(rawUrl: string, allowedHosts: string[]): WebhookTargetValidation {
    if (!rawUrl || typeof rawUrl !== "string") return { ok: false, error: "Webhook URL is required" };
    if (rawUrl.length > MAX_URL_LENGTH) return { ok: false, error: "Webhook URL exceeds 2048 characters" };
    let parsed: URL;
    try {
        parsed = new URL(rawUrl);
    } catch {
        return { ok: false, error: "Webhook URL is not a valid absolute URL" };
    }
    if (parsed.protocol !== "https:") return { ok: false, error: "Webhook URL must use https" };
    if (parsed.username || parsed.password) return { ok: false, error: "Webhook URL must not embed credentials" };
    const host = parsed.hostname.toLowerCase().replace(/\.$/, "");
    if (!host) return { ok: false, error: "Webhook URL has no host" };
    if (isBlockedName(host)) return { ok: false, error: `Webhook host '${host}' is not allowed (loopback/internal)` };
    if (isBlockedIpLiteral(host)) return { ok: false, error: `Webhook host '${host}' is not allowed (non-public address)` };
    const allowed = (allowedHosts ?? []).map((h) => h.trim().toLowerCase().replace(/\.$/, "")).filter(Boolean);
    if (allowed.length === 0) return { ok: false, error: "No webhook allowlist configured for this organization" };
    const permitted = allowed.some((entry) => host === entry || host.endsWith(`.${entry}`));
    if (!permitted) return { ok: false, error: `Webhook host '${host}' is not on the organization allowlist` };
    return { ok: true, host };
}

export function isRetryableStatus(status: number | null): boolean {
    if (status === null) return true;
    if (status === 408 || status === 429) return true;
    return status >= 500 && status <= 599;
}

export async function executeWebhookStep(input: {
    dispatch: WebhookDispatch;
    sign: (rawBody: string) => Promise<string>;
    fetchFn: FetchFn;
    delaysMs?: number[];
    sleep?: (ms: number) => Promise<void>;
    now?: () => number;
}): Promise<WebhookDeliveryResult> {
    const { dispatch } = input;
    const delays = input.delaysMs ?? [];
    const sleep = input.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
    const now = input.now ?? (() => Date.now());

    const target = validateWebhookTarget(dispatch.url, dispatch.allowedHosts);
    if (!target.ok) {
        return { ok: false, attempts: [], responseStatus: null, error: target.error };
    }

    const timestamp = Math.floor(now() / 1000);
    const body = JSON.stringify({
        event: dispatch.event,
        payload: dispatch.payload,
        idempotency_key: dispatch.idempotencyKey,
        timestamp,
    });
    const signature = await input.sign(`${timestamp}.${body}`);
    const headers: Record<string, string> = {
        "content-type": "application/json",
        "user-agent": "arjun-automation-webhook/1.0",
        "x-aaos-event": dispatch.event,
        "x-idempotency-key": dispatch.idempotencyKey,
        "x-aaos-signature": `t=${timestamp},v1=${signature}`,
    };

    const attempts: WebhookAttempt[] = [];
    const maxAttempts = 1 + delays.length;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        const started = now();
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), Math.max(1, dispatch.timeoutMs));
        try {
            const res = await input.fetchFn(dispatch.url, { method: "POST", headers, body, signal: controller.signal });
            const durationMs = Math.max(0, now() - started);
            if (res.status >= 200 && res.status < 300) {
                attempts.push({ attempt, ok: true, statusCode: res.status, durationMs });
                return { ok: true, attempts, responseStatus: res.status };
            }
            const retryable = isRetryableStatus(res.status);
            attempts.push({ attempt, ok: false, statusCode: res.status, durationMs, error: `HTTP ${res.status}` });
            if (!retryable || attempt === maxAttempts) {
                return { ok: false, attempts, responseStatus: res.status, error: `HTTP ${res.status}` };
            }
        } catch (error) {
            const durationMs = Math.max(0, now() - started);
            const aborted = error instanceof Error && (error.name === "AbortError" || /abort/i.test(error.message));
            attempts.push({ attempt, ok: false, statusCode: null, durationMs, error: aborted ? "request timed out" : error instanceof Error ? error.message : String(error) });
            if (attempt === maxAttempts) {
                return { ok: false, attempts, responseStatus: null, error: attempts[attempts.length - 1].error };
            }
        } finally {
            clearTimeout(timer);
        }
        await sleep(delays[attempt - 1] ?? 0);
    }
    return { ok: false, attempts, responseStatus: null, error: "delivery failed" };
}
