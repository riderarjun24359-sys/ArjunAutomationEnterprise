/**
 * AI Enterprise Brain — pure helper unit checks.
 */
import assert from "node:assert/strict";

function classifyAgentRole(type, name = "") {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("market") || s.includes("growth") || s.includes("content") || s.includes("brand")) {
        return "marketing";
    }
    if (s.includes("sales") || s.includes("lead") || s.includes("crm") || s.includes("pipeline")) {
        return "sales";
    }
    if (
        s.includes("customer success")
        || s.includes("customer_success")
        || s.includes("cs agent")
        || s.includes("churn")
        || s.includes("retention")
        || s.includes("onboarding")
    ) {
        return "customer_success";
    }
    if (s.includes("financ") || s.includes("billing") || s.includes("invoice") || s.includes("revenue")) {
        return "finance";
    }
    if (s.includes("automat") || s.includes("workflow") || s.includes("rpa") || s.includes("orchestr")) {
        return "automation";
    }
    if (s.includes("operat") || s.includes("infra") || s.includes("ops") || s.includes("sre") || s.includes("devops")) {
        return "operations";
    }
    return "other";
}

function modulesLabel(modules) {
    if (!Array.isArray(modules) || !modules.length) return "—";
    return modules
        .map((m) =>
            typeof m === "string"
                ? m
                : typeof m === "object" && m && "name" in m
                  ? String(m.name)
                  : String(m),
        )
        .filter(Boolean)
        .slice(0, 4)
        .join(", ");
}

function isPendingStatus(status) {
    const s = String(status).toLowerCase();
    return s.includes("pending") || s.includes("await") || s.includes("review") || s.includes("open");
}

function avg(nums) {
    if (!nums.length) return null;
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

assert.equal(classifyAgentRole("marketing_agent"), "marketing");
assert.equal(classifyAgentRole("", "Growth Content Bot"), "marketing");
assert.equal(classifyAgentRole("sales"), "sales");
assert.equal(classifyAgentRole("lead_qualifier"), "sales");
assert.equal(classifyAgentRole("customer_success"), "customer_success");
assert.equal(classifyAgentRole("", "Churn Retention Agent"), "customer_success");
assert.equal(classifyAgentRole("finance_billing"), "finance");
assert.equal(classifyAgentRole("automation_workflow"), "automation");
assert.equal(classifyAgentRole("operations_ops"), "operations");
assert.equal(classifyAgentRole("unknown"), "other");
assert.equal(modulesLabel(["crm", "finance"]), "crm, finance");
assert.equal(modulesLabel([]), "—");
assert.equal(modulesLabel([{ name: "sales" }]), "sales");
assert.equal(isPendingStatus("pending_approval"), true);
assert.equal(isPendingStatus("completed"), false);
assert.equal(avg([10, 20, 30]), 20);
assert.equal(avg([]), null);

function isFounderOrAdminAccess(input) {
    const adminRoles = new Set(["super_admin", "admin", "founder", "owner"]);
    if (input.authRole === "super_admin" || input.authRole === "admin") return true;
    if (input.membershipRole && adminRoles.has(String(input.membershipRole).toLowerCase())) return true;
    return false;
}

assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "member" }), false);
assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "founder" }), true);
assert.equal(isFounderOrAdminAccess({ authRole: "admin", membershipRole: "member" }), true);

console.log("test-ai-enterprise-brain: ok");
