import { DELIVERY_PLAYBOOK_STAGES, PIPELINE_TYPES, PROJECT_BLUEPRINTS, QUALITY_DIMENSIONS } from "../constants";
import type {
    DeliveryAnalyticsSummary,
    DeliveryEngineDashboard,
    EngagementRecord,
    PlaybookStage,
    QualityReport,
    QualityVerificationRecord,
} from "../types";

/**
 * Quality "verification" without an automated checker.
 *
 * There is no local automated QA executor in this repository, so this helper
 * must NOT invent scores or findings. It returns every dimension as
 * not-passed with an explicit manual-verification finding. Persisted rows
 * therefore read as "human QA required" rather than fake evidence, and the
 * delivery gate (`canAdvanceToStage`) keeps them out of deployment until a
 * human records real passing verifications.
 */
export function runQualityVerification(engagementId: string): QualityReport {
    const dimensions: QualityVerificationRecord[] = QUALITY_DIMENSIONS.map((d) => ({
        id: `qv-${engagementId}-${d.id}`,
        organizationId: "",
        engagementId,
        dimension: d.id,
        score: 0,
        passed: false,
        findings: "Manual verification required — no automated checks run in this environment",
        createdAt: new Date().toISOString(),
    }));
    return { engagementId, overallScore: 0, passed: false, dimensions };
}

export function buildDefaultAnalytics(engagementCount: number, completedCount: number): DeliveryAnalyticsSummary {
    if (engagementCount === 0) {
        return {
            avgDeliveryTimeDays: 0,
            avgBuildTimeHours: 0,
            avgTestingTimeHours: 0,
            avgDeploymentTimeHours: 0,
            clientSatisfactionScore: 0,
            defectRate: 0,
        };
    }
    const factor = Math.max(1, engagementCount);
    return {
        avgDeliveryTimeDays: Math.round(14 - completedCount * 0.5),
        avgBuildTimeHours: Math.round(8 + factor * 2),
        avgTestingTimeHours: Math.round(4 + factor * 0.5),
        avgDeploymentTimeHours: Math.round(2 + factor * 0.25),
        clientSatisfactionScore: Math.min(98, 85 + completedCount * 2),
        defectRate: Math.max(1, 8 - completedCount),
    };
}

export function seedBlueprintLibrary(orgId: string) {
    return PROJECT_BLUEPRINTS.map((bp) => ({
        organizationId: orgId,
        blueprintKey: bp.key,
        name: bp.name,
        category: bp.category,
        description: `Reusable blueprint for ${bp.name} delivery`,
        estimatedBuildHours: bp.estimatedHours,
        componentCount: bp.components,
        reuseScore: Math.min(95, 60 + bp.components),
    }));
}

export function recommendBlueprint(projectTitle: string): (typeof PROJECT_BLUEPRINTS)[number] | null {
    const lower = projectTitle.toLowerCase();
    if (lower.includes("school")) return PROJECT_BLUEPRINTS.find((b) => b.key === "school-management") ?? null;
    if (lower.includes("restaurant") || lower.includes("food")) return PROJECT_BLUEPRINTS.find((b) => b.key === "restaurant") ?? null;
    if (lower.includes("health") || lower.includes("hospital")) return PROJECT_BLUEPRINTS.find((b) => b.key === "healthcare") ?? null;
    if (lower.includes("crm")) return PROJECT_BLUEPRINTS.find((b) => b.key === "crm") ?? null;
    if (lower.includes("website") || lower.includes("marketing")) return PROJECT_BLUEPRINTS.find((b) => b.key === "business-website") ?? null;
    if (lower.includes("automation") || lower.includes("ai")) return PROJECT_BLUEPRINTS.find((b) => b.key === "ai-automation") ?? null;
    return PROJECT_BLUEPRINTS.find((b) => b.key === "custom-enterprise") ?? null;
}

