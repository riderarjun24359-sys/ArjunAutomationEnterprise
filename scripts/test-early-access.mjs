/**
 * Early Access builder contract checks (no product mock data).
 */
import assert from "node:assert/strict";

function isPending(status) {
    const s = status.toLowerCase();
    return s.includes("pending") || s.includes("invited") || s.includes("sent") || s.includes("await") || s === "open";
}

assert.equal(isPending("pending"), true);
assert.equal(isPending("accepted"), false);

function buildInviteCodes(invites) {
    return invites.filter((i) => i.code).map((i) => ({ code: i.code, email: i.email }));
}

const codes = buildInviteCodes([
    { code: "EA-001", email: "a@x.com" },
    { code: "", email: "b@x.com" },
]);
assert.equal(codes.length, 1);
assert.equal(codes[0].code, "EA-001");

function npsFromRatings(ratings) {
    if (!ratings.length) return null;
    return Math.round(((ratings.filter((r) => r >= 4).length - ratings.filter((r) => r <= 2).length) / ratings.length) * 100);
}

assert.equal(npsFromRatings([5, 5, 4, 1]), 50);
assert.equal(npsFromRatings([]), null);

console.log("test-early-access: ok");
