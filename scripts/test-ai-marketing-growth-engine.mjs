/**
 * AI Marketing & Growth Engine — pure helper checks (no mock business data).
 */
import assert from "node:assert/strict";

function normalizeChannel(platformOrType) {
    const p = String(platformOrType).toLowerCase().trim();
    if (p.includes("blog") || p.includes("article") || p.includes("seo")) return "blog";
    if (p.includes("email") || p.includes("newsletter") || p.includes("drip")) return "email";
    if (p.includes("linked")) return "linkedin";
    if (p === "twitter" || p === "x" || p.includes("x.com")) return "x";
    if (p.includes("face")) return "facebook";
    if (p.includes("insta")) return "instagram";
    return p || "other";
}

function classifyCampaignPhase(campaignType, name, status) {
    const s = `${campaignType} ${name} ${status}`.toLowerCase();
    if (s.includes("idea") || s.includes("research")) return "ideation";
    if (s.includes("plan") || s.includes("brief")) return "planning";
    if (s.includes("produc") || s.includes("creat") || s.includes("draft")) return "production";
    if (s.includes("launch") || s.includes("publish") || s.includes("live")) return "launch";
    if (s.includes("optim") || s.includes("iterate") || s.includes("test")) return "optimize";
    return "other";
}

function weekBucket(isoDate) {
    const d = new Date(isoDate);
    if (Number.isNaN(d.getTime())) return "unscheduled";
    const year = d.getUTCFullYear();
    const oneJan = new Date(Date.UTC(year, 0, 1));
    const day = Math.floor((d.getTime() - oneJan.getTime()) / 86_400_000);
    const week = Math.floor((day + oneJan.getUTCDay()) / 7) + 1;
    return `${year}-W${String(week).padStart(2, "0")}`;
}

assert.equal(normalizeChannel("LinkedIn Organic"), "linkedin");
assert.equal(normalizeChannel("Twitter"), "x");
assert.equal(normalizeChannel("Instagram Reels"), "instagram");
assert.equal(normalizeChannel("Email drip"), "email");
assert.equal(normalizeChannel("SEO blog article"), "blog");
assert.equal(classifyCampaignPhase("launch", "Q3 go-live", "active"), "launch");
assert.equal(classifyCampaignPhase("brief", "Planning pack", "draft"), "planning");
assert.equal(classifyCampaignPhase("creative production", "Assets", "in_progress"), "production");
assert.ok(weekBucket("2026-08-07T00:00:00.000Z").startsWith("2026-W"));
assert.equal(weekBucket("not-a-date"), "unscheduled");

function isFounderOrAdminAccess(input) {
    const adminRoles = new Set(["super_admin", "admin", "founder", "owner"]);
    if (input.authRole === "super_admin" || input.authRole === "admin") return true;
    if (input.membershipRole && adminRoles.has(String(input.membershipRole).toLowerCase())) return true;
    return false;
}

assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "member" }), false);
assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "founder" }), true);

console.log("test-ai-marketing-growth-engine: ok");
