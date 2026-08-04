import type { SecurityPolicyResult, UserContext } from "../types";
import { hasPermission } from "../engine/rbac-engine";

export const SECURITY_POLICIES = [
    {
        id: "security-center-access",
        name: "Security Center Access",
        description: "Requires security:dashboard permission for Security Center operations.",
        enforced: true,
    },
    {
        id: "mfa-enrollment",
        name: "MFA Enrollment",
        description: "Sensitive actions require MFA enrollment when policy is enforced.",
        enforced: true,
    },
    {
        id: "org-isolation",
        name: "Organization Isolation",
        description: "All tenant resources must be scoped to organization context.",
        enforced: true,
    },
    {
        id: "no-hardcoded-secrets",
        name: "No Hardcoded Secrets",
        description: "Secrets must be loaded from environment or vault — never hardcoded.",
        enforced: true,
    },
] as const;

export function enforceCapabilityAccess(
    capabilityId: string,
    userContext: UserContext,
): SecurityPolicyResult {
    if (!hasPermission(userContext.role, "security:dashboard")) {
        return {
            allowed: false,
            capabilityId,
            action: "access",
            reason: "Insufficient permissions for Security Center",
        };
    }
    return { allowed: true, capabilityId, action: "access" };
}
