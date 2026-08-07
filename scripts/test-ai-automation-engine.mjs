/**
 * AI Automation & Workflow Engine — pure helper checks.
 */
import assert from "node:assert/strict";

function classifyTriggerType(type, name = "") {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("form") || s.includes("submission")) return "form_submitted";
    if (s.includes("lead")) return "lead_created";
    if (s.includes("deal") && (s.includes("won") || s.includes("closed"))) return "deal_won";
    if (s.includes("invoice") || s.includes("overdue") || s.includes("billing")) return "invoice_overdue";
    if (s.includes("customer") || s.includes("client") || s.includes("account")) return "customer_created";
    if (s.includes("webhook") || s.includes("http")) return "webhook";
    if (s.includes("manual") || s.includes("on_demand") || s.includes("button")) return "manual";
    if (s.includes("schedule") || s.includes("cron") || s.includes("time") || s.includes("interval")) return "schedule";
    return "manual";
}

function classifyActionType(type, name = "") {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("whatsapp") || s.includes("wa ")) return "send_whatsapp";
    if (s.includes("email") || s.includes("mail")) return "send_email";
    if (s.includes("crm") || s.includes("contact") || s.includes("record")) return "create_crm_record";
    if (s.includes("task") || s.includes("todo")) return "create_task";
    if (s.includes("deal") || s.includes("pipeline") || s.includes("opportunity")) return "update_deal";
    if (s.includes("publish") || s.includes("post") || s.includes("content")) return "publish_content";
    if (s.includes("report") || s.includes("analytics")) return "generate_report";
    if (s.includes("video")) return "ai_video_generation";
    if (s.includes("image") || s.includes("visual") || s.includes("banner")) return "ai_image_generation";
    if (s.includes("ai") || s.includes("generate") || s.includes("llm") || s.includes("prompt")) {
        return "ai_content_generation";
    }
    if (s.includes("http") || s.includes("api") || s.includes("webhook") || s.includes("request")) {
        return "custom_http_request";
    }
    return "create_task";
}

function classifyNodeKind(type, name = "") {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("loop") || s.includes("foreach") || s.includes("iterate")) return "loop";
    if (s.includes("delay") || s.includes("wait") || s.includes("sleep") || s.includes("timer")) return "delay";
    if (s.includes("branch") || s.includes("fork") || s.includes("switch") || s.includes("transition")) return "branch";
    if (s.includes("condition") || s.includes("decision") || s.includes("if ")) return "condition";
    if (s.includes("template") || s.includes("subflow")) return "template";
    if (s.includes("trigger") || s.includes("event") || s.includes("webhook") || s.includes("schedule")) return "trigger";
    return "action";
}

function normalizeExecutionStatus(status) {
    const s = String(status).toLowerCase();
    if (s.includes("retry") || s.includes("queued") || s.includes("pending_retry")) return "retry";
    if (s.includes("fail") || s.includes("error") || s.includes("abort")) return "failed";
    if (s.includes("complete") || s.includes("success") || s.includes("done") || s.includes("finished")) {
        return "completed";
    }
    if (s.includes("run") || s.includes("active") || s.includes("progress") || s.includes("started")) {
        return "running";
    }
    return "running";
}

function classifyIntegrationType(type, name = "") {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("slack")) return "slack";
    if (s.includes("discord")) return "discord";
    if (s.includes("github") || s.includes("git")) return "github";
    if (s.includes("stripe")) return "stripe";
    if (s.includes("razorpay") || s.includes("razor")) return "razorpay";
    if (s.includes("drive") || s.includes("google")) return "google_drive";
    if (s.includes("calendar") || s.includes("ical") || s.includes("meeting")) return "calendar";
    if (s.includes("webhook") || s.includes("http")) return "webhooks";
    if (s.includes("email") || s.includes("smtp") || s.includes("mail")) return "email";
    return "webhooks";
}

function isFounderOrAdminAccess(input) {
    const adminRoles = new Set(["super_admin", "admin", "founder", "owner"]);
    if (input.authRole === "super_admin" || input.authRole === "admin") return true;
    if (input.membershipRole && adminRoles.has(String(input.membershipRole).toLowerCase())) return true;
    return false;
}

assert.equal(classifyTriggerType("form.submitted"), "form_submitted");
assert.equal(classifyTriggerType("lead.created"), "lead_created");
assert.equal(classifyTriggerType("deal.won"), "deal_won");
assert.equal(classifyTriggerType("invoice.overdue"), "invoice_overdue");
assert.equal(classifyTriggerType("webhook"), "webhook");
assert.equal(classifyTriggerType("cron.schedule"), "schedule");
assert.equal(classifyActionType("send_email"), "send_email");
assert.equal(classifyActionType("whatsapp notify"), "send_whatsapp");
assert.equal(classifyActionType("ai image banner"), "ai_image_generation");
assert.equal(classifyActionType("custom http request"), "custom_http_request");
assert.equal(classifyNodeKind("decision"), "condition");
assert.equal(classifyNodeKind("foreach loop"), "loop");
assert.equal(classifyNodeKind("delay wait"), "delay");
assert.equal(normalizeExecutionStatus("completed"), "completed");
assert.equal(normalizeExecutionStatus("failed"), "failed");
assert.equal(normalizeExecutionStatus("retry_queued"), "retry");
assert.equal(classifyIntegrationType("slack bot"), "slack");
assert.equal(classifyIntegrationType("stripe payments"), "stripe");
assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "member" }), false);
assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "admin" }), true);

console.log("test-ai-automation-engine: ok");
