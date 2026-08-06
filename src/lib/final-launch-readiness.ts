/**
 * Final Launch Readiness — customer journey / UX / trust audit before first invite.
 * Read-only validation of existing surfaces; no schema or product changes.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { listMissingCriticalSecrets } from "@/src/lib/production-secrets";
import { isEmailProviderConfigured } from "@/src/lib/production-email";

export const FINAL_LAUNCH_READINESS_VERSION = "1.0.0-final-launch-readiness";

export type IssueSeverity = "critical" | "high" | "medium" | "nice";
export type AuditStatus = "pass" | "warn" | "fail";
export type LaunchDecision = "GO" | "HOLD";

export interface AuditIssue {
    id: string;
    severity: IssueSeverity;
    area: "journey" | "ux" | "trust" | "runtime";
    title: string;
    detail: string;
}

export interface AuditCheck {
    id: string;
    area: "journey" | "ux" | "trust";
    status: AuditStatus;
    detail: string;
}

export interface FinalLaunchReadinessReport {
    version: string;
    checkedAt: string;
    score: number;
    decision: LaunchDecision;
    decisionRationale: string;
    checks: AuditCheck[];
    issues: AuditIssue[];
    critical: AuditIssue[];
    high: AuditIssue[];
    medium: AuditIssue[];
    nice: AuditIssue[];
    journeySteps: Array<{ step: string; path: string; present: boolean }>;
    executiveSummary: string;
}

function ok(cwd: string, rel: string): boolean {
    return existsSync(join(cwd, rel));
}

function read(cwd: string, rel: string): string {
    try {
        return readFileSync(join(cwd, rel), "utf8");
    } catch {
        return "";
    }
}

const JOURNEY: Array<{ step: string; path: string; file: string }> = [
    { step: "Sign up", path: "/auth/sign-up", file: "app/auth/sign-up/page.tsx" },
    { step: "Email verification", path: "/auth/verify-email", file: "app/auth/verify-email/page.tsx" },
    { step: "Organization creation", path: "/onboarding", file: "app/(shell)/onboarding/page.tsx" },
    { step: "Workspace setup", path: "/onboarding", file: "src/modules/soft-launch/components/OnboardingWizard.tsx" },
    { step: "Team invitation", path: "/early-access", file: "src/modules/early-access/components/EarlyAccessPanels.tsx" },
    { step: "First login", path: "/auth/sign-in", file: "app/auth/sign-in/page.tsx" },
    { step: "First AI interaction", path: "/ai", file: "app/(shell)/ai/page.tsx" },
    { step: "First client", path: "/clients", file: "app/(shell)/clients/page.tsx" },
    { step: "First project", path: "/projects", file: "app/(shell)/projects/page.tsx" },
    { step: "First task", path: "/tasks", file: "app/(shell)/tasks/page.tsx" },
    { step: "First invoice", path: "/finance", file: "app/(shell)/finance/page.tsx" },
    { step: "Logout/Login", path: "/auth/sign-in", file: "src/modules/auth/components/AuthStatus.tsx" },
];

export function validateFinalLaunchReadiness(
    env: NodeJS.ProcessEnv = process.env,
    cwd = process.cwd(),
): FinalLaunchReadinessReport {
    const checks: AuditCheck[] = [];
    const issues: AuditIssue[] = [];

    const journeySteps = JOURNEY.map((j) => ({
        step: j.step,
        path: j.path,
        present: ok(cwd, j.file),
    }));

    for (const step of journeySteps) {
        const status: AuditStatus = step.present ? "pass" : "fail";
        checks.push({
            id: `journey_${step.step.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
            area: "journey",
            status,
            detail: step.present ? `${step.step} surface present (${step.path})` : `${step.step} surface missing (${step.path})`,
        });
        if (!step.present) {
            issues.push({
                id: `missing_${step.step}`,
                severity: "critical",
                area: "journey",
                title: `Missing customer journey step: ${step.step}`,
                detail: `Expected surface for ${step.path} is absent.`,
            });
        }
    }

    // Welcome + verify email template for journey completeness
    if (!ok(cwd, "app/auth/welcome/page.tsx")) {
        issues.push({
            id: "welcome_page",
            severity: "high",
            area: "journey",
            title: "Welcome page missing",
            detail: "Post-verify welcome route improves first-session trust.",
        });
        checks.push({ id: "journey_welcome", area: "journey", status: "warn", detail: "Welcome page missing" });
    } else {
        checks.push({ id: "journey_welcome", area: "journey", status: "pass", detail: "Welcome page present" });
    }

    // UX audit
    const uxPrimitives = [
        ["EmptyState", "src/design-os/components/EmptyState.tsx"],
        ["LoadingState", "src/design-os/components/LoadingState.tsx"],
        ["ErrorState", "src/design-os/components/ErrorState.tsx"],
        ["SkeletonLoader", "src/design-os/motion/components/SkeletonLoader.tsx"],
        ["useReducedMotion", "src/design-os/motion/hooks/useReducedMotion.ts"],
    ] as const;
    for (const [name, file] of uxPrimitives) {
        const present = ok(cwd, file);
        checks.push({
            id: `ux_${name}`,
            area: "ux",
            status: present ? "pass" : "fail",
            detail: present ? `${name} available in Design OS` : `${name} missing`,
        });
        if (!present) {
            issues.push({
                id: `ux_missing_${name}`,
                severity: "critical",
                area: "ux",
                title: `UX primitive missing: ${name}`,
                detail: file,
            });
        }
    }

    const header = read(cwd, "src/modules/company-launch-kit/components/premium/PremiumHeader.tsx");
    const hasMobileNav = header.includes("Mobile navigation") || header.includes("mobileOpen");
    checks.push({
        id: "ux_mobile_nav",
        area: "ux",
        status: hasMobileNav ? "pass" : "warn",
        detail: hasMobileNav ? "Marketing header includes mobile navigation" : "Mobile nav signals weak in PremiumHeader",
    });
    if (!hasMobileNav) {
        issues.push({
            id: "ux_mobile",
            severity: "high",
            area: "ux",
            title: "Mobile navigation incomplete",
            detail: "PremiumHeader should expose a mobile menu for Early Access visitors.",
        });
    }

    const a11yOk = header.includes("aria-label");
    checks.push({
        id: "ux_accessibility_header",
        area: "ux",
        status: a11yOk ? "pass" : "warn",
        detail: a11yOk ? "Header uses aria-label on navigation controls" : "Header accessibility labels missing",
    });
    if (!a11yOk) {
        issues.push({
            id: "ux_a11y_header",
            severity: "medium",
            area: "ux",
            title: "Header accessibility gaps",
            detail: "Add aria-labels to primary navigation controls.",
        });
    }

    const reducedMotionUsed =
        read(cwd, "src/design-os/components/EmptyState.tsx").includes("useReducedMotion") &&
        read(cwd, "src/design-os/components/LoadingState.tsx").includes("useReducedMotion");
    checks.push({
        id: "ux_motion_consistency",
        area: "ux",
        status: reducedMotionUsed ? "pass" : "warn",
        detail: reducedMotionUsed
            ? "Empty/Loading states respect reduced motion"
            : "Motion consistency incomplete across core states",
    });
    if (!reducedMotionUsed) {
        issues.push({
            id: "ux_motion",
            severity: "medium",
            area: "ux",
            title: "Motion consistency gap",
            detail: "Core state components should honor useReducedMotion.",
        });
    }

    // Performance signals — lazy/deferred marketing pieces if present
    const deferred = ok(cwd, "src/modules/company-launch-kit/components/premium/LazyOnView.tsx") ||
        ok(cwd, "src/modules/company-launch-kit/components/premium/DeferredHomeSections.tsx");
    checks.push({
        id: "ux_performance_lazy",
        area: "ux",
        status: deferred ? "pass" : "warn",
        detail: deferred ? "Deferred/lazy marketing sections present" : "No deferred home section helpers detected",
    });
    if (!deferred) {
        issues.push({
            id: "ux_perf",
            severity: "nice",
            area: "ux",
            title: "Further performance deferral",
            detail: "Consider expanding lazy-on-view usage for below-fold marketing.",
        });
    }

    // Broken-link style audit: footer legal routes exist
    const legalPages = [
        ["privacy", "app/(marketing)/privacy/page.tsx"],
        ["terms", "app/(marketing)/terms/page.tsx"],
        ["cookies", "app/(marketing)/cookies/page.tsx"],
        ["refund", "app/(marketing)/refund/page.tsx"],
    ] as const;
    const footer = read(cwd, "src/modules/company-launch-kit/components/premium/PremiumFooter.tsx");
    for (const [name, file] of legalPages) {
        const present = ok(cwd, file);
        const linked = footer.toLowerCase().includes(name);
        checks.push({
            id: `trust_link_${name}`,
            area: "trust",
            status: present && linked ? "pass" : present ? "warn" : "fail",
            detail: present && linked ? `${name} page + footer link` : present ? `${name} page present, footer link weak` : `${name} page missing`,
        });
        if (!present) {
            issues.push({
                id: `trust_missing_${name}`,
                severity: "critical",
                area: "trust",
                title: `Missing legal page: ${name}`,
                detail: file,
            });
        } else if (!linked) {
            issues.push({
                id: `trust_unlinked_${name}`,
                severity: "high",
                area: "trust",
                title: `Footer may not link ${name}`,
                detail: "Ensure PremiumFooter exposes the legal route.",
            });
        }
    }

    // Branding
    const branding = read(cwd, "src/modules/soft-launch/data/launch-assets.ts");
    const layout = read(cwd, "app/layout.tsx");
    const brandOk = branding.includes("SOFT_LAUNCH_BRANDING") || branding.includes("productName");
    const ogOk = layout.includes("openGraph") && layout.includes("SOFT_LAUNCH_BRANDING");
    checks.push({
        id: "trust_branding",
        area: "trust",
        status: brandOk && ogOk ? "pass" : "warn",
        detail: brandOk && ogOk ? "Soft-launch branding + root OG metadata aligned" : "Branding/OG consistency incomplete",
    });
    if (!(brandOk && ogOk)) {
        issues.push({
            id: "trust_brand",
            severity: "medium",
            area: "trust",
            title: "Branding consistency gap",
            detail: "Align root layout OG metadata with soft-launch brand assets.",
        });
    }

    // Copy / security / billing messaging
    const home = read(cwd, "src/modules/company-launch-kit/data/home-content.ts");
    const pricing = read(cwd, "src/modules/company-launch-kit/data/pricing.ts");
    const securityMsg = /row-level security|tenant isolation|encrypted|audit/i.test(home);
    const billingMsg = /milestone-based billing|billing|pricing/i.test(home + pricing);
    checks.push({
        id: "trust_security_messaging",
        area: "trust",
        status: securityMsg ? "pass" : "warn",
        detail: securityMsg ? "Security messaging present on marketing content" : "Security messaging thin",
    });
    checks.push({
        id: "trust_billing_messaging",
        area: "trust",
        status: billingMsg ? "pass" : "warn",
        detail: billingMsg ? "Billing/pricing messaging present" : "Billing messaging thin",
    });
    if (!securityMsg) {
        issues.push({
            id: "trust_security_copy",
            severity: "medium",
            area: "trust",
            title: "Strengthen security messaging",
            detail: "Surface RLS/tenant isolation language on public trust pages.",
        });
    }
    if (!billingMsg) {
        issues.push({
            id: "trust_billing_copy",
            severity: "medium",
            area: "trust",
            title: "Strengthen billing messaging",
            detail: "Clarify Early Access billing expectations on pricing surfaces.",
        });
    }

    // Runtime blockers that affect real customer experience at invite time
    const missingSecrets = listMissingCriticalSecrets(env);
    const emailOk = isEmailProviderConfigured(env);
    if (missingSecrets.length) {
        issues.push({
            id: "runtime_secrets",
            severity: "critical",
            area: "runtime",
            title: "Production secrets incomplete in this environment",
            detail: `Missing: ${missingSecrets.join(", ")}`,
        });
    }
    if (!emailOk) {
        issues.push({
            id: "runtime_email",
            severity: "critical",
            area: "runtime",
            title: "Email provider not configured",
            detail: "Verify-email and invite emails will fail without Resend/SMTP.",
        });
    }

    // Nice-to-haves
    if (!ok(cwd, "app/manifest.ts")) {
        issues.push({
            id: "nice_pwa",
            severity: "nice",
            area: "ux",
            title: "PWA manifest",
            detail: "Manifest already expected for soft launch — confirm present.",
        });
    } else {
        checks.push({ id: "ux_pwa", area: "ux", status: "pass", detail: "PWA manifest present" });
    }

    const fail = checks.filter((c) => c.status === "fail");
    const warn = checks.filter((c) => c.status === "warn");
    const passCount = checks.filter((c) => c.status === "pass").length;
    const score = Math.max(
        0,
        Math.min(
            100,
            Math.round(
                (passCount / Math.max(checks.length, 1)) * 100 -
                    fail.length * 8 -
                    warn.length * 2 -
                    issues.filter((i) => i.severity === "critical").length * 5,
            ),
        ),
    );

    const critical = issues.filter((i) => i.severity === "critical");
    const high = issues.filter((i) => i.severity === "high");
    const medium = issues.filter((i) => i.severity === "medium");
    const nice = issues.filter((i) => i.severity === "nice");

    // GO only when no critical issues and journey fully present
    const journeyComplete = journeySteps.every((s) => s.present);
    const decision: LaunchDecision = critical.length === 0 && journeyComplete && score >= 75 ? "GO" : "HOLD";
    const decisionRationale =
        decision === "GO"
            ? "Customer journey, UX primitives, and trust surfaces clear critical bar — safe to send first invitation."
            : critical.length
              ? `HOLD: ${critical.length} critical issue(s) block first invitation.`
              : `HOLD: score ${score}/100 or journey/trust gaps remain.`;

    return {
        version: FINAL_LAUNCH_READINESS_VERSION,
        checkedAt: new Date().toISOString(),
        score,
        decision,
        decisionRationale,
        checks,
        issues,
        critical,
        high,
        medium,
        nice,
        journeySteps,
        executiveSummary: [
            `Final Launch Readiness ${FINAL_LAUNCH_READINESS_VERSION}.`,
            `Score ${score}/100 · Decision ${decision}.`,
            `Journey ${journeySteps.filter((s) => s.present).length}/${journeySteps.length}.`,
            `Issues: ${critical.length} critical · ${high.length} high · ${medium.length} medium · ${nice.length} nice.`,
            decisionRationale,
        ].join(" "),
    };
}
