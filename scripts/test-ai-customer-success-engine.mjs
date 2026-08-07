/**
 * AI Customer Success & Support Engine — pure helper checks.
 */
import assert from "node:assert/strict";

function normalizeTicketStatus(status) {
    const s = String(status).toLowerCase().trim();
    if (s.includes("escalat")) return "escalated";
    if (s.includes("wait") || s.includes("customer")) return "waiting_customer";
    if (s.includes("pending") || s.includes("hold")) return "pending";
    if (s.includes("resolv") || s.includes("done") || s.includes("fixed")) return "resolved";
    if (s.includes("close")) return "closed";
    return "open";
}

function inferInboxChannel(subject, description, queueName) {
    const s = `${subject} ${description} ${queueName}`.toLowerCase();
    if (s.includes("whatsapp") || s.includes("wa ")) return "whatsapp";
    if (s.includes("chat") || s.includes("live")) return "live_chat";
    if (s.includes("form") || s.includes("contact") || s.includes("web")) return "contact_form";
    if (s.includes("email") || s.includes("mail")) return "email";
    return "email";
}

function inferReplyTone(title, body) {
    const s = `${title} ${body}`.toLowerCase();
    if (s.includes("tech") || s.includes("api") || s.includes("debug") || s.includes("error")) return "technical";
    if (s.includes("friend") || s.includes("thanks") || s.includes("happy")) return "friendly";
    return "professional";
}

function classifyRenewalBucket(renewalDate, status) {
    const s = String(status).toLowerCase();
    if (s.includes("payment") || s.includes("invoice") || s.includes("billing")) return "payment_followup";
    if (s.includes("remind")) return "reminder";
    if (!renewalDate) return s.includes("expir") ? "expired" : "upcoming";
    const t = new Date(renewalDate).getTime();
    if (!Number.isFinite(t)) return "reminder";
    if (t < Date.now()) return "expired";
    return "upcoming";
}

assert.equal(normalizeTicketStatus("Escalated - L2"), "escalated");
assert.equal(normalizeTicketStatus("Waiting on Customer"), "waiting_customer");
assert.equal(normalizeTicketStatus("Resolved"), "resolved");
assert.equal(inferInboxChannel("WhatsApp issue", "", ""), "whatsapp");
assert.equal(inferInboxChannel("Live chat drop", "", ""), "live_chat");
assert.equal(inferReplyTone("API error guide", "debug steps"), "technical");
assert.equal(inferReplyTone("Friendly thanks", "happy to help"), "friendly");
assert.equal(classifyRenewalBucket(null, "payment overdue"), "payment_followup");
assert.equal(classifyRenewalBucket("2020-01-01", "active"), "expired");

function isFounderOrAdminAccess(input) {
    const adminRoles = new Set(["super_admin", "admin", "founder", "owner"]);
    if (input.authRole === "super_admin" || input.authRole === "admin") return true;
    if (input.membershipRole && adminRoles.has(String(input.membershipRole).toLowerCase())) return true;
    return false;
}

assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "member" }), false);
assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "admin" }), true);

console.log("test-ai-customer-success-engine: ok");
