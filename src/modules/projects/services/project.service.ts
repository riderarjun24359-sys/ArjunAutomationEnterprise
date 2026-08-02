import {
    buildProjectDashboardStats,
    mapCommentSummary,
    mapFileSummary,
    mapMilestoneSummary,
    mapProjectDetail,
    mapProjectSummary,
    mapProjectTaskSummary,
    mapTeamMemberSummary,
    mapTimeEntrySummary,
} from "@/src/modules/database/lib/project-mappers";
import { resolveOrganizationContext } from "@/src/modules/database/lib/organization-context";
import { databaseService } from "@/src/modules/database/services/database-service";
import type {
    CommentSummary,
    FileSummary,
    MilestoneSummary,
    ProjectDashboardStats,
    ProjectDetail,
    ProjectSummary,
    TaskSummary,
    TeamMemberSummary,
    TimeEntrySummary,
} from "@/src/modules/projects/types";

export class ProjectService {
    private async getContext(authUserId: string, email: string, fullName?: string | null) {
        return resolveOrganizationContext(authUserId, email, fullName);
    }

    async getProjects(authUserId: string, email: string, fullName?: string | null): Promise<ProjectSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return [];
        }

        const records = await databaseService.projects.listByOrganization(context.organizationId);
        return records.map(mapProjectSummary);
    }

    async getProject(_authUserId: string, _email: string, id: string, _fullName?: string | null): Promise<ProjectDetail | undefined> {
        const record = await databaseService.projects.getById(id);
        return record ? mapProjectDetail(record) : undefined;
    }

    async getMilestones(projectId: string): Promise<MilestoneSummary[]> {
        const records = await databaseService.projects.listMilestones(projectId);
        return records.map(mapMilestoneSummary);
    }

    async getTasks(authUserId: string, email: string, projectId: string, fullName?: string | null): Promise<TaskSummary[]> {
        const context = await this.getContext(authUserId, email, fullName);
        if (!context) {
            return [];
        }

        const records = await databaseService.tasks.listByOrganization(context.organizationId, {
            filters: { project_id: projectId },
        });

        return records.map(mapProjectTaskSummary);
    }

    async getTeam(projectId: string): Promise<TeamMemberSummary[]> {
        const records = await databaseService.projects.listMembers(projectId);
        return records.map(mapTeamMemberSummary);
    }

    async getTimeEntries(projectId: string): Promise<TimeEntrySummary[]> {
        const records = await databaseService.projects.listTimeEntries(projectId);
        return records.map(mapTimeEntrySummary);
    }

    async getFiles(projectId: string): Promise<FileSummary[]> {
        const records = await databaseService.projects.listFiles(projectId);
        return records.map(mapFileSummary);
    }

    async getComments(projectId: string): Promise<CommentSummary[]> {
        const records = await databaseService.projects.listComments(projectId);
        return records.map(mapCommentSummary);
    }

    async getDashboardStats(authUserId: string, email: string, projectId: string, _fullName?: string | null): Promise<ProjectDashboardStats> {
        const project = await databaseService.projects.getById(projectId);
        const milestones = project ? await databaseService.projects.listMilestones(projectId) : [];
        return buildProjectDashboardStats(project, milestones);
    }
}

export const projectService = new ProjectService();
