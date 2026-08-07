/**
 * Growth OS AI Content Engine — pure helper checks (no mock business data).
 */
import assert from "node:assert/strict";

function normalizePlatform(platform) {
    const p = String(platform).toLowerCase().trim();
    if (p === "twitter" || p === "x.com") return "x";
    if (p.includes("linked")) return "linkedin";
    if (p.includes("insta")) return "instagram";
    if (p.includes("face")) return "facebook";
    if (p.includes("thread")) return "threads";
    if (p.includes("you")) return "youtube";
    return p || "other";
}

function classifyEmailKind(campaignType, name) {
    const s = `${campaignType} ${name}`.toLowerCase();
    if (s.includes("welcome") || s.includes("onboard")) return "welcome";
    if (s.includes("update") || s.includes("release") || s.includes("product")) return "product_update";
    if (s.includes("news") || s.includes("digest")) return "newsletter";
    if (s.includes("re-engag") || s.includes("reengag") || s.includes("winback") || s.includes("dormant")) {
        return "reengagement";
    }
    if (s.includes("nurtur") || s.includes("lead") || s.includes("drip")) return "nurture";
    return "other";
}

function tokenize(text) {
    return new Set(
        String(text)
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter((t) => t.length > 2),
    );
}

function titleSimilarity(a, b) {
    const left = tokenize(a);
    const right = tokenize(b);
    if (!left.size || !right.size) return 0;
    let inter = 0;
    for (const t of left) if (right.has(t)) inter += 1;
    const union = left.size + right.size - inter;
    return union === 0 ? 0 : Math.round((inter / union) * 1000) / 1000;
}

function classifyLandingKind(pageType, name) {
    const s = `${pageType} ${name}`.toLowerCase();
    if (s.includes("case")) return "case_study";
    if (s.includes("campaign") || s.includes("launch")) return "campaign";
    if (s.includes("industr") || s.includes("vertical")) return "industry";
    if (s.includes("product") || s.includes("platform") || s.includes("service")) return "product";
    return "other";
}

assert.equal(normalizePlatform("Twitter"), "x");
assert.equal(normalizePlatform("LinkedIn Ads"), "linkedin");
assert.equal(classifyEmailKind("drip", "Lead nurture"), "nurture");
assert.equal(classifyEmailKind("welcome", "Day 1"), "welcome");
assert.equal(classifyLandingKind("landing", "Product overview"), "product");
assert.ok(titleSimilarity("enterprise automation platform", "enterprise automation suite") >= 0.4);
assert.equal(titleSimilarity("aaa", "zzz"), 0);

console.log("test-growth-os-content: ok");
