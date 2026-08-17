"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/src/components/ui/card";
import { EmptyState } from "@/src/components/ui/EmptyState";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import {
    BUG_PRIORITY_OPTIONS,
    PIPELINE_STAGE_OPTIONS,
    RISK_LEVEL_OPTIONS,
    SEVERITY_OPTIONS,
    TEST_PRIORITY_OPTIONS,
    WCAG_LEVEL_OPTIONS,
} from "@/src/modules/qa-engineer/constants";
import type { useQaEngineer } from "@/src/modules/qa-engineer/hooks/useQaEngineer";
import {
    accessibilityValidationFormSchema,
    apiValidationFormSchema,
    bugTriageFormSchema,
    coverageAnalyticsFormSchema,
    databaseValidationFormSchema,
    defectAnalysisFormSchema,
    e2eTestPlanFormSchema,
    engagementFormSchema,
    integrationTestPlanFormSchema,
    performanceValidationFormSchema,
    qualityScoreFormSchema,
    regressionAnalysisFormSchema,
    releaseReadinessFormSchema,
    riskBasedTestFormSchema,
    securityValidationFormSchema,
    testStrategyFormSchema,
    uiValidationFormSchema,
    unitTestPlanFormSchema,
    type AccessibilityValidationFormValues,
    type ApiValidationFormValues,
    type BugTriageFormValues,
    type CoverageAnalyticsFormValues,
    type DatabaseValidationFormValues,
    type DefectAnalysisFormValues,
    type E2eTestPlanFormValues,
    type EngagementFormValues,
    type IntegrationTestPlanFormValues,
    type PerformanceValidationFormValues,
    type QualityScoreFormValues,
    type RegressionAnalysisFormValues,
    type ReleaseReadinessFormValues,
    type RiskBasedTestFormValues,
    type SecurityValidationFormValues,
    type TestStrategyFormValues,
    type UiValidationFormValues,
    type UnitTestPlanFormValues,
} from "@/src/modules/qa-engineer/schemas";

type QaEngineerData = ReturnType<typeof useQaEngineer>;
const inputClass = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-rose-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950";
function SaveButton({ loading, label = "Save changes" }: { loading?: boolean; label?: string }) {
    return <button type="submit" disabled={loading} className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-500 disabled:opacity-60">{loading ? "Saving..." : label}</button>;
}
function ListCard({ title, subtitle, meta }: { title: string; subtitle: string; meta?: string }) {
    return <div className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800"><p className="font-medium">{title}</p><p className="text-sm text-slate-500">{subtitle}</p>{meta ? <p className="mt-1 text-xs text-rose-600">{meta}</p> : null}</div>;
}

export function QaOverviewPanel({ data }: { data: QaEngineerData }) {
    const pipeline = data.pipeline;
    return (
        <div className="grid gap-6 xl:grid-cols-2">
            <Card hover><SectionHeader title="QA engineer summary" description="Engagement and quality assurance metrics" /><div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ListCard title="Engagements" subtitle={`${data.stats?.totalEngagements ?? 0} total`} meta={`${data.stats?.activeEngagements ?? 0} active`} />
                <ListCard title="Test Plans" subtitle={`${data.stats?.unitTestPlanCount ?? 0} unit • ${data.stats?.integrationTestPlanCount ?? 0} integration`} meta={`${data.stats?.e2eTestPlanCount ?? 0} E2E • ${data.stats?.testStrategyCount ?? 0} strategies`} />
                <ListCard title="Validations" subtitle={`${data.stats?.securityValidationCount ?? 0} security • ${data.stats?.performanceValidationCount ?? 0} performance`} meta={`${data.stats?.accessibilityValidationCount ?? 0} accessibility • ${data.stats?.apiValidationCount ?? 0} API`} />
                <ListCard title="Quality & Release" subtitle={`${data.stats?.openBugCount ?? 0} open bugs`} meta={`${data.stats?.pendingReleaseReadiness ?? 0} pending release • ${data.stats?.qualityScoreCount ?? 0} quality scores`} />
            </div></Card>
            <Card hover><SectionHeader title="AI worker pipeline" description={`${pipeline?.previousWorker ?? "AI Development Factory"} → ${pipeline?.currentWorker ?? "AI QA Engineer"} → ${pipeline?.nextWorker ?? "Deployment"}`} /><div className="mt-6 space-y-3">
                {pipeline?.stages?.length ? pipeline.stages.map((stage) => (
                    <ListCard key={stage.key} title={stage.label} subtitle={stage.key} meta={PIPELINE_STAGE_OPTIONS.find((o) => o.value === stage.key)?.label ?? stage.label} />
                )) : <EmptyState title="No pipeline data" description="Pipeline stages will appear as engagements progress through the AI worker chain." />}
            </div></Card>
        </div>
    );
}

