import { databaseService } from "@/src/modules/database/services/database-service";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import type { DashboardOverview, DashboardOverviewInput } from "@/src/modules/dashboard/types";

const formatRelativeTime = (isoDate: string): string => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.floor(diffMs / 60000);

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} hr ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
};

const buildOverview = (input: DashboardOverviewInput): DashboardOverview => {
    const { organization, membershipsCount, auditLogs, taskCount = 0, openTasks = 0 } = input;
    const hasSupabaseData = Boolean(organization || auditLogs.length > 0 || membershipsCount > 0 || taskCount > 0);

    const activities = auditLogs.length
        ? auditLogs.map((log) => ({
              id: log.id,
              title: `${log.action} ${log.entity_type ?? "record"}`,
              detail: log.entity_type ? `${log.entity_type} ${log.entity_id ?? ""}`.trim() : "System activity",
              time: formatRelativeTime(log.created_at),
              tag: log.action,
          }))
        : [
              { id: "fallback-1", title: "Workspace initialized", detail: "Enterprise shell connected", time: "Today", tag: "system" },
              { id: "fallback-2", title: "Modules ready", detail: "CRM, Projects, and Tasks online", time: "Today", tag: "platform" },
          ];

    return {
        organization,
        teamCount: membershipsCount,
        auditCount: auditLogs.length,
        source: hasSupabaseData ? "supabase" : "fallback",
        kpis: [
            {
                title: "Organization",
                value: organization?.name ?? "Workspace",
                detail: organization?.status ?? "Active workspace",
                trend: "up",
                tone: "accent",
            },
            {
                title: "Team Members",
                value: membershipsCount.toString(),
                detail: "Active memberships",
                trend: "up",
            },
            {
                title: "Open Tasks",
                value: openTasks.toString(),
                detail: `${taskCount} total tasks`,
                trend: openTasks > 0 ? "down" : "up",
            },
            {
                title: "Audit Events",
                value: auditLogs.length.toString(),
                detail: "Recent platform signals",
                trend: "up",
            },
        ],
        activities,
    };
};

export const dashboardService = {
    async getOverview(authUserId: string, email: string, fullName?: string | null): Promise<DashboardOverview> {
        const context = await resolveOrganizationContext(authUserId, email, fullName);

        if (!context) {
            return buildOverview({
                organization: null,
                membershipsCount: 0,
                auditLogs: [],
                taskCount: 0,
                openTasks: 0,
            });
        }

        const organization = await databaseService.organizations.getById(context.organizationId);
        const memberships = await databaseService.memberships.getByUser(context.profileId);

        const auditLogs = await databaseService.audits.list({
            limit: 10,
            orderBy: "created_at",
            orderDirection: "desc",
            filters: { organization_id: context.organizationId },
        });

        const tasks = await databaseService.tasks.listByOrganization(context.organizationId);
        const openTasks = tasks.filter((task) => task.status !== "done" && task.status !== "cancelled").length;

        return buildOverview({
            organization,
            membershipsCount: memberships.length,
            auditLogs,
            taskCount: tasks.length,
            openTasks,
        });
    },
};
