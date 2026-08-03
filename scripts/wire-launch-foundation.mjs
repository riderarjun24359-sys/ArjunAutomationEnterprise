#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const daPath = join(root, "src/modules/database/data-access.ts");
let da = readFileSync(daPath, "utf8");

if (!da.includes("ElfLaunchHubRepository")) {
    const anchor = "} from \"@/src/modules/database/repositories/retail-repositories\";";
    const rtlImportEnd = da.indexOf(anchor) + anchor.length;
    const elfImport = `
import {
    ElfLaunchHubRepository,
    ElfOrganizationProvisionRepository,
    ElfTenantProvisionRepository,
    ElfIndustryPackAssignmentRepository,
    ElfModuleLicenseRepository,
    ElfWizardProfileRepository,
    ElfWizardBrandingRepository,
    ElfWizardDepartmentRepository,
    ElfWizardSettingRepository,
    ElfImportJobRepository,
    ElfImportValidationRepository,
    ElfImportPreviewRepository,
    ElfImportHistoryRepository,
    ElfGoLiveChecklistRepository,
    ElfGoLiveScoreRepository,
    ElfDeploymentStatusRepository,
    ElfReadinessValidationRepository,
    ElfCustomerHealthScoreRepository,
    ElfPlatformAdoptionRepository,
    ElfFeatureUsageRepository,
    ElfRenewalTrackingRepository,
    ElfSupportTicketRepository,
    ElfKnowledgeBaseArticleRepository,
    ElfIncidentTrackingRepository,
    ElfCustomerRegistryRepository,
    ElfSubscriptionRecordRepository,
    ElfLicenseManagementRepository,
    ElfLaunchMetricRepository,
    ElfLaunchHealthRepository,
    ElfMissionControlKpiRepository,
    ElfLaunchFailureRepository,
    ElfAuditLogRepository,
} from "@/src/modules/database/repositories/launch-foundation-repositories";
`;
    da = da.slice(0, rtlImportEnd) + elfImport + da.slice(rtlImportEnd);

    const rtlProp = "    readonly rtlAuditLogs: RtlAuditLogRepository;";
    const elfProps = `    readonly elfLaunchHubs: ElfLaunchHubRepository;
    readonly elfOrganizationProvisions: ElfOrganizationProvisionRepository;
    readonly elfTenantProvisions: ElfTenantProvisionRepository;
    readonly elfIndustryPackAssignments: ElfIndustryPackAssignmentRepository;
    readonly elfModuleLicenses: ElfModuleLicenseRepository;
    readonly elfWizardProfiles: ElfWizardProfileRepository;
    readonly elfWizardBranding: ElfWizardBrandingRepository;
    readonly elfWizardDepartments: ElfWizardDepartmentRepository;
    readonly elfWizardSettings: ElfWizardSettingRepository;
    readonly elfImportJobs: ElfImportJobRepository;
    readonly elfImportValidations: ElfImportValidationRepository;
    readonly elfImportPreviews: ElfImportPreviewRepository;
    readonly elfImportHistory: ElfImportHistoryRepository;
    readonly elfGoLiveChecklists: ElfGoLiveChecklistRepository;
    readonly elfGoLiveScores: ElfGoLiveScoreRepository;
    readonly elfDeploymentStatuses: ElfDeploymentStatusRepository;
    readonly elfReadinessValidations: ElfReadinessValidationRepository;
    readonly elfCustomerHealthScores: ElfCustomerHealthScoreRepository;
    readonly elfPlatformAdoption: ElfPlatformAdoptionRepository;
    readonly elfFeatureUsage: ElfFeatureUsageRepository;
    readonly elfRenewalTracking: ElfRenewalTrackingRepository;
    readonly elfSupportTickets: ElfSupportTicketRepository;
    readonly elfKnowledgeBaseArticles: ElfKnowledgeBaseArticleRepository;
    readonly elfIncidentTracking: ElfIncidentTrackingRepository;
    readonly elfCustomerRegistry: ElfCustomerRegistryRepository;
    readonly elfSubscriptionRecords: ElfSubscriptionRecordRepository;
    readonly elfLicenseManagement: ElfLicenseManagementRepository;
    readonly elfLaunchMetrics: ElfLaunchMetricRepository;
    readonly elfLaunchHealth: ElfLaunchHealthRepository;
    readonly elfMissionControlKpis: ElfMissionControlKpiRepository;
    readonly elfLaunchFailures: ElfLaunchFailureRepository;
    readonly elfAuditLogs: ElfAuditLogRepository;`;
    da = da.replace(rtlProp, rtlProp + "\n" + elfProps);

    const rtlCtor = "        this.rtlAuditLogs = new RtlAuditLogRepository();";
    const elfCtor = `        this.elfLaunchHubs = new ElfLaunchHubRepository();
        this.elfOrganizationProvisions = new ElfOrganizationProvisionRepository();
        this.elfTenantProvisions = new ElfTenantProvisionRepository();
        this.elfIndustryPackAssignments = new ElfIndustryPackAssignmentRepository();
        this.elfModuleLicenses = new ElfModuleLicenseRepository();
        this.elfWizardProfiles = new ElfWizardProfileRepository();
        this.elfWizardBranding = new ElfWizardBrandingRepository();
        this.elfWizardDepartments = new ElfWizardDepartmentRepository();
        this.elfWizardSettings = new ElfWizardSettingRepository();
        this.elfImportJobs = new ElfImportJobRepository();
        this.elfImportValidations = new ElfImportValidationRepository();
        this.elfImportPreviews = new ElfImportPreviewRepository();
        this.elfImportHistory = new ElfImportHistoryRepository();
        this.elfGoLiveChecklists = new ElfGoLiveChecklistRepository();
        this.elfGoLiveScores = new ElfGoLiveScoreRepository();
        this.elfDeploymentStatuses = new ElfDeploymentStatusRepository();
        this.elfReadinessValidations = new ElfReadinessValidationRepository();
        this.elfCustomerHealthScores = new ElfCustomerHealthScoreRepository();
        this.elfPlatformAdoption = new ElfPlatformAdoptionRepository();
        this.elfFeatureUsage = new ElfFeatureUsageRepository();
        this.elfRenewalTracking = new ElfRenewalTrackingRepository();
        this.elfSupportTickets = new ElfSupportTicketRepository();
        this.elfKnowledgeBaseArticles = new ElfKnowledgeBaseArticleRepository();
        this.elfIncidentTracking = new ElfIncidentTrackingRepository();
        this.elfCustomerRegistry = new ElfCustomerRegistryRepository();
        this.elfSubscriptionRecords = new ElfSubscriptionRecordRepository();
        this.elfLicenseManagement = new ElfLicenseManagementRepository();
        this.elfLaunchMetrics = new ElfLaunchMetricRepository();
        this.elfLaunchHealth = new ElfLaunchHealthRepository();
        this.elfMissionControlKpis = new ElfMissionControlKpiRepository();
        this.elfLaunchFailures = new ElfLaunchFailureRepository();
        this.elfAuditLogs = new ElfAuditLogRepository();`;
    da = da.replace(rtlCtor, rtlCtor + "\n" + elfCtor);

    writeFileSync(daPath, da, "utf8");
}