export function EngagementsPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<EngagementFormValues>({ resolver: zodResolver(engagementFormSchema), defaultValues: { title: "", engagementKey: "", baEngagementId: "", saEngagementId: "", dfEngagementId: "", solutionArchitectureId: "", workPackageId: "", brdId: "", frsId: "", clientId: "", projectId: "", agentId: "", sessionId: "", summary: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="QA engagements" description="QA engagements linked to BA, SA, and DF deliverables" /><div className="mt-6 space-y-3">
                {data.engagements.length === 0 ? <EmptyState title="No engagements" description="Start a new QA engagement from development factory outputs." /> : data.engagements.map((e) => (
                    <ListCard key={e.id} title={e.title} subtitle={`${e.engagementKey} • ${e.pipelineStage}`} meta={`${e.status}${e.baEngagementTitle ? ` • BA: ${e.baEngagementTitle}` : ""}${e.saEngagementTitle ? ` • SA: ${e.saEngagementTitle}` : ""}${e.dfEngagementTitle ? ` • DF: ${e.dfEngagementTitle}` : ""}${e.workPackageTitle ? ` • WP: ${e.workPackageTitle}` : ""}${e.solutionArchitectureTitle ? ` • Arch: ${e.solutionArchitectureTitle}` : ""}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create engagement" description="Start a new QA engineering engagement" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createEngagement(v))}>
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <input {...form.register("engagementKey")} placeholder="Engagement key" className={inputClass} />
                <select {...form.register("baEngagementId")} className={inputClass}><option value="">BA engagement</option>{data.baEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("saEngagementId")} className={inputClass}><option value="">SA engagement</option>{data.saEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("dfEngagementId")} className={inputClass}><option value="">DF engagement</option>{data.dfEngagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <select {...form.register("workPackageId")} className={inputClass}><option value="">Work package</option>{data.workPackageOptions.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</select>
                <select {...form.register("solutionArchitectureId")} className={inputClass}><option value="">Solution architecture</option>{data.solutionArchitectureOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                <select {...form.register("brdId")} className={inputClass}><option value="">BRD</option>{data.brdOptions.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
                <select {...form.register("frsId")} className={inputClass}><option value="">FRS</option>{data.frsOptions.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
                <select {...form.register("clientId")} className={inputClass}><option value="">Client</option>{data.clientOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <select {...form.register("projectId")} className={inputClass}><option value="">Project</option>{data.projectOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                <select {...form.register("agentId")} className={inputClass}><option value="">AI agent</option>{data.agentOptions.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                <textarea {...form.register("summary")} placeholder="Summary" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create engagement" />
            </form></Card>
        </div>
    );
}

export function TestStrategiesPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<TestStrategyFormValues>({ resolver: zodResolver(testStrategyFormSchema), defaultValues: { engagementId: "", strategyKey: "", title: "", scope: "", approach: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Test strategies" description="QA test strategy documents" /><div className="mt-6 space-y-3">
                {data.testStrategies.length === 0 ? <EmptyState title="No test strategies" description="Define test strategies for QA engagements." /> : data.testStrategies.map((s) => (
                    <ListCard key={s.id} title={s.title} subtitle={`${s.strategyKey} • ${s.engagementTitle}`} meta={`${s.status} • ${s.testLevelCount} levels • ${s.scopePreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create test strategy" description="Define a test strategy" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createTestStrategy(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("strategyKey")} placeholder="Strategy key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <textarea {...form.register("scope")} placeholder="Scope" rows={2} className={inputClass} />
                <textarea {...form.register("approach")} placeholder="Approach" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create strategy" />
            </form></Card>
        </div>
    );
}

export function UnitTestsPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<UnitTestPlanFormValues>({ resolver: zodResolver(unitTestPlanFormSchema), defaultValues: { engagementId: "", planKey: "", name: "", targetModules: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Unit test plans" description="Unit test plan definitions" /><div className="mt-6 space-y-3">
                {data.unitTestPlans.length === 0 ? <EmptyState title="No unit test plans" description="Create unit test plans for modules under test." /> : data.unitTestPlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.engagementTitle}`} meta={`${p.status} • ${p.testCaseCount} cases • ${p.targetModules}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create unit test plan" description="Define a unit test plan" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createUnitTestPlan(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input {...form.register("targetModules")} placeholder="Target modules" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create plan" />
            </form></Card>
        </div>
    );
}

export function IntegrationTestsPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<IntegrationTestPlanFormValues>({ resolver: zodResolver(integrationTestPlanFormSchema), defaultValues: { engagementId: "", planKey: "", name: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Integration test plans" description="Integration test scenarios and points" /><div className="mt-6 space-y-3">
                {data.integrationTestPlans.length === 0 ? <EmptyState title="No integration test plans" description="Define integration test plans." /> : data.integrationTestPlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.engagementTitle}`} meta={`${p.status} • ${p.integrationPointCount} points • ${p.scenarioCount} scenarios`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create integration test plan" description="Define an integration test plan" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createIntegrationTestPlan(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create plan" />
            </form></Card>
        </div>
    );
}

export function E2eTestsPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<E2eTestPlanFormValues>({ resolver: zodResolver(e2eTestPlanFormSchema), defaultValues: { engagementId: "", planKey: "", name: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="E2E test plans" description="End-to-end user journey test plans" /><div className="mt-6 space-y-3">
                {data.e2eTestPlans.length === 0 ? <EmptyState title="No E2E test plans" description="Define end-to-end test plans." /> : data.e2eTestPlans.map((p) => (
                    <ListCard key={p.id} title={p.name} subtitle={`${p.planKey} • ${p.engagementTitle}`} meta={`${p.status} • ${p.journeyCount} journeys • ${p.scenarioCount} scenarios`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create E2E test plan" description="Define an E2E test plan" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createE2eTestPlan(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("planKey")} placeholder="Plan key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create plan" />
            </form></Card>
        </div>
    );
}

export function RegressionPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<RegressionAnalysisFormValues>({ resolver: zodResolver(regressionAnalysisFormSchema), defaultValues: { engagementId: "", analysisKey: "", name: "", regressionRisks: "", recommendations: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Regression analyses" description="Regression risk assessments" /><div className="mt-6 space-y-3">
                {data.regressionAnalyses.length === 0 ? <EmptyState title="No regression analyses" description="Run regression analysis on changed areas." /> : data.regressionAnalyses.map((a) => (
                    <ListCard key={a.id} title={a.name} subtitle={`${a.analysisKey} • ${a.engagementTitle}`} meta={`${a.status} • ${a.affectedAreaCount} areas • ${a.risksPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create regression analysis" description="Record a regression analysis" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRegressionAnalysis(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("analysisKey")} placeholder="Analysis key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <textarea {...form.register("regressionRisks")} placeholder="Regression risks" rows={2} className={inputClass} />
                <textarea {...form.register("recommendations")} placeholder="Recommendations" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create analysis" />
            </form></Card>
        </div>
    );
}

export function RiskBasedTestingPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<RiskBasedTestFormValues>({ resolver: zodResolver(riskBasedTestFormSchema), defaultValues: { engagementId: "", testKey: "", name: "", riskLevel: "medium", testPriority: "medium" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Risk-based tests" description="Risk-prioritized test definitions" /><div className="mt-6 space-y-3">
                {data.riskBasedTests.length === 0 ? <EmptyState title="No risk-based tests" description="Define risk-based test priorities." /> : data.riskBasedTests.map((t) => (
                    <ListCard key={t.id} title={t.name} subtitle={`${t.testKey} • ${t.engagementTitle}`} meta={`${RISK_LEVEL_OPTIONS.find((o) => o.value === t.riskLevel)?.label ?? t.riskLevel} risk • ${TEST_PRIORITY_OPTIONS.find((o) => o.value === t.testPriority)?.label ?? t.testPriority} priority • ${t.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create risk-based test" description="Define a risk-based test" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createRiskBasedTest(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("testKey")} placeholder="Test key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("riskLevel")} className={inputClass}>{RISK_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <select {...form.register("testPriority")} className={inputClass}>{TEST_PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <SaveButton loading={form.formState.isSubmitting} label="Create test" />
            </form></Card>
        </div>
    );
}

export function SecurityValidationsPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<SecurityValidationFormValues>({ resolver: zodResolver(securityValidationFormSchema), defaultValues: { engagementId: "", validationKey: "", name: "", findings: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Security validations" description="Security test validations and findings" /><div className="mt-6 space-y-3">
                {data.securityValidations.length === 0 ? <EmptyState title="No security validations" description="Run security validation checks." /> : data.securityValidations.map((v) => (
                    <ListCard key={v.id} title={v.name} subtitle={`${v.validationKey} • ${v.engagementTitle}`} meta={`${v.checkCount} checks • ${v.status} • ${v.findingsPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create security validation" description="Record a security validation" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createSecurityValidation(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("validationKey")} placeholder="Validation key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <textarea {...form.register("findings")} placeholder="Findings" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create validation" />
            </form></Card>
        </div>
    );
}

export function PerformanceValidationsPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<PerformanceValidationFormValues>({ resolver: zodResolver(performanceValidationFormSchema), defaultValues: { engagementId: "", validationKey: "", name: "", results: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Performance validations" description="Performance test results and targets" /><div className="mt-6 space-y-3">
                {data.performanceValidations.length === 0 ? <EmptyState title="No performance validations" description="Run performance validation tests." /> : data.performanceValidations.map((v) => (
                    <ListCard key={v.id} title={v.name} subtitle={`${v.validationKey} • ${v.engagementTitle}`} meta={`${v.targetCount} targets • ${v.status} • ${v.resultsPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create performance validation" description="Record a performance validation" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createPerformanceValidation(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("validationKey")} placeholder="Validation key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <textarea {...form.register("results")} placeholder="Results" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create validation" />
            </form></Card>
        </div>
    );
}

export function AccessibilityValidationsPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<AccessibilityValidationFormValues>({ resolver: zodResolver(accessibilityValidationFormSchema), defaultValues: { engagementId: "", validationKey: "", name: "", wcagLevel: "AA", findings: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Accessibility validations" description="WCAG accessibility compliance checks" /><div className="mt-6 space-y-3">
                {data.accessibilityValidations.length === 0 ? <EmptyState title="No accessibility validations" description="Run accessibility validation checks." /> : data.accessibilityValidations.map((v) => (
                    <ListCard key={v.id} title={v.name} subtitle={`${v.validationKey} • ${v.engagementTitle}`} meta={`${WCAG_LEVEL_OPTIONS.find((o) => o.value === v.wcagLevel)?.label ?? v.wcagLevel} • ${v.checkCount} checks • ${v.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create accessibility validation" description="Record an accessibility validation" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createAccessibilityValidation(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("validationKey")} placeholder="Validation key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <select {...form.register("wcagLevel")} className={inputClass}>{WCAG_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("findings")} placeholder="Findings" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create validation" />
            </form></Card>
        </div>
    );
}

export function ApiValidationsPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<ApiValidationFormValues>({ resolver: zodResolver(apiValidationFormSchema), defaultValues: { engagementId: "", validationKey: "", name: "", validationResults: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="API validations" description="API endpoint validation results" /><div className="mt-6 space-y-3">
                {data.apiValidations.length === 0 ? <EmptyState title="No API validations" description="Validate API endpoints against contracts." /> : data.apiValidations.map((v) => (
                    <ListCard key={v.id} title={v.name} subtitle={`${v.validationKey} • ${v.engagementTitle}`} meta={`${v.endpointCount} endpoints • ${v.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create API validation" description="Record an API validation" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createApiValidation(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("validationKey")} placeholder="Validation key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <textarea {...form.register("validationResults")} placeholder="Validation results" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create validation" />
            </form></Card>
        </div>
    );
}

export function DatabaseValidationsPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<DatabaseValidationFormValues>({ resolver: zodResolver(databaseValidationFormSchema), defaultValues: { engagementId: "", validationKey: "", name: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Database validations" description="Schema and data integrity checks" /><div className="mt-6 space-y-3">
                {data.databaseValidations.length === 0 ? <EmptyState title="No database validations" description="Validate database schema and integrity." /> : data.databaseValidations.map((v) => (
                    <ListCard key={v.id} title={v.name} subtitle={`${v.validationKey} • ${v.engagementTitle}`} meta={`${v.schemaCheckCount} schema • ${v.integrityCheckCount} integrity • ${v.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create database validation" description="Record a database validation" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDatabaseValidation(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("validationKey")} placeholder="Validation key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create validation" />
            </form></Card>
        </div>
    );
}

export function UiValidationsPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<UiValidationFormValues>({ resolver: zodResolver(uiValidationFormSchema), defaultValues: { engagementId: "", validationKey: "", name: "", validationResults: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="UI validations" description="UI component validation results" /><div className="mt-6 space-y-3">
                {data.uiValidations.length === 0 ? <EmptyState title="No UI validations" description="Validate UI components and layouts." /> : data.uiValidations.map((v) => (
                    <ListCard key={v.id} title={v.name} subtitle={`${v.validationKey} • ${v.engagementTitle}`} meta={`${v.componentCount} components • ${v.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create UI validation" description="Record a UI validation" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createUiValidation(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("validationKey")} placeholder="Validation key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <textarea {...form.register("validationResults")} placeholder="Validation results" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create validation" />
            </form></Card>
        </div>
    );
}

export function BugTriagePanel({ data }: { data: QaEngineerData }) {
    const form = useForm<BugTriageFormValues>({ resolver: zodResolver(bugTriageFormSchema), defaultValues: { engagementId: "", bugKey: "", title: "", severity: "medium", priority: "medium", triageNotes: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Bug triage" description="Bug severity and priority triage" /><div className="mt-6 space-y-3">
                {data.bugTriages.length === 0 ? <EmptyState title="No bug triage entries" description="Triage bugs found during QA." /> : data.bugTriages.map((b) => (
                    <ListCard key={b.id} title={b.title} subtitle={`${b.bugKey} • ${b.engagementTitle}`} meta={`${SEVERITY_OPTIONS.find((o) => o.value === b.severity)?.label ?? b.severity} severity • ${BUG_PRIORITY_OPTIONS.find((o) => o.value === b.priority)?.label ?? b.priority} priority • ${b.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create bug triage" description="Record a bug triage entry" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createBugTriage(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("bugKey")} placeholder="Bug key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <select {...form.register("severity")} className={inputClass}>{SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <select {...form.register("priority")} className={inputClass}>{BUG_PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
                <textarea {...form.register("triageNotes")} placeholder="Triage notes" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create triage" />
            </form></Card>
        </div>
    );
}

export function DefectAnalysisPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<DefectAnalysisFormValues>({ resolver: zodResolver(defectAnalysisFormSchema), defaultValues: { engagementId: "", analysisKey: "", title: "", rootCause: "", impactAnalysis: "", remediation: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Defect analyses" description="Root cause and impact analysis" /><div className="mt-6 space-y-3">
                {data.defectAnalyses.length === 0 ? <EmptyState title="No defect analyses" description="Analyze defects for root cause and remediation." /> : data.defectAnalyses.map((a) => (
                    <ListCard key={a.id} title={a.title} subtitle={`${a.analysisKey} • ${a.engagementTitle}`} meta={`${a.status} • ${a.rootCausePreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create defect analysis" description="Record a defect analysis" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createDefectAnalysis(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("analysisKey")} placeholder="Analysis key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <textarea {...form.register("rootCause")} placeholder="Root cause" rows={2} className={inputClass} />
                <textarea {...form.register("impactAnalysis")} placeholder="Impact analysis" rows={2} className={inputClass} />
                <textarea {...form.register("remediation")} placeholder="Remediation" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create analysis" />
            </form></Card>
        </div>
    );
}

export function CoverageAnalyticsPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<CoverageAnalyticsFormValues>({ resolver: zodResolver(coverageAnalyticsFormSchema), defaultValues: { engagementId: "", analyticsKey: "", name: "", coveragePercent: 0, gaps: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Coverage analytics" description="Test coverage metrics and gaps" /><div className="mt-6 space-y-3">
                {data.coverageAnalytics.length === 0 ? <EmptyState title="No coverage analytics" description="Track test coverage metrics." /> : data.coverageAnalytics.map((a) => (
                    <ListCard key={a.id} title={a.name} subtitle={`${a.analyticsKey} • ${a.engagementTitle}`} meta={`${a.coveragePercent}% coverage • ${a.metricCount} metrics • ${a.gapsPreview}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create coverage analytics" description="Record coverage analytics" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createCoverageAnalytics(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("analyticsKey")} placeholder="Analytics key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={0} max={100} {...form.register("coveragePercent", { valueAsNumber: true })} placeholder="Coverage %" className={inputClass} />
                <textarea {...form.register("gaps")} placeholder="Coverage gaps" rows={2} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create analytics" />
            </form></Card>
        </div>
    );
}

export function ReleaseReadinessPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<ReleaseReadinessFormValues>({ resolver: zodResolver(releaseReadinessFormSchema), defaultValues: { engagementId: "", assessmentKey: "", title: "", recommendation: "" } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Release readiness" description="Release readiness assessments and blockers" /><div className="mt-6 space-y-3">
                {data.releaseReadiness.length === 0 ? <EmptyState title="No release readiness assessments" description="Assess release readiness criteria." /> : data.releaseReadiness.map((r) => (
                    <ListCard key={r.id} title={r.title} subtitle={`${r.assessmentKey} • ${r.engagementTitle}`} meta={`${r.criteriaCount} criteria • ${r.blockerCount} blockers • ${r.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create release readiness" description="Record a release readiness assessment" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createReleaseReadiness(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("assessmentKey")} placeholder="Assessment key" className={inputClass} />
                <input {...form.register("title")} placeholder="Title" className={inputClass} />
                <textarea {...form.register("recommendation")} placeholder="Recommendation" rows={3} className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create assessment" />
            </form></Card>
        </div>
    );
}

export function QualityScoresPanel({ data }: { data: QaEngineerData }) {
    const form = useForm<QualityScoreFormValues>({ resolver: zodResolver(qualityScoreFormSchema), defaultValues: { engagementId: "", scoreKey: "", name: "", overallScore: 0 } });
    return (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card hover><SectionHeader title="Quality scores" description="Overall and dimensional quality scores" /><div className="mt-6 space-y-3">
                {data.qualityScores.length === 0 ? <EmptyState title="No quality scores" description="Record quality scores for engagements." /> : data.qualityScores.map((s) => (
                    <ListCard key={s.id} title={s.name} subtitle={`${s.scoreKey} • ${s.engagementTitle}`} meta={`${s.overallScore} overall • ${s.dimensionCount} dimensions • ${s.status}`} />
                ))}
            </div></Card>
            <Card hover><SectionHeader title="Create quality score" description="Record a quality score" /><form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(async (v) => data.createQualityScore(v))}>
                <select {...form.register("engagementId")} className={inputClass}><option value="">Engagement</option>{data.engagementOptions.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                <input {...form.register("scoreKey")} placeholder="Score key" className={inputClass} />
                <input {...form.register("name")} placeholder="Name" className={inputClass} />
                <input type="number" min={0} max={100} {...form.register("overallScore", { valueAsNumber: true })} placeholder="Overall score" className={inputClass} />
                <SaveButton loading={form.formState.isSubmitting} label="Create score" />
            </form></Card>
        </div>
    );
}

export function QaAuditPanel({ data }: { data: QaEngineerData }) {
    return (
        <Card hover><SectionHeader title="QA engineer audit history" description="Complete audit trail for all QA operations" /><div className="mt-6 space-y-3">
            {data.auditLogs.length === 0 ? <EmptyState title="No audit entries" description="Audit logs will appear as actions are performed." /> : data.auditLogs.map((e) => (
                <ListCard key={e.id} title={`${e.entityType} — ${e.action}`} subtitle={e.summary} meta={new Date(e.createdAt).toLocaleString()} />
            ))}
        </div></Card>
    );
}

export function QaSdkPanel({ data }: { data: QaEngineerData }) {
    return (
        <Card hover><SectionHeader title="Shared QA Engineer SDK" description="Import from @/src/modules/qa-engineer/sdk for AI Orchestration, Knowledge, Business Analyst, Solution Architect, and Development Factory integration" /><div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ListCard title="createQaEngineerClient()" subtitle="Factory for module-scoped QA client with auth context" meta="Used by AI Orchestration, Knowledge, Business Analyst, Solution Architect, and Development Factory modules" />
            <ListCard title="client.startEngagement()" subtitle="Start a new QA engagement linked to BA, SA, and DF deliverables" meta={`${data.engagements.length} engagements active`} />
            <ListCard title="client.generateArtifact()" subtitle="Generate test strategy, unit test plan, E2E test plan, or release readiness" meta={`${data.testStrategies.length + data.unitTestPlans.length + data.e2eTestPlans.length + data.releaseReadiness.length} artifacts generated`} />
            <ListCard title="client.runAnalysis()" subtitle="Run regression, defect, or coverage analysis" meta={`${data.regressionAnalyses.length + data.defectAnalyses.length + data.coverageAnalytics.length} analyses completed`} />
            <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{`import { createQaEngineerClient } from "@/src/modules/qa-engineer/sdk";
import { createAiOrchestrationClient } from "@/src/modules/ai-orchestration/sdk";
import { createKnowledgeClient } from "@/src/modules/knowledge/sdk";
import { createBusinessAnalystClient } from "@/src/modules/business-analyst/sdk";
import { createSolutionArchitectClient } from "@/src/modules/solution-architect/sdk";
import { createDevelopmentFactoryClient } from "@/src/modules/development-factory/sdk";

const qa = createQaEngineerClient(userId, email, fullName);
const ai = createAiOrchestrationClient(userId, email, fullName);
const knowledge = createKnowledgeClient(userId, email, fullName);
const ba = createBusinessAnalystClient(userId, email, fullName);
const sa = createSolutionArchitectClient(userId, email, fullName);
const df = createDevelopmentFactoryClient(userId, email, fullName);

const baEngagement = await ba.startEngagement({ title: "CRM Migration", engagementKey: "crm-migration", agentId });
const saEngagement = await sa.startEngagement({ title: "CRM Architecture", engagementKey: "crm-arch", baEngagementId: baEngagement.engagementId, agentId });
const dfEngagement = await df.startEngagement({ title: "CRM Development", engagementKey: "crm-dev", baEngagementId: baEngagement.engagementId, saEngagementId: saEngagement.engagementId, agentId });
const workPackages = await df.getWorkPackages();
const qaEngagement = await qa.startEngagement({ title: "CRM QA", engagementKey: "crm-qa", baEngagementId: baEngagement.engagementId, saEngagementId: saEngagement.engagementId, dfEngagementId: dfEngagement.engagementId, workPackageId: workPackages[0]?.id, agentId });
const context = await knowledge.resolveContext({ contextKey: "qa-crm-qa", agentId });
const strategy = await qa.generateArtifact({ engagementId: qaEngagement.engagementId, artifactType: "test_strategy", title: "CRM Test Strategy", content: "..." });
const analysis = await qa.runAnalysis({ engagementId: qaEngagement.engagementId, analysisType: "regression", inputPayload: { analysisKey: "REG-001", name: "CRM Regression Scan" } });`}</pre>
        </div></Card>
    );
}
