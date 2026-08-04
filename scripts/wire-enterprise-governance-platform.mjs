#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("EgpGovernanceHubRepository")) {
    const anchor = '} from "@/src/modules/database/repositories/ai-organization-foundation-repositories";';
    const aofImportEnd = da.indexOf(anchor) + anchor.length;
    const egpImport = `
import {
    EgpGovernanceHubRepository,
    EgpOrganizationGovernanceRepository,
    EgpGovernancePolicyRepository,
    EgpGovernanceFrameworkRepository,
    EgpGovernanceReviewRepository,
    EgpGovernanceDashboardRepository,
    EgpComplianceFrameworkRepository,
    EgpComplianceControlRepository,
    EgpComplianceEvidenceRepository,
    EgpComplianceReportRepository,
    EgpComplianceCalendarRepository,
    EgpAuditCenterRepository,
    EgpAuditFindingRepository,
    EgpCorrectiveActionRepository,
    EgpAuditEvidenceRepository,
    EgpAuditAnalyticsRepository,
    EgpDataClassificationRepository,
    EgpRetentionPolicyRepository,
    EgpDataLifecycleRepository,
    EgpDataOwnershipRepository,
    EgpDataQualityRepository,
    EgpRiskRegisterRepository,
    EgpRiskAssessmentRepository,
    EgpRiskMitigationRepository,
    EgpRiskMonitoringRepository,
    EgpBusinessContinuityRepository,
    EgpGovernanceMetricRepository,
    EgpGovernanceHealthRepository,
    EgpComplianceDashboardRepository,
    EgpMissionProgressRepository,
    EgpGovernanceFailureRepository,
    EgpAuditLogRepository,
} from "@/src/modules/database/repositories/enterprise-governance-platform-repositories";
`;
    da = da.slice(0, aofImportEnd) + egpImport + da.slice(aofImportEnd);

    const aofProp = "    readonly aofAuditLogs: AofAuditLogRepository;";
    const egpProps = `    readonly egpGovernanceHubs: EgpGovernanceHubRepository;
    readonly egpOrganizationGovernance: EgpOrganizationGovernanceRepository;
    readonly egpGovernancePolicies: EgpGovernancePolicyRepository;
    readonly egpGovernanceFramework: EgpGovernanceFrameworkRepository;
    readonly egpGovernanceReviews: EgpGovernanceReviewRepository;
    readonly egpGovernanceDashboards: EgpGovernanceDashboardRepository;
    readonly egpComplianceFramework: EgpComplianceFrameworkRepository;
    readonly egpComplianceControls: EgpComplianceControlRepository;
    readonly egpComplianceEvidence: EgpComplianceEvidenceRepository;
    readonly egpComplianceReports: EgpComplianceReportRepository;
    readonly egpComplianceCalendar: EgpComplianceCalendarRepository;
    readonly egpAuditCenter: EgpAuditCenterRepository;
    readonly egpAuditFindings: EgpAuditFindingRepository;
    readonly egpCorrectiveActions: EgpCorrectiveActionRepository;
    readonly egpAuditEvidence: EgpAuditEvidenceRepository;
    readonly egpAuditAnalytics: EgpAuditAnalyticsRepository;
    readonly egpDataClassification: EgpDataClassificationRepository;
    readonly egpRetentionPolicies: EgpRetentionPolicyRepository;
    readonly egpDataLifecycle: EgpDataLifecycleRepository;
    readonly egpDataOwnership: EgpDataOwnershipRepository;
    readonly egpDataQuality: EgpDataQualityRepository;
    readonly egpRiskRegister: EgpRiskRegisterRepository;
    readonly egpRiskAssessment: EgpRiskAssessmentRepository;
    readonly egpRiskMitigation: EgpRiskMitigationRepository;
    readonly egpRiskMonitoring: EgpRiskMonitoringRepository;
    readonly egpBusinessContinuity: EgpBusinessContinuityRepository;
    readonly egpGovernanceMetrics: EgpGovernanceMetricRepository;
    readonly egpGovernanceHealth: EgpGovernanceHealthRepository;
    readonly egpComplianceDashboards: EgpComplianceDashboardRepository;
    readonly egpMissionProgress: EgpMissionProgressRepository;
    readonly egpGovernanceFailures: EgpGovernanceFailureRepository;
    readonly egpAuditLogs: EgpAuditLogRepository;`;
    da = da.replace(aofProp, aofProp + "\n" + egpProps);

    const aofCtor = "        this.aofAuditLogs = new AofAuditLogRepository();";
    const egpCtor = `        this.egpGovernanceHubs = new EgpGovernanceHubRepository();
        this.egpOrganizationGovernance = new EgpOrganizationGovernanceRepository();
        this.egpGovernancePolicies = new EgpGovernancePolicyRepository();
        this.egpGovernanceFramework = new EgpGovernanceFrameworkRepository();
        this.egpGovernanceReviews = new EgpGovernanceReviewRepository();
        this.egpGovernanceDashboards = new EgpGovernanceDashboardRepository();
        this.egpComplianceFramework = new EgpComplianceFrameworkRepository();
        this.egpComplianceControls = new EgpComplianceControlRepository();
        this.egpComplianceEvidence = new EgpComplianceEvidenceRepository();
        this.egpComplianceReports = new EgpComplianceReportRepository();
        this.egpComplianceCalendar = new EgpComplianceCalendarRepository();
        this.egpAuditCenter = new EgpAuditCenterRepository();
        this.egpAuditFindings = new EgpAuditFindingRepository();
        this.egpCorrectiveActions = new EgpCorrectiveActionRepository();
        this.egpAuditEvidence = new EgpAuditEvidenceRepository();
        this.egpAuditAnalytics = new EgpAuditAnalyticsRepository();
        this.egpDataClassification = new EgpDataClassificationRepository();
        this.egpRetentionPolicies = new EgpRetentionPolicyRepository();
        this.egpDataLifecycle = new EgpDataLifecycleRepository();
        this.egpDataOwnership = new EgpDataOwnershipRepository();
        this.egpDataQuality = new EgpDataQualityRepository();
        this.egpRiskRegister = new EgpRiskRegisterRepository();
        this.egpRiskAssessment = new EgpRiskAssessmentRepository();
        this.egpRiskMitigation = new EgpRiskMitigationRepository();
        this.egpRiskMonitoring = new EgpRiskMonitoringRepository();
        this.egpBusinessContinuity = new EgpBusinessContinuityRepository();
        this.egpGovernanceMetrics = new EgpGovernanceMetricRepository();
        this.egpGovernanceHealth = new EgpGovernanceHealthRepository();
        this.egpComplianceDashboards = new EgpComplianceDashboardRepository();
        this.egpMissionProgress = new EgpMissionProgressRepository();
        this.egpGovernanceFailures = new EgpGovernanceFailureRepository();
        this.egpAuditLogs = new EgpAuditLogRepository();`;
    da = da.replace(aofCtor, aofCtor + "\n" + egpCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("egpGovernanceHubs")) {
    ds = ds.replace(
        "    aofAuditLogs: databaseAccess.aofAuditLogs,",
        `    aofAuditLogs: databaseAccess.aofAuditLogs,
    egpGovernanceHubs: databaseAccess.egpGovernanceHubs,
    egpOrganizationGovernance: databaseAccess.egpOrganizationGovernance,
    egpGovernancePolicies: databaseAccess.egpGovernancePolicies,
    egpGovernanceFramework: databaseAccess.egpGovernanceFramework,
    egpGovernanceReviews: databaseAccess.egpGovernanceReviews,
    egpGovernanceDashboards: databaseAccess.egpGovernanceDashboards,
    egpComplianceFramework: databaseAccess.egpComplianceFramework,
    egpComplianceControls: databaseAccess.egpComplianceControls,
    egpComplianceEvidence: databaseAccess.egpComplianceEvidence,
    egpComplianceReports: databaseAccess.egpComplianceReports,
    egpComplianceCalendar: databaseAccess.egpComplianceCalendar,
    egpAuditCenter: databaseAccess.egpAuditCenter,
    egpAuditFindings: databaseAccess.egpAuditFindings,
    egpCorrectiveActions: databaseAccess.egpCorrectiveActions,
    egpAuditEvidence: databaseAccess.egpAuditEvidence,
    egpAuditAnalytics: databaseAccess.egpAuditAnalytics,
    egpDataClassification: databaseAccess.egpDataClassification,
    egpRetentionPolicies: databaseAccess.egpRetentionPolicies,
    egpDataLifecycle: databaseAccess.egpDataLifecycle,
    egpDataOwnership: databaseAccess.egpDataOwnership,
    egpDataQuality: databaseAccess.egpDataQuality,
    egpRiskRegister: databaseAccess.egpRiskRegister,
    egpRiskAssessment: databaseAccess.egpRiskAssessment,
    egpRiskMitigation: databaseAccess.egpRiskMitigation,
    egpRiskMonitoring: databaseAccess.egpRiskMonitoring,
    egpBusinessContinuity: databaseAccess.egpBusinessContinuity,
    egpGovernanceMetrics: databaseAccess.egpGovernanceMetrics,
    egpGovernanceHealth: databaseAccess.egpGovernanceHealth,
    egpComplianceDashboards: databaseAccess.egpComplianceDashboards,
    egpMissionProgress: databaseAccess.egpMissionProgress,
    egpGovernanceFailures: databaseAccess.egpGovernanceFailures,
    egpAuditLogs: databaseAccess.egpAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for EGP");
