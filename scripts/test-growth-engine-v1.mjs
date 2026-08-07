/**
 * Growth Engine v1 pure helper checks (no mock business data).
 */
import assert from "node:assert/strict";

function isConvertedLead(status) {
    const s = status.toLowerCase();
    return s.includes("qualified") || s.includes("won") || s.includes("converted") || s.includes("customer");
}

function isReferral(source) {
    return source.toLowerCase().includes("refer");
}

function money(n) {
    return Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
}

function pct(n) {
    return Math.round((Number.isFinite(n) ? n : 0) * 10) / 10;
}

assert.equal(isConvertedLead("qualified"), true);
assert.equal(isConvertedLead("new"), false);
assert.equal(isReferral("partner-referral"), true);
assert.equal(money(12.345), 12.35);
assert.equal(pct(33.33), 33.3);

const converted = 2;
const leads = 10;
assert.equal(pct((converted / leads) * 100), 20);

console.log("test-growth-engine-v1: ok");
