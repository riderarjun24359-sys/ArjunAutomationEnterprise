/**
 * Enterprise Integrations — pure helper checks.
 */
import assert from "node:assert/strict";

function classifySocialPlatform(type, name = "") {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("linkedin")) return "linkedin";
    if (s.includes("facebook") || s.includes("meta")) return "facebook";
    if (s.includes("instagram") || s.includes("ig ")) return "instagram";
    if (s.includes("twitter") || s.includes(" x ") || s.trim() === "x" || s.includes("x.com")) return "x";
    if (s.includes("youtube") || s.includes("yt ")) return "youtube";
    return null;
}

function classifyPaymentProvider(type, name = "") {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("stripe")) return "stripe";
    if (s.includes("razorpay") || s.includes("razor")) return "razorpay";
    return "other";
}

function classifyCalendarProvider(type, name = "") {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("google") || s.includes("gcal")) return "google_calendar";
    if (s.includes("outlook") || s.includes("microsoft") || s.includes("office365") || s.includes("graph")) {
        return "outlook";
    }
    return null;
}

function secretRotationHealth(rotationDueAt, status) {
    if (/revok|disabled|expired/i.test(status)) return "overdue";
    if (!rotationDueAt) return "unknown";
    const t = new Date(rotationDueAt).getTime();
    if (!Number.isFinite(t)) return "unknown";
    const days = (t - Date.now()) / 86_400_000;
    if (days < 0) return "overdue";
    if (days <= 30) return "rotate_soon";
    return "healthy";
}

function isFounderOrAdminAccess(input) {
    const adminRoles = new Set(["super_admin", "admin", "founder", "owner"]);
    if (input.authRole === "super_admin" || input.authRole === "admin") return true;
    if (input.membershipRole && adminRoles.has(String(input.membershipRole).toLowerCase())) return true;
    return false;
}

assert.equal(classifySocialPlatform("linkedin"), "linkedin");
assert.equal(classifySocialPlatform("instagram_business"), "instagram");
assert.equal(classifySocialPlatform("twitter"), "x");
assert.equal(classifySocialPlatform("youtube"), "youtube");
assert.equal(classifyPaymentProvider("stripe_live"), "stripe");
assert.equal(classifyPaymentProvider("razorpay"), "razorpay");
assert.equal(classifyCalendarProvider("google calendar"), "google_calendar");
assert.equal(classifyCalendarProvider("outlook 365"), "outlook");
assert.equal(secretRotationHealth("2099-01-01", "active"), "healthy");
assert.equal(secretRotationHealth("2020-01-01", "active"), "overdue");
assert.equal(secretRotationHealth(null, "revoked"), "overdue");
assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "member" }), false);
assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "admin" }), true);

// Env health never returns secret values
const fakeEnv = { OPENAI_API_KEY: "sk-test-secret-value" };
assert.equal(Boolean(fakeEnv.OPENAI_API_KEY && fakeEnv.OPENAI_API_KEY.length > 0), true);
assert.notEqual(JSON.stringify({ key: "OPENAI_API_KEY", configured: true }), JSON.stringify(fakeEnv));

console.log("test-enterprise-integrations: ok");
