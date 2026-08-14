import type { UserRole } from "@/src/constants/roles";
import { aiEnterpriseBrainDeniedMessage, isFounderOrAdminAccess } from "../access";
import {
    buildAiEnterpriseBrainSnapshot,
    createEmptyAiEnterpriseBrainSnapshot,
} from "../builders/ai-enterprise-brain.builders";
import { aiEnterpriseBrainRepository } from "../repository/ai-enterprise-brain.repository";
import type { AiEnterpriseBrainSnapshot } from "../types";
import { buildProductionHealthReport } from "@/src/lib/production-health";
import { customerSuccessService } from "@/src/modules/customer-success/services/customer-success.service";
import { billingRevenueService } from "@/src/modules/billing-revenue/services/billing-revenue.service";
import { taskService } from "@/src/modules/tasks/services/task.service";
import { aiOrchestrationService } from "@/src/modules/ai-orchestration/services/ai-orchestration.service";
import { databaseService } from "@/src/modules/database/services/database-service";
import { buildAutomationLogPayload } from "@/src/modules/database/lib/automation-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";

export class AiEnterpriseBrainService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    async getSnapshot(
        authUserId: string,
        email: string,
        fullName?: string | null,
        authRole?: UserRole | null,
    ): Promise<AiEnterpriseBrainSnapshot> {
        const data = await aiEnterpriseBrainRepository
            .loadOrganizationData(authUserId, email, fullName)
            .catch(() => null);
        const allowed = isFounderOrAdminAccess({ authRole, membershipRole: data?.membershipRole ?? null });
        if (!allowed) {
            return createEmptyAiEnterpriseBrainSnapshot(false, aiEnterpriseBrainDeniedMessage());
        }
        if (!data) {
            return createEmptyAiEnterpriseBrainSnapshot(
                true,
                "No organization context resolved for live AI Enterprise Brain data.",
            );
        }
        return buildAiEnterpriseBrainSnapshot(data);
    }

    async runForOrganization(organizationId: string): Promise<boolean> {
        // 1. Collect Signals
        const [health, csStats, billingStats, tasks] = await Promise.all([
            buildProductionHealthReport(),
            customerSuccessService.getHealthScoresForOrg(organizationId),
            billingRevenueService.getDashboardStatsForOrg(organizationId),
            taskService.getTasksForOrg(organizationId),
        ]);

        const criticalHealth = health.status === "critical";
        const highRiskClients = csStats.filter(hs => hs.overallScore < 50);

        // 2. Recovery Verification
        const incidentTask = tasks.find(t => t.title.includes("Enterprise Ops Priority") && t.status === "todo");
        if (incidentTask && !criticalHealth && highRiskClients.length === 0) {
            await taskService.updateTaskById(incidentTask.id, { status: "done" });
            await databaseService.aiOrchestrationAuditLogs.create({
                organization_id: organizationId,
                action: "remediation_verified",
                result: "task_closed",
            });
            return true;
        }

        // 3. Prioritization & Analysis
        if (!criticalHealth && highRiskClients.length === 0) return false;
        
        // Escalation check
        if (incidentTask) {
            const createdAt = new Date(incidentTask.createdAt).getTime();
            if (Date.now() - createdAt > 3600000) { // 1 hour
                await taskService.updateTaskById(incidentTask.id, { priority: "urgent" });
                await databaseService.aiOrchestrationAuditLogs.create({
                    organization_id: organizationId,
                    action: "prioritize_operations",
                    result: "task_escalated",
                });
            }
            return false;
        }

        // 4. AI Orchestration
        const aiResponse = await aiOrchestrationService.executeTaskSystemWide({
            taskType: "prioritize_ops",
            organizationId,
            inputPayload: { moduleSource: "ai-enterprise-brain", healthStatus: health.status, riskClients: highRiskClients.length, revenueMrr: billingStats.mrrUsd },
        });

        // 5. Deduplicated Task Creation
        await taskService.createTaskSystemWide(organizationId, {
            title: "Enterprise Ops Priority Action Required",
            description: `AI recommended prioritization: ${JSON.stringify(aiResponse)}`,
            status: "todo",
            priority: "high",
            dueDate: new Date(Date.now() + 3600000).toISOString(),
        });

        await databaseService.aiOrchestrationAuditLogs.create({
            organization_id: organizationId,
            action: "prioritize_operations",
            result: "task_created",
        });

        return true;
    }

    async runSystemWideControlLoop(): Promise<boolean> {
        const orgs = await databaseService.organizations.list();
        let success = true;
        for (const org of orgs) {
            try {
                await this.runForOrganization(org.id);
            } catch (e) {
                console.error(`Failed to run control loop for org ${org.id}`, e);
                success = false;
            }
        }
        return success;
    }
}

export const aiEnterpriseBrainService = new AiEnterpriseBrainService();
