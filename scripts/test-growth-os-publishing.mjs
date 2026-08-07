/**
 * Growth OS Publishing & Distribution — pure helper checks (no mock business data).
 */
import assert from "node:assert/strict";

function mapConnectorSlot(platform) {
    const p = String(platform).toLowerCase();
    if (p.includes("linked")) return "linkedin";
    if (p.includes("insta")) return "instagram";
    if (p.includes("face")) return "facebook";
    if (p.includes("twitter") || p === "x") return "x";
    if (p.includes("you")) return "youtube";
    if (p.includes("email") || p.includes("mail")) return "email_esp";
    if (p.includes("blog")) return "blog_cms";
    if (p.includes("web") || p.includes("site")) return "website_cms";
    if (p.includes("sitemap")) return "sitemap";
    return p || "website_cms";
}

function classifyWebsiteKind(title, pageType) {
    const s = `${title} ${pageType}`.toLowerCase();
    if (s.includes("blog") || s.includes("article") || s.includes("post")) return "blog";
    if (s.includes("case")) return "case_study";
    if (s.includes("knowledge") || s.includes("faq") || s.includes("docs") || s.includes("help")) return "knowledge";
    if (s.includes("landing") || s.includes("product") || s.includes("page")) return "landing";
    return "other";
}

function bestTimeScore(iso) {
    const hour = Number(String(iso).slice(11, 13));
    if (!Number.isFinite(hour)) return 50;
    if (hour >= 14 && hour <= 16) return 92;
    if (hour >= 9 && hour <= 11) return 84;
    if (hour >= 12 && hour <= 13) return 70;
    return 45;
}

function isRetryEligible(status) {
    const s = String(status).toLowerCase();
    return s.includes("fail") || s.includes("error") || s.includes("retry") || s.includes("timeout");
}

function slugToUtm(slug, name) {
    const base = String(slug || name || "campaign")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .slice(0, 40);
    return { source: "growth_os", medium: "campaign", content: base || "release" };
}

assert.equal(mapConnectorSlot("LinkedIn Organic"), "linkedin");
assert.equal(classifyWebsiteKind("FAQ Hub", "docs"), "knowledge");
assert.equal(bestTimeScore("2026-08-07T15:00:00Z"), 92);
assert.equal(isRetryEligible("failed_rate_limit"), true);
assert.equal(slugToUtm("launch-q3", "Launch").source, "growth_os");

const slots = [
    "website_cms",
    "blog_cms",
    "linkedin",
    "instagram",
    "facebook",
    "x",
    "youtube",
    "email_esp",
    "sitemap",
];
assert.equal(slots.length, 9);

console.log("test-growth-os-publishing: ok");
