/**
 * Growth OS AI Video Factory — pure helper checks (no mock business data).
 */
import assert from "node:assert/strict";

function classifyScriptKind(scriptType, name, targetLength) {
    const s = `${scriptType} ${name}`.toLowerCase();
    if (s.includes("short") || s.includes("reel") || s.includes("tiktok") || targetLength <= 60) return "shorts";
    if (s.includes("demo") || s.includes("product")) return "product_demo";
    if (s.includes("explain")) return "explainer";
    if (s.includes("case")) return "case_study";
    if (s.includes("webinar") || s.includes("event")) return "webinar";
    if (s.includes("youtube") || s.includes("long") || targetLength >= 480) return "youtube_long";
    return "other";
}

function classifyProjectStage(status) {
    const s = String(status).toLowerCase();
    if (s.includes("publish")) return "published";
    if (s.includes("export") || s.includes("render") || s.includes("queue")) return "export";
    if (s.includes("approv") && !s.includes("pending")) return "approved";
    if (s.includes("review") || s.includes("pending") || s.includes("await")) return "review";
    if (s.includes("draft") || s.includes("idea")) return "draft";
    return "other";
}

function normalizeAspect(format, aspect) {
    const s = `${format} ${aspect ?? ""}`.toLowerCase();
    if (s.includes("9:16") || s.includes("vertical") || s.includes("short") || s.includes("reel")) return "9:16";
    if (s.includes("1:1") || s.includes("square")) return "1:1";
    if (s.includes("4:5")) return "4:5";
    if (s.includes("16:9") || s.includes("landscape") || s.includes("youtube")) return "16:9";
    return "16:9";
}

function estimateSceneDuration(totalSeconds, sceneCount) {
    if (sceneCount <= 0) return 0;
    return Math.max(3, Math.round(totalSeconds / sceneCount));
}

assert.equal(classifyScriptKind("short", "Reel A", 45), "shorts");
assert.equal(classifyScriptKind("youtube", "Deep dive", 600), "youtube_long");
assert.equal(classifyProjectStage("pending_review"), "review");
assert.equal(normalizeAspect("vertical short", ""), "9:16");
assert.equal(estimateSceneDuration(120, 4), 30);

const slots = [
    "script_generation",
    "voice_synthesis",
    "visual_assembly",
    "motion_graphics",
    "captioning",
    "transcoding",
];
assert.equal(slots.length, 6);

console.log("test-growth-os-video: ok");
