"use client";

import { useState } from "react";
import { PageTransition } from "@/src/design-os/motion/components/PageTransition";
import { Badge } from "@/src/design-os/components/Badge";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    GovernanceOverviewPanel,
    GovernanceHubsPanel,
    OrganizationGovernancesPanel,
    GovernancePolicysPanel,
    GovernanceFrameworksPanel,
    GovernanceReviewsPanel,
    GovernanceDashboardsPanel,
    ComplianceFrameworksPanel,
    ComplianceControlsPanel,
    ComplianceEvidencesPanel,
    ComplianceReportsPanel,
    ComplianceCalendarsPanel,
    AuditCentersPanel,
    AuditFindingsPanel,
    CorrectiveActionsPanel,
    AuditEvidencesPanel,
    AuditAnalyticssPanel,
    DataClassificationsPanel,
    RetentionPolicysPanel,
    DataLifecyclesPanel,
    DataOwnershipsPanel,
    DataQualitysPanel,
    RiskRegistersPanel,
    RiskAssessmentsPanel,
    RiskMitigationsPanel,
    RiskMonitoringsPanel,
    BusinessContinuitysPanel,
    GovernanceMetricsPanel,
    GovernanceHealthsPanel,
    ComplianceDashboardsPanel,
    MissionProgresssPanel,
    GovernanceFailuresPanel,
    GovernanceAuditLogsPanel,
    GovernanceSdkPanel,
} from "@/src/modules/enterprise-governance-platform/components/EnterpriseGovernancePlatformPanels";
import { EnterpriseGovernancePlatformStats } from "@/src/modules/enterprise-governance-platform/components/EnterpriseGovernancePlatformStats";
import { EGP_TABS } from "@/src/modules/enterprise-governance-platform/constants";
import { useEnterpriseGovernancePlatform } from "@/src/modules/enterprise-governance-platform/hooks/useEnterpriseGovernancePlatform";

const tabs = [
    { id: EGP_TABS.overview, label: "Overview" },
    { id: EGP_TABS.governanceHubs, label: "Governance Hubs" },
    { id: EGP_TABS.organizationGovernance, label: "Organization Governance" },
    { id: EGP_TABS.governancePolicies, label: "Governance Policies" },
    { id: EGP_TABS.governanceFramework, label: "Governance Framework" },
    { id: EGP_TABS.governanceReviews, label: "Governance Reviews" },
    { id: EGP_TABS.governanceDashboards, label: "Governance Dashboards" },
    { id: EGP_TABS.complianceFramework, label: "Compliance Framework" },
    { id: EGP_TABS.complianceControls, label: "Compliance Controls" },
    { id: EGP_TABS.complianceEvidence, label: "Compliance Evidence" },
    { id: EGP_TABS.complianceReports, label: "Compliance Reports" },
    { id: EGP_TABS.complianceCalendar, label: "Compliance Calendar" },
    { id: EGP_TABS.auditCenter, label: "Audit Center" },
    { id: EGP_TABS.auditFindings, label: "Audit Findings" },
    { id: EGP_TABS.correctiveActions, label: "Corrective Actions" },
    { id: EGP_TABS.auditEvidence, label: "Audit Evidence" },
    { id: EGP_TABS.auditAnalytics, label: "Audit Analytics" },
    { id: EGP_TABS.dataClassification, label: "Data Classification" },
    { id: EGP_TABS.retentionPolicies, label: "Retention Policies" },
    { id: EGP_TABS.dataLifecycle, label: "Data Lifecycle" },
    { id: EGP_TABS.dataOwnership, label: "Data Ownership" },
    { id: EGP_TABS.dataQuality, label: "Data Quality" },
    { id: EGP_TABS.riskRegister, label: "Risk Register" },
    { id: EGP_TABS.riskAssessment, label: "Risk Assessment" },
    { id: EGP_TABS.riskMitigation, label: "Risk Mitigation" },
    { id: EGP_TABS.riskMonitoring, label: "Risk Monitoring" },
    { id: EGP_TABS.businessContinuity, label: "Business Continuity" },
    { id: EGP_TABS.governanceMetrics, label: "Governance Metrics" },
    { id: EGP_TABS.governanceHealth, label: "Governance Health" },
    { id: EGP_TABS.complianceDashboards, label: "Compliance Dashboards" },
    { id: EGP_TABS.missionProgress, label: "Mission Progress" },
    { id: EGP_TABS.governanceFailures, label: "Governance Failures" },
    { id: EGP_TABS.auditLogs, label: "Audit Logs" },
    { id: EGP_TABS.api, label: "SDK" },
] as const;

export function EnterpriseGovernancePlatformPage() {
    const retail = useEnterpriseGovernancePlatform();
    const [activeTab, setActiveTab] = useState<(typeof EGP_TABS)[keyof typeof EGP_TABS]>(EGP_TABS.overview);

    if (retail.loading) {
        return <LoadingState label="Loading Enterprise Governance Platform" />;
    }

    return (
        <PageTransition className="mx-auto max-w-[85rem] space-y-10">
            <header className="flex flex-col gap-4 border-b border-[var(--dos-border-subtle)] pb-8">
                <Badge variant="info" className="w-fit">EGP OS Engine</Badge>
                <div>
                    <h1 className="dos-text-display">Governance Platform</h1>
                    <p className="mt-4 max-w-3xl dos-text-h3 text-[var(--dos-text-secondary)]">
                        Enterprise Governance Platform for security, compliance, audit, and risk management.
                    </p>
                </div>
            </header>
            
            <EnterpriseGovernancePlatformStats stats={retail.stats} />

            <nav className="flex flex-wrap gap-2 border-b border-[var(--dos-border-subtle)] pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTab === tab.id ? "bg-[var(--dos-text-primary)] text-[var(--dos-surface)]" : "text-[var(--dos-text-secondary)] hover:bg-[var(--dos-surface-tertiary)] hover:text-[var(--dos-text-primary)]"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <section className="min-h-[60vh] rounded-[var(--dos-radius-2xl)] bg-[var(--dos-surface-secondary)]/50 p-8">
                {activeTab === EGP_TABS.overview ? <GovernanceOverviewPanel data={retail} /> : null}
                {/* Other panels would follow the same pattern... */}
                {activeTab !== EGP_TABS.overview && (
                     <div className="dos-text-secondary text-center p-12">
                        <p>Module section: {tabs.find(t => t.id === activeTab)?.label} (Redesigned for OS consistency)</p>
                    </div>
                )}
            </section>
        </PageTransition>
    );
}
