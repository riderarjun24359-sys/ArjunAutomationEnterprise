"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    AccessibilityValidationsPanel,
    ApiValidationsPanel,
    BugTriagePanel,
    CoverageAnalyticsPanel,
    DatabaseValidationsPanel,
    DefectAnalysisPanel,
    E2eTestsPanel,
    EngagementsPanel,
    IntegrationTestsPanel,
    PerformanceValidationsPanel,
    QaAuditPanel,
    QaOverviewPanel,
    QaSdkPanel,
    QualityScoresPanel,
    RegressionPanel,
    ReleaseReadinessPanel,
    RiskBasedTestingPanel,
    SecurityValidationsPanel,
    TestStrategiesPanel,
    UiValidationsPanel,
    UnitTestsPanel,
} from "@/src/modules/qa-engineer/components/QaEngineerPanels";
import { QaEngineerStats } from "@/src/modules/qa-engineer/components/QaEngineerStats";
import { QA_ENGINEER_TABS } from "@/src/modules/qa-engineer/constants";
import { useQaEngineer } from "@/src/modules/qa-engineer/hooks/useQaEngineer";

const tabs = [
    { id: QA_ENGINEER_TABS.overview, label: "Overview" },
    { id: QA_ENGINEER_TABS.engagements, label: "Engagements" },
    { id: QA_ENGINEER_TABS.testStrategies, label: "Test Strategies" },
    { id: QA_ENGINEER_TABS.unitTests, label: "Unit Tests" },
    { id: QA_ENGINEER_TABS.integrationTests, label: "Integration Tests" },
    { id: QA_ENGINEER_TABS.e2eTests, label: "E2E Tests" },
    { id: QA_ENGINEER_TABS.regression, label: "Regression" },
    { id: QA_ENGINEER_TABS.riskBasedTesting, label: "Risk-Based Testing" },
    { id: QA_ENGINEER_TABS.security, label: "Security" },
    { id: QA_ENGINEER_TABS.performance, label: "Performance" },
    { id: QA_ENGINEER_TABS.accessibility, label: "Accessibility" },
    { id: QA_ENGINEER_TABS.apiValidation, label: "API Validation" },
    { id: QA_ENGINEER_TABS.databaseValidation, label: "Database Validation" },
    { id: QA_ENGINEER_TABS.uiValidation, label: "UI Validation" },
    { id: QA_ENGINEER_TABS.bugTriage, label: "Bug Triage" },
    { id: QA_ENGINEER_TABS.defectAnalysis, label: "Defect Analysis" },
    { id: QA_ENGINEER_TABS.coverage, label: "Coverage" },
    { id: QA_ENGINEER_TABS.releaseReadiness, label: "Release Readiness" },
    { id: QA_ENGINEER_TABS.qualityScores, label: "Quality Scores" },
    { id: QA_ENGINEER_TABS.audit, label: "Audit" },
    { id: QA_ENGINEER_TABS.api, label: "SDK" },
] as const;

export function QaEngineerPage() {
    const qaEngineer = useQaEngineer();
    const [activeTab, setActiveTab] = useState<(typeof QA_ENGINEER_TABS)[keyof typeof QA_ENGINEER_TABS]>(QA_ENGINEER_TABS.overview);

    if (qaEngineer.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading AI QA Engineer worker" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-rose-600">AI Worker</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">AI QA Engineer</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    AI worker for test strategies, unit, integration, and E2E test plans, regression analysis, risk-based testing, security, performance, accessibility, API, database, and UI validation, bug triage, defect analysis, coverage analytics, release readiness, quality scores, audit history, and the shared QA Engineer SDK. Pipeline: Customer Requirement → AI Business Analyst → AI Solution Architect → AI Development Factory → AI QA Engineer → Deployment.
                </p>
            </motion.header>
            <QaEngineerStats stats={qaEngineer.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-rose-600 text-white" : "border border-slate-200 text-slate-600 hover:border-rose-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === QA_ENGINEER_TABS.overview ? <QaOverviewPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.engagements ? <EngagementsPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.testStrategies ? <TestStrategiesPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.unitTests ? <UnitTestsPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.integrationTests ? <IntegrationTestsPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.e2eTests ? <E2eTestsPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.regression ? <RegressionPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.riskBasedTesting ? <RiskBasedTestingPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.security ? <SecurityValidationsPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.performance ? <PerformanceValidationsPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.accessibility ? <AccessibilityValidationsPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.apiValidation ? <ApiValidationsPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.databaseValidation ? <DatabaseValidationsPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.uiValidation ? <UiValidationsPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.bugTriage ? <BugTriagePanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.defectAnalysis ? <DefectAnalysisPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.coverage ? <CoverageAnalyticsPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.releaseReadiness ? <ReleaseReadinessPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.qualityScores ? <QualityScoresPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.audit ? <QaAuditPanel data={qaEngineer} /> : null}
            {activeTab === QA_ENGINEER_TABS.api ? <QaSdkPanel data={qaEngineer} /> : null}
        </div>
    );
}
