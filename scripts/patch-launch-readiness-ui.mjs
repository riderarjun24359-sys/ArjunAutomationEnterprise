#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const genPath = join(root, "scripts/generate-executive-intelligence-ui.mjs");
const outPath = join(root, "scripts/generate-launch-readiness-ui.mjs");
let s = readFileSync(genPath, "utf8");

const entitiesBlock = `const entities = [
    { tab: "readinessHubs", plural: "readinessHubs", singular: "ReadinessHub", pascal: "ReadinessHub", db: "elrReadinessHubs", hubField: false, fields: [{ name: "hubKey", type: "string" }, { name: "hubName", type: "string" }, { name: "environment", type: "string" }], display: { title: "hubName", sub: "hubKey" } },
    { tab: "environmentValidations", plural: "environmentValidations", singular: "EnvironmentValidation", pascal: "EnvironmentValidation", db: "elrEnvironmentValidations", fields: [{ name: "validationKey", type: "string" }, { name: "validationType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "validationType" } },
    { tab: "configurationValidations", plural: "configurationValidations", singular: "ConfigurationValidation", pascal: "ConfigurationValidation", db: "elrConfigurationValidations", fields: [{ name: "validationKey", type: "string" }, { name: "configType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "configType" } },
    { tab: "secretsValidations", plural: "secretsValidations", singular: "SecretsValidation", pascal: "SecretsValidation", db: "elrSecretsValidations", fields: [{ name: "validationKey", type: "string" }, { name: "secretType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "secretType" } },
    { tab: "deploymentPlans", plural: "deploymentPlans", singular: "DeploymentPlan", pascal: "DeploymentPlan", db: "elrDeploymentPlans", fields: [{ name: "planKey", type: "string" }, { name: "planName", type: "string" }, { name: "targetVersion", type: "string" }], display: { title: "planName", sub: "targetVersion" } },
    { tab: "rollbackPlans", plural: "rollbackPlans", singular: "RollbackPlan", pascal: "RollbackPlan", db: "elrRollbackPlans", fields: [{ name: "planKey", type: "string" }, { name: "rollbackVersion", type: "string" }, { name: "rollbackReason", type: "string" }], display: { title: "planKey", sub: "rollbackVersion" } },
    { tab: "versionRegistry", plural: "versionRegistry", singular: "VersionRegistry", pascal: "VersionRegistry", db: "elrVersionRegistry", fields: [{ name: "versionKey", type: "string" }, { name: "versionNumber", type: "string" }, { name: "releaseChannel", type: "select", options: "RELEASE_CHANNEL_OPTIONS" }], display: { title: "versionNumber", sub: "releaseChannel" } },
    { tab: "releaseNotes", plural: "releaseNotes", singular: "ReleaseNote", pascal: "ReleaseNote", db: "elrReleaseNotes", fields: [{ name: "noteKey", type: "string" }, { name: "versionRef", type: "string" }, { name: "noteSummary", type: "string" }], display: { title: "noteKey", sub: "versionRef" } },
    { tab: "backupPolicies", plural: "backupPolicies", singular: "BackupPolicy", pascal: "BackupPolicy", db: "elrBackupPolicies", fields: [{ name: "policyKey", type: "string" }, { name: "policyName", type: "string" }, { name: "retentionDays", type: "number" }], display: { title: "policyName", sub: "policyKey" } },
    { tab: "backupVerifications", plural: "backupVerifications", singular: "BackupVerification", pascal: "BackupVerification", db: "elrBackupVerifications", fields: [{ name: "verificationKey", type: "string" }, { name: "backupRef", type: "string" }, { name: "verificationScore", type: "number" }], display: { title: "verificationKey", sub: "backupRef" } },
    { tab: "restoreVerifications", plural: "restoreVerifications", singular: "RestoreVerification", pascal: "RestoreVerification", db: "elrRestoreVerifications", fields: [{ name: "verificationKey", type: "string" }, { name: "restoreRef", type: "string" }, { name: "verificationScore", type: "number" }], display: { title: "verificationKey", sub: "restoreRef" } },
    { tab: "recoveryDrills", plural: "recoveryDrills", singular: "RecoveryDrill", pascal: "RecoveryDrill", db: "elrRecoveryDrills", fields: [{ name: "drillKey", type: "string" }, { name: "drillType", type: "string" }, { name: "drillScore", type: "number" }], display: { title: "drillKey", sub: "drillType" } },
    { tab: "observabilityLogs", plural: "observabilityLogs", singular: "ObservabilityLog", pascal: "ObservabilityLog", db: "elrObservabilityLogs", fields: [{ name: "logKey", type: "string" }, { name: "logLevel", type: "select", options: "LOG_LEVEL_OPTIONS" }, { name: "logSource", type: "string" }], display: { title: "logKey", sub: "logLevel" } },
    { tab: "observabilityMetrics", plural: "observabilityMetrics", singular: "ObservabilityMetric", pascal: "ObservabilityMetric", db: "elrObservabilityMetrics", fields: [{ name: "metricKey", type: "string" }, { name: "metricName", type: "string" }, { name: "metricValue", type: "number" }], display: { title: "metricName", sub: "metricKey" } },
    { tab: "traceRecords", plural: "traceRecords", singular: "TraceRecord", pascal: "TraceRecord", db: "elrTraceRecords", fields: [{ name: "traceKey", type: "string" }, { name: "traceName", type: "string" }, { name: "latencyMs", type: "number" }], display: { title: "traceName", sub: "traceKey" } },
    { tab: "slaMonitors", plural: "slaMonitors", singular: "SlaMonitor", pascal: "SlaMonitor", db: "elrSlaMonitors", fields: [{ name: "monitorKey", type: "string" }, { name: "slaTarget", type: "number" }, { name: "currentValue", type: "number" }], display: { title: "monitorKey", sub: "slaTarget" } },
    { tab: "securityChecklists", plural: "securityChecklists", singular: "SecurityChecklist", pascal: "SecurityChecklist", db: "elrSecurityChecklists", fields: [{ name: "checklistKey", type: "string" }, { name: "checklistName", type: "string" }, { name: "completionScore", type: "number" }], display: { title: "checklistName", sub: "completionScore" } },
    { tab: "vulnerabilityReviews", plural: "vulnerabilityReviews", singular: "VulnerabilityReview", pascal: "VulnerabilityReview", db: "elrVulnerabilityReviews", fields: [{ name: "reviewKey", type: "string" }, { name: "vulnerabilityRef", type: "string" }, { name: "severity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "reviewKey", sub: "severity" } },
    { tab: "permissionAudits", plural: "permissionAudits", singular: "PermissionAudit", pascal: "PermissionAudit", db: "elrPermissionAudits", fields: [{ name: "auditKey", type: "string" }, { name: "auditScope", type: "string" }, { name: "findingCount", type: "number" }], display: { title: "auditKey", sub: "auditScope" } },
    { tab: "complianceReviews", plural: "complianceReviews", singular: "ComplianceReview", pascal: "ComplianceReview", db: "elrComplianceReviews", fields: [{ name: "reviewKey", type: "string" }, { name: "complianceType", type: "string" }, { name: "reviewScore", type: "number" }], display: { title: "reviewKey", sub: "complianceType" } },
    { tab: "adminGuides", plural: "adminGuides", singular: "AdminGuide", pascal: "AdminGuide", db: "elrAdminGuides", fields: [{ name: "guideKey", type: "string" }, { name: "guideTitle", type: "string" }, { name: "guideVersion", type: "string" }], display: { title: "guideTitle", sub: "guideVersion" } },
    { tab: "userGuides", plural: "userGuides", singular: "UserGuide", pascal: "UserGuide", db: "elrUserGuides", fields: [{ name: "guideKey", type: "string" }, { name: "guideTitle", type: "string" }, { name: "guideVersion", type: "string" }], display: { title: "guideTitle", sub: "guideVersion" } },
    { tab: "deploymentGuides", plural: "deploymentGuides", singular: "DeploymentGuide", pascal: "DeploymentGuide", db: "elrDeploymentGuides", fields: [{ name: "guideKey", type: "string" }, { name: "guideTitle", type: "string" }, { name: "guideVersion", type: "string" }], display: { title: "guideTitle", sub: "guideVersion" } },
    { tab: "launchScoreMetrics", plural: "launchScoreMetrics", singular: "LaunchScoreMetric", pascal: "LaunchScoreMetric", db: "elrLaunchScoreMetrics", hubField: false, orgOnly: true, fields: [{ name: "metricsKey", type: "string" }, { name: "securityScore", type: "number" }, { name: "overallLaunchScore", type: "number" }], display: { title: "metricsKey", sub: "overallLaunchScore" } },
    { tab: "readinessValidations", plural: "readinessValidations", singular: "ReadinessValidation", pascal: "ReadinessValidation", db: "elrReadinessValidations", fields: [{ name: "validationKey", type: "string" }, { name: "validationType", type: "string" }, { name: "validationScore", type: "number" }], display: { title: "validationKey", sub: "validationType" } },
    { tab: "launchBlockers", plural: "launchBlockers", singular: "LaunchBlocker", pascal: "LaunchBlocker", db: "elrLaunchBlockers", fields: [{ name: "blockerKey", type: "string" }, { name: "blockerTitle", type: "string" }, { name: "blockerSeverity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "blockerTitle", sub: "blockerSeverity" } },
    { tab: "scoreSnapshots", plural: "scoreSnapshots", singular: "ScoreSnapshot", pascal: "ScoreSnapshot", db: "elrScoreSnapshots", fields: [{ name: "snapshotKey", type: "string" }, { name: "snapshotDate", type: "string" }, { name: "overallLaunchScore", type: "number" }], display: { title: "snapshotKey", sub: "snapshotDate" } },
    { tab: "launchHealth", plural: "launchHealth", singular: "LaunchHealth", pascal: "LaunchHealth", db: "elrLaunchHealth", hubField: false, orgOnly: true, fields: [{ name: "healthKey", type: "string" }, { name: "overallScore", type: "number" }, { name: "disasterRecoveryMode", type: "boolean" }], display: { title: "healthKey", sub: "overallScore" } },
    { tab: "criticalIssues", plural: "criticalIssues", singular: "CriticalIssue", pascal: "CriticalIssue", db: "elrCriticalIssues", fields: [{ name: "issueKey", type: "string" }, { name: "issueTitle", type: "string" }, { name: "issueSeverity", type: "select", options: "ALERT_SEVERITY_OPTIONS" }], display: { title: "issueTitle", sub: "issueSeverity" } },
    { tab: "readinessWarnings", plural: "readinessWarnings", singular: "ReadinessWarning", pascal: "ReadinessWarning", db: "elrReadinessWarnings", fields: [{ name: "warningKey", type: "string" }, { name: "warningType", type: "string" }, { name: "warningMessage", type: "string" }], display: { title: "warningKey", sub: "warningType" } },
    { tab: "launchFailures", plural: "launchFailures", singular: "LaunchFailure", pascal: "LaunchFailure", db: "elrLaunchFailures", fields: [{ name: "failureKey", type: "string" }, { name: "failureType", type: "string" }], display: { title: "failureKey", sub: "failureType" } },
];`;

