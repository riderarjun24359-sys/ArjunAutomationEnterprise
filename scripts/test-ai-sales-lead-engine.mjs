/**
 * AI Sales & Lead Generation Engine — pure helper checks (no mock business data).
 */
import assert from "node:assert/strict";

function scoreBand(score) {
    if (score >= 70) return "hot";
    if (score >= 40) return "warm";
    return "cold";
}

function classifyQualification(status, score) {
    const s = String(status).toLowerCase();
    if (s.includes("disqual") || s.includes("reject") || s.includes("spam")) return "disqualified";
    if (s.includes("qualif") || s.includes("mql") || s.includes("sql") || score >= 70) return "qualified";
    if (s.includes("nurtur") || s.includes("warm") || (score >= 40 && score < 70)) return "nurture";
    if (s.includes("new") || s.includes("open") || s.includes("inbox")) return "new";
    if (score >= 70) return "qualified";
    if (score >= 40) return "nurture";
    return "new";
}

function opportunitySignal(probability, amount) {
    if (probability >= 60 && amount > 0) return "strong";
    if (probability >= 30 || amount > 0) return "moderate";
    return "weak";
}

function money(n) {
    return Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
}

assert.equal(scoreBand(85), "hot");
assert.equal(scoreBand(55), "warm");
assert.equal(scoreBand(10), "cold");
assert.equal(classifyQualification("mql", 50), "qualified");
assert.equal(classifyQualification("nurture", 45), "nurture");
assert.equal(classifyQualification("disqualified", 90), "disqualified");
assert.equal(opportunitySignal(75, 10000), "strong");
assert.equal(opportunitySignal(20, 0), "weak");
assert.equal(money(12.345), 12.35);

function isFounderOrAdminAccess(input) {
    const adminRoles = new Set(["super_admin", "admin", "founder", "owner"]);
    if (input.authRole === "super_admin" || input.authRole === "admin") return true;
    if (input.membershipRole && adminRoles.has(String(input.membershipRole).toLowerCase())) return true;
    return false;
}

assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "member" }), false);
assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "founder" }), true);

console.log("test-ai-sales-lead-engine: ok");
