import { IntentSchema } from "../src/design-os/navigation/intent.ts";
import assert from "node:assert";

console.log("Running IntentSchema Tests...");

// A. Valid VIEW intent
const validView = {
    action: "VIEW",
    moduleHref: "/dashboard",
    source: "AI_FALLBACK",
    rawInput: "show dashboard"
};
assert.doesNotThrow(() => IntentSchema.parse(validView));
console.log("✓ Valid VIEW intent passed");

// D. Missing action
const missingAction = {
    moduleHref: "/dashboard",
    source: "AI_FALLBACK",
    rawInput: "show dashboard"
};
assert.throws(() => IntentSchema.parse(missingAction));
console.log("✓ Missing action passed");

// E. Invalid action
const invalidAction = {
    action: "INVALID",
    moduleHref: "/dashboard",
    source: "AI_FALLBACK",
    rawInput: "show dashboard"
};
assert.throws(() => IntentSchema.parse(invalidAction));
console.log("✓ Invalid action passed");

// J. Invalid source
const invalidSource = {
    action: "VIEW",
    moduleHref: "/dashboard",
    source: "DETERMINISTIC",
    rawInput: "show dashboard"
};
assert.throws(() => IntentSchema.parse(invalidSource));
console.log("✓ Invalid source passed");

console.log("All tests passed!");
