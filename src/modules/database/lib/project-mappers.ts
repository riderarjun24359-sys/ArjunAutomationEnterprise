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
import { formatRelativeTimestamp } from "@/src/modules/database/lib/formatters";
import type {
    DbProject,
    DbProjectComment,
    DbProjectFile,
    DbProjectMember,
    DbProjectMilestone,
    DbProjectTimeEntry,
    DbTask,
} from "@/src/modules/database/types/platform";

export const mapProjectSummary = (project: DbProject): ProjectSummary => ({
    id: project.id,
    name: project.name,
    status: project.status as ProjectSummary["status"],
    priority: project.priority as ProjectSummary["priority"],
    progress: project.progress,
    budget: project.budget,
    timeline: project.timeline,
    owner: project.owner_name,
    clientName: project.client_name,
    updatedAt: formatRelativeTimestamp(project.updated_at),
});

export const mapProjectDetail = (project: DbProject): ProjectDetail => ({
    ...mapProjectSummary(project),
    description: project.description,
    template: project.template,
    client: project.client_name,
    teamSize: project.team_size,
});

export const mapMilestoneSummary = (milestone: DbProjectMilestone): MilestoneSummary => ({
    id: milestone.id,
    title: milestone.title,
    dueDate: milestone.due_date ?? "—",
    status: milestone.status as MilestoneSummary["status"],
    progress: milestone.progress,
});

export const mapProjectTaskSummary = (task: DbTask): TaskSummary => ({
    id: task.id,
    title: task.title,
    status: task.status as TaskSummary["status"],
    assignee: task.assignee_name ?? "Unassigned",
    dueDate: task.due_date ?? "—",
    priority: task.priority as TaskSummary["priority"],
});

export const mapTeamMemberSummary = (member: DbProjectMember): TeamMemberSummary => ({
    id: member.id,
    name: member.name,
    role: member.role as TeamMemberSummary["role"],
    capacity: member.capacity,
    status: member.status as TeamMemberSummary["status"],
});

export const mapTimeEntrySummary = (entry: DbProjectTimeEntry): TimeEntrySummary => ({
    id: entry.id,
    projectName: entry.project_name,
    startedAt: entry.started_at,
    duration: entry.duration,
    status: entry.status as TimeEntrySummary["status"],
});

export const mapFileSummary = (file: DbProjectFile): FileSummary => ({
    id: file.id,
    name: file.name,
    folder: file.folder,
    version: file.version,
    updatedAt: file.updated_at,
});

export const mapCommentSummary = (comment: DbProjectComment): CommentSummary => ({
    id: comment.id,
    author: comment.author,
    body: comment.body,
    mentions: comment.mentions ?? [],
    attachments: comment.attachments ?? [],
    createdAt: formatRelativeTimestamp(comment.created_at),
});

export const buildProjectDashboardStats = (project: DbProject | null, milestones: DbProjectMilestone[]): ProjectDashboardStats => {
    const upcomingDeadlines = milestones
        .filter((milestone) => milestone.status !== "completed")
        .map((milestone) => `${milestone.title} - ${milestone.due_date ?? "TBD"}`);

    return {
        health: project?.status === "active" ? "Healthy" : "Planning",
        progress: `${project?.progress ?? 0}%`,
        budget: project?.budget ?? "$0",
        timeline: project?.status === "active" ? "On track" : "Planning",
        upcomingDeadlines,
        recentActivity: ["Milestone updated", "New comment added", "Task moved to review"],
    };
};
