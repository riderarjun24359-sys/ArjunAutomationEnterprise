import { aiOrchestrationService } from "../src/modules/ai-orchestration/services/ai-orchestration.service.ts";
import assert from "node:assert";

console.log("Running validateIntent Tests...");

// A. Known authorized moduleHref
assert.strictEqual(aiOrchestrationService.validateIntent("/dashboard"), true);
console.log("✓ Known authorized route passed");

// B. Unknown moduleHref
assert.strictEqual(aiOrchestrationService.validateIntent("/unknown"), false);
console.log("✓ Unknown route passed");

// D. Arbitrary external URL
assert.strictEqual(aiOrchestrationService.validateIntent("https://evil.com"), false);
console.log("✓ External URL passed");

console.log("All tests passed!");