s = s.replace(/const mod = join\(root, "src\/modules\/executive-intelligence"\);/, 'const mod = join(root, "src/modules/launch-readiness");');
s = s.replace(/const entities = \[[\s\S]*?\];/, entitiesBlock);

const reps = [
    [/intelligenceHubs/g, "readinessHubs"],
    [/intelligenceHubOptions/g, "readinessHubOptions"],
    [/getIntelligenceHubs/g, "getReadinessHubs"],
    [/getIntelligenceHubOptions/g, "getReadinessHubOptions"],
    [/IntelligenceHubSelect/g, "ReadinessHubSelect"],
    [/buildIntelligenceHubLookupMaps/g, "buildReadinessHubLookupMaps"],
    [/intelligenceHubId/g, "readinessHubId"],
    [/Intelligence Hubs/g, "Readiness Hubs"],
    [/Intelligence Hub/g, "Launch Readiness"],
    [/intelligence hub/g, "launch readiness hub"],
    [/executive-intelligence/g, "launch-readiness"],
    [/executiveIntelligence/g, "launchReadiness"],
    [/ExecutiveIntelligence/g, "LaunchReadiness"],
    [/Executive Intelligence/g, "Launch Readiness"],
    [/executive intelligence/g, "launch readiness"],
    [/databaseService\.aix/g, "databaseService.elr"],
    [/buildAix/g, "buildElr"],
    [/mapAix/g, "mapElr"],
    [/AixDashboardStats/g, "ElrDashboardStats"],
    [/AixPipelineInfo/g, "ElrPipelineInfo"],
    [/AixSdk/g, "ElrSdk"],
    [/AIX_TABS/g, "ELR_TABS"],
    [/AIX_THEME/g, "ELR_THEME"],
    [/AIX_PERMISSIONS/g, "ELR_PERMISSIONS"],
    [/AIX_STATUS_OPTIONS/g, "ELR_STATUS_OPTIONS"],
    [/Sprint 8/g, "Sprint 9"],
    [/violet-600/g, "rose-600"],
    [/violet-500/g, "rose-500"],
    [/violet-400/g, "rose-400"],
    [/violet-300/g, "rose-300"],
    [/ring-violet/g, "ring-rose"],
    [/bg-violet/g, "bg-rose"],
    [/text-violet/g, "text-rose"],
    [/hover:bg-violet/g, "hover:bg-rose"],
    [/hover:border-violet/g, "hover:border-rose"],
    [/mapRecommendationOutputForStats/g, "mapDeploymentPlanForStats"],
    [/mapEvidenceTraceForStats/g, "mapBackupPolicyForStats"],
    [/mapExecutiveMetricForStats/g, "mapLaunchScoreMetricForStats"],
    [/mapKnowledgeReasoningSessionForStats/g, "mapRecoveryDrillForStats"],
    [/mapBusinessRiskForStats/g, "mapLaunchBlockerForStats"],
    [/mapChurnRiskForStats/g, "mapReadinessValidationForStats"],
    [/mapExecutiveHealthForStats/g, "mapLaunchHealthForStats"],
    [/mapExecutiveFailureForStats/g, "mapLaunchFailureForStats"],
    [/recommendationOutputs/g, "deploymentPlans"],
    [/evidenceTraces/g, "backupPolicies"],
    [/executiveMetrics/g, "launchScoreMetrics"],
    [/knowledgeReasoningSessions/g, "recoveryDrills"],
    [/businessRisks/g, "launchBlockers"],
    [/churnRisks/g, "readinessValidations"],
    [/executiveHealth/g, "launchHealth"],
    [/executiveFailures/g, "launchFailures"],
    [/totalIntelligenceHubs/g, "totalReadinessHubs"],
    [/activeIntelligenceHubs/g, "activeReadinessHubs"],
    [/recommendationCount/g, "deploymentPlanCount"],
    [/evidenceTraceCount/g, "backupPolicyCount"],
    [/reasoningSessionCount/g, "recoveryDrillCount"],
    [/openRiskCount/g, "openBlockerCount"],
    [/avgAiConfidenceScore/g, "overallLaunchScore"],
    [/businessScore/g, "securityScore"],
    [/growthScore/g, "reliabilityScore"],
    [/operationalScore/g, "performanceScore"],
    [/securityScore/g, "documentationScore"],
    [/customerScore/g, "operationalScore"],
    [/sdkGenerateBrief/g, "sdkValidateEnvironment"],
    [/sdkGenerateRecommendation/g, "sdkRunDeploymentCheck"],
    [/sdkTriggerReasoning/g, "sdkRunRecoveryDrill"],
    [/generateBrief/g, "validateEnvironment"],
    [/generateRecommendation/g, "runDeploymentCheck"],
    [/triggerReasoning/g, "runRecoveryDrill"],
    [/AixSdkConnectServiceInput/g, "ElrSdkValidateEnvironmentInput"],
    [/AixSdkConnectServiceResult/g, "ElrSdkValidateEnvironmentResult"],
    [/AixSdkIssueApiKeyInput/g, "ElrSdkRunDeploymentCheckInput"],
    [/AixSdkIssueApiKeyResult/g, "ElrSdkRunDeploymentCheckResult"],
    [/AixSdkRegisterWebhookInput/g, "ElrSdkRunRecoveryDrillInput"],
    [/AixSdkRegisterWebhookResult/g, "ElrSdkRunRecoveryDrillResult"],
    [/createDailyExecutiveBrief/g, "createEnvironmentValidation"],
    [/createRecommendationOutput/g, "createDeploymentPlan"],
    [/createKnowledgeReasoningSession/g, "createRecoveryDrill"],
    [/Generate executive brief/g, "Validate production environment"],
    [/Generate AI recommendation/g, "Run deployment readiness check"],
    [/Trigger knowledge reasoning/g, "Run recovery drill"],
    [/briefs, recommendations, reasoning/g, "validations, deployments, recovery drills"],
    [/Briefs, recommendations, reasoning, and intelligence outputs/g, "Validations, deployments, recovery drills, and launch readiness outputs"],
    [/Executive intelligence pipeline/g, "Launch readiness pipeline"],
    [/AIX_TABS count/g, "ELR_TABS count"],
    [/Generated executive intelligence/g, "Generated launch readiness"],
    [/AI executive intelligence platform: daily briefs, revenue analytics, platform health intel, security & compliance signals, priority recommendations, knowledge reasoning, evidence traces, and executive dashboard with security-first audit and the shared Executive Intelligence SDK\./g,
        "Enterprise launch readiness platform: production validation, deployment readiness, backup and recovery, observability, security and compliance, documentation, launch scoring, and launch dashboard with security-first audit and the shared Launch Readiness SDK."],
    [/brief generation, recommendation output, and knowledge reasoning/g, "environment validation, deployment check, and recovery drill"],
    [/generate_brief/g, "validate_environment"],
    [/trigger_reasoning/g, "run_recovery_drill"],
    [/generateRecommendation/g, "runDeploymentCheck"],
    [/generateBrief/g, "validateEnvironment"],
    [/triggerReasoning/g, "runRecoveryDrill"],
    [/"aix\.view"/g, '"elr.view"'],
    [/"aix\.manage"/g, '"elr.manage"'],
    [/"aix\.approve"/g, '"elr.approve"'],
    [/"aix\.admin"/g, '"elr.admin"'],
    [/executive_intelligence/g, "launch_readiness"],
    [/moduleSource: executive_intelligence/g, "moduleSource: launch_readiness"],
    [/recommendations/g, "deployment plans"],
    [/evidence traces/g, "backup policies"],
    [/reasoning sessions/g, "recovery drills"],
    [/open risks/g, "open blockers"],
    [/avg AI confidence/g, "overall launch score"],
    [/Executive Intelligence summary/g, "Launch Readiness summary"],
    [/Security-first executive intelligence/g, "Security-first launch readiness"],
    [/ElrSdkConnectServiceInput/g, "ElrSdkValidateEnvironmentInput"],
    [/ElrSdkConnectServiceResult/g, "ElrSdkValidateEnvironmentResult"],
    [/ElrSdkIssueApiKeyInput/g, "ElrSdkRunDeploymentCheckInput"],
    [/ElrSdkIssueApiKeyResult/g, "ElrSdkRunDeploymentCheckResult"],
    [/ElrSdkRegisterWebhookInput/g, "ElrSdkRunRecoveryDrillInput"],
    [/ElrSdkRegisterWebhookResult/g, "ElrSdkRunRecoveryDrillResult"],
    [/totalLaunchReadinesss/g, "totalReadinessHubs"],
    [/activeLaunchReadinesss/g, "activeReadinessHubs"],
    [/deploymentPlansCount/g, "deploymentPlanCount"],
    [/elrLaunchReadinesss/g, "elrReadinessHubs"],
    [/getExecutiveFailures/g, "getLaunchFailures"],
    [/import \{ ELR_THEME, RISK_LEVEL_OPTIONS, TREND_DIRECTION_OPTIONS, ALERT_SEVERITY_OPTIONS \}/g, "import { ELR_THEME, RELEASE_CHANNEL_OPTIONS, LOG_LEVEL_OPTIONS, ALERT_SEVERITY_OPTIONS }"],
];

