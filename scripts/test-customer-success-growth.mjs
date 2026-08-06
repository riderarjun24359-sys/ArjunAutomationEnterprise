/**
 * Customer Success Growth builder contract checks (no product mock data).
 */
import assert from "node:assert/strict";

function isReferral(source) {
    return source.toLowerCase().includes("refer");
}

function npsFromRatings(ratings) {
    if (!ratings.length) return null;
    const promoters = ratings.filter((r) => r >= 4).length;
    const detractors = ratings.filter((r) => r <= 2).length;
    return Math.round(((promoters - detractors) / ratings.length) * 100);
}

function daysBetween(start, end) {
    const a = Date.parse(start);
    const b = Date.parse(end);
    if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) return null;
    return Math.round(((b - a) / (24 * 60 * 60 * 1000)) * 10) / 10;
}

function funnelConversion(prev, current) {
    if (!prev) return null;
    return Math.round((current / prev) * 1000) / 10;
}

assert.equal(isReferral("partner-referral"), true);
assert.equal(isReferral("organic"), false);
assert.equal(npsFromRatings([5, 5, 4, 1]), 50);
assert.equal(npsFromRatings([]), null);
assert.equal(daysBetween("2026-08-01T00:00:00.000Z", "2026-08-04T00:00:00.000Z"), 3);
assert.equal(funnelConversion(10, 5), 50);
assert.equal(funnelConversion(0, 5), null);

console.log("test-customer-success-growth: ok");
