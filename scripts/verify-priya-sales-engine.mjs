import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");

const sendWhatsApp = read("app/api/ai-sales/tools/send-whatsapp/route.ts");
const whatsappWebhook = read("app/api/ai-sales/webhooks/whatsapp/route.ts");
const consentRoute = read("app/api/ai-sales/tools/record-consent/route.ts");
const migration = read("supabase/migrations/202611230009_priya_whatsapp_messaging.sql");
const dispatcher = read("app/api/ai-sales/dispatch-followups/route.ts");
const hud = read("src/modules/ai-sales-lead-engine/components/JarvisExecutiveHud.tsx");
const booking = read("app/api/ai-sales/tools/book-demo/route.ts");
const provider = read("src/modules/ai-voice-agent/providers/voice-provider.ts");

assert.match(sendWhatsApp, /requested_whatsapp_message/);
assert.match(sendWhatsApp, /ai_sales_suppressions/);
assert.match(sendWhatsApp, /status === "APPROVED"/);
assert.match(sendWhatsApp, /ai_sales_whatsapp_messages/);
assert.match(sendWhatsApp, /idempotencyKey/);
assert.match(whatsappWebhook, /x-hub-signature-256/);
assert.match(whatsappWebhook, /createHmac\("sha256"/);
assert.match(whatsappWebhook, /rawBody/);
assert.match(consentRoute, /requested_whatsapp_message/);
assert.match(dispatcher, /Provider outcome unknown/i);
assert.match(dispatcher, /manual review required/i);
assert.match(dispatcher, /status", "processing"/);
assert.match(migration, /ai_sales_whatsapp_idempotency_unique/);
assert.match(migration, /requested_whatsapp_message/);
assert.match(hud, /\/api\/ai-sales\/jarvis\/briefing/);
assert.match(hud, /setInterval/);
assert.match(booking, /Asia\/Kolkata/);
assert.match(provider, /api\.vapi\.ai\/call/);
assert.match(provider, /api\.retellai\.com\/v2\/create-phone-call/);

for (const path of [
    "n8n/workflows/01-priya-followup-dispatcher.json",
    "n8n/workflows/02-jarvis-daily-briefing.json",
    "n8n/workflows/03-jarvis-verified-event-alert.json",
    "n8n/workflows/04-priya-google-meet-demo-booking.json",
]) {
    const workflow = JSON.parse(read(path));
    assert.equal(workflow.active, false, path + " must remain inactive until credentials and release gates are complete");
    assert.ok(Array.isArray(workflow.nodes) && workflow.nodes.length > 0, path + " must contain nodes");
    assert.ok(workflow.connections && typeof workflow.connections === "object", path + " must contain connections");
}

console.log("Priya/Jarvis static release checks passed.");