for (const [from, to] of reps) s = s.replace(from, to);

s = s.replace(/databaseService\.elrRecommendationOutputs\.listByOrganization/g, "databaseService.elrDeploymentPlans.listByOrganization");
s = s.replace(/databaseService\.elrEvidenceTraces\.listByOrganization/g, "databaseService.elrBackupPolicies.listByOrganization");
s = s.replace(/databaseService\.elrExecutiveMetrics\.listByOrganization/g, "databaseService.elrLaunchScoreMetrics.listByOrganization");
s = s.replace(/databaseService\.elrKnowledgeReasoningSessions\.listByOrganization/g, "databaseService.elrRecoveryDrills.listByOrganization");
s = s.replace(/databaseService\.elrBusinessRisks\.listByOrganization/g, "databaseService.elrLaunchBlockers.listByOrganization");
s = s.replace(/databaseService\.elrChurnRisks\.listByOrganization/g, "databaseService.elrReadinessValidations.listByOrganization");
s = s.replace(/databaseService\.elrExecutiveHealth\.listByOrganization/g, "databaseService.elrLaunchHealth.listByOrganization");
s = s.replace(/databaseService\.elrExecutiveIntelligences\.listByOrganization/g, "databaseService.elrReadinessHubs.listByOrganization");

const elrOptionsBlock = `export const RELEASE_CHANNEL_OPTIONS = [
    { value: "stable", label: "Stable" },
    { value: "beta", label: "Beta" },
    { value: "canary", label: "Canary" },
] as const;

export const LOG_LEVEL_OPTIONS = [
    { value: "debug", label: "Debug" },
    { value: "info", label: "Info" },
    { value: "warning", label: "Warning" },
    { value: "error", label: "Error" },
    { value: "critical", label: "Critical" },
] as const;

export const ALERT_SEVERITY_OPTIONS = [
    { value: "critical", label: "Critical" },
    { value: "warning", label: "Warning" },
    { value: "info", label: "Info" },
] as const;

export const ELR_STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "healthy", label: "Healthy" },
    { value: "degraded", label: "Degraded" },
    { value: "failed", label: "Failed" },
    { value: "open", label: "Open" },
    { value: "ready", label: "Ready" },
] as const;

export const ELR_PERMISSIONS = ["elr.view", "elr.manage", "elr.approve", "elr.admin"] as const;

`;

s = s.replace(
    /(writeFileSync\(join\(mod, "constants\/index\.ts"\), `export const ELR_TABS = \{[\s\S]*?\} as const;\r?\n\r?\n)[\s\S]*?(\r?\nexport const ELR_THEME)/,
    `$1${elrOptionsBlock}$2`,
);

s = s.replace(
    /import \{ ELR_THEME, RISK_LEVEL_OPTIONS, TREND_DIRECTION_OPTIONS, TREND_DIRECTION_OPTIONS, RISK_LEVEL_OPTIONS \}/,
    "import { ELR_THEME, RELEASE_CHANNEL_OPTIONS, LOG_LEVEL_OPTIONS, ALERT_SEVERITY_OPTIONS }",
);

s = s.replace(/Select intelligence hub/g, "Select readiness hub");
s = s.replace(/Select executive intelligence/g, "Select readiness hub");

writeFileSync(outPath, s, "utf8");
console.log("Patched generate-launch-readiness-ui.mjs");
