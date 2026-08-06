/**
 * Unit checks for production cutover secrets + Stripe webhook HMAC.
 */
import assert from "node:assert/strict";
import { createHmac, timingSafeEqual } from "node:crypto";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

assert.equal(existsSync(join(root, "instrumentation.ts")), true);
assert.equal(existsSync(join(root, "app/api/payments/webhook/route.ts")), true);
assert.equal(existsSync(join(root, "app/api/ops/cutover/route.ts")), true);
assert.equal(existsSync(join(root, "src/modules/soft-launch/content/emails/password-reset.md")), true);

function verifyStripeWebhookSignature(input) {
    if (!input.secret) return { ok: false, reason: "webhook_secret_missing" };
    if (!input.signatureHeader) return { ok: false, reason: "signature_header_missing" };
    const parts = Object.fromEntries(
        input.signatureHeader.split(",").map((piece) => {
            const [k, ...rest] = piece.trim().split("=");
            return [k, rest.join("=")];
        }),
    );
    const timestamp = parts.t;
    const signature = parts.v1;
    if (!timestamp || !signature) return { ok: false, reason: "signature_malformed" };
    const signedPayload = `${timestamp}.${input.payload}`;
    const expected = createHmac("sha256", input.secret).update(signedPayload, "utf8").digest("hex");
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, reason: "signature_mismatch" };
    return { ok: true };
}

const secret = "whsec_test";
const ts = Math.floor(Date.now() / 1000);
const payload = '{"id":"evt_1","type":"customer.subscription.updated"}';
const sig = createHmac("sha256", secret).update(`${ts}.${payload}`).digest("hex");
assert.equal(verifyStripeWebhookSignature({ payload, signatureHeader: `t=${ts},v1=${sig}`, secret }).ok, true);
assert.equal(verifyStripeWebhookSignature({ payload, signatureHeader: `t=${ts},v1=deadbeef`, secret }).ok, false);
assert.equal(verifyStripeWebhookSignature({ payload, signatureHeader: null, secret }).ok, false);

function listMissingCritical(env) {
    const keys = [
        "NEXT_PUBLIC_APP_URL",
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "PLATFORM_LEAD_API_KEY",
        "PLATFORM_ORGANIZATION_ID",
    ];
    return keys.filter((k) => !env[k]?.trim());
}

assert.deepEqual(
    listMissingCritical({
        NEXT_PUBLIC_APP_URL: "https://x",
        NEXT_PUBLIC_SUPABASE_URL: "https://y",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
        PLATFORM_LEAD_API_KEY: "k",
        PLATFORM_ORGANIZATION_ID: "o",
    }),
    [],
);
assert.ok(listMissingCritical({}).length === 5);

console.log("test-production-cutover: ok");
