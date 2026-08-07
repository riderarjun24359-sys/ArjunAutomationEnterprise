/**
 * Growth OS Growth Intelligence — pure helper checks (no mock business data).
 */
import assert from "node:assert/strict";

function money(n) {
    return Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
}

function pct(n) {
    return Math.round((Number.isFinite(n) ? n : 0) * 10) / 10;
}

function attainmentPercent(value, target) {
    if (!target) return null;
    return pct((value / target) * 100);
}

function classifyRecommendation(type, title) {
    const s = `${type} ${title}`.toLowerCase();
    if (s.includes("seo") || s.includes("keyword") || s.includes("rank")) return "seo";
    if (s.includes("content") || s.includes("blog") || s.includes("article")) return "content";
    if (s.includes("publish") || s.includes("schedule") || s.includes("timing") || s.includes("time")) {
        return "publishing_time";
    }
    if (s.includes("campaign") || s.includes("ads") || s.includes("roi")) return "campaign";
    if (s.includes("nurtur") || s.includes("drip") || s.includes("lead")) return "nurture";
    if (s.includes("expand") || s.includes("upsell") || s.includes("cross")) return "expansion";
    return "other";
}

function scenarioMultiply(base, factor) {
    return money(base * factor);
}

function isConvertedLead(status) {
    const s = String(status).toLowerCase();
    return s.includes("qualified") || s.includes("won") || s.includes("converted") || s.includes("customer");
}

assert.equal(money(12.345), 12.35);
assert.equal(attainmentPercent(80, 100), 80);
assert.equal(classifyRecommendation("seo_opportunity", "Keyword gap"), "seo");
assert.equal(classifyRecommendation("lead_nurture", "Follow up"), "nurture");
assert.equal(scenarioMultiply(1000, 1.15), 1150);
assert.equal(isConvertedLead("qualified"), true);

console.log("test-growth-os-intelligence: ok");
