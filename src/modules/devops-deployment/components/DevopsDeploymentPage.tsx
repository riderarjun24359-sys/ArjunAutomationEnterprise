"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LoadingState } from "@/src/components/ui/LoadingState";
import {
    BackupVerificationPanel,
    BlueGreenPlansPanel,
    CanaryPlansPanel,
    CicdPipelinesPanel,
    CostEstimatesPanel,
    DeploymentApprovalsPanel,
    DevopsDeploymentOverviewPanel,
    DevopsDeploymentSdkPanel,
    DisasterRecoveryPanel,
    DockerConfigsPanel,
    DdAuditPanel,
    DdEngagementsPanel,
    EnvironmentsPanel,
    HealthChecksPanel,
    InfrastructureTemplatesPanel,
    KubernetesPlansPanel,
    LoggingIntegrationsPanel,
    MonitoringIntegrationsPanel,
    ReleaseOrchestrationPanel,
    ReleaseVersionsPanel,
    RollbackPlansPanel,
} from "@/src/modules/devops-deployment/components/DevopsDeploymentPanels";
import { DevopsDeploymentStats } from "@/src/modules/devops-deployment/components/DevopsDeploymentStats";
import { DEVOPS_DEPLOYMENT_TABS } from "@/src/modules/devops-deployment/constants";
import { useDevopsDeployment } from "@/src/modules/devops-deployment/hooks/useDevopsDeployment";

const tabs = [
    { id: DEVOPS_DEPLOYMENT_TABS.overview, label: "Overview" },
    { id: DEVOPS_DEPLOYMENT_TABS.engagements, label: "Engagements" },
    { id: DEVOPS_DEPLOYMENT_TABS.cicdPipelines, label: "CI/CD Pipelines" },
    { id: DEVOPS_DEPLOYMENT_TABS.environments, label: "Environments" },
    { id: DEVOPS_DEPLOYMENT_TABS.infrastructureTemplates, label: "Infrastructure" },
    { id: DEVOPS_DEPLOYMENT_TABS.dockerConfigs, label: "Docker" },
    { id: DEVOPS_DEPLOYMENT_TABS.kubernetesPlans, label: "Kubernetes" },
    { id: DEVOPS_DEPLOYMENT_TABS.releaseOrchestration, label: "Release Orchestration" },
    { id: DEVOPS_DEPLOYMENT_TABS.rollbackPlans, label: "Rollback Plans" },
    { id: DEVOPS_DEPLOYMENT_TABS.blueGreenPlans, label: "Blue-Green" },
    { id: DEVOPS_DEPLOYMENT_TABS.canaryPlans, label: "Canary" },
    { id: DEVOPS_DEPLOYMENT_TABS.monitoring, label: "Monitoring" },
    { id: DEVOPS_DEPLOYMENT_TABS.logging, label: "Logging" },
    { id: DEVOPS_DEPLOYMENT_TABS.healthChecks, label: "Health Checks" },
    { id: DEVOPS_DEPLOYMENT_TABS.backupVerification, label: "Backup Verification" },
    { id: DEVOPS_DEPLOYMENT_TABS.disasterRecovery, label: "Disaster Recovery" },
    { id: DEVOPS_DEPLOYMENT_TABS.costEstimates, label: "Cost Estimates" },
    { id: DEVOPS_DEPLOYMENT_TABS.deploymentApprovals, label: "Approvals" },
    { id: DEVOPS_DEPLOYMENT_TABS.releaseVersions, label: "Release Versions" },
    { id: DEVOPS_DEPLOYMENT_TABS.audit, label: "Audit" },
    { id: DEVOPS_DEPLOYMENT_TABS.api, label: "SDK" },
] as const;

export function DevopsDeploymentPage() {
    const devopsDeployment = useDevopsDeployment();
    const [activeTab, setActiveTab] = useState<(typeof DEVOPS_DEPLOYMENT_TABS)[keyof typeof DEVOPS_DEPLOYMENT_TABS]>(DEVOPS_DEPLOYMENT_TABS.overview);

    if (devopsDeployment.loading) {
        return <div className="mx-auto max-w-7xl"><LoadingState label="Loading AI DevOps & Deployment worker" /></div>;
    }

    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-slate-900 dark:text-slate-100">
            <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">AI Worker</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">AI DevOps & Deployment Engineer</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                    AI worker for CI/CD pipelines, environments, infrastructure templates, Docker and Kubernetes plans, release orchestration, rollback, blue-green and canary deployments, monitoring, logging, health checks, backup verification, disaster recovery, cost estimates, deployment approvals, release versions, audit history, and the shared DevOps SDK. Pipeline: Customer Requirement → AI Business Analyst → AI Solution Architect → AI Development Factory → AI QA Engineer → AI DevOps & Deployment → Production Deployment.
                </p>
            </motion.header>
            <DevopsDeploymentStats stats={devopsDeployment.stats} />
            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-orange-600 text-white" : "border border-slate-200 text-slate-600 hover:border-orange-300 dark:border-slate-800 dark:text-slate-300"}`}>{tab.label}</button>
                ))}
            </div>
            {activeTab === DEVOPS_DEPLOYMENT_TABS.overview ? <DevopsDeploymentOverviewPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.engagements ? <DdEngagementsPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.cicdPipelines ? <CicdPipelinesPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.environments ? <EnvironmentsPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.infrastructureTemplates ? <InfrastructureTemplatesPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.dockerConfigs ? <DockerConfigsPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.kubernetesPlans ? <KubernetesPlansPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.releaseOrchestration ? <ReleaseOrchestrationPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.rollbackPlans ? <RollbackPlansPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.blueGreenPlans ? <BlueGreenPlansPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.canaryPlans ? <CanaryPlansPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.monitoring ? <MonitoringIntegrationsPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.logging ? <LoggingIntegrationsPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.healthChecks ? <HealthChecksPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.backupVerification ? <BackupVerificationPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.disasterRecovery ? <DisasterRecoveryPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.costEstimates ? <CostEstimatesPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.deploymentApprovals ? <DeploymentApprovalsPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.releaseVersions ? <ReleaseVersionsPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.audit ? <DdAuditPanel data={devopsDeployment} /> : null}
            {activeTab === DEVOPS_DEPLOYMENT_TABS.api ? <DevopsDeploymentSdkPanel data={devopsDeployment} /> : null}
        </div>
    );
}
