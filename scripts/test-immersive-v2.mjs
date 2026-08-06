/**
 * Immersive Experience Engine v2 — pure theme/greeting helpers (no mock business data).
 */
import assert from "node:assert/strict";

function resolveDayPart(hour) {
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
}

function personalizeGreeting(greeting, fullName) {
    const first = String(fullName ?? "")
        .trim()
        .split(/\s+/)[0];
    if (first) return `${greeting}, ${first}`;
    return greeting;
}

assert.equal(resolveDayPart(9), "morning");
assert.equal(resolveDayPart(14), "afternoon");
assert.equal(resolveDayPart(19), "evening");
assert.equal(resolveDayPart(23), "night");
assert.equal(personalizeGreeting("Good morning", "Arjun Founder"), "Good morning, Arjun");
assert.equal(personalizeGreeting("Welcome back", null), "Welcome back");

console.log("test-immersive-v2: ok");
