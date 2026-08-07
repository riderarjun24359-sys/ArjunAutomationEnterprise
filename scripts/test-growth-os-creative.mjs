/**
 * Growth OS AI Creative Studio — pure helper checks (no mock business data).
 */
import assert from "node:assert/strict";

function isValidHex(hex) {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(String(hex).trim());
}

function classifyBrandVisual(assetType, name) {
    const s = `${assetType} ${name}`.toLowerCase();
    if (s.includes("hero")) return "hero";
    if (s.includes("banner") || s.includes("header")) return "banner";
    if (s.includes("blog") || s.includes("cover") || s.includes("article")) return "blog_cover";
    if (s.includes("landing") || s.includes("page")) return "landing";
    if (s.includes("product") || s.includes("illustrat")) return "product";
    if (s.includes("info") || s.includes("diagram") || s.includes("chart")) return "infographic";
    return "other";
}

function normalizeSocialPlatform(platform, postType) {
    const p = `${platform} ${postType}`.toLowerCase();
    if (p.includes("carousel") || p.includes("slide")) return "carousel";
    if (p.includes("story") || p.includes("reel")) return "story";
    if (p.includes("insta")) return "instagram";
    if (p.includes("linked")) return "linkedin";
    if (p.includes("face")) return "facebook";
    if (p.includes("twitter") || p === "x" || p.includes(" x ")) return "x";
    return String(platform).toLowerCase() || "other";
}

function classifyCampaign(campaignType, name) {
    const s = `${campaignType} ${name}`.toLowerCase();
    if (s.includes("launch") || s.includes("product")) return "product_launch";
    if (s.includes("event") || s.includes("webinar") || s.includes("summit")) return "event";
    if (s.includes("season") || s.includes("holiday") || s.includes("festive")) return "seasonal";
    if (s.includes("promo") || s.includes("offer") || s.includes("discount")) return "promotional";
    if (s.includes("email") || s.includes("newsletter")) return "email_banner";
    return "other";
}

function layoutScoreFromSteps(stepCount, status) {
    const base = Math.min(100, Math.max(0, Number(stepCount) * 12));
    const s = String(status).toLowerCase();
    if (s.includes("active") || s.includes("approved") || s.includes("complete")) return Math.min(100, base + 20);
    if (s.includes("draft")) return Math.max(0, base - 10);
    return base;
}

assert.equal(isValidHex("#0A1628"), true);
assert.equal(isValidHex("navy"), false);
assert.equal(classifyBrandVisual("image", "Hero homepage"), "hero");
assert.equal(normalizeSocialPlatform("instagram", "story"), "story");
assert.equal(classifyCampaign("launch", "Product GA"), "product_launch");
assert.ok(layoutScoreFromSteps(5, "active") >= 60);

console.log("test-growth-os-creative: ok");
