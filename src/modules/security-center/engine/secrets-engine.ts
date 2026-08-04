import type { SecretEntry } from "../types";

const REQUIRED_ENV_KEYS = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
] as const;

const HARDCODED_SECRET_PATTERNS = [
    /sk_live_[a-zA-Z0-9]+/,
    /AKIA[0-9A-Z]{16}/,
    /ghp_[a-zA-Z0-9]{36}/,
];

export function listSecrets(): SecretEntry[] {
    const now = new Date().toISOString();
    return REQUIRED_ENV_KEYS.map((key) => ({
        key,
        source: "env" as const,
        required: true,
        present: typeof process.env[key] === "string" && process.env[key]!.length > 0,
        rotatedAt: now,
    }));
}

export function validateEnvironment(): { valid: boolean; missing: string[]; hardcodedViolations: string[] } {
    const missing = REQUIRED_ENV_KEYS.filter(
        (key) => !process.env[key] || process.env[key]!.length === 0,
    );
    return {
        valid: missing.length === 0,
        missing: [...missing],
        hardcodedViolations: [],
    };
}

export function scanForHardcodedSecrets(source: string): string[] {
    const violations: string[] = [];
    for (const pattern of HARDCODED_SECRET_PATTERNS) {
        if (pattern.test(source)) {
            violations.push(pattern.source);
        }
    }
    return violations;
}

export function validateNoHardcodedSecrets(modulesSource: string): boolean {
    return scanForHardcodedSecrets(modulesSource).length === 0;
}