const dsPath = join(root, "src/modules/database/services/database-service.ts");
let ds = readFileSync(dsPath, "utf8");
if (!ds.includes("elfLaunchHubs")) {
    ds = ds.replace(
        "    rtlAuditLogs: databaseAccess.rtlAuditLogs,",
        `    rtlAuditLogs: databaseAccess.rtlAuditLogs,
    elfLaunchHubs: databaseAccess.elfLaunchHubs,
    elfOrganizationProvisions: databaseAccess.elfOrganizationProvisions,
    elfTenantProvisions: databaseAccess.elfTenantProvisions,
    elfIndustryPackAssignments: databaseAccess.elfIndustryPackAssignments,
    elfModuleLicenses: databaseAccess.elfModuleLicenses,
    elfWizardProfiles: databaseAccess.elfWizardProfiles,
    elfWizardBranding: databaseAccess.elfWizardBranding,
    elfWizardDepartments: databaseAccess.elfWizardDepartments,
    elfWizardSettings: databaseAccess.elfWizardSettings,
    elfImportJobs: databaseAccess.elfImportJobs,
    elfImportValidations: databaseAccess.elfImportValidations,
    elfImportPreviews: databaseAccess.elfImportPreviews,
    elfImportHistory: databaseAccess.elfImportHistory,
    elfGoLiveChecklists: databaseAccess.elfGoLiveChecklists,
    elfGoLiveScores: databaseAccess.elfGoLiveScores,
    elfDeploymentStatuses: databaseAccess.elfDeploymentStatuses,
    elfReadinessValidations: databaseAccess.elfReadinessValidations,
    elfCustomerHealthScores: databaseAccess.elfCustomerHealthScores,
    elfPlatformAdoption: databaseAccess.elfPlatformAdoption,
    elfFeatureUsage: databaseAccess.elfFeatureUsage,
    elfRenewalTracking: databaseAccess.elfRenewalTracking,
    elfSupportTickets: databaseAccess.elfSupportTickets,
    elfKnowledgeBaseArticles: databaseAccess.elfKnowledgeBaseArticles,
    elfIncidentTracking: databaseAccess.elfIncidentTracking,
    elfCustomerRegistry: databaseAccess.elfCustomerRegistry,
    elfSubscriptionRecords: databaseAccess.elfSubscriptionRecords,
    elfLicenseManagement: databaseAccess.elfLicenseManagement,
    elfLaunchMetrics: databaseAccess.elfLaunchMetrics,
    elfLaunchHealth: databaseAccess.elfLaunchHealth,
    elfMissionControlKpis: databaseAccess.elfMissionControlKpis,
    elfLaunchFailures: databaseAccess.elfLaunchFailures,
    elfAuditLogs: databaseAccess.elfAuditLogs,`
    );
    writeFileSync(dsPath, ds, "utf8");
}

console.log("Wired data-access and database-service for ELF");
