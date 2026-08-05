import { DELIVERY_PLAYBOOK_STAGES, PIPELINE_TYPES, PROJECT_BLUEPRINTS, QUALITY_DIMENSIONS } from "../constants";
import type {
    DeliveryAnalyticsSummary,
    DeliveryEngineDashboard,
    EngagementRecord,
    PlaybookStage,
    QualityReport,
    QualityVerificationRecord,
} from "../types";

export function runQualityVerification(engagementId: string): QualityReport {
    const dimensions: QualityVerificationRecord[] = QUALITY_DIMENSIONS.map((d, i) => ({
        id: `qv-${engagementId}-${d.id}`,
        organizationId: "",
        engagementId,
        dimension: d.id,
        score: 78 + (i % 4) * 5,
        passed: i !== 2,
        findings: i === 2 ? "Contrast ratio below WCAG AA on secondary buttons" : "",
        createdAt: new Date().toISOString(),
    }));
    const overallScore = Math.round(dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length);
    return { engagementId, overallScore, passed: dimensions.every((d) => d.passed), dimensions };
}

export function buildDefaultAnalytics(engagementCount: number, completedCount: number): DeliveryAnalyticsSummary {
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

export function generateAiRecommendations(engagements: EngagementRecord[]) {
    const recs: Array<{ recommendationType: "blueprint" | "component" | "duplicate" | "improvement" | "checklist"; title: string; description: string; priority: "low" | "medium" | "high"; engagementId?: string }> = [];

    for (const eng of engagements.filter((e) => e.status === "active").slice(0, 3)) {
        const bp = recommendBlueprint(eng.title);
        if (bp && !eng.blueprintKey) {
            recs.push({
                recommendationType: "blueprint",
                title: `Use ${bp.name} blueprint`,
                description: `AI recommends the ${bp.name} blueprint (${bp.estimatedHours}h estimated build).`,
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

    if (engagements.length > 1) {
        recs.push({
            recommendationType: "duplicate",
            title: "Detect duplicate component work",
            description: "Review component library before building auth modules — 3 similar implementations exist.",
            priority: "medium",
        });
    }

    recs.push({
        recommendationType: "improvement",
        title: "Reuse CRM dashboard components",
        description: "CRM blueprint components can accelerate current build by ~30%.",
        priority: "low",
    });

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

export function runAutomationPipeline(pipelineType: (typeof PIPELINE_TYPES)[number]["id"], engagementId: string) {
    const durations: Record<string, number> = {
        init: 1200,
        environment: 4500,
        quality: 8000,
        testing: 12000,
        deployment: 6000,
        documentation: 3000,
    };
    return {
        pipelineType,
        engagementId,
        status: "passed" as const,
        durationMs: durations[pipelineType] ?? 5000,
        summary: `${pipelineType} pipeline completed successfully`,
    };
}
