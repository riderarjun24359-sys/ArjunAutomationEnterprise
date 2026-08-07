/**
 * Growth OS Foundation — pure helper checks (no mock business data).
 */
import assert from "node:assert/strict";

function mapWorkflowStage(status) {
    const s = String(status).toLowerCase();
    if (s.includes("publish") && !s.includes("schedul")) return "published";
    if (s.includes("schedul") || s.includes("queued")) return "scheduled";
    if (s.includes("approv") && !s.includes("pending") && !s.includes("await")) return "approved";
    if (s.includes("review") || s.includes("pending") || s.includes("await")) return "review";
    if (s.includes("draft") || s.includes("idea") || s.includes("new")) return "draft";
    return "draft";
}

function roleForStage(stage) {
    if (stage === "draft") return "creator";
    if (stage === "review") return "manager";
    if (stage === "approved") return "admin";
    return "publisher";
}

function avg(nums) {
    if (!nums.length) return null;
    const sum = nums.reduce((a, b) => a + b, 0);
    return Math.round((sum / nums.length) * 10) / 10;
}

function isTypographyGuideline(category) {
    const c = String(category).toLowerCase();
    return c.includes("type") || c.includes("font") || c.includes("typography") || c.includes("voice");
}

assert.equal(mapWorkflowStage("draft"), "draft");
assert.equal(mapWorkflowStage("pending_review"), "review");
assert.equal(mapWorkflowStage("approved"), "approved");
assert.equal(mapWorkflowStage("scheduled"), "scheduled");
assert.equal(mapWorkflowStage("published"), "published");
assert.equal(roleForStage("review"), "manager");
assert.equal(roleForStage("approved"), "admin");
assert.equal(avg([10, 20, 30]), 20);
assert.equal(avg([]), null);
assert.equal(isTypographyGuideline("typography"), true);
assert.equal(isTypographyGuideline("color"), false);

const stages = ["draft", "review", "approved", "scheduled", "published"];
assert.equal(stages.join("→"), "draft→review→approved→scheduled→published");

console.log("test-growth-os-foundation: ok");