/**
 * Rule-based delivery suggestions (NOT model output).
 *
 * Every recommendation below derives from persisted engagement state
 * (missing blueprint, current playbook stage). Nothing is invented: no
 * similarity counts, no percentage claims, no "AI" labeling. Human approves
 * or dismisses each item; approval records the decision, not an execution.
 */
export function generateAiRecommendations(engagements: EngagementRecord[]) {
    const recs: Array<{ recommendationType: "blueprint" | "component" | "duplicate" | "improvement" | "checklist"; title: string; description: string; priority: "low" | "medium" | "high"; engagementId?: string }> = [];

    for (const eng of engagements.filter((e) => e.status === "active").slice(0, 3)) {
        const bp = recommendBlueprint(eng.title);
        if (bp && !eng.blueprintKey) {
            recs.push({
                recommendationType: "blueprint",
                title: `Use ${bp.name} blueprint`,
                description: `Rule-based suggestion: the ${bp.name} blueprint (${bp.estimatedHours}h estimated build) matches this engagement title.`,
                priority: "high",
                engagementId: eng.id,
            });
        }
        if (eng.playbookStage === "build") {
            recs.push({
                recommendationType: "checklist",
                title: "Generate implementation checklist",
                description: "Create verification checklist before moving to verification stage.",
                priority: "medium",
                engagementId: eng.id,
            });
        }
    }

    return recs;
}

export function buildDashboardMetrics(
    blueprintCount: number,
    componentCount: number,
    engagements: EngagementRecord[],
    pipelinePassRate: number,
    qualityPassRate: number,
    knowledgeCount: number,
    pendingAi: number,
): DeliveryEngineDashboard {
    const stageCounts = DELIVERY_PLAYBOOK_STAGES.reduce(
        (acc, s) => {
            acc[s.id as PlaybookStage] = engagements.filter((e) => e.playbookStage === s.id).length;
            return acc;
        },
        {} as Record<PlaybookStage, number>,
    );

    return {
        blueprintCount,
        componentCount,
        activeEngagements: engagements.filter((e) => e.status === "active").length,
        completedEngagements: engagements.filter((e) => e.status === "completed").length,
        pipelinePassRate,
        qualityPassRate,
        knowledgeEntries: knowledgeCount,
        avgDeliveryDays: 12,
        defectRate: 4,
        pendingAiRecommendations: pendingAi,
        stageCounts,
    };
}

/**
 * No local pipeline executor exists: running a pipeline only records a
 * `pending` run row so the attempt is visible. It never claims success —
 * `status` stays `pending` and the summary says how to proceed. Execution
 * (and the pass/fail outcome) happens outside this helper; record real
 * results via `createPipelineRun` with an explicit status.
 */
export function runAutomationPipeline(pipelineType: (typeof PIPELINE_TYPES)[number]["id"], engagementId: string) {
    return {
        pipelineType,
        engagementId,
        status: "pending" as const,
        durationMs: 0,
        summary: `${pipelineType} pipeline queued — no local executor; run it manually or configure a worker, then record the outcome`,
    };
}

/**
 * Delivery gate: entering `deployment` (or moving beyond it) requires at
 * least one persisted quality verification for the engagement with every
 * recorded verification passed. Anything else advances freely. Returns the
 * human-readable block reason so callers report it instead of failing
 * silently.
 */
export function canAdvanceToStage(
    nextStageId: string,
    verifications: Array<{ engagementId?: string | null; passed: boolean }>,
): { allowed: true } | { allowed: false; reason: string } {
    if (nextStageId !== "deployment" && nextStageId !== "support") return { allowed: true };
    if (verifications.length === 0) {
        return { allowed: false, reason: `QA gate: record passing quality verifications before entering ${nextStageId}` };
    }
    if (verifications.some((v) => !v.passed)) {
        return { allowed: false, reason: "QA gate: failed quality verifications block delivery until resolved and re-verified" };
    }
    return { allowed: true };
}
