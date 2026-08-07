/**
 * AI Operations & Monitoring Center — pure helper checks.
 */
import assert from "node:assert/strict";

function classifyHealthDomain(type, name = "") {
    const s = `${type} ${name}`.toLowerCase();
    if (s.includes("database") || s.includes("postgres") || s.includes("supabase") || s.includes("sql")) {
        return "database";
    }
    if (s.includes("queue") || s.includes("retry") || s.includes("dead") || s.includes("bus")) return "queue";
    if (s.includes("storage") || s.includes("blob") || s.includes("s3") || s.includes("bucket")) return "storage";
    if (s.includes("job") || s.includes("scheduler") || s.includes("worker") || s.includes("background")) {
        return "background_jobs";
    }
    if (s.includes("api") || s.includes("service") || s.includes("gateway") || s.includes("http")) return "api";
    return "api";
}

function classifyAlertSeverity(severity) {
    const s = String(severity).toLowerCase();
    if (s.includes("crit") || s.includes("fatal") || s.includes("p0") || s.includes("sev1")) return "critical";
    if (s.includes("warn") || s.includes("p1") || s.includes("sev2") || s.includes("high")) return "warning";
    return "info";
}

function classifyLogKind(level, source, message = "") {
    const s = `${level} ${source} ${message}`.toLowerCase();
    if (s.includes("workflow") || s.includes("automation") || s.includes("dwe")) return "workflow";
    if (s.includes("ai") || s.includes("agent") || s.includes("llm") || s.includes("token")) return "ai_execution";
    return "application";
}

function isSuspiciousEvent(action, title, detail = "", securityLevel = "") {
    const s = `${action} ${title} ${detail} ${securityLevel}`.toLowerCase();
    return (
        s.includes("fail")
        || s.includes("suspicious")
        || s.includes("breach")
        || s.includes("unauthorized")
        || s.includes("denied")
        || s.includes("threat")
        || s.includes("anomaly")
        || s.includes("high")
        || s.includes("critical")
    );
}

function isFounderOrAdminAccess(input) {
    const adminRoles = new Set(["super_admin", "admin", "founder", "owner"]);
    if (input.authRole === "super_admin" || input.authRole === "admin") return true;
    if (input.membershipRole && adminRoles.has(String(input.membershipRole).toLowerCase())) return true;
    return false;
}

assert.equal(classifyHealthDomain("database_pool"), "database");
assert.equal(classifyHealthDomain("retry queue"), "queue");
assert.equal(classifyHealthDomain("s3 storage"), "storage");
assert.equal(classifyHealthDomain("background worker"), "background_jobs");
assert.equal(classifyHealthDomain("api gateway"), "api");
assert.equal(classifyAlertSeverity("critical"), "critical");
assert.equal(classifyAlertSeverity("warning"), "warning");
assert.equal(classifyLogKind("info", "workflow-engine"), "workflow");
assert.equal(classifyLogKind("info", "ai-agent", "token usage"), "ai_execution");
assert.equal(classifyLogKind("info", "app"), "application");
assert.equal(isSuspiciousEvent("login_failed", "Denied access"), true);
assert.equal(isSuspiciousEvent("view", "dashboard"), false);
assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "member" }), false);
assert.equal(isFounderOrAdminAccess({ authRole: "member", membershipRole: "founder" }), true);

console.log("test-ai-operations-center: ok");
